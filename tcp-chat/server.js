import net from 'node:net';

const clients = [];

const server = net.createServer((socket) => {
    // Add new client to the list
    clients.push(socket);
    console.log('Total connected clients: ', clients.length);

    socket.write('Welcome to the TCP Chat Server!\n');
    socket.write('Type your message and press Enter to broadcast.\n');

    // When data is received from a client
    socket.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`Received: ${message}`);

        // Broadcast the message to all other clients
        clients.forEach((client) => {
            if (client !== socket) {
                client.write(`Client says: ${message}\n`);
            }
        });
    });

    // Remove the client when it disconnects
    socket.on('end', () => {
        const index = clients.indexOf(socket);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        console.log('A client disconnected.');
        console.log('Total connected clients: ', clients.length);
    });

    // Basic error handling
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(1337, () => {
    console.log('TCP Chat Server is listening on port 1337');
});
