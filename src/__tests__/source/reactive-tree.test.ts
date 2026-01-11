import { ReactiveTree, ReactiveTreeNode, ITreeNodeData } from '../../modules/structures/tree';

interface TestNode extends ITreeNodeData {
	id: string;
	name: string;
	value?: number;
}

describe('ReactiveTree', () => {
	describe('Basic Operations', () => {
		test('should create a tree with default root', () => {
			const tree = new ReactiveTree<TestNode>();

			expect(tree.size).toBe(1); // Just root
			expect(tree.root).toBeDefined();
			expect(tree.isReactive).toBe(true);
		});

		test('should create tree with custom root', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root Node' },
			});

			expect(tree.root.data.name).toBe('Root Node');
		});

		test('should create tree with children', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{ data: { id: 'child1', name: 'Child 1' } },
					{ data: { id: 'child2', name: 'Child 2' } },
				],
			});

			expect(tree.size).toBe(3);
			expect(tree.root.children.length).toBe(2);
		});

		test('should add nodes', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
			});

			const child = tree.addNode('root', { id: 'child1', name: 'Child 1' });

			expect(child).toBeDefined();
			expect(tree.size).toBe(2);
			expect(tree.hasNode('child1')).toBe(true);
		});

		test('should remove nodes', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [{ data: { id: 'child1', name: 'Child 1' } }],
			});

			const removed = tree.removeNode('child1');

			expect(removed).toBe(true);
			expect(tree.size).toBe(1);
			expect(tree.hasNode('child1')).toBe(false);
		});

		test('should not remove root node', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
			});

			const removed = tree.removeNode('root');

			expect(removed).toBe(false);
			expect(tree.size).toBe(1);
		});

		test('should update nodes', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [{ data: { id: 'child1', name: 'Child 1', value: 10 } }],
			});

			tree.updateNode('child1', { name: 'Updated Child', value: 20 });

			const node = tree.getNode('child1');
			expect(node?.data.name).toBe('Updated Child');
			expect(node?.data.value).toBe(20);
		});
	});

	describe('Node Access', () => {
		test('should get node by ID', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'child1', name: 'Child 1' },
						children: [{ data: { id: 'grandchild1', name: 'Grandchild 1' } }],
					},
				],
			});

			const grandchild = tree.getNode('grandchild1');

			expect(grandchild).toBeDefined();
			expect(grandchild?.data.name).toBe('Grandchild 1');
		});

		test('should get node by path', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'child1', name: 'Child 1' },
						children: [{ data: { id: 'grandchild1', name: 'Grandchild 1' } }],
					},
				],
			});

			const grandchild = tree.getByPath('root.child1.grandchild1');

			expect(grandchild).toBeDefined();
			expect(grandchild?.data.name).toBe('Grandchild 1');
		});
	});

	describe('Node Properties', () => {
		test('should track depth correctly', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'child1', name: 'Child 1' },
						children: [{ data: { id: 'grandchild1', name: 'Grandchild 1' } }],
					},
				],
			});

			expect(tree.root.depth).toBe(0);
			expect(tree.getNode('child1')?.depth).toBe(1);
			expect(tree.getNode('grandchild1')?.depth).toBe(2);
		});

		test('should identify leaf nodes', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [{ data: { id: 'leaf', name: 'Leaf' } }],
			});

			expect(tree.root.isLeaf).toBe(false);
			expect(tree.getNode('leaf')?.isLeaf).toBe(true);
		});

		test('should build correct path', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'child1', name: 'Child 1' },
						children: [{ data: { id: 'grandchild1', name: 'Grandchild 1' } }],
					},
				],
			});

			expect(tree.getNode('grandchild1')?.path).toBe('root.child1.grandchild1');
		});
	});

	describe('Move Operations', () => {
		test('should move node to new parent', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{ data: { id: 'parent1', name: 'Parent 1' }, children: [{ data: { id: 'child', name: 'Child' } }] },
					{ data: { id: 'parent2', name: 'Parent 2' } },
				],
			});

			const moved = tree.moveNode('child', 'parent2');

			expect(moved).toBe(true);
			expect(tree.getNode('parent1')?.children.length).toBe(0);
			expect(tree.getNode('parent2')?.children.length).toBe(1);
			expect(tree.getNode('child')?.parent?.id).toBe('parent2');
		});

		test('should not move node into its own subtree', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'parent', name: 'Parent' },
						children: [{ data: { id: 'child', name: 'Child' } }],
					},
				],
			});

			const moved = tree.moveNode('parent', 'child');

			expect(moved).toBe(false);
		});
	});

	describe('Traversal', () => {
		test('should walk depth-first', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'a', name: 'A' },
						children: [{ data: { id: 'a1', name: 'A1' } }, { data: { id: 'a2', name: 'A2' } }],
					},
					{ data: { id: 'b', name: 'B' } },
				],
			});

			const visited: string[] = [];
			tree.walkDepthFirst(node => visited.push(node.id as string));

			expect(visited).toEqual(['root', 'a', 'a1', 'a2', 'b']);
		});

		test('should walk breadth-first', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'a', name: 'A' },
						children: [{ data: { id: 'a1', name: 'A1' } }],
					},
					{ data: { id: 'b', name: 'B' } },
				],
			});

			const visited: string[] = [];
			tree.walkBreadthFirst(node => visited.push(node.id as string));

			expect(visited).toEqual(['root', 'a', 'b', 'a1']);
		});

		test('should find node by predicate', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{ data: { id: 'a', name: 'Apple' } },
					{ data: { id: 'b', name: 'Banana' } },
				],
			});

			const found = tree.findNode(node => node.data.name === 'Banana');

			expect(found?.id).toBe('b');
		});

		test('should find all nodes matching predicate', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root', value: 10 },
				children: [
					{ data: { id: 'a', name: 'A', value: 5 } },
					{ data: { id: 'b', name: 'B', value: 15 } },
					{ data: { id: 'c', name: 'C', value: 20 } },
				],
			});

			const found = tree.findNodes(node => (node.data.value ?? 0) > 10);

			expect(found.length).toBe(2);
		});

		test('should get all leaf nodes', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'a', name: 'A' },
						children: [{ data: { id: 'a1', name: 'A1' } }],
					},
					{ data: { id: 'b', name: 'B' } },
				],
			});

			const leaves = tree.getLeaves();

			expect(leaves.length).toBe(2);
			expect(leaves.map(l => l.id)).toEqual(['a1', 'b']);
		});

		test('should get nodes at depth', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'a', name: 'A' },
						children: [{ data: { id: 'a1', name: 'A1' } }],
					},
					{ data: { id: 'b', name: 'B' } },
				],
			});

			const atDepth1 = tree.getNodesAtDepth(1);

			expect(atDepth1.length).toBe(2);
			expect(atDepth1.map(n => n.id)).toEqual(['a', 'b']);
		});
	});

	describe('Events', () => {
		test('should emit node.added event', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
			});
			const handler = jest.fn();

			tree.on('node.added', handler);
			tree.addNode('root', { id: 'child', name: 'Child' });

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].node.id).toBe('child');
		});

		test('should emit node.removed event', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [{ data: { id: 'child', name: 'Child' } }],
			});
			const handler = jest.fn();

			tree.on('node.removed', handler);
			tree.removeNode('child');

			expect(handler).toHaveBeenCalled();
		});

		test('should emit node.moved event', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{ data: { id: 'a', name: 'A' }, children: [{ data: { id: 'child', name: 'Child' } }] },
					{ data: { id: 'b', name: 'B' } },
				],
			});
			const handler = jest.fn();

			tree.on('node.moved', handler);
			tree.moveNode('child', 'b');

			expect(handler).toHaveBeenCalled();
		});
	});

	describe('Serialization', () => {
		test('should serialize tree to nested object', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{
						data: { id: 'a', name: 'A' },
						children: [{ data: { id: 'a1', name: 'A1' } }],
					},
				],
			});

			const serialized = tree.serialize();

			expect(serialized).toEqual({
				id: 'root',
				name: 'Root',
				children: [
					{
						id: 'a',
						name: 'A',
						children: [{ id: 'a1', name: 'A1' }],
					},
				],
			});
		});

		test('should get all values as flat array', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [{ data: { id: 'a', name: 'A' } }, { data: { id: 'b', name: 'B' } }],
			});

			const values = tree.getValue();

			expect(values.length).toBe(3);
		});
	});

	describe('Clear Operation', () => {
		test('should clear all nodes except root', () => {
			const tree = new ReactiveTree<TestNode>({
				root: { id: 'root', name: 'Root' },
				children: [
					{ data: { id: 'a', name: 'A' } },
					{ data: { id: 'b', name: 'B' } },
				],
			});

			tree.clear();

			expect(tree.size).toBe(1);
			expect(tree.root.children.length).toBe(0);
		});
	});
});

describe('ReactiveTreeNode', () => {
	test('should create node with data', () => {
		const node = new ReactiveTreeNode<TestNode>({ id: 'test', name: 'Test' });

		expect(node.id).toBe('test');
		expect(node.data.name).toBe('Test');
		expect(node.isRoot).toBe(true);
		expect(node.isLeaf).toBe(true);
	});

	test('should add and manage children', () => {
		const parent = new ReactiveTreeNode<TestNode>({ id: 'parent', name: 'Parent' });

		const child = parent.addChild({ id: 'child', name: 'Child' });

		expect(parent.isLeaf).toBe(false);
		expect(parent.children.length).toBe(1);
		expect(child.parent).toBe(parent);
		expect(child.isRoot).toBe(false);
	});

	test('should remove children', () => {
		const parent = new ReactiveTreeNode<TestNode>({ id: 'parent', name: 'Parent' });
		parent.addChild({ id: 'child1', name: 'Child 1' });
		parent.addChild({ id: 'child2', name: 'Child 2' });

		const removed = parent.removeChild('child1');

		expect(removed).toBe(true);
		expect(parent.children.length).toBe(1);
	});

	test('should update node data', () => {
		const node = new ReactiveTreeNode<TestNode>({ id: 'test', name: 'Original', value: 10 });
		const handler = jest.fn();

		node.on('update', handler);
		node.update({ name: 'Updated', value: 20 });

		expect(node.data.name).toBe('Updated');
		expect(node.data.value).toBe(20);
		expect(node.id).toBe('test'); // ID should not change
		expect(handler).toHaveBeenCalled();
	});
});
