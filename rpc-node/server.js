import http from 'http'

const methods = {
    multiply: ([a, b]) => a * b,
    divide: ([a, b]) => {
        if (b === 0) throw new Error('Division by zero')
        return a / b
    },
}

const server = http.createServer(async (req, res) => {
    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        // Respond to preflight requests
        res.writeHead(204)
        res.end()
        return
    }

    if (req.method !== 'POST') {
        res.writeHead(405)
        res.end()
        return
    }

    let body = ''
    for await (const chunk of req) {
        body += chunk
    }

    try {
        const { jsonrpc, method, params, id } = JSON.parse(body)
        if (jsonrpc !== '2.0' || !methods[method]) {
            throw new Error('Invalid request')
        }

        const result = methods[method](params)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ jsonrpc: '2.0', result, id }))
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32600, message: error.message },
                id: null,
            })
        )
    }
})

server.listen(3000, () => {
    console.log('JSON-RPC server with CORS is running on http://localhost:3000')
})
