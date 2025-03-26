/**
 * Script to concatenate all TypeScript (.ts) files in a given directory (including subdirectories)
 * into a single output file, saving it in a folder named "output".
 *
 * How It Works:
 * 1. The script takes two parameters:
 *    - `directoryPath` (required): The path to the directory containing the `.ts` files.
 *    - `outputFileName` (optional): The name of the output file. Defaults to the base name of the input directory.
 * 2. It recursively scans the provided directory and its subdirectories for `.ts` files.
 * 3. For each file found:
 *    - It adds a docblock-style comment at the beginning indicating the relative path of the file.
 *    - It appends the file's content after the comment.
 * 4. All concatenated content is saved into a folder named "output" (created if it does not exist).
 *
 * Example Usage:
 * Run this script with Node.js, providing the required arguments:
 *
 * ```bash
 * node script.js ./src outputFile.ts
 * ```
 *
 * - `./src` is the directory containing the TypeScript files.
 * - `outputFile.ts` is the name of the concatenated result file.
 *
 * Result:
 * - The output file will be created at `./output/outputFile.ts`.
 * - If `outputFile.ts` is not provided, it defaults to `src.ts`.
 */

const fs = require('fs');
const path = require('path');

// Get directory path and output file name from command line arguments
const directoryPath = process.argv[2];
const outputFileName = process.argv[3] || `${path.basename(directoryPath)}.ts`;

// Define the output folder and output file path
const outputFolder = path.join(__dirname, 'output');
const outputFilePath = path.join(outputFolder, outputFileName);

/**
 * Ensures the "output" folder exists, creating it if necessary.
 */
function ensureOutputFolder() {
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder, { recursive: true });
	}
}

/**
 * Recursively retrieves all .ts files from a given directory.
 *
 * @param {string} dirPath - The directory path to search for .ts files.
 * @returns {string[]} - An array of full paths to .ts files.
 */
function getAllTsFiles(dirPath) {
	let tsFiles = [];
	const files = fs.readdirSync(dirPath, { withFileTypes: true });

	files.forEach(file => {
		const fullPath = path.join(dirPath, file.name);
		if (file.isDirectory()) {
			// Recursively search subdirectories
			tsFiles = tsFiles.concat(getAllTsFiles(fullPath));
		} else if (file.isFile() && path.extname(file.name) === '.ts') {
			tsFiles.push(fullPath);
		}
	});

	return tsFiles;
}

/**
 * Reads all .ts files, prepends file path as a docblock comment, and concatenates the content.
 *
 * @param {string} dirPath - The directory containing the .ts files.
 * @param {string} outputFilePath - The path where the concatenated output file will be saved.
 */
function concatenateFilesWithDocblockComments(dirPath, outputFilePath) {
	try {
		ensureOutputFolder();

		const tsFiles = getAllTsFiles(dirPath);

		let concatenatedContent = '';

		tsFiles.forEach(filePath => {
			const relativePath = path.relative(dirPath, filePath);
			const content = fs.readFileSync(filePath, 'utf8');
			concatenatedContent += `/**\n * File: ${relativePath}\n */\n${content}\n`;
		});

		fs.writeFileSync(outputFilePath, concatenatedContent);
		console.log(`Files were successfully concatenated into ${outputFilePath}`);
	} catch (error) {
		console.error('Error processing files:', error.message);
	}
}

// Validate input and run the script
if (!directoryPath) {
	console.error('Error: Please provide a directory path as the first argument.');
	process.exit(1);
}

concatenateFilesWithDocblockComments(directoryPath, outputFilePath);
