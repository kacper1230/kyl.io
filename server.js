var express = require('express');
var app = express();
var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var fs = require('fs');
var versionS = "0029384751";
var serverStartTimeS = process.hrtime()[0];
var serverStartTimeNano = process.hrtime()[1];

var players = [];
var playersBulletsS = [];
var eventBoxesS = [];

var canvasHeight = 600;
var canvasWidth = 1000;

setInterval(spawnBox, 3000);
setInterval(checkBullets, 33);
setInterval(update, 11);

setInterval(sendPlayers, 17);


app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	next();
});

http.listen(process.env.PORT || 3000, function () {
	console.log("Server is running on PORT 3000");
});

function currentTime() {
	var timeS = process.hrtime()[0] - serverStartTimeS;

	return timeS;
}


function Player(id, nick, x, y, s, speed, alive, enemy) {
	this.id = id;
	this.nick = nick;
	this.hp = 100;
	this.x = x;
	this.y = y;
	this.s = s;
	this.speed = speed;
	this.alive = alive;
	this.enemy = enemy;
	this.points = 0;
}

function Bullet(x, y, speed, dirX, dirY, shootersId, enemyShoot) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.dirX = dirX * this.speed;
	this.dirY = dirY * this.speed;
	this.shootersId = shootersId;
	this.enemyShoot = enemyShoot;
	this.lifeSpan = 2;
	this.spawnTime = currentTime();

	this.delete = function () {
		this.x = null;
		this.y = null;
	}

	this.update = function () {
		if (this.x && this.y) {
			this.x += dirX;
			this.y += dirY;
			this.checkLife();
		}

	}

	this.checkLife = function () {
		if (this.x > canvasWidth || this.x < 0 || this.y > canvasHeight || this.y < 0) {
			delete this.x;
			delete this.y;
		}
		if (currentTime() >= this.spawnTime + this.lifeSpan) {
			this.delete();
		}
	}

}

function EventBox(x, y) {
	this.x = x;
	this.y = y;
	this.bonusSpeed = 1;
}

function spawnBox() {
	var losowa = Math.random() * 100;
	var szansa = 10;
	if (losowa <= szansa) {
//		console.log(losowa);
		var x = Math.random() * 1000;
		var y = Math.random() * 600;
		var eventBox = new EventBox(x, y);
		eventBoxesS.push(eventBox);
		io.emit('EventBox', eventBoxesS);
	}
}

function checkBullets() {
	for (var i = 0; i < playersBulletsS.length; i++) {
		//----------------Boxy
		for (var j = 0; j < eventBoxesS.length; j++) {
			var distToBox = Math.sqrt(Math.pow(playersBulletsS[i].x - eventBoxesS[j].x, 2) + (Math.pow(playersBulletsS[i].y - eventBoxesS[j].y, 2)));
			if (distToBox <= 7) {
				for (var k = 0; k < players.length; k++) {
					if (players[k].id == playersBulletsS[i].shootersId) {
						players[k].speed += eventBoxesS[j].bonusSpeed;
						console.log(players[k]);
					}
				}
				eventBoxesS[j] = [];
				playersBulletsS[i].delete();
				io.emit('EventBox', eventBoxesS);
			}
		} //-------Koniec Boxow

		//---------------Gracze	
		for (var j = 0; j < players.length; j++) {
			var distToPlayer = Math.sqrt(Math.pow(playersBulletsS[i].x - players[j].x, 2) + (Math.pow(playersBulletsS[i].y - players[j].y, 2)));
			if (distToPlayer <= (players[j].s / 2) && players[j].id != playersBulletsS[i].shootersId) {
				//console.log('Trafiony zatopiony');
				if (players[j].hp > 0) {
					players[j].hp -= 5;
					for (var k = 0; k < players.length; k++) {
						if (players[k].id == playersBulletsS[i].shootersId) {
							players[k].points += 5;
						}
					}
				}
				playersBulletsS[i].delete();
			}
		} //-----------------Koniec graczy

	}
}


function update() {
	//console.log(players);
	checkBullets();
	//currentTime();
	for (var i = 0; i < playersBulletsS.length; i++) {
		playersBulletsS[i].update();
	}

};

function handler(req, res) {
	fs.readFile('index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			res.writeHead(200);
			res.end(data);
		});
}

function sendPlayers() {
	io.emit('gracze', players);
}


//function sendPlayers() {
//	io.emit('gracze', players);
//}
//
//function sendBullets() {
//	io.emit('playersBullets', playersBulletsS);
//}
//
//function sendBoxes() {
//	io.emit('newEventBox', eventBoxesS);
//}


io.on('connection', function (socket) {
	wiadomosc = "Polaczyles sie z serwerem";

	socket.emit('polaczenie', wiadomosc);

	socket.on('nowyGracz', function (dane) {
		//console.log(dane.v);
		if (dane.v == undefined) {
			if (dane.v != versionS) {
				socket.disconnect(true);
			}
		} else {
			console.log('Dolaczyl gracz o id ' + socket.id);
			var newPlayer = new Player(socket.id, dane.nick, dane.x, dane.y, dane.s, dane.speed, true, true);
			players.push(newPlayer);
			socket.emit('gracze', players);
			socket.emit('EventBox', eventBoxesS);
		}
	});

	socket.on('nick', function (nick) {
		for (var i = 0; i < players.length; i++) {
			if (player[i].id == socket.id) {
				player[i].nick = nick;
			}
		}
	});

	socket.on('playerInfo', function (player) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				players[i].nick = player.nick;
				players[i].x = player.x;
				players[i].y = player.y;
				players[i].s = player.s;
				players[i].speed = player.speed;
			}
		}
	});

	socket.on('disconnect', function () {
		console.log("Gracz o id " + socket.id + " rozlaczyl sie.");
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				players[i].alive = false;
				players[i].points = null;
				if (players[i].points = null) {
					players.slice(i, 1);
				}
			}

		}
	});

	socket.on('respawn', function () {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				players[i].hp = 100;
			}
		}
	});



	socket.on('shoot', function (danePocisku) {
		var b = new Bullet(danePocisku.x, danePocisku.y, danePocisku.speed, danePocisku.dirX, danePocisku.dirY, socket.id, danePocisku.enemyshoot);
		playersBulletsS.push(b);
		io.emit("playersShoots", b);
		//socket.broadcast.emit('playersBullets', playersBulletsS);
		//	socket.emit('playersBullets', playersBulletsS);
		//	sendBullets();

	});

	//	socket.on('getHit', function (id) {
	//		for (var i = 0; i < players.length; i++) {
	//			if (players[i].id == id) {
	//				players[i].points += 5;
	//			}
	//		}
	//	});

});
