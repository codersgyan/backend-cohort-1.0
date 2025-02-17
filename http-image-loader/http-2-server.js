import fs from 'node:fs';
import path from 'node:path';
import spdy from 'spdy';
import express from 'express';

const app = express();
const PORT = 3002;

// Serve static client files from the "public" directory
app.use(express.static('public'));

// Serve the chopped images from the "chopped_images" directory
app.use('/chopped_images', express.static('chopped_images'));

// Read SSL/TLS certificate and key
const options = {
    key: fs.readFileSync(path.join(import.meta.dirname, 'server.key')),
    cert: fs.readFileSync(path.join(import.meta.dirname, 'server.crt')),
};

// Create HTTP/2 server using spdy and Express
spdy.createServer(options, app).listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start HTTP/2 server:', err);
        return process.exit(1);
    }
    console.log(`HTTP/2 server listening on https://localhost:${PORT}`);
});
