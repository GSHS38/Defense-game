function Particle(X,Y){
    this.posX=X;
    this.posY=Y;
    this.life=1000;
    this.update=function(){
        this.life-=deltaTime;
        if(this.life<=0){
            delete this;
        }
        context.fillStyle="#AAAAAA";
        context.arc(X,Y,10,0,2*Math.PI,true);
        
    };
    return this;
}

function createParticle(X,Y){
    let part=new Particle(X,Y);
    setInterval(part.update(),20);
    
}