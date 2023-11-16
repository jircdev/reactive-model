import { Book } from '../../entities/book-item';

/**
 * TO USE:
 * var {getAItem} = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');
   await getAItem('ITEM_ID')
 */

/**
 * Asynchronously retrieves a specific item by its ID.
 *
 * This function is designed to load an item, identified by a given ID, from a data source.
 * It handles several scenarios including:
 * - If no ID is provided, it logs an error message with instructions on how to create an item.
 * - If there are issues loading the item (e.g., response status is false).
 * - If the item cannot be found or the loaded item's ID does not match the provided ID.
 *
 * It's important to ensure that the item's ID is known and correct before calling this function.
 *
 * @async
 * @function getAItem
 * @param {string} id - The unique identifier for the item to be retrieved.
 * @returns {Promise<void>} - The function returns nothing but performs console logging based on different scenarios.
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
