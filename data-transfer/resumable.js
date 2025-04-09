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

app.post('/upload-chunk', upload.single('chunk'), (req, res) => {
    const { chunkIndex, totalChunks, fileName, uploadId } = req.body
    // `req.file` contains the chunk data saved by multer in tempUploads/

    // Create a unique directory for this upload session (uploadId)
    const uploadDir = path.join(__dirname, 'uploads', uploadId)
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Move the uploaded chunk to a stable name, e.g., "chunk-0", "chunk-1", etc.
    const chunkPath = path.join(uploadDir, `chunk-${chunkIndex}`)
    fs.renameSync(req.file.path, chunkPath)

    // Check if all chunks are done (optional logic, depends on your flow)
    if (parseInt(chunkIndex, 10) + 1 === parseInt(totalChunks, 10)) {
        // Merge all chunks into a final file
        const finalFilePath = path.join(__dirname, 'uploads', fileName)
        const writeStream = fs.createWriteStream(finalFilePath)

        for (let i = 0; i < totalChunks; i++) {
            const filePart = path.join(uploadDir, `chunk-${i}`)
            const data = fs.readFileSync(filePart)
            writeStream.write(data)
            fs.unlinkSync(filePart)
        }
        writeStream.end()
        fs.rmdirSync(uploadDir) // remove chunk temp folder

        return res.json({
            success: true,
            message: 'All chunks uploaded. File merged successfully.',
        })
    }

    // If not the last chunk, just respond OK
    return res.json({ success: true, message: `Chunk ${chunkIndex} uploaded.` })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
