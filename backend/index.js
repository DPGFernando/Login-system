import express from 'express';
import {connectDB} from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import path from 'path';

const app = express();

app.use(cors({origin: 'http://localhost:5173', credentials: true})); //allow us to make request from frontend
app.use(express.json());
app.use(cookieParser()); //alllow us to parse cookies

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();


app.use('/api/auth', authRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log('Server running on port ', PORT);
});

//aIx7Ju4KUvg0lis2