function Bullet(posX, posY, speed, dir, enemyShoot, shootersId) {
	this.shootersId = shootersId;
	this.pos = createVector(posX, posY);
	this.speed = 3;
	this.dir = dir.normalize().mult(this.speed);
	this.enemyShoot = enemyShoot;
	this.bulletLifeSpan = 1500;
	this.spawnTime = millis();

	this.update = function () {
		if (this.pos) {
			this.pos.add(this.dir);
			//			danePocisku.x = this.pos.x;
			//			danePocisku.y = this.pos.y;
			//this.checkBullets();
			this.checkLife();
		}
	}

	this.show = function () {
		if (this.pos) {
			if (this.shootersId != socket.id) {
				fill(255, 0, 0);
			} else fill(0, 255, 0);
			rect(this.pos.x, this.pos.y, 3, 3);
		}
	}

	this.checkLife = function () {
		if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
			delete this.pos.x;
			delete this.pos.y;
		}
		if (millis() >= this.spawnTime + this.bulletLifeSpan) {
			delete this.pos;
		}
	}

	this.checkBullets = function () {
		for (var i = 0; i < enemies.length; i++) {
			var distToEnemy = dist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y);
			if (ball) {
				var distToPlayer = dist(this.pos.x, this.pos.y, ball.pos.x, ball.pos.y);
			}
			//
			//			if (distToEnemy <= 7.5 && this.enemyShoot == false) {
			//				enemies.splice(i, 1);
			//				if (ball) {
			//					ball.s += 1;
			//				}
			//			}
			//			if (distToPlayer <= 8 && this.enemyShoot == true) {
			//				ball = null;
			//			}
		}
	}


}
