const { marked } = require("marked");
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');
const fs = require("fs").promises;
const path = require("path");
const beautify = require("js-beautify").html;

const filePath = process.argv[2];

// Check if a file path was provided
if (filePath) {
  readMarkdown(filePath);
} else {
  console.error("No file name provided.");
}

function readMarkdown(filePath) {
  fs.readFile(filePath, "utf8")
    .then(fileData => {
      // Configure marked to use highlighting
      marked.use(markedHighlight({
        highlight: (code, lang) => {
          return hljs.highlightAuto(code, [lang]).value;
        }
      }));

      const htmlBody = marked.parse(fileData);

      const parsedPath = path.parse(filePath);
      const outputPath = path.join(parsedPath.dir, parsedPath.name + ".html");
      writeHTML(outputPath, htmlBody);
    })
    .catch(err => {
      console.error("Error reading file:", err);
      throw err;
    });
}

function readStylesheet(style) {
  return fs.readFile(`src\\styles\\${style}.css`, "utf8")
    .then(fileData => {
      return fileData;
    })
    .catch(err => {
      console.error("Error reading stylesheet:", err);
      throw err;
    });
}

async function writeHTML(filePath, htmlBody) {
  try {
    // Get the title as the first <h1> tags
    const title = htmlBody.match(/<h1>(.*?)<\/h1>/)[1];
    htmlBody = htmlBody.replace("<h1>", '<h1 id="title">');

    // Get CSS styling and apply it through HTML <style> tag
    const style = await readStylesheet("notionlike");
    
    const htmlString = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>${style}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
    </head>
    <body>
      ${htmlBody}
    </body>
    </html>`;

    const formattedHtml = beautify(htmlString, { indent_size: 2 });

    fs.writeFile(filePath, formattedHtml)
      .catch(err => {
        console.error("Error writing to file:", err);
        throw err;
      });
  } catch (err) {
    console.error("Error parsing to HTML:", err);
  }
}
