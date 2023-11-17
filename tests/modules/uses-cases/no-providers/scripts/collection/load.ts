import Dexie from 'dexie';
import { Books } from '../../entities/books-collection';

/**
 * TO USE:
   var {loadACollection} = await beyond.import('@beyond-js/reactive-tests/uses-cases/no-providers');
   await loadACollection();
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
export /*bundle*/ const loadACollection = async () => {
	console.log('🔄 The collection is being loaded...');
	const books = new Books();
	const response = await books.load();

	if (!response?.status)
		return console.error(
			'❌ There was an error while trying to load the item, please note: For this test we are validating that the response of the load method of the item has a status property which if successful is true otherwise false.'
		);

	if (!books.loaded)
		return console.error(
			'❌ The collection could not be loaded, taking into account that for this test we are taking into account the loaded property of the collection.'
		);

	console.log(
		`✅ The collection has been loaded successfully, in total there are: ${books.items.length} items:`,
		books.items
	);

	console.log(
		'🔄 We are going to make a query directly to indexedDB to verify that we are getting all the items and that they are the same.'
	);

	const currentCollectionItems = {};
	books.items.forEach(item => {
		currentCollectionItems[item.id] = item;
	});

	const db = new Dexie('test');
	db.version(3).stores({
		books: '&id, title, author, year',
	});

	try {
		// Searches for the book record in IndexedDB and verifies its consistency.
		const registries = await db.table('books').toArray();

		console.log(
			`The query to indexedDB has been done successfully, a total of ${registries.length} items have been found: `,
			registries
		);

		if (books.items.length !== registries.length)
			return console.error(
				'✅ The number of items fetched from the collection upload does not match the number of items in indexedDB.',
				`Collection items: ${books.items.length} | IndexedDB items: ${registries.length}`
			);

		registries.forEach(registry => {
			if (!currentCollectionItems[registry.id]) {
				return console.error(
					`❌ Item with id ${registry.id} does not exist in the list of items loaded from the collection.`
				);
			}
		});

		console.log(
			'✅ The test has been executed successfully, the collection has been loaded and has brought the same items that are in indexedDB.'
		);
	} catch (error) {
		console.error(
			'❌ An unexpected error occurred while trying to search indexedDB, delete the existing "test" tables and try again.',
			error
		);
	}
};
