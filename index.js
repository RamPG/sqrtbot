const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const outputMessageLanguage = require('./languages');

const rawData = fs.readFileSync('./users.json');
const users = JSON.parse(rawData);
const rawToken = fs.readFileSync('./token.json');
const {token} = JSON.parse(rawToken);

const bot = new TelegramBot(token, {polling: true});
const writeUsersList = () => {
    const data = JSON.stringify(users);
    fs.writeFileSync('./users.json', data);
}
const findUserId = (fromUserId) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId == fromUserId) {
            return i;
        }
    }
    return '';
}

const updateUsersList = (fromUserId, language) => {
    users.push({
        userId: fromUserId,
        language: language,
    });
    writeUsersList();
}
const getLanguageUser = (fromUserId) => {
    const id = findUserId(fromUserId);
    if (id === '') {
        updateUsersList(fromUserId, 'en');
        return 'en';
    }
    return users[id].language;
}
const setLanguageUser = (fromUserId, language) => {
    const id = findUserId(fromUserId);
    if (id === '') {
        updateUsersList(fromUserId, language);
    }
    users[id].language = language;
    writeUsersList()
}

const getMessageLanguage = (language, command) => {
    return outputMessageLanguage[language][command];
}
bot.on("polling_error", console.log);
bot.onText(/\/start/, (msg) => {
    const {id} = msg.from;
    let language = getLanguageUser(id);
    const outputMessage = getMessageLanguage(language, 'start');
    bot.sendMessage(id, outputMessage);
});
bot.onText(/\/ru/, (msg) => {
    const {id} = msg.from;
    setLanguageUser(id, 'ru');
    const outputMessage = getMessageLanguage('ru', 'language');
    bot.sendMessage(id, outputMessage);
});
bot.onText(/\/en/, (msg) => {
    const {id} = msg.from;
    setLanguageUser(id, 'en');
    const outputMessage = getMessageLanguage('en', 'language');
    bot.sendMessage(id, outputMessage);
});
bot.onText(/\/es/, (msg) => {
    const {id} = msg.from;
    setLanguageUser(id, 'es');
    const outputMessage = getMessageLanguage('es', 'language');
    bot.sendMessage(id, outputMessage);
});
bot.onText(/\/zh/, (msg) => {
    const {id} = msg.from;
    setLanguageUser(id, 'zh');
    const outputMessage = getMessageLanguage('zh', 'language');
    bot.sendMessage(id, outputMessage);
});
bot.onText(/\/faq/, (msg) => {
    const {id} = msg.from;
    let language = getLanguageUser(id);
    const outputMessage = getMessageLanguage(language, 'faq');
    bot.sendMessage(id, outputMessage);
});
bot.onText(/\/call/, (msg) => {
    const {id} = msg.from;
    let language = getLanguageUser(id);
    const outputMessage = getMessageLanguage(language, 'call');
    bot.sendMessage(id, outputMessage);
    bot.sendMessage(1099874743, 'Заявка на обслуживание. Язык: ' + language + ' id пользователя: ' + id);
});
bot.on('message', (msg) => {
    const {id} = msg.from;
    let language = getLanguageUser(id);
    if (id != 1099874743) {
        bot.sendMessage(1099874743, 'Язык: ' + language + ' id пользователя: ' + id + ' Сообщение: ' + msg.text);
    }
});
bot.onText(/\/operator/, (msg) => {
    const message = msg.text.split(' ');
    const id = parseInt(message[1]);
    const text = message.slice(2, message.length).join(' ');
    if (msg.from.id == 1099874743) {
        bot.sendMessage(id, text);
    } else {
        bot.sendMessage(msg.from.id, 'У вас нет прав.');
    }

});
