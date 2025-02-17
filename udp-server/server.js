import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
    // Optionally, echo the message back to the sender:
    server.send(`hello: ${msg}`, rinfo.port, rinfo.address, (error) => {
        if (error) {
            console.error('Error sending response:', error);
        } else {
            console.log('Echoed message back to client.');
        }
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

// Bind the server to port 41234
server.bind(41234);
