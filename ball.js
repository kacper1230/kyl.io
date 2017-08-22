function Ball(posX, posY, s, alive, enemy) {
	this.pos = createVector(posX, posY);
	this.dir = createVector(mouseX - this.pos.x, mouseY - this.pos.y).normalize();
	this.s = s;
	this.bulletSpeed = 100;
	this.alive = alive;
	this.enemy = enemy;
	this.hp = 100;
	this.speed = 2;

	this.show = function () {
		if (alive) {
			fill(0, 255, 0);
			ellipse(this.pos.x, this.pos.y, this.s, this.s);
			text(nick, this.pos.x - this.s, this.pos.y + 20);
			fill(255, 0, 0);
			rect(this.pos.x - this.s, this.pos.y - this.s, 31 * this.hp / 100, 3);
//			fill(0, 255, 0);
//			text(this.points, this.pos.x - this.s, this.pos.y + 20);
		}
	}

	this.update = function () {
		// console.log(this.pos.x + "  " + this.pos.y);
		this.dist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
		if (this.dist > 1) {
			this.dir = createVector(mouseX - this.pos.x, mouseY - this.pos.y).normalize().mult(this.speed);
			this.pos.add(this.dir);
		}
	}
//
//	this.checkBullets = function () {
//		for (var i = bullets.length - 1; i > 0; i--) {
//			if (bullets[i].pos) {
//				var distToBullet = dist(this.pos.x, this.pos.y, bullets[i].pos.x, bullets[i].pos.y);
//				if (distToBullet <= this.s && bullets[i].enemyShoot == true) {
//					if (this.hp > 0) {
//						this.hp -= 5;
//						console.log(bullets[i].shootersId);
//						socket.emit('getHit',bullets[i].shootersId);
//					}
//				}
//			}
//
//		}
		//		for (var i = 0; i  < bullets.length ; i++) {
		//			var distToBullet = dist(this.pos.x, this.pos.y, bullets[i].pos.x, bullets[i].pos.y);
		//			if (distToBullet <= this.s/2) {
		//				this.hp -= 5;
		//			}
		//		}
//	}

	this.shoot = function () {
		var d = createVector(mouseX - this.pos.x, mouseY - this.pos.y).normalize();
		var b = new Bullet(this.pos.x, this.pos.y, d, false);
		bullets.push(b);
	}

}
