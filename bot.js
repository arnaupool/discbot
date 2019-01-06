var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
const fs = require('fs');

var array = ["Me cago en tus muertos",
  "¿Quieres callarte ya?", "Por favor, déjame dormir",
  "No tengo tiempo para esto", "Ya me he cansado, ahora mismo van dos matones "
   + "rumanos a tu casa.", "Marge, la escopeta.", "oof"
]
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.setPresence({ game:{
  name: "Type xhelp"
    }
});

bot.on('disconnect', function(errMsg, code) { });

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == 'x') {
        var args = message.substring(1).split(' '); //Devuelve un array, en el cual la primera posición identifica el tipo de orden
        var cmd = args[0];                          //Coge el contenido de la primera posición
        var ini = message.indexOf(' ');             //Coge el índice del espacio entre la orden y el parámetro, devuelve -1 si no hay parámetro
        var tot = message.substr(ini);              //Coge el mensaje a partir del índice anterior
        var mes = null;                             //Variables varias
        var tuit = null;
        var smt = null;
        var text = null;

        switch(cmd) {
			case 'd': 
				bot.sendMessage({
					to: channelID,
					message: "Pruebecita"})
				bot.deleteMessage(channelID, function(error){console.log(error)});
				break;
          case 'r':                                 //Comando más fácil de teclear que el /tts predeterminado
            if (ini != -1) {
                bot.sendMessage({
                  tts:true,
                    to: channelID,
                    message: tot
                });
                
              } else {
                bot.sendMessage({
                  tts:true,
                    to: channelID,
                    message: "Envíame algo que decir, macho, ¿qué coño quieres que diga?"
                });
              }
            break;

          case 'hola':                              //Te envía una frase aleatoria de un array de frases
              var num = Math.floor((Math.random() * 6) + 1);
              console.log(num + '\n');
              console.log(array[num]);
              bot.sendMessage({
                    to: channelID,
                    message: array[num]
                });
            break;

          case 'help':                              //Muestra la ayuda
                bot.sendMessage({
                    to: channelID,
                    message: 'De momento tengo estos comandos:\n'
                    + '__xhelp:__ Muestra esta ayuda.\n'
                    + '__xhola:__ Hace algo.\n'
                    + '__xr + texto:__ Comando /tts, más corto de teclear.\n'
                    + '__xs + palabra:__ Busca en Twitter el último tuit que contenga la palabra, ya sea en el user o en el texto del tuit.\n'
                    + '__xlaunch + texto__: Lanza un tuit con el texto puesto, en la cuenta de @_a_leg. Haced lo que queráis. \n'
                });
            break;

          case 'launch':                             //Envía un tweet a través de la cuenta @_a_leg
            if (ini <= 0) {
              bot.sendMessage({
                to: channelID,
                message: 'Envía algún mensaje.'
              });
              break;
            }
            if (tot.length <= 280) {
                Twitter.post('statuses/update', { status: tot }, function(err, data, response) {
                  //console.log(data.id_str)
                  if (err) {
                    smt = parseInt(err.statusCode)
                    //console.log('smt: ' + smt)
                    //console.log(typeof smt)
                    //console.log('-----')                          Detección de errores
                    //console.log('raw code: ' + err.statusCode)
                    //console.log(typeof err.statusCode)
                    switch(smt) {
                      case '403' : mes = 'Tweet duplicado, no se ha podido enviar. Espera unos segundos o envía otro tweet.'
                          break;
                      case '400' : mes = 'Petición inválida.'
                          break;
                      default: mes = 'Error. Inténtalo más tarde.'
                    }
                    //console.log(err.message)
                    //console.log(err.statusCode)
                    bot.sendMessage({
                      to: channelID,
                      message: mes + '\n'
                      + 'Mensaje de error: ' + err.message + '\n'
                      + 'Código de estado: ' + err.statusCode
                    });
                  } else {                                            //Tweet enviado
                    bot.sendMessage({
                      to: channelID,
                      embed: {
                        color: 2123412,
                        author: {
                          name: user.username,
                          icon_url: user.avatarURL
                          },
                        title: "Tweet enviado",
                        url: 'https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str,
                        description: tot,

                        fields: [
                            {
                              name: "Enviado por",
                              value: "\v" + user
                            },
                        ],

                        timestamp: new Date(),
                        footer: {
                          icon_url: bot.avatarURL,
                          text: "arnaupool ©"
                        }
                       }
                      });
                      //Guarda en un log
                      var data = 'Tweet URL: https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str + "\n" +
								 'Tweet text: ' + tot + '\n' +
								 'Sent by: ' + user + '\n'		//No he sabido poner la fecha con Date()
					  fs.appendFile('tweetlog.txt', '\n' + data, function (err) {
								if (err) throw err;
								console.log('tweetlog updated!');
							});
                  }
                })
            } else {
              bot.sendMessage({
                to: channelID,
                message: 'El mensaje no puede superar los 280 carácteres'
              });
            }
            break;

          case 's':
            if (tot.length <= 0) {
              bot.sendMessage({
                to: channelID,
                message: 'Ponme una palabra para buscar.'
                });
              break;
            } else {
              //Mirar que no sea un rt
              //console.log(data.statuses[0].text)
              Twitter.get('search/tweets', { q: tot + ' since:2011-07-11', count: 1 }, function(err, data, response) {
                var undef = data.statuses[0]
                if (typeof undef == 'undefined') {
                  bot.sendMessage({
                    to: channelID,
                    message: 'No se ha encontrado nada, busca algo con sentido.'
                  });
                } else {
                  bot.sendMessage({
                      to: channelID,
                      message: '```' + data.statuses[0].text + '```' + '\n'
                      + 'https://twitter.com/' + data.statuses[0].user.screen_name + '/status/' + data.statuses[0].id_str
                  });
                }
              })
              break;
            }
          case 'date':
			let d = new Date();
			bot.sendMessage({
				to: channelID,
				message: d + ' '
				});
				console.log(d)
				break;
          }
        }
});
