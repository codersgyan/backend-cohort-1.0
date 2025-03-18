import net from 'node:net';

const PORT = 1337;
const clients = [];

// Create the TCP server
const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.authenticated = false;
    socket.joined = false;
    socket.username = '';

    console.log('New client connected.');
    clients.push(socket);

    // Process data assuming each 'data' event is a complete message.
    socket.on('data', (data) => {
        const message = parseMessage(data);
        if (!message) {
            console.error('Invalid message format.');
            return;
        }
        handleMessage(socket, message);
    });

    socket.on('end', () => {
        console.log('Client disconnected.');
        if(!socket.writableEnded) {
            socket.end(            );
        }
        removeClient(socket);
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
        removeClient(socket);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

/**
 * Parses a complete protocol message.
 * Assumes the message is complete and in the following format:
 *
 *   CHAT/1.0 <COMMAND>
 *   Header: Value
 *   Header: Value
 *   ...
 *   Content-Length: <number>
 *
 *   <body>
 *
 * Returns an object { protocolVersion, command, headers, body } or null on error.
 */
function parseMessage(data) {
    const parts = data.split('\r\n\r\n');
    if (parts.length < 2) return null; // Missing body delimiter

    const headerPart = parts[0];
    const body = parts.slice(1).join('\r\n\r\n');
    const headerLines = headerPart.split('\r\n');
    if (headerLines.length === 0) return null;

    const firstLineTokens = headerLines[0].split(' ');
    if (firstLineTokens.length < 2) return null;
    const protocolVersion = firstLineTokens[0]; // Should be CHAT/1.0
    const command = firstLineTokens[1];

    const headers = {};
    let contentLength = 0;
    for (let i = 1; i < headerLines.length; i++) {
        const line = headerLines[i];
        const idx = line.indexOf(':');
        if (idx > -1) {
            const key = line.substring(0, idx).trim();
            const value = line.substring(idx + 1).trim();
            headers[key] = value;
            if (key.toLowerCase() === 'content-length') {
                contentLength = parseInt(value, 10);
            }
        }
    }

    // Optionally, check that body length matches Content-Length.
    if (body.length !== contentLength) {
        console.warn(
            `Warning: body length (${body.length}) does not match Content-Length (${contentLength}).`
        );
    }

    return { protocolVersion, command, headers, body };
}

/**
 * Dispatches the message to the appropriate handler.
 */
function handleMessage(socket, message) {
    switch (message.command) {
        case 'AUTH':
            handleAuth(socket, message);
            break;
        case 'JOIN':
            handleJoin(socket, message);
            break;
        case 'SEND':
            handleSend(socket, message);
            break;
        case 'LEAVE':
            handleLeave(socket, message);
            break;
        default:
            socket.write(
                formatResponse(
                    'ERROR',
                    message.command,
                    { Error: 'Unknown command', 'Content-Length': 0 },
                    ''
                )
            );
    }
}

/**
 * Handles the AUTH command.
 * Expects headers: User, Token.
 * Token must equal "secret123".
 */
function handleAuth(socket, message) {
    const user = message.headers['User'];
    const token = message.headers['Token'];

    if (user && token && token === 'secret123') {
        socket.authenticated = true;
        socket.username = user;
        socket.write(formatResponse('OK', 'AUTH', { 'Content-Length': 0 }, ''));
        console.log(`User ${user} authenticated successfully.`);
    } else {
        socket.write(
            formatResponse(
                'ERROR',
                'AUTH',
                { Error: 'Authentication failed', 'Content-Length': 0 },
                ''
            )
        );
        console.log(`Authentication failed for user ${user || 'unknown'}.`);
        socket.end();
    }
}

/**
 * Handles the JOIN command.
 */
function handleJoin(socket, message) {
    if (!socket.authenticated) {
        socket.write(
            formatResponse('ERROR', 'JOIN', { Error: 'Not authenticated', 'Content-Length': 0 }, '')
        );
        return;
    }
    if (!socket.joined) {
        socket.joined = true;
        socket.write(formatResponse('OK', 'JOIN', { 'Content-Length': 0 }, ''));
        broadcast(createServerMessage(`${socket.username} has joined the chat.`, 'JOIN'), socket);
        console.log(`User ${socket.username} joined the chat.`);
    }
}

/**
 * Handles the SEND command.
 */
function handleSend(socket, message) {
    if (!socket.authenticated || !socket.joined) {
        socket.write(
            formatResponse(
                'ERROR',
                'SEND',
                { Error: 'Not joined or authenticated', 'Content-Length': 0 },
                ''
            )
        );
        return;
    }
    const body = message.body;
    const broadcastMsg = formatResponse(
        'MESSAGE',
        'SEND',
        { 'Content-Length': Buffer.byteLength(body, 'utf8') },
        body,
        socket.username
    );
    broadcast(broadcastMsg, socket);
    console.log(`Broadcasting message from ${socket.username}: ${body}`);
}

/**
 * Handles the LEAVE command.
 */
function handleLeave(socket, message) {
    if (socket.joined) {
        socket.joined = false;
        socket.write(formatResponse('OK', 'LEAVE', { 'Content-Length': 0 }, ''));
        broadcast(createServerMessage(`${socket.username} has left the chat.`, 'LEAVE'), socket);
        console.log(`User ${socket.username} left the chat.`);
        socket.end();
    } else {
        socket.write(
            formatResponse('ERROR', 'LEAVE', { Error: 'Not in chat', 'Content-Length': 0 }, '')
        );
    }
}

/**
 * Formats a response message.
 * type: OK, ERROR, or MESSAGE.
 * responseFor: The command this response is for.
 * headers: Additional headers as an object.
 * body: Message body.
 * user (optional): For MESSAGE responses, the sender's username.
 */
function formatResponse(type, responseFor, headers, body, user) {
    let startLine = `CHAT/1.0 ${type}`;
    const headerLines = [];
    headerLines.push(`Response-For: ${responseFor}`);
    if (user && type === 'MESSAGE') {
        headerLines.push(`User: ${user}`);
    }
    for (const key in headers) {
        headerLines.push(`${key}: ${headers[key]}`);
    }
    return `${startLine}\r\n${headerLines.join('\r\n')}\r\n\r\n${body}`;
}

/**
 * Creates a server-generated message.
 */
function createServerMessage(text, responseFor) {
    return formatResponse(
        'MESSAGE',
        responseFor,
        { 'Content-Length': Buffer.byteLength(text, 'utf8') },
        text,
        'SERVER'
    );
}

/**
 * Broadcasts a message to all connected clients (except the sender).
 */
function broadcast(message, senderSocket) {
    clients.forEach((client) => {
        if (client !== senderSocket && client.joined) {
            client.write(message);
        }
    });
}

/**
 * Removes a client from the clients array.
 */
function removeClient(socket) {
    const index = clients.indexOf(socket);
    if (index !== -1) {
        clients.splice(index, 1);
    }
}
