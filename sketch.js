var vC = "0029384751";
var ball, enemy;
var bullets = [];
var enemies = [];
var eventBoxesC = [];
var socket;
var gracze = [];
var daneGracza;
var danePocisku;
var nick;
var playersBulletsC = [];

function playMusic() {
	music.play();
}

function setNick() {
	nick = document.getElementById('nick').value;
	$('#nickModal').modal('hide');
	delete ball; 
	ball = new Ball(random(width), random(height), 16, true, false);
}

function setup() {
	createCanvas(1000, 600);

	//socket = io.connect('http://servergierki.eu-4.evennode.com/');
	socket = io.connect('http://localhost:3000');
	socket.on('polaczenie', function (data) {
		console.log(data);
	});

	ball = new Ball(700,1200 , 16, true, false);

	//	enemy1 = new Enemy(this.ball.pos);
	//	enemies.push(enemy1);




	nick = "Nowy Gracz";

	daneGracza = {
		hp: ball.hp,
		x: ball.pos.x,
		y: ball.pos.y,
		s: ball.s,
		alive: ball.alive,
		v: vC,
	}

	socket.emit('nowyGracz', daneGracza);


	socket.on('playersShoots', function (b) {
		//		var d = createVector(b.dirX, b.dirY);
		//		var strzal = new Bullet(b.x, b.y, d, b.enemyShoot, b.shootersId);
		//		bullets.push(strzal);
	});

	socket.on('gracze', function (players) {
		gracze = players;
		for (var i = 0; i < gracze.length; i++) {
			if (gracze[i].id == socket.id) {
				ball.hp = gracze[i].hp;
			}
		}
	});

	socket.on('newEventBox', function (eventBoxesS) {
		eventBoxesC = eventBoxesS;
	});

	socket.on('playersBullets', function (playersBulletsS) {
		playersBulletsC = playersBulletsS;
		//	console.log(playersBulletsC);
	});

}


function draw() {
	background(51);

	if (ball) {
		ball.show();
		ball.update();
	}

	if (ball.hp <= 0) {
		delete ball;
		ball = new Ball(random(width), random(height), 16, true, false);
		//ball.hp =
	}

	for (var i = 0; i < gracze.length; i++) {
		if (gracze[i].alive && gracze[i].id != socket.id) {
			var col = gracze[i].hp / 100;
			fill(100 / col, 0, 255 * col);
			ellipse(gracze[i].x, gracze[i].y, gracze[i].s, gracze[i].s);
			if (gracze[i].nick) {
				fill(255, 0, 255);
				text(gracze[i].nick, gracze[i].x - gracze[i].s, gracze[i].y + 20);
			}
			fill(255, 0, 0);
			rect(gracze[i].x - gracze[i].s, gracze[i].y - gracze[i].s, 31 * gracze[i].hp / 100, 3);
		}

		if (gracze[i].points) {
			fill(255, 0, 255);
			text(gracze[i].points.toString(), gracze[i].x + 20, gracze[i].y)
		}
		if (gracze[i].id == socket.id) {
			ball.hp = gracze[i].hp;
		}

	}


	if (ball) {
		nick = document.getElementById('nick').value;
		daneGracza = {
			nick: nick,
			x: ball.pos.x,
			y: ball.pos.y,
			s: ball.s,
			alive: ball.alive,
		}
	}
	socket.emit("playerInfo", daneGracza);


	for (var i = 0; i < enemies.length; i++) {
		enemies[i].show();
		enemies[i].update();
	}

	for (var i = 0; i < eventBoxesC.length; i++) {
		fill(0, 0, 255, 100);
		rect(eventBoxesC[i].x, eventBoxesC[i].y, 10, 10);
	}


	for (var i = 0; i < bullets.length; i++) {
		bullets[i].show();
		bullets[i].update();
	}

	for (var i = 0; i < playersBulletsC.length; i++) {
		//		playersBulletsC[i].show();
		if (playersBulletsC[i].shootersId == socket.id) {
			fill(0, 255, 0);
		} else {
			fill(255, 0, 0);
		}
		rect(playersBulletsC[i].x, playersBulletsC[i].y, 3, 3);
	}


}

function mouseClicked() {
	if (ball) {
		//this.ball.shoot();
		danePocisku = {
			x: this.ball.pos.x,
			y: this.ball.pos.y,
			dirX: this.ball.dir.x,
			dirY: this.ball.dir.y,
			shootersId: "",
			enemyshoot: true,
		}
		socket.emit('shoot', danePocisku);
	}

}

function event() {
	var losowa = random(1);
	if (losowa <= 0.01) {
		var box = new EventRect();
		boxes.push(box);
	}
}
