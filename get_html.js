const fs = require('fs');
const content = fs.readFileSync('index.js', 'utf8');

// Mock window and other things if needed, but we just want to run the code that defines htmlParts
// and then console.log it.
// We can wrap the part of the code in a function.

const startMarker = 'const htmlParts = [';
const endMarker = '].join(\'\');';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const code = content.substring(startIndex, endIndex) + '; console.log(htmlParts);';
    eval(code);
} else {
    console.error('Markers not found');
}
