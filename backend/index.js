import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/database.js';

dotenv.config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Campus Cave Server is running!');
});

app.listen(process.env.PORT || 8001, () => {
    console.log(`Campus Cave Server listening on port ${process.env.PORT || 8001}`);
});
