require('dotenv').config()
const { Wechaty } = require('wechaty');
const axios = require('axios');
const config = require('./config');

const options = {
  params: {
    key: config.TRELLO_API_KEY,
    token: config.TRELLO_OAUTH_TOKEN,
  }
}

const addCard = async ({ name, desc }) => {
  const listUrl = `${config.TRELLO_BASE_URL}/boards/${'FsSsX6OM'}/lists`;
  const cardUrl = `${config.TRELLO_BASE_URL}/cards`;
  try {
        const { data: lists } = await axios.get(listUrl, options);

        const bugList = lists.filter((list) => list.name === 'Bugs');

        const bugListId = bugList[0].id;

        const { data: card } = await axios.post(cardUrl, {
          name,
          desc,
          pos: 'top',
          idList: bugListId
        }, options);


        // console.log(card);
    } catch (error) {
        if (error) {
            console.log('error ', error);
        }
    }
}


function onScan (qrcode, status) {
  require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

function onLogin (user) {
  console.log(`${user} login`)
}

function onLogout(user) {
  console.log(`${user} logout`)
}

async function onMessage (msg) {
  const from = msg.from();
  const to = msg.to();
  // console.log('from', from.name(), from.id);
  // console.log('to', to.name(), to.id);
  // console.log('room', msg.room());

  if(msg.self()) {
    const text = msg.text();

    console.log(text.search('bug'));
    if(text.search('bug') >= 0) {
      console.log(text);
      console.log(from.name());

      addCard({ name: `From: ${from.name()}`, desc: text });
    }
    
    return;
  }
  console.log(msg.toString())
}

const bot = new Wechaty()

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))