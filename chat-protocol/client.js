import readline from 'node:readline/promises';
import net from 'node:net';

const HOST = 'localhost';
const PORT = 1337;

async function startChat() {
    // User interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>',
    });

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
                { User: username, Token: token, 'content-length': 0 },
                ''
            );
        
            client.write(authCommand);
        }
    );


    client.on('data', (data) => {
        console.log('Received: ', data.toString());
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
