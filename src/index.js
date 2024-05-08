const fs = require('fs');

const filePath = process.argv[2];

// Check if a file path was provided
if (filePath) {
  console.log('File path:', filePath);
  readMarkdown(filePath);
} else {
  console.error('No file name provided.');
}

function readMarkdown(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Log the content of the file
    console.log(data);
  });
}