import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { google } from 'googleapis'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const CRED_PATH = path.join(__dirname, 'credentials.json')
const TOKEN_PATH = path.join(__dirname, 'token.json')
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

// Load OAuth2 client
const { web } = JSON.parse(await fs.readFile(CRED_PATH, 'utf8'))
const oAuth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, web.redirect_uris[0])

// Try loading existing token
try {
    const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf8'))
    oAuth2Client.setCredentials(token)
} catch {
    /* no token yet */
}

async function saveToken(token) {
    await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
    oAuth2Client.setCredentials(token)
}

async function listEvents() {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    })
    return res.data.items || []
}

const app = express()
app.use(express.static(path.join(__dirname, 'public')))

// 1️⃣ Kick off OAuth flow
app.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    })
    res.redirect(authUrl)
})

// 2️⃣ OAuth callback
app.get('/oauth2callback', async (req, res) => {
    try {
        const { code } = req.query
        const { tokens } = await oAuth2Client.getToken(code)
        await saveToken(tokens)
        res.redirect('/')
    } catch (err) {
        console.error('Auth error:', err)
        res.status(500).send('Authentication failed')
    }
})

// 3️⃣ Fetch events (only works once token is saved)
app.get('/events', async (req, res) => {
    if (!oAuth2Client.credentials.access_token) {
        return res.status(401).json({ error: 'Not authenticated' })
    }
    try {
        const items = await listEvents()
        res.json(
            items.map((evt) => ({
                summary: evt.summary || '(no title)',
                start: evt.start.dateTime || evt.start.date,
                end: evt.end.dateTime || evt.end.date,
            }))
        )
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch events' })
    }
})

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})
