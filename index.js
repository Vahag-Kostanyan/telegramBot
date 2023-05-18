import telegramApi from "node-telegram-bot-api";
import { gameOptions, againOptions } from "./options.js"

import dotenv from "dotenv";

dotenv.config();


const token = process.env.token;


const bot = new telegramApi(token, { polling: true });

const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now i will think of a number from 0 to 9 you have to guess it.')
    const rundomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = rundomNumber;
    await bot.sendMessage(chatId, 'Guess', gameOptions);
}


const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Start greeting' },
        { command: '/info', description: 'get info about user' },
        { command: '/game', description: 'game find a number' }
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        switch (text) {
            case "/start":
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp');
                return bot.sendMessage(chatId, 'Welcom to telegram bot author bot Vahagn kostanyan');
            case "/info":
                return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
            case "/game":
                return startGame(chatId)
            default:
                return bot.sendMessage(chatId, "I can't understend you try again");
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === "/again"){
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `user, you guess the number ${data}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `sorry, you didn't guess the correst number correct number is ${chats[chatId]}`, againOptions);
        }
    })

}

start();