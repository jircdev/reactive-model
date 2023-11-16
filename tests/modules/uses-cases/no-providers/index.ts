import Dexie from 'dexie';
import { Book } from './entities/book-item';

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
			'❌ There was an error in loading the item, please note: For this test we are validating that the response of the load method of the item has a status property which if successful is true otherwise false.'
		);

	if (!book.found) return console.error('❌ The item was not found.');
};
