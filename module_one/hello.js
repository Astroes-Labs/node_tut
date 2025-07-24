//hello.js


const { log } = require('console');
const fs = require('fs');//import the file system module

//Write to a file (asynchronously)
fs.writeFile('greeting.txt', 'This is a very new concept to me. I am used to php\'s synchronous behaviour', (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('File written successfully!');
  }
});

//Read from a file (asynchronously)
fs.readFile('greeting.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
    } else {
        console.log('File content:', data);
    }
    }
);

console.log('This runs before the file operations!'); // Demonstrating async behaviour
