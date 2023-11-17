import Dexie from 'dexie';

/**
 * TO USE:
 * var {updateAItem} = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');
   await updateAItem("ITEM_ID", 'TEST');
 */

/**
 * Asynchronously loads a collection of book items.
 *
 * The function performs the following actions:
 * 1. Initiates the loading of a books collection.
 * 2. Handles errors if the collection cannot be loaded or if the response status is false.
 * 3. Logs the successful loading of the collection along with the count of items.
 * 4. Verifies the consistency of the loaded collection with the records in IndexedDB.
 *
 * It uses Dexie.js for interacting with IndexedDB and assumes that the data structure in IndexedDB is known and matches the expected format.
 *
 * @async
 * @function loadACollection
 * @returns {Promise<void>} - The function returns nothing but performs console logging based on different scenarios, including the validation of the loaded collection against IndexedDB records.
 */

export /*bundle*/ const updateAItem = async (id: string, newValue: string) => {
	const noIdErrorMessage = `❌ In order to get an item, you must specify the item you want to delete. 
If you do not have one, you can create it by running the createAItem function available in this same bundle. 
The import for this function would be: 

var {createAItem} = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');

To use it, simply call:
await createAItem();

Then, copy the id and pass it in this function.`;

	if (!id) return console.error(noIdErrorMessage);

	console.log('🔄 The item with the provided id is being loaded.');
	const book = new Book();
	const response = await book.load({ id });

	if (!response?.status)
		return console.error(
			'❌ There was an error while trying to load the item, please note: For this test we are validating that the response of the load method of the item has a status property which if successful is true otherwise false.'
		);

	if (!book.found)
		return console.error(
			'❌ The item could not be found, please verify that the object is an existing object, for this test we are validating that the "found" property of the object is true.'
		);

	if (book.id !== id) return console.error('❌ The found item does not have the defined ID, check it.', book);
	console.log('✅ The item was loaded successfully:', book);

	console.log('🔄 The item is being updated. The property that its being updated is the `title` property...');

	if (!newValue) return console.error('❌ The new value cannot be empty.');
	await book.set({ title: newValue });

	console.log('🔄 The item is being published...');
	const publishingResponse = await book.publish();

	if (!publishingResponse?.status)
		return console.error('❌ There was an error in publishing the book', publishingResponse);

	console.log('✅ The item was updated successfully:', book);

	console.log('🔄 The item is being searched using a Reactive agnostic search...');

	const db = new Dexie('test');
	db.version(3).stores({
		books: '&id, title, author, year',
	});

	try {
		// Searches for the book record in IndexedDB and verifies its consistency.
		const registry = await db.table('books').get(book.id);

		if (!registry) return console.error('❌ The element was not found in indexedDB');

		console.log('✅ The element was found in indexedDB, these are its values:', registry);

		if (registry.title !== newValue) return console.error('❌ The element was not updated in indexedDB');
	} catch (error) {
		console.error(
			'❌ An unexpected error occurred while trying to search indexedDB, delete the existing "test" tables and try again.',
			error
		);
	}
};
