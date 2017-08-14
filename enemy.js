function Enemy(playerPos) {
  this.pos = createVector(random(width), random(height));
  this.playerPos = playerPos;
  this.timer = 5;
  this.spawnTime = millis()  + 1500;
  this.speed = 0.6;
  
  this.show = function() {
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 15);
  }
  
  this.update = function() {
      this.dir = createVector(playerPos.x - this.pos.x,playerPos.y - this.pos.y).normalize();
      this.dir.mult(this.speed);
      this.pos.add(this.dir);
      
      if(this.spawnTime <= millis()){
        this.shoot();
        this.spawnTime = millis() + 1500;
      }

  }
  
  this.shoot = function(){
    var b = new Bullet(this.pos.x,this.pos.y,this.dir);
      b.enemyShoot = true;
    bullets.push(b);
  }
  
 
}