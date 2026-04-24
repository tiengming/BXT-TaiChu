const http = require('http');
const fs = require('fs');

// Mock a Worker environment
const mockRequest = {
    cf: {
        latitude: 34.2658,
        longitude: 108.9541,
        city: "西安",
        region: "陕西"
    }
};

const { fetch } = require('./index.js').default;

const server = http.createServer(async (req, res) => {
    try {
        const response = await fetch(mockRequest);
        const html = await response.text();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } catch (e) {
        res.writeHead(500);
        res.end(e.toString());
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
