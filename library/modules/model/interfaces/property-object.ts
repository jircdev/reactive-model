/**
 * Interface representing the structure of property objects in the 'properties' array.
 */
export /*bundle*/ interface IPropertyObject {
	/**
	 * The name of the property.
	 */
	name: string;

	/**
	 * The type of the property. This could represent the data type or a custom type definition.
	 */
	type: string;

	/**
	 * An optional field that can specify additional object details or configurations.
	 */
	object?: any; // Define the type more specifically if possible
}
