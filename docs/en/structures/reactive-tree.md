# ReactiveTree

A reactive tree data structure for hierarchical data. Each node implements `IReactiveValue` and maintains parent/children relationships.

## Installation

```typescript
import { ReactiveTree, ReactiveTreeNode, ITreeNodeData } from '@beyond-js/reactive/structures/tree';
```

## Basic Usage

```typescript
// Define your node type
interface Category extends ITreeNodeData {
	id: string;
	name: string;
	description?: string;
}

// Create tree
const categories = new ReactiveTree<Category>({
	root: { id: 'root', name: 'All Categories' },
	children: [
		{
			data: { id: 'electronics', name: 'Electronics' },
			children: [
				{ data: { id: 'phones', name: 'Phones' } },
				{ data: { id: 'laptops', name: 'Laptops' } },
			],
		},
		{
			data: { id: 'clothing', name: 'Clothing' },
		},
	],
});

// Access nodes
const electronics = categories.getNode('electronics');
console.log(electronics?.data.name); // 'Electronics'

// Add node
categories.addNode('electronics', { id: 'tablets', name: 'Tablets' });

// Remove node (and all descendants)
categories.removeNode('phones');
```

## Constructor Options

```typescript
interface IReactiveTreeOptions<T extends ITreeNodeData> {
	// Root node data
	root?: T;
	
	// Initial children
	children?: ITreeNodeInput<T>[];
	
	// Property name for children in nested data (default: 'children')
	childrenKey?: string;
	
	// Separator for path-based access (default: '.')
	pathSeparator?: string;
}
```

## Node Access

```typescript
// By ID
const node = tree.getNode('node-id');

// By path
const nested = tree.getByPath('root.parent.child');

// Check existence
if (tree.hasNode('node-id')) {
	// ...
}

// Root access
const root = tree.root;

// Total node count
console.log(tree.size);
```

## Node Operations

### Adding Nodes

```typescript
// Add as child of parent
const newNode = tree.addNode('parentId', { id: 'newId', name: 'New Node' });

// Add at specific index
tree.addNode('parentId', { id: 'newId', name: 'New' }, 0); // First position
```

### Removing Nodes

```typescript
// Remove node and all descendants
const removed = tree.removeNode('nodeId');

// Cannot remove root
tree.removeNode('root'); // Returns false
```

### Moving Nodes

```typescript
// Move to new parent
tree.moveNode('nodeId', 'newParentId');

// Move to specific position
tree.moveNode('nodeId', 'newParentId', 0); // First child

// Cannot move node into its own subtree
tree.moveNode('parent', 'child'); // Returns false
```

### Updating Nodes

```typescript
// Update node data
tree.updateNode('nodeId', { name: 'Updated Name' });

// ID cannot be changed
tree.updateNode('nodeId', { id: 'newId' }); // id stays the same
```

## Node Properties

```typescript
const node = tree.getNode('nodeId');

// Identity
node.id;          // The node's ID
node.data;        // The full data object

// Relationships
node.parent;      // Parent node or null
node.children;    // Array of child nodes
node.isRoot;      // true if no parent
node.isLeaf;      // true if no children

// Position
node.depth;       // Distance from root (root = 0)
node.path;        // Full path string (e.g., 'root.parent.child')
```

## Traversal

### Depth-First (Pre-order)

```typescript
tree.walkDepthFirst(node => {
	console.log(node.data.name);
});
// Visits: Root -> Child1 -> Grandchild1 -> Grandchild2 -> Child2
```

### Breadth-First

```typescript
tree.walkBreadthFirst(node => {
	console.log(node.data.name);
});
// Visits: Root -> Child1 -> Child2 -> Grandchild1 -> Grandchild2
```

### Finding Nodes

```typescript
// Find first matching
const found = tree.findNode(node => node.data.name === 'Target');

// Find all matching
const matches = tree.findNodes(node => node.data.active === true);

// Get all leaf nodes
const leaves = tree.getLeaves();

// Get nodes at specific depth
const topLevel = tree.getNodesAtDepth(1);
```

## Events

| Event | Data | Description |
|-------|------|-------------|
| `node.added` | `{ node, parent, index }` | Node was added |
| `node.removed` | `{ node, parent }` | Node was removed |
| `node.moved` | `{ node, oldParent, newParent, oldIndex, newIndex }` | Node was moved |
| `node.changed` | `{ node }` | Node data was updated |
| `change` | - | Any modification occurred |
| `clear` | - | Tree was cleared |

## Serialization

```typescript
// To nested object
const nested = tree.serialize();
// { id: 'root', name: 'Root', children: [{ id: 'child', ... }] }

// To flat array
const flat = tree.getValue();
// [{ id: 'root', ... }, { id: 'child', ... }, ...]
```

## Import from Nested Data

```typescript
const data = {
	id: 'root',
	name: 'Root',
	children: [
		{ id: 'a', name: 'A', children: [] },
		{ id: 'b', name: 'B' },
	],
};

tree.fromNestedData(data);
```

## Example: File System

```typescript
interface FileNode extends ITreeNodeData {
	id: string;
	name: string;
	type: 'file' | 'folder';
	size?: number;
}

class FileExplorer {
	private tree = new ReactiveTree<FileNode>({
		root: { id: 'root', name: '/', type: 'folder' },
	});

	constructor() {
		this.tree.on('change', () => this.render());
	}

	createFolder(parentId: string, name: string): void {
		this.tree.addNode(parentId, {
			id: crypto.randomUUID(),
			name,
			type: 'folder',
		});
	}

	createFile(parentId: string, name: string, size: number): void {
		this.tree.addNode(parentId, {
			id: crypto.randomUUID(),
			name,
			type: 'file',
			size,
		});
	}

	move(nodeId: string, newParentId: string): void {
		this.tree.moveNode(nodeId, newParentId);
	}

	delete(nodeId: string): void {
		this.tree.removeNode(nodeId);
	}

	getPath(nodeId: string): string {
		const node = this.tree.getNode(nodeId);
		return node?.path.split('.').slice(1).join('/') ?? '';
	}

	getTotalSize(folderId: string): number {
		const folder = this.tree.getNode(folderId);
		if (!folder) return 0;

		let total = 0;
		folder.walkDepthFirst(node => {
			if (node.data.type === 'file') {
				total += node.data.size ?? 0;
			}
		});
		return total;
	}

	private render(): void {
		// Update UI
	}
}
```

## Example: Menu System

```typescript
interface MenuItem extends ITreeNodeData {
	id: string;
	label: string;
	icon?: string;
	href?: string;
	disabled?: boolean;
}

class NavigationMenu {
	private menu = new ReactiveTree<MenuItem>();

	loadFromAPI(data: MenuItem & { children?: MenuItem[] }): void {
		this.menu.fromNestedData(data);
	}

	getVisibleItems(parentId: string): MenuItem[] {
		const parent = this.menu.getNode(parentId);
		if (!parent) return [];

		return parent.children
			.filter(child => !child.data.disabled)
			.map(child => child.data);
	}

	getBreadcrumb(nodeId: string): MenuItem[] {
		const node = this.menu.getNode(nodeId);
		if (!node) return [];

		const breadcrumb: MenuItem[] = [];
		let current = node;

		while (current) {
			breadcrumb.unshift(current.data);
			current = current.parent as ReactiveTreeNode<MenuItem>;
		}

		return breadcrumb;
	}
}
```
