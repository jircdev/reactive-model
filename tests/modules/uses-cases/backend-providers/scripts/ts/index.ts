import { Books, Book } from '@beyond-js/reactive-tests/uses-cases/backend-providers/entities.ts';

/**
 * Asynchronously updates a collection of book items.
 *
 * The function performs the following actions:
 * 1. Instantiates two new book items with different titles ('Book A' and 'Book B').
 * 2. Publishes both items and checks if the publication was successful.
 * 3. Loads an existing collection of books.
 * 4. Updates the title of 'Book B' to 'Book B Updated' and republishes it.
 * 5. Reloads the collection to reflect the update.
 *
 * This function demonstrates how to handle a collection of items, including loading, updating, and republishing individual items within the collection.
 *
 * @async
 * @function updateACollection
 * @returns {Promise<void>} - The function returns nothing but performs console logging based on different scenarios, including the loading and updating of a collection of book items.
 */

export /*bundle*/ async function updateACollection() {
	const collection = new Books();
	globalThis.collection = collection;
	collection.on('change', () => console.log('🔄 Collection changed', [...collection.items]));
	console.log('🔄 Two items are being instantiated, one with the title: Book A and the other as Book B...');
	const itemA = new Book();
	const itemB = new Book();

	await itemA.set({ title: 'Book A' });
	await itemB.set({ title: 'Book B' });

	const responseA = await itemA.publish();
	const responseB = await itemB.publish();

	console.log('✅ The following items are published');

	if (!responseA.status || !responseB.status)
		return console.error(
			'❌ Something happened while trying to publish one of the items and the publication could not be done.',
		);

	console.log('🔄 The collection is being loaded...');

	const collectionLoadResponse = await collection.load();
	if (!collectionLoadResponse.status)
		return console.error('❌ There was an error while trying to load the collection.');

	console.log('✅ The collection was successfully loaded, these are the items: ', collection.items);

	console.log(`🔄 Updating "Book B" so that its title will be: "Book B Updated"...`);

	itemB.set({ title: 'Book B Updated' });
	await itemB.publish();

	console.log('🔄 The collection is being loaded to see the "Book B Updated"...');

	const response = await collection.load();
	if (!response.status) return console.error('❌ There was an error while trying to load the collection.');
	console.log(collection.items);
}
