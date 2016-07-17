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

class Vector extends Point {
    flipX() {
        this.x *= -1;
    }

    flipY() {
        this.y *= -1;
    }
}

class Rect {
    topLeft : Point;
    bottomRight : Point;

    constructor(left : number, top: number, right: number, bottom: number) {
        this.topLeft = new Point(left, top);
        this.bottomRight = new Point(right, bottom);
    }

    add(point: Point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    }
}

class Ball extends Rect {
    radius : number;
    dir  : Vector;
    min  : Point;
    max  : Point;

    constructor(radius : number, posX : number, posY : number, dirX : number, dirY : number) {
        super(posX, posY, posX + 2 * radius, posY + 2 * radius);
        this.radius = radius;        
        this.dir = new Vector(dirX, dirY);        
    }

    move() : Point {
        if (this.topLeft.x + this.dir.x <= this.min.x) {
            this.dir.flipX();
        }
        if (this.topLeft.y + this.dir.y <= this.min.y) {
            this.dir.flipY();
        }
        if (this.topLeft.x + this.dir.x + this.radius * 2 >= this.max.x) {
            this.dir.flipX();
        }
        if (this.topLeft.y + this.dir.y + this.radius * 2 >= this.max.y) {
            this.dir.flipY();
        }        

        this.add(this.dir);

        return this.topLeft;
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