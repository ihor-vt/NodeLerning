import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import route from './routers/userRouter.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const mongoDBUrl = `mongodb://${process.env.HOST}:${process.env.PORT}/${process.env.DB_NAME}`;
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const serverPort = process.env.SERVER_PORT || 3000;
app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});

app.use('/api/log', route);
