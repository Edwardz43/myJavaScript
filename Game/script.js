$(document).ready(function(){
    //canvas
    var myGameArea = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = 1280;
            this.canvas.height = 600;
            this.context = this.canvas.getContext("2d");
            var myGame = $('#myGame')[0];
            myGame.insertBefore(this.canvas, myGame.childNodes[0]);
            this.frameNo = 0;
        }
    };
    //BG
    var myBackground;
    function component(width, height, color, x, y, type) {
        this.type = type;
        if (type == "image" || type == "background") {
            this.image = new Image();
            this.image.src = color;
        }
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;    
        this.x = x;
        this.y = y;    
        this.update = function() {
            var ctx = myGameArea.context;
            if (type == "image" || type == "background") {
                ctx.drawImage(this.image, 
                    this.x, 
                    this.y,
                    this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, 
                    this.x + this.width, 
                    this.y,
                    this.width, this.height);
            }
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        this.newPos = function() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.type == "background") {
                if (this.x == -(this.width)) {
                    this.x = 0;
                }
            }
        }    
    }
    
    var canvas = myGameArea.canvas;
    var ctx = canvas.getContext('2d');
    
    //選妖精 先預設女性 黃色
    var colorNum = 0;
    var fairyColor;
    var fairySex = "f";
    var imgFairy = new Image();
    imgFairy.src = 'images/fairy_f/yellow_03.png';
    var imgFairyicon = new Image();
    imgFairyicon.src = 'images/fairy_f/yellow_02.png';
    function selectFairy(){
        switch(colorNum){
            case 0:
                fairyColor = "yellow";
                //alert(fairyColor);
                break;
            case 1:
                fairyColor = "blue";
                //alert(fairyColor);
                break;
            case 2:
                fairyColor = "pink";
                //alert(fairyColor);
                break;
            case 3:
                fairyColor = "purple";
                //alert(fairyColor);
                break;
            default:
                fairyColor = "yellow";
        }
        imgFairy.src = 'images/fairy_'+ fairySex +'/'+ fairyColor +'_03.png';
        imgFairyicon.src = 'images/fairy_'+ fairySex +'/'+ fairyColor +'_02.png';
        Fairy.hurtSound.src = 'BGM/hurt_' + fairySex + '.wav';
    }
    
    //開場畫面
    var demoCount = 0;
    var flash = 60;
    var startColor ='white';  
    function drawTitle(){
        if(gameStage == 0){
        ctx.clearRect(0,0,canvas.width,canvas.height);    
        myBackground.speedX = -1;
        myBackground.newPos();    
        myBackground.update();    
        var gameTitle = 'Fairy Quest';
        
        //title
        ctx.save();
        ctx.font = "120px oblique";
        ctx.fillStyle = 'orange';
        ctx.fillText(gameTitle, 370, 320, 625, 240);
        ctx.fillStyle = 'blue';
        ctx.fillText(gameTitle, 373, 323, 625, 240);
        
        //start game
        var startHint = 'Press Enter to Start';
        ctx.font = "40px Arial";
        ctx.fillStyle = startColor;
        if(demoCount % flash > 5) ctx.fillText(startHint, 460, 430, 800, 240);
        ctx.restore();
        
        ctx.save();
        //ctx.clearRect(60, 48, 35 , 35);
        ctx.drawImage(
            imgFairy, Math.floor(demoCount / 20) *50 , 0, 50, 42,
            180, 200, 150 , 140
            );
   
        demoCount++;
        if(demoCount >=60) demoCount = 0;
        
        if(isGaming) stageTraner.draw();
            
        ctx.restore();
       
        }
    }
    
    function demo(){
        myBackground = new component(2062, 600, "images/BG011.png", 0, 0, "background");
        BGM.src = 'BGM/OP.mp3';
        BGM.volume = 0.3;
        BGM.play();
        var demoLoop = setInterval(drawTitle, 20);
        $(document).keyup(function(e){
            if(gameStage == 0){
                if(e.keyCode == 13){
                    flash = 10;
                    var decideSound = new Audio('BGM/decide.mp3');
                    decideSound.volume = 0.3;
                    decideSound.play();
                    startColor ='red';
                    setTimeout(function() {isGaming = true;},500);
                    setTimeout(startGame, 1500);
                    setTimeout(function(){
                        clearInterval(demoLoop);
                        gameStage = 1;
                        BGM.src = 'BGM/Battle.mp3';
                        BGM.volume = 0.2;
                        BGM.play();
                    },1500);
                }    
                if(e.keyCode == 37){
                    var selectSound = new Audio('BGM/select.mp3');
                    selectSound.volume = 0.3;
                    selectSound.play();
                    colorNum--;
                    if(colorNum < 0) colorNum = 3;
                    selectFairy();
                }
                if(e.keyCode == 39){
                    var selectSound2 = new Audio('BGM/select.mp3');
                    selectSound2.volume = 0.3;
                    selectSound2.play();
                    colorNum++
                    if(colorNum > 3) colorNum = 0;
                    selectFairy();
                }
                if(e.keyCode == 38 || e.keyCode == 40){
                    var selectSound3 = new Audio('BGM/select.mp3');
                    selectSound3.volume = 0.3;
                    selectSound3.play();
                    fairySex = fairySex == "f" ? "m" : "f";
                    selectFairy();
                }
            }
            
        });    
    }
    
    //測試用
    var damage = 0;
    
    //遊戲狀態  跟暫停有關
    var isGaming = false;
    
    var balls = [];
    var enermyballs = [];
    var enermys = [];
    var items = [];
    
    var enermyCount = 0;
    var gameStage = 0;
    var countCong = 0;
    
    var chargeSound = new Audio('BGM/charde.wav');
    chargeSound.volume = 0.1;
    chargeSound.loop = true;
    
    var BGM = new Audio();
    BGM.loop = true;

    //主角妖精
    var Fairy = {
        level : 1,
        exp : 0,
        lupExp : 100,
        maxHp : 500,
        hp : 500,
        X : 100,
        Y : 100,
        dx : 0,
        dy : 0,
        speed : 5,
        width : 100,
        height : 84,
        Move : "none",
        beHit : false,
        atk : 15,
        died : false,
        dir : 'r',
        //draw相關
        drawCount : 0,
        hitCount : 0,
        chargeCount : 0,
        deadCount : 0,
        chargeNum : 1,
        isCharging : false,
        hurtSound : new Audio('BGM/hurt_' + fairySex + '.wav'),
        shot : function (){
            var power = Math.floor(Fairy.chargeNum/50 +1);
            var dirBall = Fairy.dir=="r"?3:-3;
            var type;
            switch (power) {
                case 2: case 3:
                    type = "green";
                    break;
                case 4:
                    type = "blue";
                    break;    
                default:
                    type = "nomal";
                    break;
            }
        	if(Fairy.atk > 19){
        	    balls.push(new Ball(Fairy.X - 5, Fairy.Y + 2, power, dirBall, -0.1,type));
                balls.push(new Ball(Fairy.X - 5, Fairy.Y + 6, power, dirBall, 0.1,type));    
        	}else if (Fairy.atk > 23) {
                balls.push(new Ball(Fairy.X - 5, Fairy.Y + 2, power, dirBall, -0.3,type));
                balls.push(new Ball(Fairy.X - 5, Fairy.Y + 4, power, dirBall, 0, type));
                balls.push(new Ball(Fairy.X - 5, Fairy.Y + 6, power, dirBall, 0.3,type));    
            }else balls.push(new Ball(Fairy.X - 5, Fairy.Y + 4, power, dirBall, 0, type));
            var fireSound = new Audio('BGM/magicBall.ogg');
            fireSound.volume = 0.05;
            fireSound.play();
            Fairy.isCharging = false;
            Fairy.chargeNum = 1;
            chargeSound.pause();
            chargeSound.load();
        },
        move : function(){
            if(Fairy.hp > 0){
                switch (Fairy.Move) {
                    case 'LEFT':
                        Fairy.dx = -Fairy.speed;
                        Fairy.dir = 'l';
                        break;
                    case 'RIGHT':
                        Fairy.dx = Fairy.speed;
                        Fairy.dir = 'r';
                        break;
                    case 'UP':
                        Fairy.dy = -Fairy.speed;  
                        break;
                    case 'DOWN':
                        Fairy.dy = Fairy.speed; 
                        break;
                    case 'h-NONE':
                        Fairy.dx = 0;
                        break;
                    case 'v-NONE':
                        Fairy.dy = 0;
                        break;
                    default:
                        Fairy.dx = 0;
                        Fairy.dy = 0;
                }
                if (Fairy.X + Fairy.dx < 0 || Fairy.X + Fairy.dx + Fairy.width >= canvas.width){
                    Fairy.dx = 0; 
                }
                if (Fairy.Y + Fairy.dy < 0 || Fairy.Y + Fairy.dy +Fairy.height > canvas.height){
                    Fairy.dy = 0; 
                }
                Fairy.X = Fairy.X + Fairy.dx;
                Fairy.Y = Fairy.Y + Fairy.dy;
            }
            if(Fairy.isCharging){
                Fairy.chargeNum++;
                if(Fairy.chargeNum >= 150) {
                    Fairy.chargeNum = 150;
                }
                if(Fairy.chargeNum > 30){
                    chargeSound.play();
                }
            }
        },
        //集氣
        charge : function(){
            if(!Fairy.died && !Fairy.isCharging) Fairy.isCharging = true;    
        },
        draw : function (){
            if(!Fairy.died){
                if(!Fairy.beHit){
                    if (Fairy.drawCount >= 18) Fairy.drawCount = 0;
                    ctx.save();
                    if(Fairy.dir == "r"){
                        ctx.drawImage(
                        imgFairy, Math.floor(Fairy.drawCount / 6)*50 , 85, 50, 42,
                        Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                        );    
                    }else{
                        ctx.drawImage(
                        imgFairy, Math.floor(Fairy.drawCount / 6)*50 , 43, 50, 42,
                        Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                        );    
                    }
                    ctx.restore();   
                    Fairy.drawCount++;
                }else{
                    if(Fairy.drawCount >= 18)Fairy.drawCount = 0;
                    if (Fairy.drawCount % 4 != 0 && Fairy.hitCount <= 50) {
                        ctx.save();
                        if(Fairy.dir == "r"){
                            ctx.drawImage(
                            imgFairy, Math.floor(Fairy.drawCount / 6)*50 , 85, 50, 42,
                            Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                            );    
                        }else{
                            ctx.drawImage(
                            imgFairy, Math.floor(Fairy.drawCount / 6)*50 , 43, 50, 42,
                            Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                            );    
                        }
                        ctx.restore();
                    }else if(Fairy.hitCount > 50){
                        Fairy.beHit = false;
                        Fairy.hitCount =0;
                    }
                    Fairy.hitCount++
                    Fairy.drawCount++;
                }
                if(Fairy.chargeNum >= 50){
                    if(Fairy.chargeCount >= 60)Fairy.chargeCount = 0;
                    var imgCharge = new Image();
                    imgCharge.src = 'images/charging2.png';
                    if(Fairy.chargeNum == 150)imgCharge.src = 'images/charging.png';
                    ctx.save();
                    ctx.drawImage(
                        imgCharge, Math.floor(Fairy.chargeCount / 6)*240 , 0, 240, 240,
                        Fairy.X - 30, Fairy.Y - 30, 160 , 160
                        );
                    Fairy.chargeCount++
                    ctx.restore();
                }
            }else{
                Fairy.hp = 0;
                if(Fairy.deadCount < 42){
                    ctx.save();
                    imgFairy.src = 'images/deadeffect.png',
                    ctx.drawImage(
                        imgFairy, 0, Math.floor(Fairy.deadCount / 6)*240, 640, 240,
                        Fairy.X - 600, Fairy.Y - 200, 320*4 , 120*4
                        );
                    Fairy.deadCount++
                    ctx.restore(); 
                }
            }    
        },
        levelUp : function(){
            Fairy.level++;
            Fairy.lupExp += Math.pow(Fairy.level, 0.8) * 90; 
            Fairy.maxHp += 100;
            Fairy.atk ++;
            recoverHp(Fairy.maxHp);
            //升級音效
            var lvupSound = new Audio('BGM/lvup.mp3');
            lvupSound.volume = 0.2;
            lvupSound.play();
            Fairy.exp = 0;    
        }
    };

    //扣HP    
    function reduceHp(x){
        var hpMinus = x;
        if(Fairy.hp - hpMinus <= 0) {
            Fairy.died = true;
            Fairy.hp = 0;
        }else
        //alert(hpMinus);
        var timer = setInterval(function(){
            Fairy.hp--;
            hpMinus--;
            //alert(hpMinus)
            if(hpMinus <= 0){
                clearInterval(timer);
            }
        },5);
    }
    
    //回HP
    function recoverHp(x){
        var hpPlus = x;
        var timer = setInterval(function(){
            Fairy.hp += 10;
            if(Fairy.hp >= Fairy.maxHp) Fairy.hp = Fairy.maxHp;
            hpPlus -= 10;
            if(hpPlus <= 0)clearInterval(timer);    
        },5);
    }                                    
    
    //魔法球 
    function Ball(X, Y, power,dx, dy, type){
        this.type = type;
        this.power = (Fairy.level + Fairy.atk) * power;
        this.X = X;
        this.Y = Y;
        this.width = 100, 
        this.height = 100,
        this.deltaX = dx*4,
        this.deltaY = dy*4;
        this.hit = false;
        this.counter = 0;
        this.img = new Image();
    }
        
    function moveBall(ball){
        //攻擊命中
        for(var i=0; i < enermys.length; i++){
            if (enermys[i].hp > 0) {
                if ((
                    ball.X + ball.deltaX >= enermys[i].X - enermys[i].width * 0.2  && 
                    ball.X - ball.deltaX  <= enermys[i].X + enermys[i].width * 0.5 &&
                    ball.Y + ball.height * 0.2 >= enermys[i].Y - enermys[i].height * 0.2 && 
                    ball.Y - ball.deltaY * 1.0 <= enermys[i].Y + enermys[i].height * 0.5
                    )){
                    enermys[i].hitSound.volume = 0.2;
                    enermys[i].hitSound.play();
    
                    if(ball.power / Fairy.level <= 20) ball.hit = true;
                    else ball.power -= 10;
                    
                    enermys[i].hp -= ball.power * 0.8;
                    if(enermys[i].hp <= 0) {
                        enermys[i].downSound.volume = 0.2;
                        enermys[i].downSound.play();
                    }
                    
                    if(ball.power ==0 )balls.splice(balls.indexOf(ball), 1);
                }
            }
        }
        
        if (Boss.hp > 0 && Boss.X <= 900) {
            if (
                    ball.X + ball.deltaX  >= Boss.X - Boss.width* 0.1 && 
                    ball.X - ball.deltaX  <= Boss.X + Boss.width* 0.3 &&
                    ball.Y + ball.height  >= 160 + Boss.Y - Boss.height* 0.2 && 
                    ball.Y - ball.deltaY  <= 240 + Boss.Y + Boss.height* 0.2
                ){
                // var hitSound = new Audio('BGM/enermy.wav');
                // hitSound.volume = 0.5;
                // hitSound.play();
        
                if(ball.power / Fairy.level <= 20) ball.hit = true;
                else ball.power -= 15;
                Boss.hp -= ball.power * 0.8;
                if(Boss.hp <= 0) {
                    Boss.hp = 0;
                    Boss.died = true;
                }
                if(ball.power ==0 )balls.splice(balls.indexOf(ball), 1);
            }
        }
        //火球飛超過銀幕 就從陣列中移除火球
        if (ball.X + ball.deltaX  > canvas.width || ball.X - ball.deltaX  < 0){
            //alert("ok");
            balls.splice(balls.indexOf(ball), 1);
        }
        
        ball.X += ball.deltaX;
        ball.Y += ball.deltaY;
    }
    
    function drawBall(ball) {
        //如果球被刪除了  就=null 那就不必畫了
        if(ball != null){
            if(ball.hit != true){
            	ctx.save();
            	var power = ball.power /(Fairy.level + Fairy.atk);
            	//集氣就丟大球
            	switch (ball.type) {
                    case "green":
                        ball.img.src = 'images/charging2.png';
                        ctx.drawImage(
                        ball.img, (Math.floor(ball.counter / 6) % 4 + 3)*240 , Math.floor(ball.counter/24)*240,
                        240, 240,ball.X + 5, ball.Y, ball.width, ball.height
                        );
                        ball.counter++;
                        if (ball.counter >= 25) ball.counter = 0;
                        break;
                    case "blue":
                        ball.img.src = 'images/charging.png';
                        ctx.drawImage(
                        ball.img, (Math.floor(ball.counter / 6) % 4 + 3)*240 , Math.floor(ball.counter/24)*240,
                        240, 240,
                        ball.X + 5, ball.Y, ball.width, ball.height
                        );
                        ball.counter++;
                        if (ball.counter >= 25) ball.counter = 0;
                        break;     
                    default:
                        ball.img.src = 'images/magicball.png';
                        ctx.drawImage(
                        ball.img, (ball.counter %3 )*320 , Math.floor(ball.counter/3)*240, 320, 240,
                        ball.X + 5, ball.Y, ball.width, ball.height
                        );
                        ball.counter++;
                        if(ball.counter >= 31) ball.counter = 0;
                        break;
                } 
                ctx.restore();
                
            }else {
                balls.splice(balls.indexOf(ball), 1);
            }
        }
    }
    
    //敵人
    var enermy = function(type){ 
        this.type = type;
        switch (type) {
            case "shadow":
                this.level = 3;
                this.maxHp = 160;
                this.hp = 160;
                this.X = 1300;
                this.Y = 450 + Math.random()* 30;
                this.dx = -(1.2 + Math.random()* 0.8);
                this.dy = 0;
                this.width = 100;
                this.height = 100;
                this.exp = 50 + this.level * 27;
                this.power = 20* this.level;
                this.hitSound = new Audio('BGM/shadowHurt.wav');
                this.downSound = new Audio('BGM/shadowDown.wav');
                this.imgWidth = 60;
                this.imgHeight = 60;
                break;
            case "harpy":
                this.level = 5;
                this.maxHp = 180;
                this.hp = 180;
                this.X = 1300;
                this.Y = 120 + Math.random()* 120;
                this.dx = -(2 + Math.random()* 2);
                this.dy = 0;
                this.width = 100;
                this.height = 100;
                this.exp = 70 + this.level * 38;
                this.power = 25* this.level;
                this.hitSound = new Audio('BGM/harpyHurt.wav');
                this.downSound = new Audio('BGM/harpyDown.wav');
                this.imgWidth = 45;
                this.imgHeight = 50;
                break;
            case "knight":
                this.level = 8;
                this.maxHp = 1200;
                this.hp = 1200;
                this.X = 1300;
                this.Y = 420;
                this.dx = -(2 + Math.random()* 1.2);
                this.dy = 0;
                this.width = 160;
                this.height = 160;
                this.exp = 180 + this.level * 120;
                this.power = 30* this.level;
                this.dir;
                this.jumpTimer = 0;
                this.hitSound = new Audio('BGM/knightHurt.wav');
                this.downSound = new Audio('BGM/knightDown.mp3');
                break;
        }
        this.shot = function (){
            if(this.hp > 0 && !Fairy.died){
                var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                enermyballs.push(new enermyBall(this.X + 15, this.Y + 20, -deltaX, -deltaY, this.level, this.type));
            }
        }
        
        this.move = function (){
            if(this.hp > 0){
                //判斷是否撞到
                if(!Fairy.beHit){
                    if(this.X - this.width*0.7 <= Fairy.X  &&
                        this.X + this.width*0.7 >= Fairy.X  &&
                        this.Y - this.height*0.7 <= Fairy.Y  &&
                        this.Y + this.height*0.7 >= Fairy.Y){
                            if(Fairy.hp - this.power <= 0){
                                Fairy.died = true;
                                Fairy.hp = 0;
                            }
                            Fairy.hurtSound.volume = 0.2;
                            Fairy.hurtSound.play();
                            reduceHp(this.power);
                            //test
                            damage += this.power;
                            Fairy.beHit = true;
                    }
                }
                if(this.type == "knight"){
                    //轉向
                    if(this.X - this.width >= Fairy.X){
                        this.dir = "left";
                        this.dx = -(2.5 + Math.random()* 1);
                    }    
                    if(this.X + this.width <= Fairy.X) {
                        this.dir = "right";
                        this.dx = (1.5 + Math.random()* 1.5);
                    }
                    //跳躍
                    if(this.X + this.width*0.5 >= Fairy.X &&this.X - this.width*0.5 <= Fairy.X){
                        if(this.jumpTimer == 60 && this.Y <= 420) 
                            this.dy = -32;
                    }
                    this.dy += 2.5;
                    this.X += this.dx;
                    this.Y += this.dy;
                    if(this.Y >= 420) this.Y = 420;
                    this.jumpTimer++;
                    if(this.jumpTimer > 60) this.jumpTimer = 0;    
                }else{
                    this.X += this.dx;
                    this.Y += this.dy;    
                }
                
                 //走出銀幕就刪掉怪物
                if(this.X + this.width <= 0 ) {
                    enermys.splice(enermys.indexOf(this), 1);
                }
            }
        }
        this.liveCount = 0;
        this.deadCount = 0;
        this.draw = function() {
            var img = new Image();
            img.src = 'images/'+this.type+'.png';
            if(this.hp > 0){
                if(this.liveCount >= 18) this.liveCount = 0;
                if (this.type == "knight") {
                    if(this.dir == "right"){
                        ctx.drawImage(
                        img, Math.floor(this.liveCount / 6)*60, 140, 60, 70, 
                        this.X, this.Y, this.width, this.height
                        );
                    }else{
                        ctx.drawImage(
                        img, Math.floor(this.liveCount / 6)*60, 70, 60, 70, 
                        this.X, this.Y, this.width, this.height
                        );    
                    }        
                }else{
                    if(this.liveCount >= 18) this.liveCount = 0;
                    ctx.drawImage(
                    img, Math.floor(this.liveCount / 6)*this.imgWidth, this.imgHeight, this.imgWidth, this.imgHeight,
                     this.X, this.Y, this.width, this.height
                    );    
                }
                
                if(this.hp < this.maxHp){
                    var len = this.type=="knight"?80:50;
                    var hpLen = (this.hp / this.maxHp)*len;
                    ctx.fillStyle="#EA0000";
                    ctx.fillRect(this.X + 26,this.Y - 5, len, 5);
                    ctx.fillStyle="#FFD306";
                    ctx.fillRect(this.X + 26,this.Y - 5, hpLen, 5);
                }
                this.liveCount++;
            }else{
                if (this.deadCount < 41){
                    var imgEnermyDown = new Image();
                    imgEnermyDown.src = 'images/boom.png';
                    ctx.drawImage(imgEnermyDown, Math.floor(this.deadCount / 5)* 240, 0, 240, 240,
                    this.X, this.Y, this.width, this.height
                    );
                    this.deadCount++;    
                }else{
                    Fairy.exp += this.exp;
                    if(Math.random() < 0.3){
                        items.push(new Item(this.X, this.Y, Math.floor(Math.random()*4 +1)));
                    }
                    enermys.splice(enermys.indexOf(this),1);
                    enermyCount++;
                    if(enermyCount % 10 == 0 && enermyCount < 30) enermys.push(new enermy("knight"));
                    this.deadCount = 0; 
                }
            }
        }   
    };

    function createEnermy(){
        if(gameStage == 1){ 
            if(Math.random() * 600 < 1) enermys.push(new enermy("shadow"));
            if(Math.random() * 600 < 1) enermys.push(new enermy("harpy"));
            if(enermys.length == 0) Math.random() > 0.5 ? enermys.push(new enermy("shadow")) : enermys.push(new enermy("harpy"));    
        }
    }
    
    function enermyBall(X, Y, deltaX, deltaY,level,type){
        this.X = X;
        this.Y = Y;
        this.deltaX = deltaX*3.5;
        this.deltaY = deltaY*3.5;
        this.power = level * 10;
        this.hit = false;
        this.type = type;
        this.count = 0;
        this.width = 10;   
        this.height = 10;
    }
    
    function moveEnermyBall(ball){
        var midX = Fairy.X + Fairy.width / 2;
        var midY = Fairy.Y + Fairy.height / 2;
        //攻擊命中
        if (Fairy.hp > 0 && Fairy.beHit == false) {
            if (
                ball.X + ball.deltaX  >= midX - Fairy.width *0.5 && 
                ball.X - ball.deltaX  <= midX + Fairy.width *0.3 &&
                ball.Y + ball.deltaY  >= midY - Fairy.height *0.9 && 
                ball.Y - ball.deltaY  <= midY + Fairy.height *0.2 
                )
            {
                Fairy.hurtSound.volume = 0.2;
                Fairy.hurtSound.play();
                ball.hit = true;
                if(Fairy.hp - this.power <= 0){
                    Fairy.died = true;
                    Fairy.hp = 0;
                }
                Fairy.beHit = true;
                reduceHp(ball.power);
                //test
                damage += ball.power;
                //alert(ball.power)
            }
        }
        //火球飛超過銀幕 就從陣列中移除火球
        if (ball.X + ball.deltaX  - ball.width> canvas.width||
            ball.X + ball.deltaX + 30  < 0){
            //alert("ok");
            enermyballs.splice(enermyballs.indexOf(ball), 1);
            return;
        }
        
        ball.X += ball.deltaX;
        ball.Y += ball.deltaY;
    }
    
    function drawEnermyBall(ball) {
        //如果球被刪除了  就=null 那就不必畫了
        if(ball != null){
            if(ball.hit != true){
            	ctx.save();
                var img = new Image();
                img.src = 'images/'+ball.type+'ball.png';
            	switch (ball.type) {
            	    case "boss1":
                        if (ball.count >= 101) ball.count = 0;
                        ctx.drawImage(
                            img, (Math.floor(ball.count / 10) % 10)*240 , 
                            Math.floor(ball.count / 100)*240, 240, 240,
                            ball.X, ball.Y - 10, 80, 80
                        );
            	        break;
            	    case "boss2":
                        if (ball.count >= 101) ball.count = 0;
                        ctx.drawImage(
                            img, (Math.floor(ball.count / 10) % 5)*240 , 
                            Math.floor(ball.count / 50)*240, 240, 240,
                            ball.X, ball.Y - 10, 80, 80
                        ); 
            	        break;
        	        case "boss3":
                        if (ball.count >= 151) ball.count = 0;
                        ctx.drawImage(
                            img, (Math.floor(ball.count / 10) % 5)*480 , 
                            Math.floor(ball.count / 50)*480, 480, 480,
                            ball.X, ball.Y - 10, 80, 80
                        );
                        break;
            	    case "knight":
                        if (ball.count >= 101) ball.count = 0;
                        ctx.drawImage(
                            img, (Math.floor(ball.count / 10) % 5)*400 , 
                            Math.floor(ball.count / 50)*400, 400, 400,
                            ball.X + 5, ball.Y, 80, 80
                        );
            	        break;
                    case "harpy":
                        if (ball.count >= 51) ball.count = 0;
                        ctx.drawImage(
                            img, (Math.floor(ball.count / 5) % 5)*192 , 
                            Math.floor(ball.count / 25)*192, 192, 192,
                            ball.X + 5, ball.Y, 50, 50
                        );
                        break;
                    case "shadow":
                        if (ball.count >= 151) ball.count = 0;
                        ctx.drawImage(
                            img, (Math.floor(ball.count / 10) % 5)*120 , 
                            Math.floor(ball.count / 50)*120, 120, 120,
                            ball.X + 5, ball.Y, 50, 50
                        );
                        break;
                }
                ball.count++;
                ctx.restore();
            }else{
                enermyballs.splice(enermyballs.indexOf(ball), 1);
                return;
            }
        }
    }
    
    //Boss
    var Boss = {
        maxHp : 8000,
        hp : 8000,
        X : 1320,
        Y : 150,
        dx : -0.6,
        //dy : 0, 
        width : 360,
        height : 360,
        //Move : "none",
        atk : 15,
        died : false,
        imgCount : 0,
        imgDiedCount : 0,
        shotTimer : 0,
        fury : false,
        img : new Image(),
        //散彈
        shot1 : function (){
            if(Boss.X <= 900 && Boss.hp > 0){
                var pX = this.X + this.width/2;
                var pY = this.Y + this.height/2;
                var deltaX = 3* Math.sin(Math.atan2(pX - Fairy.X, pY - Fairy.Y + 130));
                var deltaY = 3* Math.cos(Math.atan2(pX - Fairy.X, pY - Fairy.Y + 130));
                for(var i = 0; i < 5; i++){
                    enermyballs.push(new enermyBall(pX -50, pY -50, -deltaX*0.6, - deltaY*0.6 + 0.25 * i,  this.atk, 'boss1'));
                }
                // var fireSound = new Audio('BGM/fire.ogg');
                // fireSound.volume = 0.1;
                // fireSound.play();
            }
        },
        //黑洞
        shot2 : function (){
            if(Boss.X <= 900 && Boss.hp > 0){
                var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y + 120 - Fairy.Y));
            	enermyballs.push(new enermyBall(Boss.X + 120 , Boss.Y + 140 , -deltaX, -deltaY ,  this.atk*1.2, 'boss2'));
                // var fireSound = new Audio('BGM/fire.ogg');
                // fireSound.volume = 0.1;
                // fireSound.play();
            }
        },
        shot3 : function(){
            if(Boss.X <= 900 && Boss.hp > 0 && Boss.shotTimer % 15 == 0 && Boss.shotTimer <= 300){
                var deltaX = 2* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                var deltaY = 2* Math.cos(Math.atan2(this.X - Fairy.X, this.Y + 120 - Fairy.Y));
                enermyballs.push(new enermyBall(Boss.X + 120 , Boss.Y + 140 , -deltaX, -deltaY ,  this.atk*1.0, 'boss3'));
                // var fireSound = new Audio('BGM/fire.ogg');
                // fireSound.volume = 0.1;
                // fireSound.play();
            }    
        },
        move : function() {
            if(Boss.hp > 0){
                //判斷是否撞到
                if(!Fairy.beHit){
                    if(Boss.X - Boss.width*0.3 <= Fairy.X  &&
                        Boss.X + Boss.width*0.7 >= Fairy.X  &&
                        Boss.Y - Boss.height*0.5 <= Fairy.Y  &&
                        Boss.Y + Boss.height*0.7 >= Fairy.Y){
                            if(Fairy.hp - Boss.atk*5 <= 0) {
                                Fairy.died = true;
                                Fairy.hp = 0;
                            }else{
                                reduceHp(Boss.atk*5);
                                //test
                                damage += Boss.atk*5;
                            }
                            Fairy.hurtSound.volume = 0.2;
                            Fairy.hurtSound.play();
                            Fairy.beHit = true;
                    }
                }
                if(Boss.X <= 900) Boss.dx = 0;
                Boss.X += Boss.dx;
                //this.Y += this.dy;
            }    
        },
        draw : function(){
            //var imgBoss = new Image();
            Boss.img.src = 'images/Boss.png';
            ctx.save();
            
            if(Boss.hp > 0)  
            ctx.drawImage(
                Boss.img, 0, Math.floor(Boss.imgCount/10) * 200, 200, 200,
                Boss.X, Boss.Y, Boss.width, Boss.height
            );
            //Boss死亡特效
            else {
                ctx.drawImage(
                    Boss.img, 0, Math.floor(Boss.imgCount/10) * 200, 200, 200,
                    Boss.X - 3 *(Boss.imgCount %10 > 5 ? 1: -1), Boss.Y + (Boss.imgDiedCount * 0.6) , Boss.width, Boss.height - (Boss.imgDiedCount *1)
                );
                Boss.imgDiedCount++;
                if(Boss.imgDiedCount >= Boss.height *4) Boss.imgDiedCount = Boss.height *4;
            }
            Boss.imgCount++;
            if(Boss.imgCount >= 40) Boss.imgCount = 0;
            ctx.restore();
        }
    };
    //Boss出場
    function bossStage(){
         if(enermyCount >= 30 && gameStage == 1){
            gameStage = 2;
            setTimeout(function() {
                BGM.src = 'BGM/BossBattle.mp3';
                //alert('tran');
                myBackground = new component(2062, 600, "images/BG004.png", 0, 0, "background");
            }, 200);
            setTimeout(function(){
                BGM.play();    
            }, 2500);
        }
        if(enermyCount >= 30 && gameStage == 2 || gameStage == 3){
            Boss.move();
            Boss.draw();
            if(Boss.shotTimer % 240 == 0 ) Boss.shot1();
            //if(Math.random() * 300 < 1)Boss.shot1();
            if(Boss.shotTimer % 180 == 0 ) Boss.shot2();
            if(Math.random() * 300 < 1)Boss.shot2();
            if(Boss.hp <= Boss.maxHp* 0.3 && !Boss.fury) {
                Boss.fury = true;
                Boss.shotTimer = 0;
            } 
            if(Boss.fury) Boss.shot3();
            
            Boss.shotTimer++;
            if(Boss.shotTimer >= 1200) Boss.shotTimer = 0;
        }
    }
    
    //道具
    var Item = function(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 120;
        this.height = 120;
        this.count = 0;
        this.timeout = 0;
        this.check = function(){
            if (
                this.x + this.width*0.5  >= Fairy.X && 
                this.x - this.width*0.5  <= Fairy.X &&
                this.y + this.height*0.5  >= Fairy.Y && 
                this.y - this.height*0.5  <= Fairy.Y 
                ){
                
                switch(this.type){
                    case 1: case 2:
                        var cureSound = new Audio('BGM/cure.wav');
                        cureSound.volume = 0.2;
                        cureSound.play();
                        //alert("recover");
                        recoverHp(Fairy.maxHp*0.1);
                        items.splice(items.indexOf(this),1)
                        break;
                    case 3: case 4:
                        var puSound = new Audio('BGM/powerup.wav');
                        puSound.volume = 0.2;
                        puSound.play();
                       // alert("powerup");
                        Fairy.atk += 0.5;
                        items.splice(items.indexOf(this),1)
                        break;    
                        
                }
            }
            this.timeout++;
            if(this.timeout >= 600) items.splice(items.indexOf(this),1);
        }
        
        this.draw = function(){
            switch(type){
                case 1: case 2:
                    var i01Img = new Image();
                    i01Img.src = 'images/item03.png';
                    ctx.drawImage(
                        i01Img , (Math.floor(this.count /4) % 5)*192, Math.floor(this.count / 20)*192,192, 192,
                        this.x, this.y, this.width *0.7, this.height *0.7
                        );
                    this.count++
                    if(this.count >= 81) this.count = 0;    
                    break;
                case 3: case 4:
                    var i02Img = new Image();
                    i02Img.src = 'images/item02.png';
                    ctx.drawImage(
                        i02Img , (Math.floor(this.count /4) % 5)*192, Math.floor(this.count / 20)*192,192, 192,
                        this.x, this.y, this.width, this.height
                        );
                    this.count++
                    if(this.count >= 121) this.count = 0;
                    break;
            }
            ctx.save();
           
            ctx.restore();    
        }
    }
    
    //畫狀態
    function drawState(){
        var bar = 180;
        var hpLength = (Fairy.hp <= 0)?0:(Fairy.hp / Fairy.maxHp) *bar;
        var expBar = (Fairy.exp / Fairy.lupExp) * bar;
        
        ctx.save();
        ctx.fillStyle = "rgba(192, 125, 53, 0.6)";
        ctx.fillRect(0, 0, 310, 102);
        ctx.strokeStyle = "#5F5F5F";
        ctx.strokeRect(0,0, 312, 104);
        ctx.restore();
        
        ctx.save();
        //Fairy HP
        ctx.font = "20px oblique";
        var hp = "HP";
        ctx.fillStyle = "yellow";
        ctx.fillText(hp,90,62);
        ctx.fillStyle = "#EA0000";
        ctx.strokeRect(120,42, bar + 4, 28);
        ctx.fillStyle = "#00AD00";
        ctx.fillRect(122,44, hpLength > bar ? bar : hpLength, 24);
        
        //Fairy EXP
        ctx.font = "18px oblique";
        var exp = "exp";
        ctx.fillStyle = "yellow";
        ctx.fillText(exp,90,85);
        ctx.fillStyle = "#1B1F3A";
        ctx.strokeRect(120,78, bar + 4, 12);
        ctx.fillStyle = "#4781E7";
        ctx.fillRect(122,80, expBar > bar ? bar : expBar, 8);
        ctx.restore();
        
        //icon
        ctx.save();
        ctx.fillStyle = "#B79A59";
        ctx.beginPath();
        ctx.arc(0,0,100,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = "rgba(87, 74, 71, 0.5)";
        ctx.beginPath();
        ctx.arc(0,0,95,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        
        //根據血量決定表情
        if(Fairy.hp <= Fairy.maxHp*0.7 && Fairy.hp > Fairy.maxHp*0.3) ctx.drawImage(imgFairyicon, 0, 0, 96, 96, 0, 0, 70, 70);
        else if(Fairy.hp <= Fairy.maxHp*0.3 && Fairy.hp > 0) ctx.drawImage(imgFairyicon, 192, 0, 96, 96, 0, 0, 70, 70);
        else if(Fairy.hp <= 0) ctx.drawImage(imgFairyicon, 288, 96, 96, 96, 0, 0, 70, 70);
        else ctx.drawImage(imgFairyicon, 96, 96, 96, 96, 0, 0, 70, 70);
        ctx.restore();
        
        //hp bar
        if(Boss.X <= 900 && gameStage == 2 || gameStage == 3){
            Boss.img.src = 'images/Boss.png';
            var hpLen = (Boss.hp / Boss.maxHp)*1170;
            
            ctx.fillStyle = '#CEDCC3';
            ctx.fillRect(1199, 519, 72, 72);
            ctx.drawImage(Boss.img, 54, 41, 90, 90, 1200,520,70,70);
            ctx.fillStyle="#842B00";
            ctx.fillRect(20, 550, 1170, 40);
            ctx.fillStyle="#00AD00";
            ctx.fillRect(20, 550, hpLen, 40);
            
            ctx.strokeStyle = "#2F1B41";
            ctx.font = "40px Arial";
            ctx.strokeText('Evil God',550,585,140,240);
            ctx.fillStyle = "#643579";
            ctx.fillText('Evil God',551,586,140,240);
        }
        
        //gameover
        if(Fairy.died){
            ctx.save();
            ctx.font = "120px oblique";
            ctx.fillStyle = "white";
            ctx.fillText("Game Over",340,340);
            ctx.fillStyle = "red";
            ctx.fillText("Game Over",343,343);
            ctx.restore();
        }
    }
    
    //過場特效機
    var stageTraner = {
        count : 0,
        draw : function(){
            var imgTranStage = new Image();
            imgTranStage.src = 'images/tran.png';
            if(stageTraner.count < 145){
                //alert('ok');
                ctx.drawImage(
                     imgTranStage, Math.floor(stageTraner.count / 12)%3 *1280, Math.floor(stageTraner.count / 18) *960, 1280, 960,
                     0, 0, canvas.width, canvas.height
                );
                stageTraner.count++;
            }
        }
    };
    
    //結束場景
    function endStage(){
        if(gameStage == 2 && Boss.died){
            gameStage = 3;
            BGM.pause();
            var bossDieSound = new Audio('BGM/bossdie.wav');
            bossDieSound.play();
            setTimeout(function() {
                BGM.src = 'BGM/Victory.mp3';
                BGM.play();
                setTimeout(function() {
                    gameStage = 4;
                }, 2500);
            }, 3500);
        }
        if(gameStage == 4){
            drawCong();
            setTimeout(function() {
                myBackground = new component(2062, 600, "images/BG011.png", 0, 0, "background");
                setTimeout(function() {
                    gameStage = 5;
                }, 3500);
            }, 1500);
        }
        if(gameStage ==5) drawEnding();
    }
    
    //恭喜訊息
    function drawCong(){
        var imgCong = new Image();
        imgCong.src = 'images/cong.png';
        ctx.save();
        ctx.drawImage(
            imgCong, 0, Math.floor(countCong / 6)*480, 640, 480, 
            0, 0, canvas.width, canvas.height
        );
        countCong++;
        if(countCong >= 37) countCong = 0;
        ctx.restore();    
    }
    
    //Ending
    var imgEndCount = 0;
    var curtainCount = 0;
    function drawEnding (){
        ctx.save();
        //閉幕
        var curtain = new Image();
        curtain.src = 'images/curtain.png';
        ctx.drawImage(curtain, 0, Math.floor(curtainCount/10)*240, 320,240, 0, 0, canvas.width, canvas.height + 20);
        //字幕
        var imgEnding = new Image();
        ctx.transform(1,0,0,1,0,800 - imgEndCount);
        imgEnding.src ='images/End.png';
        ctx.drawImage(imgEnding, 0,0,canvas.width*1.2, canvas.height*4.6);
        ctx.restore();
        imgEndCount++;
        curtainCount++;
        if(curtainCount >= 179) curtainCount = 179;
        if(imgEndCount >= 2300) {
            isGaming = false;
            BGM.pause(); 
        }
    }

    function animate(){
        if(isGaming){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //BG
            myBackground.speedX = -1;
            myBackground.newPos();    
            myBackground.update();
            //過場特效
            if(enermyCount >= 30 && stageTraner.count < 73) stageTraner.draw();
         
            Fairy.move();
            Fairy.draw();
            //判斷升級
            if(Fairy.exp >= Fairy.lupExp) Fairy.levelUp();
            
            for(var i=0; i<balls.length; i++){
                moveBall(balls[i]);  
                drawBall(balls[i]);
            }
            
            //生怪機制
            createEnermy();
            
            //敵人
            for(var i = 0; i < enermys.length; i++){
                enermys[i].move();
                if(enermys[i] != null){
                    enermys[i].draw();
                    if(Math.random() * 200 < 1 && enermys[i] != null)enermys[i].shot(); 
                }
            }
            //道具
            for(var i = 0; i < items.length; i++){
                items[i].check();
                if(items[i] != null) items[i].draw();
            }
            
            //Boss進場
            bossStage();
            
            //畫子彈
            for(var i = 0; i < enermyballs.length; i++){
                moveEnermyBall(enermyballs[i]);  
                drawEnermyBall(enermyballs[i]);
            }
            
            //主角狀態
            drawState();
            
            //破關
            endStage()
            
            //測試用
            var s =  
            "atk :"+ Fairy.atk +", enermyCount : "+ enermyCount +", Damage : "+ damage +", chargeNum : " + Fairy.chargeNum+
            ", sound : "+Fairy.hurtSound.currentSrc + ", Sex : " + fairySex;
            //+", X :" + Fairy.X + ", Y :"+Fairy.Y; 
            $("#report").text(s);
            window.requestAnimationFrame(animate);
        }
    }
    
    function startGame(){
        stageTraner.count = 0;
        BGM.play();
        window.requestAnimationFrame(animate);
        myBackground = new component(2062, 600, "images/BG003.jpg", 0, 0, "background");
        if(isGaming){
            $(document).keydown(function(evt) {
                // alert(evt.keyCode);
                switch (evt.keyCode) {
                    case 13:
                        enermys.push(new enermy("knight"));   
                        break;
                    case 32:
                        Fairy.charge();
                        break;
                     case 37:
                        Fairy.Move = 'LEFT';  
                        break;
                    case 38:
                        Fairy.Move = 'UP';
                        break;
                    case 39:
                        Fairy.Move = 'RIGHT';
                        break;
                    case 40:
                        Fairy.Move = 'DOWN';
                        break;    
                    case 65:
                        Fairy.hp = Fairy.maxHp;
                        break;
                    case 68:
                        enermyCount = 29;
                        break;
                    case 83:
                        Fairy.hp = 1;
                        break;
                    case 107:
                        Fairy.atk += 10;
                        break;
                    case 109:
                        Fairy.atk -= 10;
                        break;
                    //default:
                        // code
                }
             
            });         
            
            $(document).keyup(function(evt) {       
                switch (evt.keyCode) {
                    case 32:
                        if(!Fairy.died)
                        Fairy.shot();   
                        break;
                    case 37: case 39:
                        Fairy.Move = 'h-NONE';     
                        break;
                    case 38:  case 40:
                        Fairy.Move = 'v-NONE';   
                        break;
                }
            });
        }
    }
    
    myGameArea.start();
    //開場畫面
    demo();
      
    // 暫停功能
    $('#myBtn').click(function(){
        if(isGaming){
            $('#pauseModal').css("display", "block");
            isGaming = false;
            BGM.pause();
        }
    })
    
    $('.close').click(function(){
        $('#pauseModal').css("display", "none");
        isGaming = true;
        animate();
        BGM.play();    
    });
});