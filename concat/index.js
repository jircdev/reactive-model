const fs = require('fs');
const path = require('path');

// Get directory path from command line arguments
const directoryPath = process.argv[2];
const directoryName = path.basename(directoryPath);
const outputPath = path.join(__dirname, `${directoryName}.ts`);

// Function to read files, prepend comments in the format of a docblock, and concatenate content
async function concatenateFilesWithDocblockComments(dirPath) {
	try {
		const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
		const jsFiles = files
			.filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.ts')
			.map(dirent => path.join(dirPath, dirent.name));

		let concatenatedContent = '';

		for (const filePath of jsFiles) {
			const content = await fs.promises.readFile(filePath, 'utf8');
			concatenatedContent += `/**\n * File: ${path.basename(filePath)}\n */\n${content}\n`;
		}

		await fs.promises.writeFile(outputPath, concatenatedContent);
		console.log(`Files were successfully concatenated into ${outputPath}`);
	} catch (error) {
		console.error('Error processing files:', error);
	}
}

// Run the function with the provided directory path
concatenateFilesWithDocblockComments(directoryPath);
