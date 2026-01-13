import { Events } from 'reactive/events';
import type { IReactiveValue } from 'reactive/model';
import { ReactiveTreeNode } from './node';
import type {
	ITreeNodeData,
	IReactiveTreeOptions,
	ITreeNodeInput,
	ITreeNodeAddEvent,
	ITreeNodeRemoveEvent,
	ITreeNodeMoveEvent,
	IReactiveTreeNode,
} from './types';

// Re-export types and node class
export { ReactiveTreeNode };
export type {
	ITreeNodeData,
	IReactiveTreeOptions,
	ITreeNodeInput,
	ITreeNodeAddEvent,
	ITreeNodeRemoveEvent,
	ITreeNodeMoveEvent,
	IReactiveTreeNode,
};

/**
 * A reactive tree data structure.
 * Maintains hierarchical data with parent/children relationships.
 *
 * @template T - Type of data stored in nodes
 *
 * @example
 * ```typescript
 * interface Category extends ITreeNodeData {
 *   id: string;
 *   name: string;
 * }
 *
 * const tree = new ReactiveTree<Category>({
 *   root: { id: 'root', name: 'Categories' },
 *   children: [
 *     { data: { id: 'electronics', name: 'Electronics' }, children: [] },
 *     { data: { id: 'clothing', name: 'Clothing' }, children: [] },
 *   ]
 * });
 *
 * tree.on('node.added', ({ node }) => console.log('Added:', node.data.name));
 * tree.addNode('electronics', { id: 'phones', name: 'Phones' });
 * ```
 */
export /*bundle*/ class ReactiveTree<T extends ITreeNodeData>
	extends Events
	implements IReactiveValue<T[]>
{
	readonly isReactive: true = true;

	#root: ReactiveTreeNode<T>;
	#nodeMap: Map<string | number, ReactiveTreeNode<T>> = new Map();
	#pathSeparator: string;
	#childrenKey: string;

	/**
	 * Creates a new ReactiveTree.
	 */
	constructor(options: IReactiveTreeOptions<T> = {}) {
		super();

		this.#pathSeparator = options.pathSeparator ?? '.';
		this.#childrenKey = options.childrenKey ?? 'children';

		// Create root node
		const rootData = options.root ?? ({ id: 'root' } as T);
		this.#root = new ReactiveTreeNode(rootData, null, this.#pathSeparator);
		this.#nodeMap.set(rootData.id, this.#root);

		// Add children if provided
		if (options.children) {
			for (const childInput of options.children) {
				this.#addNodeRecursive(this.#root, childInput);
			}
		}

		// Listen to root changes
		this.#setupNodeListeners(this.#root);
	}

	// ==========================================
	// Getters
	// ==========================================

	/**
	 * The root node of the tree.
	 */
	get root(): ReactiveTreeNode<T> {
		return this.#root;
	}

	/**
	 * Total number of nodes in the tree.
	 */
	get size(): number {
		return this.#nodeMap.size;
	}

	/**
	 * Path separator used for path-based access.
	 */
	get pathSeparator(): string {
		return this.#pathSeparator;
	}

	// ==========================================
	// IReactiveValue Implementation
	// ==========================================

	/**
	 * Sets the tree content from an array of node data.
	 * Clears existing nodes (except root) and rebuilds.
	 */
	setValue(values: T[]): void {
		// Clear all children of root
		for (const child of [...this.#root._getChildrenArray()]) {
			this.removeNode(child.id);
		}

		// Add new nodes as children of root
		for (const value of values) {
			this.addNode(this.#root.id, value);
		}
	}

	/**
	 * Gets all nodes as a flat array.
	 */
	getValue(): T[] {
		const result: T[] = [];
		this.#root.walkDepthFirst(node => {
			result.push(node.data);
		});
		return result;
	}

	/**
	 * Serializes the tree to a nested object structure.
	 */
	serialize(): T & { children?: T[] } {
		return this.#root.toObject();
	}

	/**
	 * Trees don't track unpublished changes in the same way.
	 * Always returns false - override if needed.
	 */
	hasUnpublishedChanges(): boolean {
		return false;
	}

	// ==========================================
	// Node Access
	// ==========================================

	/**
	 * Gets a node by its ID.
	 */
	getNode(id: string | number): ReactiveTreeNode<T> | undefined {
		return this.#nodeMap.get(id);
	}

	/**
	 * Gets a node by its path.
	 *
	 * @param path - Dot-separated path of node IDs
	 */
	getByPath(path: string): ReactiveTreeNode<T> | undefined {
		const parts = path.split(this.#pathSeparator);
		let current: ReactiveTreeNode<T> | undefined = this.#root;

		for (const part of parts) {
			if (!current) return undefined;
			if (current.id.toString() === part) continue;
			current = current.getChild(part);
		}

		return current;
	}

	/**
	 * Checks if a node exists.
	 */
	hasNode(id: string | number): boolean {
		return this.#nodeMap.has(id);
	}

	// ==========================================
	// Node Operations
	// ==========================================

	/**
	 * Adds a new node as a child of the specified parent.
	 *
	 * @param parentId - ID of the parent node
	 * @param data - Data for the new node
	 * @param index - Optional index to insert at
	 * @returns The new node, or undefined if parent not found
	 */
	addNode(parentId: string | number, data: T, index?: number): ReactiveTreeNode<T> | undefined {
		const parent = this.#nodeMap.get(parentId);
		if (!parent) {
			console.warn(`ReactiveTree: Parent node ${parentId} not found`);
			return undefined;
		}

		if (this.#nodeMap.has(data.id)) {
			console.warn(`ReactiveTree: Node ${data.id} already exists`);
			return undefined;
		}

		const node = parent.addChild(data, index);
		this.#nodeMap.set(data.id, node);
		this.#setupNodeListeners(node);

		const eventData: ITreeNodeAddEvent<T> = {
			node,
			parent,
			index: index ?? parent.children.length - 1,
		};
		this.trigger('node.added', eventData);
		this.trigger('change');

		return node;
	}

	/**
	 * Removes a node and all its descendants.
	 *
	 * @param id - ID of the node to remove
	 * @returns true if the node was found and removed
	 */
	removeNode(id: string | number): boolean {
		const node = this.#nodeMap.get(id);
		if (!node || node.isRoot) return false;

		const parent = node.parent!;

		// Remove all descendants from map
		node.walkDepthFirst(n => {
			this.#nodeMap.delete(n.id);
		});

		// Remove from parent
		parent.removeChild(id);

		const eventData: ITreeNodeRemoveEvent<T> = { node, parent };
		this.trigger('node.removed', eventData);
		this.trigger('change');

		return true;
	}

	/**
	 * Moves a node to a new parent.
	 *
	 * @param nodeId - ID of the node to move
	 * @param newParentId - ID of the new parent
	 * @param index - Optional index in the new parent's children
	 * @returns true if the move was successful
	 */
	moveNode(nodeId: string | number, newParentId: string | number, index?: number): boolean {
		const node = this.#nodeMap.get(nodeId);
		const newParent = this.#nodeMap.get(newParentId);

		if (!node || !newParent || node.isRoot) return false;

		// Prevent moving a node into its own subtree
		let check: ReactiveTreeNode<T> | null = newParent;
		while (check !== null) {
			if (check.id === nodeId) {
				console.warn('ReactiveTree: Cannot move a node into its own subtree');
				return false;
			}
			check = check.parent;
		}

		const oldParent = node.parent!;
		const oldIndex = oldParent._getChildrenArray().indexOf(node);

		// Remove from old parent
		oldParent._getChildrenArray().splice(oldIndex, 1);

		// Add to new parent
		const newChildren = newParent._getChildrenArray();
		const newIndex = index !== undefined ? Math.min(index, newChildren.length) : newChildren.length;
		newChildren.splice(newIndex, 0, node);
		node._setParent(newParent);

		const eventData: ITreeNodeMoveEvent<T> = {
			node,
			oldParent,
			newParent,
			oldIndex,
			newIndex,
		};
		this.trigger('node.moved', eventData);
		this.trigger('change');

		return true;
	}

	/**
	 * Updates a node's data.
	 *
	 * @param id - ID of the node to update
	 * @param data - Partial data to merge
	 * @returns true if the node was found and updated
	 */
	updateNode(id: string | number, data: Partial<T>): boolean {
		const node = this.#nodeMap.get(id);
		if (!node) return false;

		node.update(data);
		this.trigger('change');

		return true;
	}

	// ==========================================
	// Traversal Methods
	// ==========================================

	/**
	 * Traverses the entire tree depth-first.
	 */
	walkDepthFirst(callback: (node: ReactiveTreeNode<T>) => void): void {
		this.#root.walkDepthFirst(callback);
	}

	/**
	 * Traverses the entire tree breadth-first.
	 */
	walkBreadthFirst(callback: (node: ReactiveTreeNode<T>) => void): void {
		this.#root.walkBreadthFirst(callback);
	}

	/**
	 * Finds a node matching the predicate.
	 */
	findNode(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T> | undefined {
		return this.#root.findNode(predicate);
	}

	/**
	 * Finds all nodes matching the predicate.
	 */
	findNodes(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T>[] {
		return this.#root.findNodes(predicate);
	}

	/**
	 * Gets all leaf nodes.
	 */
	getLeaves(): ReactiveTreeNode<T>[] {
		return this.findNodes(node => node.isLeaf);
	}

	/**
	 * Gets all nodes at a specific depth.
	 */
	getNodesAtDepth(depth: number): ReactiveTreeNode<T>[] {
		return this.findNodes(node => node.depth === depth);
	}

	// ==========================================
	// Utility Methods
	// ==========================================

	/**
	 * Clears all nodes except the root.
	 */
	clear(): void {
		for (const child of [...this.#root._getChildrenArray()]) {
			this.removeNode(child.id);
		}
		this.trigger('clear');
		this.trigger('change');
	}

	/**
	 * Creates the tree from nested data.
	 * Useful for importing hierarchical JSON.
	 */
	fromNestedData(data: T & { [key: string]: unknown }): void {
		this.clear();

		// Update root data
		const { [this.#childrenKey]: children, ...rootData } = data;
		this.#root.update(rootData as Partial<T>);
		this.#nodeMap.set((rootData as T).id ?? this.#root.id, this.#root);

		// Add children recursively
		if (Array.isArray(children)) {
			for (const child of children) {
				this.#addFromNestedRecursive(this.#root, child);
			}
		}

		this.trigger('change');
	}

	// ==========================================
	// Private Methods
	// ==========================================

	#addNodeRecursive(parent: ReactiveTreeNode<T>, input: ITreeNodeInput<T>): void {
		const node = parent.addChild(input.data);
		this.#nodeMap.set(input.data.id, node);
		this.#setupNodeListeners(node);

		if (input.children) {
			for (const childInput of input.children) {
				this.#addNodeRecursive(node, childInput);
			}
		}
	}

	#addFromNestedRecursive(parent: ReactiveTreeNode<T>, data: T & { [key: string]: unknown }): void {
		const { [this.#childrenKey]: children, ...nodeData } = data;
		const node = parent.addChild(nodeData as T);
		this.#nodeMap.set((nodeData as T).id, node);
		this.#setupNodeListeners(node);

		if (Array.isArray(children)) {
			for (const child of children) {
				this.#addFromNestedRecursive(node, child);
			}
		}
	}

	#setupNodeListeners(node: ReactiveTreeNode<T>): void {
		node.on('change', () => {
			this.trigger('node.changed', { node });
		});
	}
}
