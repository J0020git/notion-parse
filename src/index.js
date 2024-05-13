const { marked } = require("marked");
const fs = require("fs");
const path = require("path");
const beautify = require('js-beautify').html;

const filePath = process.argv[2];

// Check if a file path was provided
if (filePath) {
  readMarkdown(filePath);
} else {
  console.error("No file name provided.");
}

function readMarkdown(filePath) {
  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const htmlBody = marked.parse(fileData);

    const parsedPath = path.parse(filePath);
    const outputPath = path.join(parsedPath.dir, parsedPath.name + ".html");
    writeHTML(outputPath, htmlBody);
  });
}

function writeHTML(filePath, htmlBody) {
  // Get the title as the first <h1> tags
  const title = htmlBody.match(/<h1>(.*?)<\/h1>/)[1];
  htmlBody = htmlBody.replace('<h1>', '<h1 id="title">');

  const htmlString =
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body>
    ${htmlBody}
  </body>
  </html>`;

  const formattedHtml = beautify(htmlString, { indent_size: 2 });

  fs.writeFile(filePath, formattedHtml, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return;
    }
  });
}
