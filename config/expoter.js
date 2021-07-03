import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT,
    DEBUG_MODE,
    MONGO_URI,
    JWT_SECRET,
    REFRESH_SECRET,
} = process.env;