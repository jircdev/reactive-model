import { Book } from '../../entities/book-item';

/**
 * TO USE:
 * var {getAItem} = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');
   await getAItem('ITEM_ID')
 */

/**
 * Asynchronously updates a specific item identified by its ID.
 *
 * The function performs the following actions:
 * 1. Validates if an ID is provided; if not, logs an error with instructions.
 * 2. Attempts to load the item with the given ID, handling errors if the item can't be loaded or found.
 * 3. Updates the 'title' property of the item to a new value.
 * 4. Publishes the updated item and handles any related errors.
 * 5. Verifies the update by searching for the item in IndexedDB.
 *
 * It uses Dexie.js for interacting with IndexedDB and assumes that the data structure in IndexedDB is known and matches the expected format.
 *
 * @async
 * @function updateAItem
 * @param {string} id - The unique identifier of the item to be updated.
 * @param {string} newValue - The new value to set for the item's 'title' property.
 * @returns {Promise<void>} - The function returns nothing but performs console logging based on different scenarios, including the validation of the update against IndexedDB records.
 */
export /*bundle*/ const getAItem = async (id: string) => {
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
};
