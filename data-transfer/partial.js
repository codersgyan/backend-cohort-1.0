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

app.use(express.static('public'))

// For parsing JSON and form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/download-audio', (req, res) => {
    const filePath = path.join(__dirname, 'public/music.mp3')
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

        const chunkSize = end - start + 1
        const file = fs.createReadStream(filePath, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        }
        res.writeHead(200, head)
        fs.createReadStream(filePath).pipe(res)
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
