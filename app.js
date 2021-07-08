import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import routes from './routes';
import {PORT, MONGO_URI} from './config/expoter'
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';
import path from 'path';
const app = express();


//Database Connection
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => {
    console.log('DB connected')
})









global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use('/api' ,routes);
app.use('/uploads', express.static('uploads'))


app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Port is connected to: ${PORT}`);
})
