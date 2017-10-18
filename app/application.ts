class Point {
    x:number;
    y:number;
    constructor(x: number, y:number) {
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
    topLeft: Point;
    bottomRight: Point;
    constructor(left: number, top: number, right: number, bottom: number) {
        this.topLeft = new Point(left, top);
        this.bottomRight = new Point(right, bottom);
    }

    add(point: Point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    }

    clone(): Rect {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
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

class Obstacle extends Rect {
    checkCollision(anotherRect: Rect): Side {
        let w = 0.5 * (this.width() + anotherRect.width());
        let h = 0.5 * (this.height() + anotherRect.height());
        let dx = this.centerX() - anotherRect.centerX();
        let dy = this.centerY() - anotherRect.centerY();

        if(Math.abs(dx) <= w && Math.abs(dy) <= h) {
            let wy = w *dy;
            let hx = h *dx;
            if(wy > hx) {
                return wy > -hx ? Side.Bottom : Side.Left;
            } else {
                return wy > -hx ? Side.Right : Side.Top;
            }
        } else {
            return Side.None;
        }
    }
}

enum Side {
    None,
    Left,
    Top,
    Right,
    Bottom
}

class Ball extends Rect {
    radius: number;
    dir: Vector;
    wallLeft: Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;
    constructor(radius: number, posX: number, posY: number, dirX: number, dirY: number) {
        super(posX, posY, posX + 2 * radius, posY + 2 * radius);
        this.radius = radius;
        this.dir = new Vector(dirX, dirY);
    }

    move(): Point {
        let newPosition = this.clone();
        newPosition.add(this.dir);

        if(this.wallLeft.checkCollision(newPosition) || this.wallRight.checkCollision(newPosition)) {
            this.dir.flipX();
        }
        if(this.wallTop.checkCollision(newPosition) || this.wallBottom.checkCollision(newPosition)) {
            this.dir.flipY();
        }

        this.moveTo(newPosition);

        return this.topLeft;
    }

    setConstraints(minX: number, minY: number, maxX: number, maxY: number) {
        this.wallLeft = new Obstacle(minX - this.radius, minY - this.radius, minX, maxY + this.radius);
        this.wallTop = new Obstacle(minX - this.radius, minY - this.radius, maxX + this.radius, minY);
        this.wallRight = new Obstacle(maxX, minY - this.radius, maxX + this.radius, maxY + this.radius);
        this.wallBottom = new Obstacle(minX - this.radius, maxY, maxX + this.radius, maxY + this.radius);
    }
}

let ballElement: HTMLElement = <HTMLElement>document.getElementsByClassName('ball')[0];
let boardElement: HTMLElement = <HTMLElement>document.getElementsByClassName('game-board')[0];

let ball = new Ball(parseInt(getComputedStyle(ballElement).borderRadius), ballElement.offsetLeft, ballElement.offsetTop, 1, -1);

ball.setConstraints(0, 0, boardElement.offsetWidth, boardElement.offsetHeight);

setInterval(() => {
    let {x: posX, y:posY} = ball.move();
    ballElement.style.left = `${posX}px`;
    ballElement.style.top = `${posY}px`;
}, 15);