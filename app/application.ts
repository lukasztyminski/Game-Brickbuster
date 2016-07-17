class Ball {
    radius : number;
    posX : number;
    posY : number;
    dirX : number;
    dirY : number; 

    constructor(radius : number, posX : number, posY : number, dirX : number, dirY : number) {
        this.radius = radius;
        this.posX = posX;
        this.posY = posY;
        this.dirX = dirX;
        this.dirY = dirY;
    }

    move() {
        this.posX += this.dirX;
        this.posY += this.dirY;

        return [this.posX, this.posY];
    }
}

console.log('Hello from BrickBuster !!!');

var ball = new Ball(16, 100, 100, 1, 1);

var ballElement : HTMLElement = <HTMLElement>document.getElementsByClassName("ball")[0];

setInterval(() => {
    let [posX, posY] = ball.move();

    ballElement.style.left = posX + 'px';
    ballElement.style.top = posY + 'px';        
}, 50);