import { ReactiveArray } from '../../modules/structures/array';

describe('ReactiveArray', () => {
	describe('Basic Operations', () => {
		test('should create an empty array', () => {
			const arr = new ReactiveArray<number>();

			expect(arr.size).toBe(0);
			expect(arr.length).toBe(0);
			expect(arr.isReactive).toBe(true);
			expect(arr.isContainer).toBe(true);
		});

		test('should create array with initial items', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			expect(arr.size).toBe(3);
			expect(arr.get(0)).toBe(1);
			expect(arr.get(1)).toBe(2);
			expect(arr.get(2)).toBe(3);
		});

		test('should set and get values by index', () => {
			const arr = new ReactiveArray<string>({ items: ['a', 'b', 'c'] });

			arr.set(1, 'B');

			expect(arr.get(1)).toBe('B');
		});

		test('should check if index exists', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			expect(arr.has(0)).toBe(true);
			expect(arr.has(2)).toBe(true);
			expect(arr.has(3)).toBe(false);
			expect(arr.has(-1)).toBe(false);
		});

		test('should delete by index', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			const deleted = arr.delete(1);

			expect(deleted).toBe(true);
			expect(arr.length).toBe(2);
			expect(arr.toArray()).toEqual([1, 3]);
		});

		test('should clear all items', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			arr.clear();

			expect(arr.length).toBe(0);
		});
	});

	describe('Array-like Methods', () => {
		test('should push items', () => {
			const arr = new ReactiveArray<number>();

			arr.push(1, 2, 3);

			expect(arr.toArray()).toEqual([1, 2, 3]);
		});

		test('should pop items', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			const popped = arr.pop();

			expect(popped).toBe(3);
			expect(arr.toArray()).toEqual([1, 2]);
		});

		test('should unshift items', () => {
			const arr = new ReactiveArray<number>({ items: [2, 3] });

			arr.unshift(0, 1);

			expect(arr.toArray()).toEqual([0, 1, 2, 3]);
		});

		test('should shift items', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			const shifted = arr.shift();

			expect(shifted).toBe(1);
			expect(arr.toArray()).toEqual([2, 3]);
		});

		test('should splice items', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3, 4, 5] });

			const removed = arr.splice(1, 2, 10, 20, 30);

			expect(removed).toEqual([2, 3]);
			expect(arr.toArray()).toEqual([1, 10, 20, 30, 4, 5]);
		});

		test('should sort items', () => {
			const arr = new ReactiveArray<number>({ items: [3, 1, 4, 1, 5, 9] });

			arr.sort((a, b) => a - b);

			expect(arr.toArray()).toEqual([1, 1, 3, 4, 5, 9]);
		});

		test('should reverse items', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			arr.reverse();

			expect(arr.toArray()).toEqual([3, 2, 1]);
		});
	});

	describe('Events', () => {
		test('should emit add event on push', () => {
			const arr = new ReactiveArray<number>();
			const handler = jest.fn();

			arr.on('add', handler);
			arr.push(1, 2);

			expect(handler).toHaveBeenCalledWith({
				items: [1, 2],
				index: 0,
				method: 'push',
			});
		});

		test('should emit remove event on pop', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });
			const handler = jest.fn();

			arr.on('remove', handler);
			arr.pop();

			expect(handler).toHaveBeenCalledWith({
				items: [3],
				index: 2,
				method: 'pop',
			});
		});

		test('should emit reorder event on sort', () => {
			const arr = new ReactiveArray<number>({ items: [3, 1, 2] });
			const handler = jest.fn();

			arr.on('reorder', handler);
			arr.sort((a, b) => a - b);

			expect(handler).toHaveBeenCalledWith({
				method: 'sort',
				items: [1, 2, 3],
			});
		});

		test('should emit change event on modifications', () => {
			const arr = new ReactiveArray<number>();
			const handler = jest.fn();

			arr.on('change', handler);

			arr.push(1);
			expect(handler).toHaveBeenCalledTimes(1);

			arr.pop();
			expect(handler).toHaveBeenCalledTimes(2);
		});
	});

	describe('Iteration', () => {
		test('should iterate over values', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			const values = [...arr.values()];
			expect(values).toEqual([1, 2, 3]);
		});

		test('should iterate over entries', () => {
			const arr = new ReactiveArray<string>({ items: ['a', 'b'] });

			const entries = [...arr.entries()];
			expect(entries).toEqual([
				[0, 'a'],
				[1, 'b'],
			]);
		});

		test('should support forEach', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });
			const collected: number[] = [];

			arr.forEach(value => collected.push(value));

			expect(collected).toEqual([1, 2, 3]);
		});

		test('should be iterable with for...of', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });
			const collected: number[] = [];

			for (const item of arr) {
				collected.push(item);
			}

			expect(collected).toEqual([1, 2, 3]);
		});
	});

	describe('IReactiveValue Implementation', () => {
		test('should implement getValue', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			expect(arr.getValue()).toEqual([1, 2, 3]);
		});

		test('should implement setValue', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2] });

			arr.setValue([10, 20, 30]);

			expect(arr.toArray()).toEqual([10, 20, 30]);
		});

		test('should track unpublished changes', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2] });

			expect(arr.hasUnpublishedChanges()).toBe(false);

			arr.push(3);
			expect(arr.hasUnpublishedChanges()).toBe(true);

			arr.saveChanges();
			expect(arr.hasUnpublishedChanges()).toBe(false);
		});
	});

	describe('Non-mutating Methods', () => {
		test('should filter without mutating', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3, 4, 5] });

			const filtered = arr.filter(x => x > 2);

			expect(filtered).toEqual([3, 4, 5]);
			expect(arr.toArray()).toEqual([1, 2, 3, 4, 5]); // Original unchanged
		});

		test('should map without mutating', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			const mapped = arr.map(x => x * 2);

			expect(mapped).toEqual([2, 4, 6]);
			expect(arr.toArray()).toEqual([1, 2, 3]); // Original unchanged
		});

		test('should find items', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3, 4, 5] });

			expect(arr.find(x => x > 3)).toBe(4);
			expect(arr.findIndex(x => x > 3)).toBe(3);
		});

		test('should check some/every', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3] });

			expect(arr.some(x => x > 2)).toBe(true);
			expect(arr.every(x => x > 0)).toBe(true);
			expect(arr.every(x => x > 1)).toBe(false);
		});

		test('should reduce', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2, 3, 4] });

			const sum = arr.reduce((acc, val) => acc + val, 0);

			expect(sum).toBe(10);
		});
	});

	describe('Utility Methods', () => {
		test('should revert to initial state', () => {
			const arr = new ReactiveArray<number>({ items: [1, 2] });

			arr.push(3, 4, 5);
			expect(arr.length).toBe(5);

			arr.revert();
			expect(arr.toArray()).toEqual([1, 2]);
		});
	});
});
