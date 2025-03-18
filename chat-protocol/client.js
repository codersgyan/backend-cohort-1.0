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

startChat();
