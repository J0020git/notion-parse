const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

// Check if a file path was provided
if (filePath) {
  console.log('File path:', filePath);
  readMarkdown(filePath);
} else {
  console.error('No file name provided.');
}

function readMarkdown(filePath) {
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const htmlString = marked.parse(fileData);

    const parsedPath = path.parse(filePath);
    const outputPath = path.join(parsedPath.dir, parsedPath.name + '.html');
    writeHTML(outputPath, htmlString)
  });
}

function writeHTML(filePath, htmlString) {
  fs.writeFile(filePath, htmlString, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
  });
}