window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720; 

    ctx.fillStyle = 'white';
    ctx.width = 3;
    ctx.strokeStyle = 'white';
    class Player{
        constructor(game){
            this.game = game;
            this.collisionX =  this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 50;
            // this.speedX = 0;
            // this.speedY = 0;
        }
        draw(context){
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            // context.beginPath();
            // context.moveTo(this.collisionX,this.collisionY);
            // context.lineTo(this.game.mouse.x,this.game.mouse.y);
            // context.stroke()
        }
        update(){
            // this.speedX = (this.game.mouse.x - this.game.collisonX) / 20;
            // this.speedY = (this.game.mouse.y - this.game.collisonY) /20 ;
            this.collisionX = this.speedX;
            this.collisionY = this.speedY;
        }
    }
    
    class Game{
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
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
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                console.log(this.mouse.x);
            });
        }
        render(context){
            this.player.draw(context);
            this.player.update();
        }
    }
    
    const game = new Game(canvas);

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});

