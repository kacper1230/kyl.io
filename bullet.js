function Bullet(posX, posY, dir, enemyShoot, shootersId) {
	this.shootersId = shootersId;
	this.pos = createVector(posX, posY);
	this.speed = 3.5;
	this.dir = dir.normalize().mult(this.speed);
	this.enemyShoot = enemyShoot;
	this.bulletLifeSpan = 1500;
	this.spawnTime = millis();

	this.update = function () {
		if (this.pos) {
			this.pos.add(this.dir);
			//			danePocisku.x = this.pos.x;
			//			danePocisku.y = this.pos.y;
			this.checkBullets();
		}

		if (millis() >= this.spawnTime + this.bulletLifeSpan) {
			delete this.pos;
		}

	}


	this.show = function () {
		if (this.pos) {
			if (this.enemyShoot) {
				fill(255, 0, 0);
			} else fill(0, 255, 0);
			rect(this.pos.x, this.pos.y, 5, 5);
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
