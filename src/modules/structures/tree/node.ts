import { Events } from 'reactive/events';
import type { ITreeNodeData, IReactiveTreeNode } from './types';

/**
 * Represents a single node in a ReactiveTree.
 * Each node holds data and maintains parent/children relationships.
 *
 * @template T - Type of data stored in nodes
 */
export /*bundle*/ class ReactiveTreeNode<T extends ITreeNodeData> extends Events implements IReactiveTreeNode<T> {
	readonly isReactive: true = true;

	#data: T;
	#parent: ReactiveTreeNode<T> | null = null;
	#children: ReactiveTreeNode<T>[] = [];
	#pathSeparator: string;

	/**
	 * Creates a new tree node.
	 */
	constructor(data: T, parent: ReactiveTreeNode<T> | null = null, pathSeparator: string = '.') {
		super();
		this.#data = { ...data };
		this.#parent = parent;
		this.#pathSeparator = pathSeparator;
	}

	// ==========================================
	// Getters
	// ==========================================

	get id(): string | number {
		return this.#data.id;
	}

	get data(): T {
		return { ...this.#data };
	}

	get parent(): ReactiveTreeNode<T> | null {
		return this.#parent;
	}

	get children(): ReactiveTreeNode<T>[] {
		return [...this.#children];
	}

	get isRoot(): boolean {
		return this.#parent === null;
	}

	get isLeaf(): boolean {
		return this.#children.length === 0;
	}

	get depth(): number {
		let depth = 0;
		let current: ReactiveTreeNode<T> | null = this.#parent;
		while (current !== null) {
			depth++;
			current = current.#parent;
		}
		return depth;
	}

	get path(): string {
		const parts: (string | number)[] = [this.id];
		let current: ReactiveTreeNode<T> | null = this.#parent;
		while (current !== null) {
			parts.unshift(current.id);
			current = current.#parent;
		}
		return parts.join(this.#pathSeparator);
	}

	// ==========================================
	// Internal Setters (for tree operations)
	// ==========================================

	/**
	 * @internal Used by ReactiveTree for moving nodes
	 */
	_setParent(parent: ReactiveTreeNode<T> | null): void {
		this.#parent = parent;
	}

	/**
	 * @internal Used by ReactiveTree for direct children access
	 */
	_getChildrenArray(): ReactiveTreeNode<T>[] {
		return this.#children;
	}

	// ==========================================
	// Data Operations
	// ==========================================

	/**
	 * Updates the node's data.
	 * Triggers 'update' and 'change' events.
	 */
	update(data: Partial<T>): void {
		const previous = { ...this.#data };
		this.#data = { ...this.#data, ...data, id: this.#data.id }; // id cannot change

		this.trigger('update', { data: this.#data, previous });
		this.trigger('change');
	}

	// ==========================================
	// Child Operations
	// ==========================================

	/**
	 * Adds a child node.
	 *
	 * @param data - Data for the new child
	 * @param index - Optional index to insert at
	 * @returns The new child node
	 */
	addChild(data: T, index?: number): ReactiveTreeNode<T> {
		const child = new ReactiveTreeNode(data, this, this.#pathSeparator);

		if (index !== undefined && index >= 0 && index < this.#children.length) {
			this.#children.splice(index, 0, child);
		} else {
			this.#children.push(child);
		}

		this.trigger('child.added', { child, index: index ?? this.#children.length - 1 });
		this.trigger('change');

		return child;
	}

	/**
	 * Removes a child by ID.
	 *
	 * @param id - ID of the child to remove
	 * @returns true if the child was found and removed
	 */
	removeChild(id: string | number): boolean {
		const index = this.#children.findIndex(c => c.id === id);
		if (index === -1) return false;

		const [removed] = this.#children.splice(index, 1);
		removed._setParent(null);

		this.trigger('child.removed', { child: removed, index });
		this.trigger('change');

		return true;
	}

	/**
	 * Gets a direct child by ID.
	 */
	getChild(id: string | number): ReactiveTreeNode<T> | undefined {
		return this.#children.find(c => c.id === id);
	}

	/**
	 * Checks if this node has a direct child with the given ID.
	 */
	hasChild(id: string | number): boolean {
		return this.#children.some(c => c.id === id);
	}

	// ==========================================
	// Traversal Methods
	// ==========================================

	/**
	 * Traverses the subtree depth-first (pre-order).
	 */
	walkDepthFirst(callback: (node: ReactiveTreeNode<T>) => void): void {
		callback(this);
		for (const child of this.#children) {
			child.walkDepthFirst(callback);
		}
	}

	/**
	 * Traverses the subtree breadth-first.
	 */
	walkBreadthFirst(callback: (node: ReactiveTreeNode<T>) => void): void {
		const queue: ReactiveTreeNode<T>[] = [this];

		while (queue.length > 0) {
			const node = queue.shift()!;
			callback(node);
			queue.push(...node.#children);
		}
	}

	/**
	 * Finds a node in the subtree matching the predicate.
	 */
	findNode(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T> | undefined {
		if (predicate(this)) return this;

		for (const child of this.#children) {
			const found = child.findNode(predicate);
			if (found) return found;
		}

		return undefined;
	}

	/**
	 * Finds all nodes in the subtree matching the predicate.
	 */
	findNodes(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T>[] {
		const results: ReactiveTreeNode<T>[] = [];

		this.walkDepthFirst(node => {
			if (predicate(node)) results.push(node);
		});

		return results;
	}

	// ==========================================
	// Serialization
	// ==========================================

	/**
	 * Converts the node and its subtree to a plain object.
	 */
	toObject(): T & { children?: (T & { children?: T[] })[] } {
		const obj = { ...this.#data } as T & { children?: (T & { children?: T[] })[] };

		if (this.#children.length > 0) {
			obj.children = this.#children.map(child => child.toObject());
		}

		return obj;
	}
}
