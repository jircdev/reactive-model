// import Bee from '@beyond-js/bee';

// Bee(`http://localhost:${port}`);

var BEE = require('@beyond-js/bee');
const port = '950';
test('bee', async () => {
	BEE(`http://localhost:${port}`, {});

	const module = await bimport('@beyond-js/reactive@1.1.9/model');
	console.log(33, module);
	expect(3).toBe(3);
});
