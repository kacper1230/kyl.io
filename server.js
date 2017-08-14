var express = require('express');
var app = express();
var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var fs = require('fs');
var versionS = "0029384751";
var serverStartTime = process.hrtime()[0];

var players = [];
var playersBulletsS = [];
var eventBoxesS = [];

var canvasHeight = 600;
var canvasWidth = 1000;

setInterval(spawnBox, 15000);
//setInterval(checkBullets, 33);
setInterval(update, 33);

//setInterval(sendPlayers, 33);
//setInterval(sendBullets, 33);
//setInterval(sendBoxes, 33);
setInterval(sendData, 33);


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
	var time = process.hrtime()[0] - serverStartTime;
	return time;
}


function Player(id, nick, x, y, s, alive, enemy) {
	this.id = id;
	this.nick = nick;
	this.hp = 100;
	this.x = x;
	this.y = y;
	this.s = s;
	this.alive = alive;
	this.enemy = enemy;
	this.points = 0;
}

function Bullet(x, y, dirX, dirY, shootersId, enemyShoot) {
	this.x = x;
	this.y = y;
	this.speed = 3.5;
	this.dirX = dirX;
	this.dirY = dirY;
	this.shootersId = shootersId;
	this.enemyShoot = enemyShoot;
	this.lifeSpan = 3;

	this.update = function () {
		if (this.x && this.y) {
			this.x += dirX * this.speed;
			this.y += dirY * this.speed;
			this.checkLife();
		}
	}

	this.checkLife = function () {
		if (this.x > canvasWidth || this.x < 0 || this.y > canvasHeight || this.y < 0) {
			delete this.x;
			delete this.y;
		}
	}

}

function EventBox(x, y) {
	this.x = x;
	this.y = y;
	this.bonusSpeed = 5;
}

function spawnBox() {
	var losowa = Math.random() * 100;
	var szansa = 10;
	if (losowa >= szansa) {
		var x = Math.random() * 1000;
		var y = Math.random() * 600;
		var eventBox = new EventBox(x, y);
		eventBoxesS.push(eventBox);
	}
}

function checkBullets() {
	for (var i = 0; i < playersBulletsS.length; i++) {
		//----------------Boxy
		for (var j = 0; j < eventBoxesS.length; j++) {
			var distToBox = Math.sqrt(Math.pow(playersBulletsS[i].x - eventBoxesS[j].x, 2) + (Math.pow(playersBulletsS[i].y - eventBoxesS[j].y, 2)));
			if (distToBox <= 8) {
				//	console.log(Math.pow(playersBulletsS[i].x - eventBoxesS[j].x,2));
				//	console.log(distToBox + "  " + eventBoxesS[j]);
				eventBoxesS[j] = [];
				//delete playersBulletsS[i];
			}
		} //-------Koniec Boxow

		//---------------Gracze	
		for (var j = 0; j < players.length; j++) {
			var distToPlayer = Math.sqrt(Math.pow(playersBulletsS[i].x - players[j].x, 2) + (Math.pow(playersBulletsS[i].y - players[j].y, 2)));
			if (distToPlayer <= (players[j].s / 2) && players[j].id != playersBulletsS[i].shootersId) {
				//console.log('Trafiony zatopiony');
				if (players[j].hp > 0) {
					players[j].hp -= 5;
				} else {
					players[j].hp = 100;
				} /////---------------------------------------------------/////Tu skonczylem
				//	delete playersBulletsS[i];

			}
		} //-----------------Koniec graczy

	}
}

function update() {
	checkBullets();
	//	console.log(currentTime());
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

function sendData() {
	io.emit('gracze', players);
	io.emit('playersBullets', playersBulletsS);
	io.emit('newEventBox', eventBoxesS);

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
			var newPlayer = new Player(socket.id, dane.nick, dane.x, dane.y, dane.s, true, true);
			players.push(newPlayer);
			socket.emit('gracze', players);
			socket.emit('newEventBox', eventBoxesS);
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
				//	players[i].hp = player.hp;
				players[i].x = player.x;
				players[i].y = player.y;
				players[i].s = player.s;
			}
		}
	});

	socket.on('disconnect', function () {
		console.log("Gracz o id " + socket.id + " rozlaczyl sie.");
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == socket.id) {
				players[i].alive = false;
				players[i].points = null;
				players.slice(i, 1);
			}

		}
	});



	socket.on('shoot', function (danePocisku) {
		//	console.log(danePocisku.x + " " + danePocisku.y + " " + danePocisku.dirX + " " + danePocisku.dirY);
		var b = new Bullet(danePocisku.x, danePocisku.y, danePocisku.dirX, danePocisku.dirY, socket.id, danePocisku.enemyshoot);
		playersBulletsS.push(b);
		//	socket.broadcast.emit("playersShoots", b);
		socket.broadcast.emit('playersBullets', playersBulletsS);
		socket.emit('playersBullets', playersBulletsS);
		//	sendBullets();
	});

	socket.on('getHit', function (id) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id == id) {
				players[i].points += 5;
			}
		}
	});

});
