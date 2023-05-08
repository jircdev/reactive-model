type Property = string | { name: string; value: (index: number) => number | string };

type Element = {
	[key: string]: number | string;
};

/**
 * Generates an array of objects with the specified properties and count.
 *
 * @param properties An array of property names or objects with a `name` property and a `value` function that generates the property value.
 * @param count The number of items to generate.
 * @returns An array of objects with the specified properties and values.
 */
export /*bundle*/ function hardcodeData(properties: Property[], count: number): Element[] {
	// Helper function to generate random integers within a range
	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Generate an array of objects with the specified properties and count
	const data: Element[] = [];
	for (let i = 0; i < count; i++) {
		const obj: Element = {};
		properties.forEach(property => {
			if (typeof property !== "string") {
				obj[property.name] = property.value(i);
				return;
			}
			if (property === "id") return;

			obj[property] = property === "year" ? getRandomInt(1900, 2023) : (obj[property] = `${property} ${i + 1}`);
		});
		data.push(obj);
	}
	return data;
}

// Example usage: generate an array of 10 books with "id", "title", "author", and "year" properties,
// where the "id" property is the index plus 1, the "title" property is in the format "Book X",
// the "author" property is in the format "Author X", and the "year" property is a random year between 1900 and 2023.
// const books = HardcodeData(
// 	[
// 		"id",
// 		{ name: "title", value: i => `Book ${i + 1}` },
// 		{ name: "author", value: i => `Author ${i + 1}` },
// 		{ name: "year", value: i => getRandomInt(1900, 2023) },
// 	],
// 	10
// );
// console.log(books);
