import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

dotenv.config();

const PORT = 445;
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(
    cors({
        origin: [
            'https://codersgyan.test',
            'https://cohort.codersgyan.test',
            'https://rakesh.test',
            'https://malicious.test',
        ],
        credentials: true,
    })
);

const dbPromise = open({
    filename: './users.db',
    driver: sqlite3.Database,
});

(async () => {
    const db = await dbPromise;

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const userExists = await db.get(`SELECT * FROM users WHERE email = ?`, ['user@example.com']);
    if (!userExists) {
        await db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [
            'user@example.com',
            'password123',
        ]);
    }

    const commentExists = await db.get(`SELECT * FROM comments LIMIT 1`);
    if (!commentExists) {
        await db.run(`INSERT INTO comments (name, comment) VALUES (?, ?)`, [
            'Alice',
            'This course is amazing!',
        ]);
        await db.run(`INSERT INTO comments (name, comment) VALUES (?, ?)`, [
            'Bob',
            'Very well explained concepts.',
        ]);
    }
})();

const generateToken = (user, secret, expiresIn) => {
    return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });
};

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await dbPromise;

    try {
        const user = await db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [
            email,
            password,
        ]);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET, '15m');
        const refreshToken = generateToken(user, process.env.REFRESH_TOKEN_SECRET, '7d'); // 7 days

        res.cookie('accessToken', accessToken, {
            domain: '.codersgyan.test',
            // httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            domain: '.codersgyan.test',
            // httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/comments', async (req, res) => {
    const { username, comment } = req.body;
    const db = await dbPromise;

    if (!username || !comment) {
        return res.status(400).json({ message: 'Username and comment are required' });
    }

    try {
        await db.run(`INSERT INTO comments (name, comment) VALUES (?, ?)`, [username, comment]);
        res.json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/comments', async (req, res) => {
    const db = await dbPromise;
    try {
        const comments = await db.all(
            `SELECT id, name, comment, created_at FROM comments ORDER BY created_at DESC`
        );
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

app.post('/forgot-password', authenticateToken, async (req, res) => {
    const { email, newPassword } = req.body;
    const db = await dbPromise;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required' });
    }

    if (req.user.email !== email) {
        return res.status(403).json({ message: 'Unauthorized: Email does not match token' });
    }

    try {
        const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

        if (!user) {
            return res.status(401).json({ message: 'User Not Found' });
        }

        await db.run(`UPDATE users SET password = ? WHERE email = ?`, [newPassword, email]);
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
