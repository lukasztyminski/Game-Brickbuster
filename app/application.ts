class Ball {
    radius : number;
    posX : number;
    posY : number;
    dirX : number;
    dirY : number; 
    minX : number;
    minY : number;
    maxX : number;
    maxY : number;

    constructor(radius : number, posX : number, posY : number, dirX : number, dirY : number) {
        this.radius = radius;
        this.posX = posX;
        this.posY = posY;
        this.dirX = dirX;
        this.dirY = dirY;
    }

    move() {
        if (this.posX + this.dirX <= this.minX) {
            this.dirX *= -1;
        }
        if (this.posY + this.dirY <= this.minY) {
            this.dirY *= -1;
        }
        if (this.posX + this.dirX + this.radius * 2 >= this.maxX) {
            this.dirX *= -1;
        }
        if (this.posY + this.dirY + this.radius * 2 >= this.maxY) {
            this.dirY *= -1;
        }        
        this.posX += this.dirX;
        this.posY += this.dirY;        

        return [this.posX, this.posY];
    }

    setConstraints(minX : number, minY : number, maxX : number, maxY : number) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }    
}

console.log('Hello from BrickBuster !!!');

var ballElement : HTMLElement = <HTMLElement>document.getElementsByClassName("ball")[0];
var boardElement : HTMLElement = <HTMLElement>document.getElementsByClassName("game-board")[0];

var ball = new Ball(parseInt(getComputedStyle(ballElement)['border-top-left-radius']), ballElement.offsetLeft, ballElement.offsetTop, 1, -1);

ball.setConstraints(0, 0, boardElement.offsetWidth, boardElement.offsetHeight);

setInterval(() => {
    let [posX, posY] = ball.move();

    ballElement.style.left = posX + 'px';
    ballElement.style.top = posY + 'px';        
}, 20);