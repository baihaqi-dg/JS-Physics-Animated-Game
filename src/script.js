window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720; 

    ctx.fillStyle = 'white';
    ctx.width = 3;
    ctx.strokeStyle = 'white';
    
    //create player 
    class Player{
        constructor(game){
            this.game = game;
            this.collisionX =  this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 50;
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 20;
        }
        draw(context){
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            context.beginPath();
            context.moveTo(this.collisionX,this.collisionY);
            context.lineTo(this.game.mouse.x,this.game.mouse.y);
            context.stroke()
        }
        update(){
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            const distance = Math.hypot(this.dy,this.dx);
            if (distance > this.speedModifier) {
                this.speedX = this.dx/distance || 0;
                this.speedY = this.dy/distance || 0;
            }else{
                this.speedX = 0;
                this.speedY = 0;
            }
            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;
            //check collison
            this.game.obstacle.forEach(obstacles =>{
                // if(this.game.checkCollision(this,obstacles)){
                //     console.log('collision');
                // };
                let [collision, distance , sumOfRadii , dx, dy] = this.game.checkCollision(this,obstacles);
                if (collision) {
                    const unit_x = dx/ distance;
                    const unit_y = dy/distance;
                    this.collisionX = obstacles.collisionX + (sumOfRadii + 1) *unit_x;
                    this.collisionY = obstacles.collisionY + (sumOfRadii + 1) *unit_y;
                }
            })
        }
    }

    //create obstacle
    class Obstacle{
        constructor(game){
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 60;
            this.image = document.getElementById('obstacles');
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.width * 0.5 - 70;
            this.frameX = Math.floor(Math.random() * 4);
            this.frameY = Math.floor(Math.random() * 3);
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth,0 * this.spriteHeight
                ,this.spriteWidth,this.spriteHeight,
                this.spriteX,this.spriteY,this.width,this.height);
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }
    }
    
    class Game{
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.topMargin = 260;
            this.player = new Player(this);
            this.numberOfObstacles = 4;
            this.obstacle = [];
            this.mouse = {
                x:this.width * 0.5,
                y:this.height * 0.5,
                pressed:false
            }
            canvas.addEventListener('mousedown', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener('mousemove', e => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                // console.log(this.mouse.x);
                }
                
            });
        }
        render(context){
            this.player.draw(context);
            this.player.update();
            this.obstacle.forEach(obstacle => obstacle.draw(context));
        }

        checkCollision(a,b){
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy,dx);
            const sumOfRadii = a.collisionRadius + b.collisionRadius;
            // return (distance<sumOfRadii);
            return[(distance<sumOfRadii), distance , sumOfRadii , dx, dy];
        }

        init(){
            // for (let i = 0; i < this.numberOfObstacles; i++) {
            //     this.obstacle.push(new Obstacle(this));   
            // }
            let attempts = 0;
            while(this.obstacle.length < this.numberOfObstacles && attempts < 500){
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacle.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionY;
                    const dy = testObstacle.collisionY - obstacle.collisionX;
                    const distance = Math.hypot(dy,dx);
                    const distanceBuffer = 150; 
                    const sumOfRadii = testObstacle.collisionRadius - obstacle.collisionRadius + distanceBuffer;
                    if(distance < sumOfRadii){
                        overlap = true
                    }
                    
                });
                const margin = testObstacle.collisionRadius * 2;
                if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width 
                    && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) {
                    this.obstacle.push(testObstacle);
                }
                attempts++;
            }
        }
    }
    
    const game = new Game(canvas);
    game.init();
    console.log(game);

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});

