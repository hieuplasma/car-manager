const fs = require('fs');
const path = require('path');
var util = require('util');

// Define the folder path where your images are located
const folderPath = path.join(__dirname, './src/common/media/images');

// Read the files in the folder
const imageFiles = fs.readdirSync(folderPath);

// Initialize the Images object
const Images = {};

// Define an array of allowed file extensions
const allowedExtensions = ['.png', '.jpg', '.jpeg'];

function addImageToObject(obj, filename, fileExtension, prefixPath) {
  const name = path.parse(filename).name.replaceAll('-', '_');
  const requireStatement = `require('.${prefixPath}/${filename}')`;
  obj[name] = requireStatement;
}

function processFolder(folderPath, parentObj, prefixPath) {
  const folderName = path.basename(folderPath);
  const folderContents = fs.readdirSync(folderPath);

  folderContents.forEach((item) => {
    const itemPath = path.join(folderPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    if (isDirectory) {
      // If the item is a directory, create a subfolder object and process its contents
      parentObj[item] = {};
      processFolder(itemPath, parentObj[item], prefixPath + '/' + item);
    } else {
      // If the item is a file, check its extension and add it to the parent object
      const fileExtension = path.extname(item).toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {
        addImageToObject(parentObj, item, fileExtension, prefixPath);
      }
    }
  });
}

processFolder(folderPath, Images, '/media/images');

const exportStatement = `export const images = ${Images}`;
const outputPath = path.join(__dirname, '', './src/common/images.ts');

if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
  console.log(`Deleted existing file: ${outputPath}`);
}
fs.writeFileSync(outputPath, 'export const images =' + util.inspect(Images), 'utf-8');

fs.readFile(outputPath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/"/g, '');
  fs.writeFile(outputPath, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});


