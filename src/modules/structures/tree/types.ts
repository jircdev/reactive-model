/**
 * Base interface for tree node data.
 */
export /*bundle*/ interface ITreeNodeData {
	id: string | number;
	[key: string]: unknown;
}

/**
 * Options for creating a ReactiveTree instance.
 */
export /*bundle*/ interface IReactiveTreeOptions<T extends ITreeNodeData> {
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
export /*bundle*/ interface ITreeNodeInput<T extends ITreeNodeData> {
	data: T;
	children?: ITreeNodeInput<T>[];
}

/**
 * Event data emitted when a node is added.
 */
export /*bundle*/ interface ITreeNodeAddEvent<T extends ITreeNodeData> {
	node: IReactiveTreeNode<T>;
	parent: IReactiveTreeNode<T>;
	index: number;
}

/**
 * Event data emitted when a node is removed.
 */
export /*bundle*/ interface ITreeNodeRemoveEvent<T extends ITreeNodeData> {
	node: IReactiveTreeNode<T>;
	parent: IReactiveTreeNode<T>;
}

/**
 * Event data emitted when a node is moved.
 */
export /*bundle*/ interface ITreeNodeMoveEvent<T extends ITreeNodeData> {
	node: IReactiveTreeNode<T>;
	oldParent: IReactiveTreeNode<T>;
	newParent: IReactiveTreeNode<T>;
	oldIndex: number;
	newIndex: number;
}

/**
 * Interface for tree node instances.
 */
export /*bundle*/ interface IReactiveTreeNode<T extends ITreeNodeData> {
	readonly id: string | number;
	readonly data: T;
	readonly parent: IReactiveTreeNode<T> | null;
	readonly children: IReactiveTreeNode<T>[];
	readonly isRoot: boolean;
	readonly isLeaf: boolean;
	readonly depth: number;
	readonly path: string;

	// Data operations
	update(data: Partial<T>): void;

	// Child operations
	addChild(data: T, index?: number): IReactiveTreeNode<T>;
	removeChild(id: string | number): boolean;
	getChild(id: string | number): IReactiveTreeNode<T> | undefined;

	// Traversal
	walkDepthFirst(callback: (node: IReactiveTreeNode<T>) => void): void;
	walkBreadthFirst(callback: (node: IReactiveTreeNode<T>) => void): void;
	findNode(predicate: (node: IReactiveTreeNode<T>) => boolean): IReactiveTreeNode<T> | undefined;

	// Serialization
	toObject(): T & { children?: T[] };
}
