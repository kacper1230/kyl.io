function EventRect() {
  this.pos = createVector(random(width), random(height));
  this.type = "";
  this.types = ["points"];
  

  this.update = function() {
    this.collect();
  }

  this.show = function() {
    fill(0, 0, 255, 255);
    rect(this.pos.x, this.pos.y, 20, 20);
  }

  this.randomType = {

  }

  this.collect = function() {
    this.distToPlayer = dist(this.pos.x, this.pos.y, ball.pos.x, ball.pos.y);
  //  console.log(this.distToPlayer);
    if (this.distToPlayer <= ball.s / 2) {
    //  this.remove();
    }
  }

}