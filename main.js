"use strict";
const { default: makeWASocket, BufferJSON, initInMemoryKeyStore, DisconnectReason, AnyMessageContent, delay, useSingleFileAuthState } = require("@adiwajshing/baileys-md")
const figlet = require("figlet");
const fs = require("fs");
const P = require('pino')
const ind = require('./help/zak')
const { color, ChikaLog } = require("./lib/color");
let setting = JSON.parse(fs.readFileSync('./config.json'));
let sesion = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(sesion)

const start = async () => {
    //Meng weem
	console.log(color(figlet.textSync('ItsukiBot - MD', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('[ Created KiZaKiXD ]'))
    // set level pino ke fatal kalo ga mau nampilin log eror
    const chika = makeWASocket({ printQRInTerminal: true, logger: P({ level: 'debug' }), auth: state }) 
    chika.multi = true
    chika.nopref = true
    chika.prefa = 'anjing'
    console.log(color('Connected....'))
    chika.ev.on('messages.upsert', async m => {
    	if (!m.messages) return
        const msg = m.messages[0]
        require('./message/zaki')(chika, msg, m, ind, setting)
    })

    chika.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log(ChikaLog('connection closed, try to restart'))
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
            ? start()
            : console.log(ChikaLog('Wa web terlogout.'))
        }
    })

    chika.ev.on('creds.update', () => saveState)

    return chika
}

start()
.catch(err => console.log(err))
