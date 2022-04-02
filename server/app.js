import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import _env from 'dotenv'

import userRoute from './routes/user.js';
import postRoute from './routes/post.js';

const app = express();
_env.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Hello___alpha1001, this is social-media-API");
})
app.use('/user', userRoute);
app.use('/post', postRoute);

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { app.listen(PORT, () => console.log(`server is running on port : ${PORT}`)) })
    .catch(err => console.log(err.message))
