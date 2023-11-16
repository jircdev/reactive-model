import Dexie from 'dexie';
import { Book } from '../../entities/book-item';

/**
 * TO USE:
 * var {deleteAItem} = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');
   await deleteAItem('ITEM_ID');
 */

/**
 * Asynchronously deletes a specific item identified by its ID.
 *
 * The function performs the following actions:
 * 1. Validates if an ID is provided; if not, logs an error with instructions.
 * 2. Attempts to load the item with the given ID, handling errors if the item can't be loaded or found.
 * 3. Deletes the item and handles any errors related to the deletion process.
 * 4. Verifies the deletion by searching for the item in IndexedDB.
 *
 * Note: The function assumes that the item is stored in an IndexedDB database and uses the Dexie.js library for IndexedDB operations.
 *
 * @async
 * @function deleteAItem
 * @param {string} id - The unique identifier of the item to be deleted.
 * @returns {Promise<void>} - The function returns nothing but performs console logging based on different scenarios.
 */
export /*bundle*/ const deleteAItem = async (id: string) => {
	const noIdErrorMessage = `❌ In order to delete an item, you must specify the item you want to delete. 
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
			'❌ There was an error in loading the item, please note: For this test we are validating that the response of the load method of the item has a status property which if successful is true otherwise false.',
			response
		);

	if (!book?.found)
		return console.error(
			'❌ The item was not found. please verify that the object is an existing object, for this test we are validating that the "found" property of the object is true.',
			book
		);

	console.log('🔄 The item is being eliminated...');

	const deleteResponse = await book.delete();
	if (!deleteResponse?.status)
		return console.error(
			'❌ There was an error in deleting the item. please note: For this test we are validating that the response of the load method of the item has a status property which if successful is true otherwise false.',
			deleteResponse
		);

	console.log('✅ The item was deleted successfully.');

	console.log('🔄 The item is being searched using a Reactive agnostic search...');

	const db = new Dexie('test');
	db.version(3).stores({
		books: '&id, title, author, year',
	});

	try {
		// Searches for the book record in IndexedDB and verifies its consistency.
		const registry = await db.table('books').get(book.id);

		if (registry) return console.error('❌ The element was found in indexedDB, these are its values:', registry);

		console.log('✅ The element was not found in indexedDB.');
	} catch (error) {
		console.error(
			'❌ An unexpected error occurred while trying to search indexedDB, delete the existing "test" tables and try again.',
			error
		);
	}
};
