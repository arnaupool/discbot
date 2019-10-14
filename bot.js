var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
var os = require('os');
var osu = require('os-utils');
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

function comprov(xantoni, chechu, parra, yo, id, callback) {
				if (typeof xantoni != "undefined") 
				{
					id = xantoni;
					callback(id);
				}
				if (typeof parra != "undefined") 
				{
					id = parra;
					callback(id);
				}
				if (typeof chechu != "undefined")
				{
					id = chechu;
					callback(id);
				}
				if (typeof yo != "undefined") 
				{
					id = yo;
					callback(id);
				} else id = undefined; callback(id);
			}

bot.on('message', function (user, userID, channelID, message, evt) {
	
    if (message.substring(0, 1) == 'x') {
        var args 	= message.substring(1).split(' '); //Devuelve un array, en el cual la primera posición identifica el tipo de orden
        var cmd 	= args[0];                          //Coge el contenido de la primera posición
        var ini 	= message.indexOf(' ');             //Coge el índice del espacio entre la orden y el parámetro, devuelve -1 si no hay parámetro
        let tot 	= message.substr(ini);              //Coge el mensaje a partir del índice anterior
        let mes 	= null;                             //letiables varias
        var tuit 	= null;
        var smt 	= null;
        var text 	= null;

        switch(cmd) {
		  case 'osu':
				console.log(osu.processUptime());
				break;
			
		  case 'stats': //os.platform() os.freemem() os.totalmem() os.uptime() 
				bot.sendMessage({
					to:channelID,
					embed: {
                        color: 3553599,
                        //thumbnail: {url: 'https://pbs.twimg.com/profile_images/938202843734999040/nwD-5q9i_400x400.jpg'},
                        author: {
                          name: user.username,
                          icon_url: user.avatarURL
                          },
                        title: "Stats",
                        description: "Estadísticas de ar-bot",
                        
                        fields: [
                            {
								name: "CPU",
								value: os.cpus()[0].model
                            },
                            {
								name: "Plataforma",
                                value: os.platform()
							},
							{
								name: "Número de cores",
                                value: osu.cpuCount()
							},
							{
								name: "Uso de memoria (en MB)",
								value: ((os.totalmem() - os.freemem()) / 2048) + ' / ' + (os.totalmem() / 2048)
							},
							{
								name: "Porcentaje de memoria libre",
								value: osu.freememPercentage()
							}
                        ],

                        //fields: [
							//{
                              //name: "CPU",
                              //value: os.cpus()[0].model
                            //},
                            //{
                              //name: "Plataforma",
                              //value: os.platform()
                            //},
                            //{
                              //name: "Número de cores",
                              //value: osu.cpuCount()
                            //},
                            //{
                              //name: "Uso de memoria (en MB)",
                              //value: (os.freemem() - os.totalmem()) / 2048 + ' / ' + os.totalmem() / 2048
                            //},
                            //{
                              //name: "Porcentaje de memoria libre",
                              //value: osu.freememPercentage()
                            //},
                            //{
                              //name: "Tiempo de actividad del programa (en segundos)",
                              //value: osu.processUptime()
                            //},
                            //{
                              //name: "Tiempo de actividad del sistema (en segundos)",
                              //value: os.uptime()
                            //}
                        //],

                        timestamp: new Date(),
                        footer: {
                          icon_url: bot.avatarURL,
                          text: "arnaupool ©"
                        }
                       }
					}, function(err) {if(err) {console.log(err); bot.sendMessage({to:channelID, message: err})}});
					break;
		  
		  case 'xan' :
				//id del server = 335054739861536779
				//id de xantoni = 226436611859152896
				//mi id 		= 288115844297523210
				//id del parra 	= 285548406611378177
				//id del chechu = 280394623095144448
				//bot.leaveVoiceChannel(channelID, function(err){if(err) console.log(err)})		   
				let xantoni = bot.servers['335054739861536779'].members['226436611859152896'].voice_channel_id;
				let chechu 	= bot.servers['335054739861536779'].members['280394623095144448'].voice_channel_id;
				let parra 	= bot.servers['335054739861536779'].members['285548406611378177'].voice_channel_id;
				let yo 		= bot.servers['335054739861536779'].members['288115844297523210'].voice_channel_id;
				var id;
				
				comprov(xantoni, chechu, parra, yo, id, function(nid){
					//console.log(nid + '\n' + xantoni + '\n' + chechu + '\n' + parra + '\n' + yo);
					
					if(typeof nid != "undefined") {
						bot.joinVoiceChannel(nid, function(err){if(err) console.log(err)});
						console.log('In voice channel');
					} else console.log('Couldn\'t get in')
					
					let count = tot;
					console.log('count: ' + count)
					let x = 0;
					let interval = setInterval(function(){
						console.log('x is ' + x);
						bot.sendMessage({to:channelID, message: 'xanya'}, function(){x++});
						if(++x == count) {clearInterval(interval);}
					}, 2000)
					
					setTimeout(function(){bot.leaveVoiceChannel(nid, function(err){if(err) console.log(err)})}, count * 3000);
				
				});
				break;	
				
		  //case 'out': 
				//let out 		= bot.servers['335054739861536779'].members['288115844297523210'].voice_channel_id;
				//bot.leaveVoiceChannel(out, function(err){if(err) console.log(err)})
				//break;
		  
		  case 't':
			if(ini != -1)
			{
				let target = args[1];
				let count = args[2];
				let m0 = message.substr(args[0]);
				
				
				//console.log('Target: ' + target + '\nCount: ' + count
				//+ '\nAlgo: ' + args[3] + '\n-----------\nm0: ' + m0
				//+ '\nm1: ' + m1 + '\nm2: ' + m2 + '\nm3: ' + m3);
				
				for(let i = 0; i < args.length; i++) console.log(args[i]);
				
				bot.sendMessage({
							to: channelID,
							message: 'Ponme algunos parámetros anda'
						});
			} else
			{
					bot.sendMessage({
							to:channelID,
							message: 'Ponme algunos parámetros anda'
						});
			}
		  
			break;  
          case 's':                                 //Comando más fácil de teclear que el /tts predeterminado
            if (ini != -1) {
                bot.sendMessage({
					tts:true,
                    to: channelID,
                    message: tot
                });
                
                setTimeout(function() {bot.getMessages({
						channelID: channelID
						}, function(err, msg){
							//console.log(msg)
							var idm = msg[0].id;
							var user = msg[0].author.username;
							var mensaje = msg[0].content;
							console.log('Author: ' + user + '\nID: ' + idm + '\nContent: ' + mensaje)
							console.log(idm);
							if(typeof idm != undefined) {
									bot.deleteMessage({
										channelID: channelID,
										messageID: idm
										}, function(error) {if (error) console.log(error)});
										console.log('Deleted message with id: ' + idm)
								} //else {console.log('Error deleting message')}
							})}, 2000);
                
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
              bot.sendMessage({
                    to: channelID,
                    message: array[num]
                });
            break;

          case 'help':                              //Muestra la ayuda
				//https://ci.memecdn.com/8028227_t.jpg
                console.log('Entra en xhelp')
                bot.sendMessage({
                      to: channelID,
                      embed: {
                        color: 3553599,
                        thumbnail: { url: 'https://ci.memecdn.com/8028227_t.jpg'},
                        title: 'Comandos del bot por el momento ',
                        //url: 
                        description: '(Patente en trámite)',
                        fields: [
                            {
								name: 'xhelp',
								value: "\v Muestra este mensaje de ayuda",
								//inline: true
                            },
                            {
								name: 'xhola',
								value: 'Te envía una cadena aleatoria',
								//inline: true
							},
							{
								name: 'xs + texto',
								value: 'Comando /tts, más rápido de teclear',
								//inline:true
							},
							{
								name: 'xf + palabra',
								value: 'Busca en Twitter el último tuit que contenga la palabra,'
								+ ' ya sea en el nombre de usuario, el alias o el mismo texto del tuit',
								//inline: true
							},
							{
								name: 'xgo + texto',
								value: 'Envía un tuit con el texto puesto, en la'
								 + ' cuenta de [@_a_leg](https://twitter.com/_a_leg)',
								//inline: true
							}
                        ],

                        timestamp: new Date(),
                        footer: {
                          icon_url: bot.avatarURL,
                          text: "arnaupool ©"
                        }
                       }
                      }, function(err, resp) {
						  var s = '';
						  if (err) 
						  {
							s += 'Error: ' + err;
							bot.sendMessage({
								to:channelID,
								message: 'De verdad que no sé qué cojones me pasa, no puedo enviar la ayuda, dep'
								});
						   }
						  if (resp) s += '\nResponse: ' + resp;
						  if(err || resp) console.log(s)
						  });
                
                
            break;

          case 'go':                             //Envía un tweet a través de la cuenta @_a_leg
            if (ini <= 0) {
              bot.sendMessage({
                to: channelID,
                message: 'Envía algún mensaje, anda'
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
                        color: 3553599,
                        thumbnail: {url: 'https://pbs.twimg.com/profile_images/938202843734999040/nwD-5q9i_400x400.jpg'},
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
								console.log('Tweetlog updated with new tweet from : ' + user);
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

          case 'f':
            if (tot.length <= 0) {
              bot.sendMessage({
                to: channelID,
                message: 'Ponme una palabra para buscar'
                });
            } else {
              //Mirar que no sea un rt
              //console.log(data.statuses[0].text)
              Twitter.get('search/tweets', { q: tot + ' since:2011-07-11', count: 1 }, function(err, data, response) {
                var undef = data.statuses[0]
                if (typeof undef == 'undefined') {
                  bot.sendMessage({
                    to: channelID,
                    message: 'No se ha encontrado nada, busca otra cosa'
                  });
                } else {
                  bot.sendMessage({
                      to: channelID,
                      message: 'https://twitter.com/' + data.statuses[0].user.screen_name + '/status/' + data.statuses[0].id_str
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
				
		    //case 'ping': 
				//bot.sendMessage({
					//to: channelID,
					//message: "El tiempo es de aproximadamente " + Math.round(bot.ping) + " ms"});
					//console.log(bot.ping);
				////bot.deleteMessage({channelID:channelID, messageID:evt.d.id}, function(error){console.log(error)});
				////bot.deleteMessage({channelID: channelID, messageID:bot.channels[channelID].last_message_id}, function(err){console.log(err)});
				////console.log(bot.channels[channelID].last_message_id)
				////bot.getMessages({channelID: channelID}, function(error, msg){console.log(msg)});
				//break;
				
			
            //case 's1':
				//if (ini <= -1) {
				  //bot.sendMessage({
					//to: channelID,
					//message: 'Ponme una palabra para buscar.'
					//});
					//break;
				//} else {
					//var stream = Twitter.stream('statuses/filter', { track: tot })
					//stream.on('tweet', function (tweet) {
							////bot.sendMessage({
							////to: channelID,
							////message: tweet
							////});
							////console.log(tweet)
						//})
						////stream.stop
				   //break;
				//}
          }
        }
});
