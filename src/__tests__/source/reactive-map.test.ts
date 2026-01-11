import { ReactiveMap } from '../../modules/structures/map';

describe('ReactiveMap', () => {
	describe('Basic Operations', () => {
		test('should create an empty map', () => {
			const map = new ReactiveMap<string, number>();

			expect(map.size).toBe(0);
			expect(map.isReactive).toBe(true);
			expect(map.isContainer).toBe(true);
		});

		test('should create map with initial entries', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
					['c', 3],
				],
			});

			expect(map.size).toBe(3);
			expect(map.get('a')).toBe(1);
			expect(map.get('b')).toBe(2);
			expect(map.get('c')).toBe(3);
		});

		test('should set and get values', () => {
			const map = new ReactiveMap<string, string>();

			map.set('key1', 'value1');
			map.set('key2', 'value2');

			expect(map.get('key1')).toBe('value1');
			expect(map.get('key2')).toBe('value2');
			expect(map.get('nonexistent')).toBeUndefined();
		});

		test('should check if key exists', () => {
			const map = new ReactiveMap<string, number>({
				entries: [['exists', 42]],
			});

			expect(map.has('exists')).toBe(true);
			expect(map.has('doesNotExist')).toBe(false);
		});

		test('should delete values', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			const deleted = map.delete('a');

			expect(deleted).toBe(true);
			expect(map.has('a')).toBe(false);
			expect(map.size).toBe(1);

			const deletedAgain = map.delete('a');
			expect(deletedAgain).toBe(false);
		});

		test('should clear all values', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
					['c', 3],
				],
			});

			map.clear();

			expect(map.size).toBe(0);
			expect(map.has('a')).toBe(false);
		});
	});

	describe('Events', () => {
		test('should emit set event', () => {
			const map = new ReactiveMap<string, number>();
			const handler = jest.fn();

			map.on('set', handler);
			map.set('key', 42);

			expect(handler).toHaveBeenCalledWith({
				key: 'key',
				value: 42,
				previous: undefined,
				isNew: true,
			});
		});

		test('should emit delete event', () => {
			const map = new ReactiveMap<string, number>({
				entries: [['key', 42]],
			});
			const handler = jest.fn();

			map.on('delete', handler);
			map.delete('key');

			expect(handler).toHaveBeenCalledWith({
				key: 'key',
				value: 42,
			});
		});

		test('should emit change event on modifications', () => {
			const map = new ReactiveMap<string, number>();
			const handler = jest.fn();

			map.on('change', handler);

			map.set('a', 1);
			expect(handler).toHaveBeenCalledTimes(1);

			map.delete('a');
			expect(handler).toHaveBeenCalledTimes(2);

			map.set('b', 2);
			map.clear();
			expect(handler).toHaveBeenCalledTimes(4);
		});

		test('should emit key-specific changed events', () => {
			const map = new ReactiveMap<string, number>();
			const handler = jest.fn();

			map.on('myKey.changed', handler);
			map.set('myKey', 100);

			expect(handler).toHaveBeenCalledWith({
				value: 100,
				previous: undefined,
			});
		});
	});

	describe('Iteration', () => {
		test('should iterate over keys', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			const keys = [...map.keys()];
			expect(keys).toEqual(['a', 'b']);
		});

		test('should iterate over values', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			const values = [...map.values()];
			expect(values).toEqual([1, 2]);
		});

		test('should iterate over entries', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			const entries = [...map.entries()];
			expect(entries).toEqual([
				['a', 1],
				['b', 2],
			]);
		});

		test('should support forEach', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			const collected: [number, string][] = [];
			map.forEach((value, key) => collected.push([value, key]));

			expect(collected).toEqual([
				[1, 'a'],
				[2, 'b'],
			]);
		});
	});

	describe('IReactiveValue Implementation', () => {
		test('should implement getValue', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			expect(map.getValue()).toEqual([1, 2]);
		});

		test('should implement setValue with keyExtractor', () => {
			interface Item {
				id: string;
				name: string;
			}

			const map = new ReactiveMap<string, Item>({
				keyExtractor: item => item.id,
			});

			map.setValue([
				{ id: '1', name: 'One' },
				{ id: '2', name: 'Two' },
			]);

			expect(map.size).toBe(2);
			expect(map.get('1')?.name).toBe('One');
		});

		test('should implement serialize', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			expect(map.serialize()).toEqual([1, 2]);
		});

		test('should track unpublished changes', () => {
			const map = new ReactiveMap<string, number>({
				entries: [['a', 1]],
			});

			expect(map.hasUnpublishedChanges()).toBe(false);

			map.set('b', 2);
			expect(map.hasUnpublishedChanges()).toBe(true);

			map.saveChanges();
			expect(map.hasUnpublishedChanges()).toBe(false);
		});
	});

	describe('Utility Methods', () => {
		test('should find values', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 5],
					['c', 10],
				],
			});

			const found = map.find(v => v > 3);
			expect(found).toBe(5);
		});

		test('should filter values', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 5],
					['c', 10],
				],
			});

			const filtered = map.filter(v => v > 3);
			expect(filtered).toEqual([5, 10]);
		});

		test('should map values', () => {
			const map = new ReactiveMap<string, number>({
				entries: [
					['a', 1],
					['b', 2],
				],
			});

			const mapped = map.map(v => v * 2);
			expect(mapped).toEqual([2, 4]);
		});

		test('should revert to initial state', () => {
			const map = new ReactiveMap<string, number>({
				entries: [['a', 1]],
			});

			map.set('b', 2);
			map.set('c', 3);
			expect(map.size).toBe(3);

			map.revert();
			expect(map.size).toBe(1);
			expect(map.get('a')).toBe(1);
		});
	});
});
