import dotenv from 'dotenv';

dotenv.config({
    path: "./.env"
});

const username = process.env.username;

console.log(`Username from .env file: ${username}`);