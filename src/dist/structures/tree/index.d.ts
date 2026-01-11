import { Events } from '@beyond-js/reactive/events';
import { IReactiveValue } from '@beyond-js/reactive/model';

/**
 * Base interface for tree node data.
 */
interface ITreeNodeData {
    id: string | number;
    [key: string]: unknown;
}
/**
 * Options for creating a ReactiveTree instance.
 */
interface IReactiveTreeOptions<T extends ITreeNodeData> {
    /**
     * Root node data. If not provided, creates an empty root.
     */
    root?: T;
    /**
     * Children of the root node.
     */
    children?: ITreeNodeInput<T>[];
    /**
     * Property name that contains children in nested data.
     * Default: 'children'
     */
    childrenKey?: string;
    /**
     * Separator for path-based access.
     * Default: '.'
     */
    pathSeparator?: string;
}
/**
 * Input format for creating tree nodes.
 */
interface ITreeNodeInput<T extends ITreeNodeData> {
    data: T;
    children?: ITreeNodeInput<T>[];
}
/**
 * Event data emitted when a node is added.
 */
interface ITreeNodeAddEvent<T extends ITreeNodeData> {
    node: IReactiveTreeNode<T>;
    parent: IReactiveTreeNode<T>;
    index: number;
}
/**
 * Event data emitted when a node is removed.
 */
interface ITreeNodeRemoveEvent<T extends ITreeNodeData> {
    node: IReactiveTreeNode<T>;
    parent: IReactiveTreeNode<T>;
}
/**
 * Event data emitted when a node is moved.
 */
interface ITreeNodeMoveEvent<T extends ITreeNodeData> {
    node: IReactiveTreeNode<T>;
    oldParent: IReactiveTreeNode<T>;
    newParent: IReactiveTreeNode<T>;
    oldIndex: number;
    newIndex: number;
}
/**
 * Interface for tree node instances.
 */
interface IReactiveTreeNode<T extends ITreeNodeData> {
    readonly id: string | number;
    readonly data: T;
    readonly parent: IReactiveTreeNode<T> | null;
    readonly children: IReactiveTreeNode<T>[];
    readonly isRoot: boolean;
    readonly isLeaf: boolean;
    readonly depth: number;
    readonly path: string;
    update(data: Partial<T>): void;
    addChild(data: T, index?: number): IReactiveTreeNode<T>;
    removeChild(id: string | number): boolean;
    getChild(id: string | number): IReactiveTreeNode<T> | undefined;
    walkDepthFirst(callback: (node: IReactiveTreeNode<T>) => void): void;
    walkBreadthFirst(callback: (node: IReactiveTreeNode<T>) => void): void;
    findNode(predicate: (node: IReactiveTreeNode<T>) => boolean): IReactiveTreeNode<T> | undefined;
    toObject(): T & {
        children?: T[];
    };
}

/**
 * Represents a single node in a ReactiveTree.
 * Each node holds data and maintains parent/children relationships.
 *
 * @template T - Type of data stored in nodes
 */
declare class ReactiveTreeNode<T extends ITreeNodeData> extends Events implements IReactiveTreeNode<T> {
    #private;
    readonly isReactive: true;
    /**
     * Creates a new tree node.
     */
    constructor(data: T, parent?: ReactiveTreeNode<T> | null, pathSeparator?: string);
    get id(): string | number;
    get data(): T;
    get parent(): ReactiveTreeNode<T> | null;
    get children(): ReactiveTreeNode<T>[];
    get isRoot(): boolean;
    get isLeaf(): boolean;
    get depth(): number;
    get path(): string;
    /**
     * @internal Used by ReactiveTree for moving nodes
     */
    _setParent(parent: ReactiveTreeNode<T> | null): void;
    /**
     * @internal Used by ReactiveTree for direct children access
     */
    _getChildrenArray(): ReactiveTreeNode<T>[];
    /**
     * Updates the node's data.
     * Triggers 'update' and 'change' events.
     */
    update(data: Partial<T>): void;
    /**
     * Adds a child node.
     *
     * @param data - Data for the new child
     * @param index - Optional index to insert at
     * @returns The new child node
     */
    addChild(data: T, index?: number): ReactiveTreeNode<T>;
    /**
     * Removes a child by ID.
     *
     * @param id - ID of the child to remove
     * @returns true if the child was found and removed
     */
    removeChild(id: string | number): boolean;
    /**
     * Gets a direct child by ID.
     */
    getChild(id: string | number): ReactiveTreeNode<T> | undefined;
    /**
     * Checks if this node has a direct child with the given ID.
     */
    hasChild(id: string | number): boolean;
    /**
     * Traverses the subtree depth-first (pre-order).
     */
    walkDepthFirst(callback: (node: ReactiveTreeNode<T>) => void): void;
    /**
     * Traverses the subtree breadth-first.
     */
    walkBreadthFirst(callback: (node: ReactiveTreeNode<T>) => void): void;
    /**
     * Finds a node in the subtree matching the predicate.
     */
    findNode(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T> | undefined;
    /**
     * Finds all nodes in the subtree matching the predicate.
     */
    findNodes(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T>[];
    /**
     * Converts the node and its subtree to a plain object.
     */
    toObject(): T & {
        children?: (T & {
            children?: T[];
        })[];
    };
}

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
declare class ReactiveTree<T extends ITreeNodeData> extends Events implements IReactiveValue<T[]> {
    #private;
    readonly isReactive: true;
    /**
     * Creates a new ReactiveTree.
     */
    constructor(options?: IReactiveTreeOptions<T>);
    /**
     * The root node of the tree.
     */
    get root(): ReactiveTreeNode<T>;
    /**
     * Total number of nodes in the tree.
     */
    get size(): number;
    /**
     * Path separator used for path-based access.
     */
    get pathSeparator(): string;
    /**
     * Sets the tree content from an array of node data.
     * Clears existing nodes (except root) and rebuilds.
     */
    setValue(values: T[]): void;
    /**
     * Gets all nodes as a flat array.
     */
    getValue(): T[];
    /**
     * Serializes the tree to a nested object structure.
     */
    serialize(): T & {
        children?: T[];
    };
    /**
     * Trees don't track unpublished changes in the same way.
     * Always returns false - override if needed.
     */
    hasUnpublishedChanges(): boolean;
    /**
     * Gets a node by its ID.
     */
    getNode(id: string | number): ReactiveTreeNode<T> | undefined;
    /**
     * Gets a node by its path.
     *
     * @param path - Dot-separated path of node IDs
     */
    getByPath(path: string): ReactiveTreeNode<T> | undefined;
    /**
     * Checks if a node exists.
     */
    hasNode(id: string | number): boolean;
    /**
     * Adds a new node as a child of the specified parent.
     *
     * @param parentId - ID of the parent node
     * @param data - Data for the new node
     * @param index - Optional index to insert at
     * @returns The new node, or undefined if parent not found
     */
    addNode(parentId: string | number, data: T, index?: number): ReactiveTreeNode<T> | undefined;
    /**
     * Removes a node and all its descendants.
     *
     * @param id - ID of the node to remove
     * @returns true if the node was found and removed
     */
    removeNode(id: string | number): boolean;
    /**
     * Moves a node to a new parent.
     *
     * @param nodeId - ID of the node to move
     * @param newParentId - ID of the new parent
     * @param index - Optional index in the new parent's children
     * @returns true if the move was successful
     */
    moveNode(nodeId: string | number, newParentId: string | number, index?: number): boolean;
    /**
     * Updates a node's data.
     *
     * @param id - ID of the node to update
     * @param data - Partial data to merge
     * @returns true if the node was found and updated
     */
    updateNode(id: string | number, data: Partial<T>): boolean;
    /**
     * Traverses the entire tree depth-first.
     */
    walkDepthFirst(callback: (node: ReactiveTreeNode<T>) => void): void;
    /**
     * Traverses the entire tree breadth-first.
     */
    walkBreadthFirst(callback: (node: ReactiveTreeNode<T>) => void): void;
    /**
     * Finds a node matching the predicate.
     */
    findNode(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T> | undefined;
    /**
     * Finds all nodes matching the predicate.
     */
    findNodes(predicate: (node: ReactiveTreeNode<T>) => boolean): ReactiveTreeNode<T>[];
    /**
     * Gets all leaf nodes.
     */
    getLeaves(): ReactiveTreeNode<T>[];
    /**
     * Gets all nodes at a specific depth.
     */
    getNodesAtDepth(depth: number): ReactiveTreeNode<T>[];
    /**
     * Clears all nodes except the root.
     */
    clear(): void;
    /**
     * Creates the tree from nested data.
     * Useful for importing hierarchical JSON.
     */
    fromNestedData(data: T & {
        [key: string]: unknown;
    }): void;
}

export { ReactiveTree, ReactiveTreeNode };
export type { IReactiveTreeNode, IReactiveTreeOptions, ITreeNodeAddEvent, ITreeNodeData, ITreeNodeInput, ITreeNodeMoveEvent, ITreeNodeRemoveEvent };
