var Directions=["UP","DOWN","LEFT","RIGHT"];
var Keys={
    UP:['ArrowUp','Numpad8','KeyW'],
    DOWN:['ArrowDown','Numpad2','KeyS'],
    LEFT:['ArrowLeft','Numpad4','KeyA'],
    RIGHT:['ArrowRight','Numpad6','KeyD']
};
var canvas=document.getElementById("gameArea");
var context=canvas.getContext("2d");
var Interval,arrowInterval=500,nowarrowInterval=-4500;
var nowTime,deltaTime=0,stackTime=5000;
var keypressed=false,nowPressedKey;
var Arrows=new Array();
function images(){
    for(let dir in Directions){
        this["image_core_"+Directions[dir]]=new Image();
        this["image_core_"+Directions[dir]].src='images/core_'+Directions[dir]+'.png';
    }
    this.image_core_UP=new Image();
    this.image_core_UP.src='images/core_UP.png';
    this.image_core_DOWN=new Image();
    this.image_core_DOWN.src='images/core_DOWN.png';
    this.image_core_LEFT=new Image();
    this.image_core_LEFT.src='images/core_LEFT.png';
    this.image_core_RIGHT=new Image();
    this.image_core_RIGHT.src='images/core_RIGHT.png';
    for(let i=0;i<4;i++){
        for(let j=0;j<1;j++){ //TODO j<2
            this["image_arrow_"+j+"_"+i]=new Image();
            this["image_arrow_"+j+"_"+i].src='images/arrow_'+j+'_'+i+'.png';
        }
    }
}
var Images=new images();

var Core={
    state:"UP",
    scale:100,
    scaleTo:100,
    scaleChange:0,
    update: function(){
        if(this.scaleChange!=0)
        {
            if(this.scaleChange==1 && this.scaleTo>this.scale){
                this.scale+=0.5*deltaTime;
            }
            else if(this.scaleChange==-1 && this.scaleTo<this.scale){
                this.scale-=0.5*deltaTime;
            }
        }
        drawObject("image_core_"+this.state,400,400,this.scale);
    }
}
function startGame(){
    nowTime=new Date().getTime();
    Interval = setInterval(Update,20);
    start_generator=setInterval(function(){
        generate_arrow();
        if(Arrows.length>=10){
           clearInterval(start_generator);
        }
    },500);
}
function Update(){
    
    let lastTime=nowTime;
    nowTime=new Date().getTime();
    deltaTime=nowTime-lastTime;
    
    if(keypressed){
        Core.scaleTo=115;
        Core.scaleChange=1;
    }else{
        Core.scaleTo=100;
        Core.scaleChange=-1;
    }
    
    nowarrowInterval+=deltaTime;
    if(nowarrowInterval>=arrowInterval){
        collide(Arrows[0]);
        nowarrowInterval=0;
    }

    context.clearRect(0,0,canvas.width,canvas.height);
    Core.update();
    for(let arr in Arrows){
        Arrows[arr].update();
    }
}
function collide(arrow){
    if(arrow==null){
        defend();
        return;
    }

    if(Directions[arrow.direction]==Core.state){
        defend();
    }else{
        gameover();
    }
}
function defend(){
    delete Arrows[0];
    Arrows.shift();
    generate_arrow();
}
function gameover(){
    console.log("game over!");
    defend();
}
function keydown(event){
    for(let dir in Directions){
        if(Keys[Directions[dir]].includes(event.code)){
            change_direction(Directions[dir]);
            keypressed=true;
            nowPressedKey=event.code;
            break;
        }
    }
}
function keyup(event){
    if(event.code==nowPressedKey){
        keypressed=false;
    }
}
function drawObject(image,posX,posY,scale){
    context.drawImage(Images[image],posX-scale/2,posY-scale/2,scale,scale);
}
function change_direction(direction){
    Core.state=direction;
}
function Arrow(type,direction,speed){
    this.type=type;
    this.direction=direction;
    this.speed=speed;
    this.scale=100;
    
    let delta=this.speed*stackTime;
    switch(this.direction){
        case 0:
            this.posX=canvas.width/2;
            this.posY=canvas.height/2-delta;
            break;
        case 1:
            this.posX=canvas.width/2;
            this.posY=canvas.height/2+delta;
            break;
        case 2:
            this.posX=canvas.width/2-delta;
            this.posY=canvas.height/2;
            break;
        case 3:
            this.posX=canvas.width/2+delta;
            this.posY=canvas.height/2;
            break;
                                
    }
    this.update=function(){
        let change=deltaTime*this.speed;
        switch(this.direction){
            case 0:
                this.posY+=change;
                break;
            case 1:
                this.posY-=change;
                break;
            case 2:
                this.posX+=change;
                break;
            case 3:
                this.posX-=change;
                break;
        }
        drawObject("image_arrow_"+this.type+'_'+this.direction,this.posX,this.posY,this.scale);
    }
}
function generate_arrow(){
    console.log(randint(1)); //TODO randint(2)
    Arrows.push( new Arrow(0,randint(4),Math.random()*0.5+0.25));
}
function randint(n){
    return Math.floor(Math.random()*n);
}