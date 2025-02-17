import net from 'node:net';

const server = net.createServer((socket) => {
    console.log('Client connected');

    // When data is received from the client
    socket.on('data', (data) => {
        console.log('Received:', data.toString());
        // Echo the data back to the client
        socket.write(`Server received: ${data}`);
        socket.end();
    });

    // When the client disconnects
    socket.on('end', () => {
        console.log('Client disconnected');
    });

    // Handle any errors
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

// Listen on port 1337 (or any port you prefer)
server.listen(1337, '0.0.0.0', () => {
    console.log('Server listening on port 1337');
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});
