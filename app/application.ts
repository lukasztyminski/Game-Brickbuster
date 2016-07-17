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

    moveLeft(step: number) {
        this.topLeft.x -= step;
        this.bottomRight.x -= step;
    }

    moveRight(step: number) {
        this.topLeft.x += step;
        this.bottomRight.x += step;
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

class Sprite extends Obstacle {
    sprite: HTMLElement;

    constructor(sprite: HTMLElement, left? : number, top?: number, right?: number, bottom?: number) {
        bottom = bottom || sprite.offsetTop + sprite.offsetHeight;
        right = right || sprite.offsetLeft + sprite.offsetWidth;
        top = top || sprite.offsetTop;
        left = left || sprite.offsetLeft;

        super(left, top, right, bottom);
        this.sprite = sprite;
    }

    moveTo(rect : Rect) {
        super.moveTo(rect);

        let {x: posX, y: posY} = this.topLeft;

	    this.sprite.style.left = posX + 'px';
        this.sprite.style.top = posY + 'px';         
    }
}

class Ball extends Sprite {

    radius : number;
    dir  : Vector;

    wallLeft : Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;

    constructor(sprite: HTMLElement, dir : Vector) {
        var radius = parseInt(getComputedStyle(sprite)['border-top-left-radius']);
        super(sprite, sprite.offsetLeft, sprite.offsetTop, sprite.offsetLeft + 2 * radius, sprite.offsetTop + 2 * radius);
        this.sprite = sprite;
        this.radius = radius;        
        this.dir = dir;        
    }

    calculateNewPosition() : Rect {
        var newPosition = this.clone();
        newPosition.add(this.dir);
        return newPosition;        
    }

    bounceHorizontal() {
        this.dir.flipY();
    }

    bounceVertical() {
        this.dir.flipX();
    } 

    hide() {
        this.sprite.style.display = 'none';
    }
}

class Paddle extends Sprite {
    constructor(sprite: HTMLElement, public maxRight : number) {
        super(sprite);
    }

    moveLeft(step?: number) {
        var newPosition = this.clone();
        newPosition.moveLeft(step);

        if (newPosition.topLeft.x >= 0) {
            this.moveTo(newPosition);
        }
    }

    moveRight(step? : number) {
        var newPosition = this.clone();
        newPosition.moveRight(step);

        if (newPosition.bottomRight.x <= this.maxRight) {
            this.moveTo(newPosition);
        }
    }
}

enum GameState {
    Running,
    GameOver
}

enum KeyCodes {
    LEFT = 37,
    RIGHT = 39
}

class Game {
    loopInterval: number = 10;
    gameState: GameState;
    ball: Ball;
    paddle: Paddle;

    wallLeft : Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;    

    constructor(ballElement : HTMLElement, paddle: HTMLElement, boardElement : HTMLElement) {
        this.gameState = GameState.Running;
        this.paddle = new Paddle(paddle, boardElement.offsetWidth);

        this.ball = new Ball(
            ballElement,            
            new Vector(3, -3) 
        );

        this.createWalls(this.ball.radius, boardElement.offsetWidth, boardElement.offsetHeight);
    }

    createWalls(radius : number, maxX : number, maxY : number) {
        this.wallLeft = new Obstacle(-radius, -radius, 0, maxY + radius);
        this.wallTop = new Obstacle(-radius, -radius, maxX + radius, 0);
        this.wallRight = new Obstacle(maxX, -radius, maxX + radius, maxY + radius);
        this.wallBottom = new Obstacle(-radius, maxY, maxX + radius, maxY + radius);        
    }

    run() {
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== GameState.Running) {
                return;
            }
            if (e.keyCode == KeyCodes.LEFT) {
                this.paddle.moveLeft(5);
            }
            if (e.keyCode == KeyCodes.RIGHT) {
                this.paddle.moveRight(5);
            }

        });

       setInterval(() => {
            if (this.gameState !== GameState.Running) {
                return;
            }
            var newBallPosition = this.ball.calculateNewPosition();

            if (this.wallBottom.checkCollision(newBallPosition)) {
                this.gameState = GameState.GameOver;
                this.ball.hide();
                return;
            }

            if (this.wallLeft.checkCollision(newBallPosition) || this.wallRight.checkCollision(newBallPosition)) {
                this.ball.bounceVertical();
            }
            if (this.wallTop.checkCollision(newBallPosition)) {
                this.ball.bounceHorizontal();
            }     

            switch (this.paddle.checkCollision(newBallPosition)) {
                case (Side.Left):
                case (Side.Right):
                    this.ball.bounceHorizontal();
                    break;

                case (Side.Top):
                    this.ball.bounceVertical();
            }

            this.ball.moveTo(this.ball.calculateNewPosition());
       }, this.loopInterval) 
    }
}

console.log('Hello from BrickBuster !!!');

var game = new Game(
    <HTMLElement>document.getElementsByClassName("ball")[0],
    <HTMLElement>document.getElementsByClassName("paddle")[0],
    <HTMLElement>document.getElementsByClassName("game-board")[0]
);

game.run();