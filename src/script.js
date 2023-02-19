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
            this.collisionRadius = 30;
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 50;
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
        }
    }

    //create obstacle
    class Obstacle{
        constructor(game){
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 60;
        }
        draw(context){
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
            this.player = new Player(this);
            this.numberOfObstacles = 5;
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
                    const sumOfRadii = testObstacle.collisionRadius - obstacle.collisionRadius;
                    if(distance < sumOfRadii){
                        overlap = true
                    }
                    
                });
                if (!overlap) {
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

