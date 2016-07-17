class Point {
    x: number;
    y: number;
    constructor(x : number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(point: Point) {
        this.x += point.x;
        this.y += point.y;
    }
}

class Ball {
    radius : number;
    pos  : Point;
    dir  : Point;
    min  : Point;
    max  : Point;

    constructor(radius : number, posX : number, posY : number, dirX : number, dirY : number) {
        this.radius = radius;
        this.pos = new Point(posX, posY);
        this.dir = new Point(dirX, dirY);        
    }

    move() : Point {
        if (this.pos.x + this.dir.x <= this.min.x) {
            this.dir.x *= -1;
        }
        if (this.pos.y + this.dir.y <= this.min.y) {
            this.dir.y *= -1;
        }
        if (this.pos.x + this.dir.x + this.radius * 2 >= this.max.x) {
            this.dir.x *= -1;
        }
        if (this.pos.y + this.dir.y + this.radius * 2 >= this.max.y) {
            this.dir.y *= -1;
        }        

        this.pos.add(this.dir);

        return this.pos;
    }

    setConstraints(minX : number, minY : number, maxX : number, maxY : number) {
        this.min = new Point(minX, minY);
        this.max = new Point(maxX, maxY);
    }    
}

console.log('Hello from BrickBuster !!!');

var ballElement : HTMLElement = <HTMLElement>document.getElementsByClassName("ball")[0];
var boardElement : HTMLElement = <HTMLElement>document.getElementsByClassName("game-board")[0];

var ball = new Ball(parseInt(getComputedStyle(ballElement)['border-top-left-radius']), ballElement.offsetLeft, ballElement.offsetTop, 1, -1);

ball.setConstraints(0, 0, boardElement.offsetWidth, boardElement.offsetHeight);

setInterval(() => {
    let {x: posX, y: posY} = ball.move();

    ballElement.style.left = posX + 'px';
    ballElement.style.top = posY + 'px';        
}, 20);