import Dexie from 'dexie';
import { Book } from '../../entities/book-item';

/**
 * TO USE:
 * var {createAItem} = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');
   await createAItem()
 */

/**
 * Asynchronously creates a new book item.
 *
 * The general process of this function includes:
 * 1. Creating a new instance of a book.
 * 2. Setting the book's title to "Lord of the Rings".
 * 3. Publishing the book and handling any potential errors.
 * 4. Conducting a reactive-agnostic search in IndexedDB to verify the existence and data of the book.
 *
 * @async
 * @function createAItem
 * @description Creates a new book item and searches for it in IndexedDB.
 * @returns {Promise<Object>} Returns an object with the status of the operation.
 */
export /*bundle*/ const createAItem = async () => {
	const book = new Book();
	console.log('🔄 We are creating an item with a title property whose value is: Lord of the Rings...');

	// Set the title of the book and handle the publishing response.
	await book.set({ title: 'Lord of the Rings' });
	const response = await book.publish();

	// Handle errors in publishing the book.
	if (!response.status) {
		console.error('❌ There was an error in publishing the book', response);
		return;
	}

	console.log(`✅ Item successfully created under ID: ${book.id}`);

	// Perform a reactive-agnostic search in IndexedDB.
	console.log('🔄 A Reactive-agnostic search is being performed on IndexedDB...');
	const db = new Dexie('test');
	db.version(3).stores({
		books: '&id, title, author, year',
	});

	try {
		// Searches for the book record in IndexedDB and verifies its consistency.
		const registry = await db.table('books').get(book.id);
		console.log('✅ Element found successfully in indexedDB, these are its values:', registry);

		// Validate the integrity of the found record.
		if (registry.title !== 'Lord of the Rings')
			console.error(
				'❌ The found element does not have the predefined title, check it but this could be an error when saving the values.',
				registry
			);

		if (registry.id !== book.id)
			console.error('❌ The found element does not have the defined ID, check it.', registry);
	} catch (error) {
		console.error(
			'❌ An unexpected error occurred while trying to search indexedDB, delete the existing "test" tables and try again.',
			error
		);
	}
};
