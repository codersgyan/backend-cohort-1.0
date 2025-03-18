import readline from 'node:readline/promises';
import net from 'node:net';

const HOST = 'localhost';
const PORT = 1337;

    // User interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    prompt: '> ',
    });
async function startChat() {

    // Open a TCP connection
    const client = net.createConnection(
        {
            host: HOST,
            port: PORT,
        },
        async () => {
            console.log('Connected to the server');
            // Get username
            const username = await rl.question('Enter username: ');
            // Get Token
            const token = await rl.question('Enter token: ');
        
            // Prepare auth command
            const authCommand = buildCommand(
                'AUTH',
                { User: username, Token: token, 'Content-Length': 0 },
                ''
            );
        
            client.write(authCommand);
        }
    );


    client.on('data', async (data) => {
        const message = parseMessage(data.toString());
        if (!message) {
            console.error('Received an invalid message format from the server.');
            return;
        }
        if (message.statusMessage === 'ERROR') {
            console.error(`Server Error: ${message.headers?.Error || 'Unknown error'}`);
            return;
        }
        handleMessage(client, message);
    });

    client.on('end', () => {
        console.log('Connection closed');
        rl.close();
        process.exit(0);
    });

    rl.on('line', (input) => {
        if (input.trim().toLowerCase() === 'exit') {
            const leaveCommand = buildCommand(
                'LEAVE',
                { 'Content-Length': 0 },
                ''
            );
            client.write(leaveCommand);
            return;
        }
        const sendCommand = buildCommand(
            'SEND',
            { 'Content-Length': Buffer.byteLength(input, 'utf8') },
            input
        );
        client.write(sendCommand);
        rl.prompt();
    });
}

function buildCommand(command, headers, body) {
    /**
     *  CHAT/1.0 AUTH
        User: alice
        Token: secret123
        Content-Length: 0

        body
     */

    const startLine = `CHAT/1.0 ${command}`;
    // ['User: alice', 'Token: secret123']
    const headerLines = [];

    for (const key in headers) {
        const header = `${key}:${headers[key]}`;
        headerLines.push(header);
    }

    return `${startLine}\r\n${headerLines.join('\r\n')}\r\n\r\n${body}`;
}

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
    const statusMessage = firstLineTokens[1];

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

    return { protocolVersion, statusMessage, headers, body };
}

function handleMessage(client, message) {
    switch (message.headers['Response-For']) {
        case 'AUTH':
            handleAuth(client, message);
            break;
        case 'JOIN':
            handleJoin(client, message);
            break;
        case 'SEND':
            handleBroadcastedMsg(client, message);
            break;
        case 'LEAVE':
            handleLeave(client, message);
            break;
        default:
            console.log('Something went wrong!');
    }
}


async function handleAuth(client, message){
    const userSelected = await rl.question('Please choose an option:\n[1] Join the group chat\n[2] Leave\n');
    if(userSelected === '1'){
        const joinCommand = buildCommand(
            'JOIN',
            { 'Content-Length': 0 },
            ''
        );
        client.write(joinCommand);
    } else {
        client.end();
    }
}

async function handleJoin(client, message){
    if(message.statusMessage === 'OK'){
        console.log(`\n====================================`);
        console.log(`Welcome to the group chat!`);
        console.log(`Continue chatting and type 'exit' to leave.`);
        console.log(`====================================\n`);
        rl.prompt();
    } else if(message.statusMessage === 'MESSAGE'){
        console.log(message.body);
        rl.prompt();
    }
}

async function handleBroadcastedMsg(client, message){
    console.log('\r' + `${message.headers.User}: ${message.body}`);
    rl.prompt();
}

startChat();
