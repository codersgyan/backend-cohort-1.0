// If using package.json with "type": "module", Node will use ESM by default.
// Otherwise, rename this file to server.mjs.

import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Utilities to manage __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create Express App
const app = express()
const port = 3000
app.use(cors())

// For parsing JSON and form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/stream-text', (req, res) => {
    // Set some headers to indicate chunked response
    res.setHeader('Content-Type', 'text/plain')

    // Create a readable stream from a file
    const readStream = fs.createReadStream(path.join(__dirname, 'largeTextFile.txt'), {
        encoding: 'utf8',
        highWaterMark: 1024, // read in chunks of 1 KB
    })

    // Pipe the readStream directly to the response
    readStream.pipe(res)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
