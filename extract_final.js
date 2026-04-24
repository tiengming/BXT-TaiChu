const fs = require('fs');
const content = fs.readFileSync('index.js', 'utf8');

const startMarker = 'const htmlParts = [';
const endMarker = '].join(\'\');';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    // Extract the array content
    let arrayContent = content.substring(startIdx + startMarker.length, endIdx).trim();

    // The array contains backtick-delimited strings separated by commas.
    // However, some strings might contain escaped characters or other JS logic if not careful.
    // In our case, it's mostly HTML blocks.

    // A simple way to get the final string is to eval the array construction.
    // We need to define any variables used if any, but in my case there are none inside the backticks.

    const finalHtml = eval('[' + arrayContent + '].join("")');
    process.stdout.write(finalHtml);
} else {
    process.stderr.write('Markers not found\n');
    process.exit(1);
}
