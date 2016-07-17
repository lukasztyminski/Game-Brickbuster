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

    clone() : Rect {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
    }

    add(point: Point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    }

    moveTo(rect: Rect) {
        this.topLeft.x = rect.topLeft.x;
        this.topLeft.y = rect.topLeft.y;
        this.bottomRight.x = rect.bottomRight.x;
        this.bottomRight.y = rect.bottomRight.y;
    }

    width() {
        return this.bottomRight.x - this.topLeft.x;
    }

    height() {
        return this.bottomRight.y - this.topLeft.y;
    }

    centerX() {
        return (this.topLeft.x + this.bottomRight.x) / 2;
    }

    centerY() {
        return (this.topLeft.y + this.bottomRight.y) / 2;
    }
}

enum Side {
    None,
    Left,
    Top,
    Right, 
    Bottom
}

class Obstacle extends Rect {
    checkCollision(anotherRect : Rect) : Side {
        var w = 0.5 * (this.width() + anotherRect.width());
        var h = 0.5 * (this.height() + anotherRect.height());
        var dx = this.centerX() - anotherRect.centerX();
        var dy = this.centerY() - anotherRect.centerY();

        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
            var wy = w * dy;
            var hx = h * dx;
            if (wy > hx) {
                return wy > -hx ? Side.Bottom : Side.Left;
            } else {
                return wy > -hx ? Side.Right : Side.Top;
            }
        } else {
            return Side.None;
        }
    }
}

class Ball extends Rect {
    radius : number;
    dir  : Vector;

    wallLeft : Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;

    constructor(radius : number, position : Point, dir : Vector) {
        super(position.x, position.y, position.x + 2 * radius, position.y + 2 * radius);
        this.radius = radius;        
        this.dir = dir;        
    }

    move() : Point {
        var newPosition = this.clone();
        newPosition.add(this.dir);

        if (this.wallLeft.checkCollision(newPosition) || this.wallRight.checkCollision(newPosition)) {
            this.dir.flipX();
        }
        if (this.wallTop.checkCollision(newPosition) || this.wallBottom.checkCollision(newPosition)) {
            this.dir.flipY();
        }    

        this.moveTo(newPosition);

        return this.topLeft;
    }

    setConstraints(minX : number, minY : number, maxX : number, maxY : number) {
        this.wallLeft = new Obstacle(minX - this.radius, minY - this.radius, minX, maxY + this.radius);
        this.wallTop = new Obstacle(minX - this.radius, minY - this.radius, maxX + this.radius, minY);
        this.wallRight = new Obstacle(maxX, minY - this.radius, maxX + this.radius, maxY + this.radius);
        this.wallBottom = new Obstacle(minX - this.radius, maxY, maxX + this.radius, maxY + this.radius);        
    }    
}

class Game {
    loopInterval: number = 20;

    ballElement : HTMLElement;
    ball: Ball;

    wallLeft : Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;    

    constructor(ballElement : HTMLElement, boardElement : HTMLElement) {
        var radius = parseInt(getComputedStyle(ballElement)['border-top-left-radius']); 
        this.ballElement = ballElement;

        this.ball = new Ball(
            radius,
            new Point(ballElement.offsetLeft, ballElement.offsetTop),
            new Vector(1, -1) 
        );

        this.createWalls(radius, 0, 0, boardElement.offsetWidth, boardElement.offsetHeight);

        this.ball.setConstraints(0, 0, boardElement.offsetWidth, boardElement.offsetHeight);
    }

    createWalls(radius : number, minX : number, minY : number, maxX : number, maxY : number) {
        this.wallLeft = new Obstacle(-radius, -radius, 0, maxY + radius);
        this.wallTop = new Obstacle(-radius, -radius, maxX + radius, 0);
        this.wallRight = new Obstacle(maxX, -radius, maxX + radius, maxY + radius);
        this.wallBottom = new Obstacle(-radius, maxY, maxX + radius, maxY + radius);        
    }

    run() {
       setInterval(() => {
            let {x: posX, y: posY} = this.ball.move();

            this.ballElement.style.left = posX + 'px';
            this.ballElement.style.top = posY + 'px'; 
       }, this.loopInterval) 
    }
}

console.log('Hello from BrickBuster !!!');

var game = new Game(
    <HTMLElement>document.getElementsByClassName("ball")[0],
    <HTMLElement>document.getElementsByClassName("game-board")[0]
);

game.run();