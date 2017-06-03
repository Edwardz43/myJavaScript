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
   
    //開場畫面
    var demoCount = 0;
    var flash = 5;
    var startColor ='white';  
    function drawTitle(){
        if(gameStage == 0){
        ctx.clearRect(0,0,canvas.width,canvas.height);    
        myBackground.speedX = -1;
        myBackground.newPos();    
        myBackground.update();    
        // var c = $('#myCanvas')[0];
        // var ctx = c.getContext('2d');
        var title = new Image();
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
        ctx.strokeStyle = 'black';
        ctx.strokeText(startHint, 461, 431, 800, 240);
        ctx.font = "40px Arial";
        ctx.fillStyle = startColor;
        if(demoCount % 60 > flash) ctx.fillText(startHint, 460, 430, 800, 240);
        ctx.restore();
        
        ctx.save();
        //ctx.clearRect(60, 48, 35 , 35);
        title.src = 'images/Fairy02.png',
        ctx.drawImage(
            title, Math.floor(demoCount / 20) *50 , 0, 50, 42,
            180, 200, 150 , 140
            );
   
        demoCount++;
        if(demoCount >=60) demoCount = 0;
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
            if(e.keyCode == 13 && gameStage == 0){
                flash = 30;
                startColor ='red';
                isGaming = true;
                setTimeout(startGame, 1500);
                setTimeout(function(){
                    clearInterval(demoLoop);
                    gameStage = 1;
                    BGM.src = 'BGM/Battle.mp3';
                    BGM.volume = 0.2;
                    BGM.play();
                },1000);
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
    
    var chargeSound = new Audio('BGM/charge.wav');
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
        atk : 6,
        died : false,
        dir : 'r',
        //draw相關
        drawCount : 0,
        hitCount : 0,
        chargeCount : 0,
        deadCount : 0,
        chargeNum : 1,
        isCharging : false,
        shot : function (){
            var power = Math.floor(Fairy.chargeNum/50 +1);
            var dirBall = Fairy.dir=="r"?3:-3;
        	if(power > 3){
        	    balls.push(new Ball(Fairy.X - 5, Fairy.Y + 2, power, dirBall, -0.5));
        	    balls.push(new Ball(Fairy.X - 5, Fairy.Y + 6, power, dirBall, 0.5));
        	}
            balls.push(new Ball(Fairy.X - 5, Fairy.Y + 4, power, dirBall, 0));
            var fireSound = new Audio('BGM/magicBall.ogg');
            fireSound.volume = 0.1;
            fireSound.play();
        },
        move : function(){
            if(Fairy.hp > 0){
            
                // if(Fairy.Move == 'LEFT'){
                //     Fairy.dx = -Fairy.speed;
                //     Fairy.dir = 'l';
                // }
                // if( Fairy.Move =='RIGHT'){
                //     Fairy.dx = Fairy.speed;
                //     Fairy.dir = 'r';
                // }
                // if(Fairy.Move == 'UP'){
                //     Fairy.dy = -Fairy.speed;    
                // }
                // if(Fairy.Move =='DOWN'){
                //     Fairy.dy = Fairy.speed; 
                // }
                // if(Fairy.Move == 'l-NONE' || Fairy.Move == 'r-NONE'){
                //     Fairy.dx = 0;    
                // }
                // if(Fairy.Move == 'u-NONE' || Fairy.Move == 'd-NONE'){
                //     Fairy.dy = 0;    
                // }
                
                // if (Fairy.X + Fairy.dx < 0 || Fairy.X + Fairy.dx + Fairy.width >= canvas.width){
                //     Fairy.dx = 0; 
                // }
                // if (Fairy.Y + Fairy.dy < 0 || Fairy.Y + Fairy.dy +Fairy.height > canvas.height){
                //     Fairy.dy = 0; 
                // }
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
        },
        draw : function (){
            var imgFairy = new Image();
            imgFairy.src = 'images/Fairy02.png';
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
                    //alert(imgFairy.src);
                    ctx.restore();   
                    Fairy.drawCount++;
                }else{
                    if(Fairy.drawCount >= 18)Fairy.drawCount = 0;
                    if (Fairy.drawCount % 4 == 0 && Fairy.hitCount <= 50) {
                        ctx.save();
                         //ctx.drawImage(imgFairy, Fairy.X, Fairy.Y, Fairy.width , Fairy.height );
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
                    if(Fairy.chargeNum == 200)imgCharge.src = 'images/charging.png';
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
            Fairy.lupExp += Math.pow(Fairy.level, 1.2) * 90; 
            Fairy.maxHp += Fairy.level * 50;
            Fairy.atk += 1.5 + Math.floor(Math.random()*2);
            recoverHp(Fairy.maxHp);
            //升級音效
            var lvupSound = new Audio('BGM/lvup.mp3');
            lvupSound.volume = 0.2;
            lvupSound.play();
            Fairy.exp = 0;    
        }
    };
    
    //集氣
    function charge (){
        Fairy.chargeNum++;
        if(Fairy.chargeNum >= 200) {
            Fairy.chargeNum = 200;
        }
        if(Fairy.chargeNum > 50){
            chargeSound.play();
        }
    }
    
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
    function Ball(X, Y, power,dx, dy){
        this.X = X;
        this.Y = Y;
        this.width = 100, 
        // + Fairy.level;   
        this.height = 100,
        // + Fairy.level;
        this.deltaX = dx*4,
        this.deltaY = dy*4;
        //集氣攻擊太強  要調整
        this.power = (Fairy.level + Fairy.atk) * power;
        this.hit = false;
        this.counter = 0;
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
                Boss.hp -= ball.power * 0.3;
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
        var mBall = new Image();
        mBall.src = 'images/magicball.png';
        var bBall = new Image();
        bBall.src = 'images/bigball.png';
        //如果球被刪除了  就=null 那就不必畫了
        if(ball != null){
            if(ball.hit != true){
            	ctx.save();
            	var power = ball.power /(Fairy.level + Fairy.atk);
            	
            	//集氣就丟大球
            	if(power > 2){
            	    ctx.drawImage(
                    bBall, (ball.counter % 5)*480 , Math.floor(ball.counter/5)*480,
                    480, 480,
                    ball.X + 5, ball.Y, ball.width, ball.height
                    );
                    ball.counter++;
                    if (ball.counter >= 31) ball.counter =0
                
                //沒集氣就丟小球    
            	}else{
            	   ctx.drawImage(
                    mBall, (ball.counter %3 )*320 , Math.floor(ball.counter/3)*240, 320, 240,
                    ball.X + 5, ball.Y, ball.width, ball.height
                    );
                    ball.counter++;
                    if(ball.counter >= 31) ball.counter = 0;
            	}
            	
                ctx.restore();
                
            }else {
                balls.splice(balls.indexOf(ball), 1);
            }
        }
    }
    
    //敵人
    var enermyShadow = function () {
        this.level = Fairy.level;
        this.maxHp = 50 + this.level*35;
        this.hp = 50 + this.level*35;
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
        this.shot = function (){
            if(this.hp > 0 && !Fairy.died){
                var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                enermyballs.push(new enermyBall(this.X + 15, this.Y + 20, -deltaX, -deltaY, this.level, "shadow"));
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
                            var hitSound = new Audio('BGM/hurt02.wav');
                            hitSound.volume = 0.1;
                            hitSound.play();
                            reduceHp(this.power);
                            //test
                            damage += this.power;
                            Fairy.beHit = true;
                    }
                }
             
                if(this.Y + this.height >= canvas.height ||
                    this.Y - this.height <= 0 ) {this.dy *= -1;}
                this.X += this.dx;
                this.Y += this.dy;
                
                 //走出銀幕就刪掉怪物
                if(this.X  <= 0 ) {
                    enermys.splice(enermys.indexOf(this), 1);
                }
            }
        }
        
        var liveCount = 0;
        var deadCount = 0;
        this.draw = function() {
            var imgShadow = new Image();
            imgShadow.src = 'images/shadow.png';
            if(this.hp > 0){
                if(liveCount >= 18) liveCount = 0;
                ctx.drawImage(
                    imgShadow, 
                    Math.floor(liveCount / 6)*60, 60, 60, 60, 
                    this.X, this.Y, this.width, this.height
                    );
                if(this.hp < this.maxHp){
                    var hpLen = (this.hp / this.maxHp)*60;
                    ctx.fillStyle="#EA0000";
                    ctx.fillRect(this.X + 16,this.Y - 5, 60, 5);
                    ctx.fillStyle="#FFD306";
                    ctx.fillRect(this.X + 16,this.Y - 5, hpLen, 5);
                }    
                liveCount++;
            }else{
                if (deadCount < 41){
                    var imgEnermyDown = new Image();
                    imgEnermyDown.src = 'images/boom.png';
                    ctx.drawImage(imgEnermyDown, Math.floor(deadCount / 5)* 240, 0, 240, 240,
                    this.X, this.Y, this.width, this.height
                    );
                    deadCount++;    
                }else{
                    Fairy.exp += this.exp;
                    if(Math.random() < 0.3){
                        items.push(new Item(this.X, this.Y, Math.floor(Math.random()*4 +1)));
                    }
                    enermys.splice(enermys.indexOf(this),1);
                    enermyCount++;
                    if(enermyCount % 10 == 0 && enermyCount < 50) enermys.push(new enermyKnight());
                    deadCount = 0; 
                }
            }
        }
    }
    
    var enermyHarpy = function () {
        this.level = Fairy.level;
        this.maxHp = 40 + this.level*28;
        this.hp = 40 + this.level*28;
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
        
        this.shot = function (){
            if(this.hp > 0 && !Fairy.died){
                var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                enermyballs.push(new enermyBall(this.X + 15, this.Y + 20, -deltaX, -deltaY, this.level, "harpy"));
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
                            var hitSound = new Audio('BGM/hurt02.wav');
                            hitSound.volume = 0.1;
                            hitSound.play();
                            reduceHp(this.power);
                            //test
                            damage += this.power;
                            Fairy.beHit = true;
                    }
                }
                
                if(this.Y + this.height >= canvas.height ||
                    this.Y - this.height <= 0 ) {this.dy *= -1;}
                this.X += this.dx;
                this.Y += this.dy;
                
                 //走出銀幕就刪掉怪物
                if(this.X  <= 0 ) {
                    enermys.splice(enermys.indexOf(this), 1);
                }
            }
        }
        
        var liveCount = 0;
        var deadCount = 0;
        this.draw = function() {
            var imgHarpy = new Image();
            imgHarpy.src = 'images/grif05b.png';
            if(this.hp > 0){
                if(liveCount >= 18) liveCount = 0;
                ctx.drawImage(
                    imgHarpy, 
                    Math.floor(liveCount / 6)*45, 50, 45, 50, 
                    this.X, this.Y, this.width, this.height
                    );
                if(this.hp < this.maxHp){
                    var hpLen = (this.hp / this.maxHp)*60;
                    ctx.fillStyle="#EA0000";
                    ctx.fillRect(this.X + 16,this.Y - 5, 60, 5);
                    ctx.fillStyle="#FFD306";
                    ctx.fillRect(this.X + 16,this.Y - 5, hpLen, 5);
                }    
                liveCount++;
            }else{
                if (deadCount < 41){
                    var imgEnermyDown = new Image();
                    imgEnermyDown.src = 'images/boom.png';
                    ctx.drawImage(imgEnermyDown, Math.floor(deadCount / 5)* 240, 0, 240, 240,
                    this.X, this.Y, this.width, this.height
                    );
                    deadCount++;    
                }else{
                    Fairy.exp += this.exp;
                    if(Math.random() < 0.3){
                        items.push(new Item(this.X, this.Y, Math.floor(Math.random()*4 + 1)));
                    }
                    enermys.splice(enermys.indexOf(this),1);
                    enermyCount++;
                    if(enermyCount % 10 == 0 && enermyCount < 50) enermys.push(new enermyKnight());
                    deadCount = 0;
                }
            }
        }
    }
    
    var enermyKnight = function () {
        this.level = Fairy.level + 1;
        this.maxHp = 300 + this.level*200;
        this.hp = 300 + this.level*200;
        this.X = 1300;
        this.Y = 400;
        this.dx = -(2 + Math.random()* 1.2);
        this.dy = 0;
        this.width = 160;
        this.height = 160;
        this.exp = 180 + this.level * 120;
        this.power = 20* this.level;
        this.dir;
        this.jumpTimer = 0;
        this.hitSound = new Audio('BGM/knightHurt.wav');
        this.downSound = new Audio('BGM/knightDown.mp3');
        this.shot = function (){
            if(this.hp > 0 && !Fairy.died){
                var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                enermyballs.push(new enermyBall(this.X + 5, this.Y + 10, -deltaX, -deltaY, this.level, "knight"));
            }
        }
        
        this.move = function (){
            if(this.hp > 0){
                //判斷是否撞到
                if(!Fairy.beHit){
                    if(this.X - this.width*0.5 <= Fairy.X  &&
                        this.X + this.width*0.7 >= Fairy.X  &&
                        this.Y - this.height*0.5 <= Fairy.Y  &&
                        this.Y + this.height*0.7 >= Fairy.Y){
                            if(Fairy.hp - this.power <= 0){
                                Fairy.died = true;
                                Fairy.hp = 0;
                            }
                            var hitSound = new Audio('BGM/hurt02.wav');
                            hitSound.volume = 0.1;
                            hitSound.play();
                            reduceHp(this.power);
                            //test
                            damage += this.power;
                            Fairy.beHit = true;
                    }
                }
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
                    if(this.jumpTimer == 60 && this.Y <= 400) 
                        this.dy = -30;
                }
                this.dy += 2.5;
                this.X += this.dx;
                this.Y += this.dy;
                if(this.Y >= 400) this.Y = 400;
                this.jumpTimer++;
                if(this.jumpTimer > 60) this.jumpTimer = 0;
                 //走出銀幕就刪掉怪物
                if(this.X + this.width*2 <= 0 ) {
                    enermys.splice(enermys.indexOf(this), 1);
                }
            }
        };
        
        var liveCount = 0;
        var deadCount = 0;
        this.draw = function() {
            var imgKnight = new Image();
            imgKnight.src = 'images/knight.png';
            if(this.hp > 0){
                if(liveCount >= 18) liveCount = 0;
                if(this.dir == "right"){
                    ctx.drawImage(
                    imgKnight, 
                    Math.floor(liveCount / 6)*60, 140, 60, 70, 
                    this.X, this.Y, this.width, this.height
                    );
                }else{
                    ctx.drawImage(
                    imgKnight, 
                    Math.floor(liveCount / 6)*60, 70, 60, 70, 
                    this.X, this.Y, this.width, this.height
                    );    
                }
                if(this.hp < this.maxHp){
                    var hpLen = (this.hp / this.maxHp)*80;
                    ctx.fillStyle="#EA0000";
                    ctx.fillRect(this.X + 26,this.Y - 5, 80, 5);
                    ctx.fillStyle="#FFD306";
                    ctx.fillRect(this.X + 26,this.Y - 5, hpLen, 5);
                }
                liveCount++;
            }else{
                if (deadCount < 41){
                    var imgEnermyDown = new Image();
                    imgEnermyDown.src = 'images/boom.png';
                    ctx.drawImage(imgEnermyDown, Math.floor(deadCount / 5)* 240, 0, 240, 240,
                    this.X, this.Y, this.width, this.height
                    );
                    deadCount++;    
                }else{
                    Fairy.exp += this.exp;
                    if(Math.random() < 0.3){
                        items.push(new Item(this.X, this.Y, Math.floor(Math.random()*4 +1)));
                    }
                    enermys.splice(enermys.indexOf(this),1);
                    enermyCount++;
                    deadCount = 0; 
                }
            }
        }
    }
    
    function createEnermy(){
        if(gameStage == 1){ 
            if(Math.random() * 600 < 1) enermys.push(new enermyShadow());
            if(Math.random() * 600 < 1) enermys.push(new enermyHarpy());
            if(enermys.length == 0) Math.random() > 0.5 ? enermys.push(new enermyShadow()) : enermys.push(new enermyHarpy());    
        }
    }
    
    function enermyBall(X, Y, deltaX, deltaY,level,type){
        this.X = X;
        this.Y = Y;
        this.width = 10;   
        this.height = 10;
        this.deltaX = deltaX*3.5;
        this.deltaY = deltaY*3.5;
        this.power = level * 10;
        this.hit = false;
        this.type = type;
        this.count = 0;
    }
    
    function moveEnermyBall(ball){
        var midX = Fairy.X + Fairy.width / 2;
        var midY = Fairy.Y + Fairy.height / 2;
        //攻擊命中
        if (Fairy.hp > 0 && Fairy.beHit == false) {
            if (
                ball.X + ball.deltaX  >= midX - Fairy.width *0.5 && 
                ball.X - ball.deltaX  <= midX + Fairy.width *0.5 &&
                ball.Y + ball.deltaY  >= midY - Fairy.height *0.6 && 
                ball.Y - ball.deltaY  <= midY + Fairy.height *0.2 
                ){
                var hitSound = new Audio('BGM/hurt02.wav');
                hitSound.volume = 0.1;
                hitSound.play();
                ball.hit = true;
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
            	switch (ball.type) {
            	    case "boss1":
            	        var imgBossB01 = new Image();
                        imgBossB01.src = 'images/bossB01.png';
                        ctx.drawImage(
                            imgBossB01, (Math.floor(ball.count / 10) % 10)*240 , 
                            Math.floor(ball.count / 100)*240, 240, 240,
                            ball.X, ball.Y - 10, 80, 80
                        );
                        ball.count++;
                        if (ball.count >= 101) ball.count = 0;
            	        break;
            	    case "boss2":
            	         var imgBossB02 = new Image();
                        imgBossB02.src = 'images/bossB02.png';
                        ctx.drawImage(
                            imgBossB02, (Math.floor(ball.count / 10) % 5)*240 , 
                            Math.floor(ball.count / 50)*240, 240, 240,
                            ball.X, ball.Y - 10, 80, 80
                        );
                        ball.count++;
                        if (ball.count >= 101) ball.count = 0;
            	        break;     
            	    case "knight":
            	        var imgKnightBall = new Image();
                        imgKnightBall.src = 'images/knightball.png';
                        ctx.drawImage(
                            imgKnightBall, (Math.floor(ball.count / 10) % 5)*400 , 
                            Math.floor(ball.count / 50)*400, 400, 400,
                            ball.X + 5, ball.Y, 80, 80
                        );
                        ball.count++;
                        if (ball.count >= 101) ball.count =0
            	        break;
            	    default:
            	        var grd = ctx.createRadialGradient(
                            ball.X, ball.Y, 9 , ball.X - 1, ball.Y - 1, 0);
                        grd.addColorStop(0, "yellow");
                        grd.addColorStop(1, "white");
                        ctx.fillStyle = grd;
                        ctx.beginPath();
                        ctx.arc(ball.X, ball.Y,10, 0, Math.PI * 2, true);
                        ctx.fill();
                }
                ctx.restore();
            }else{
                enermyballs.splice(enermyballs.indexOf(ball), 1);
                return;
            }
        }
    }
    
    //Boss
    var Boss = {
        level : 10,
        maxHp : 10000,
        hp : 10000,
        X : 1350,
        Y : 150,
        dx : -0.6,
        //dy : 0, 
        width : 360,
        height : 360,
        //Move : "none",
        atk : 10,
        died : false,
        imgCount : 0,
        imgDiedCount : 0,
        shotTimer : 0,
        //散彈
        shot1 : function (){
            if(Boss.X <= 900 && Boss.hp > 0){
                var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y + 60 - Fairy.Y*0.2));
                var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y + 60 - Fairy.Y*0.2));
                for(var i = 0; i < 5; i++){
                    enermyballs.push(new enermyBall(Boss.X + 120, Boss.Y + 140 , -deltaX* 0.8, - deltaY + i*0.3,  this.atk, 'boss1'));
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
            if(Boss.X <= 900 && Boss.hp > 0){
                var n = 0;
                var shot3 = setInterval(function(){
                    var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                    var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y + 120 - Fairy.Y));
                    enermyballs.push(new enermyBall(Boss.X + 120 , Boss.Y + 140 , -deltaX, -deltaY ,  this.atk*1.0, 'boss2'));
                    n++;
                    //alert('ok');
                },200);
                
                if(n >= 20) clearInterval(shot3);
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
                            var hitSound = new Audio('BGM/hurt02.wav');
                            hitSound.volume = 0.1;
                            hitSound.play();
                            Fairy.beHit = true;
                    }
                }
                if(Boss.X <= 900) Boss.dx = 0;
                Boss.X += Boss.dx;
                //this.Y += this.dy;
            }    
        },
        draw : function(){
            var imgBoss = new Image();
            imgBoss.src = 'images/Boss.png';
            var hpLen = (Boss.hp / Boss.maxHp)*1170;
            ctx.save();
            //hp bar
            if(Boss.X <= 900){
               
                ctx.fillStyle = '#CEDCC3';
                ctx.fillRect(1199, 519, 72, 72);
                ctx.drawImage(imgBoss, 54, 41, 90, 90, 1200,520,70,70);
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
            imgBoss.src = 'images/Boss.png';
            
            if(Boss.hp > 0)  
            ctx.drawImage(
                imgBoss, 0, Math.floor(Boss.imgCount/10) * 200, 200, 200,
                Boss.X, Boss.Y, Boss.width, Boss.height
            );
            //Boss死亡特效
            else {
                ctx.drawImage(
                    imgBoss, 0, Math.floor(Boss.imgCount/10) * 200, 200, 200,
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
         if(enermyCount >= 50 && gameStage == 1){
            gameStage = 2;
            setTimeout(function() {
                BGM.src = 'BGM/BossBattle.mp3';
                //alert('tran');
                myBackground = new component(2062, 600, "images/BG004.png", 0, 0, "background");
            }, 500);
            setTimeout(function(){
                BGM.play();    
            }, 2500);
        }
        if(enermyCount >= 50 && gameStage == 2 || gameStage == 3){
            Boss.move();
            Boss.draw();
            if(Boss.shotTimer % 240 == 0 ) Boss.shot1();
            //if(Math.random() * 300 < 1)Boss.shot1();
            if(Boss.shotTimer % 180 == 0 ) Boss.shot2();
            if(Math.random() * 300 < 1)Boss.shot2();
            Boss.shotTimer++;
            if(Boss.shotTimer >= 1200) Boss.shotTimer = 0;
        }
        // if(Boss.hp <= 20 && Boss.shotTimer % 600 == 0){
        //     Boss.shot3();
        // }
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
            // var midX = Fairy.X + Fairy.width / 2;
            // var midY = Fairy.Y + Fairy.height / 2;
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
    var icon = new Image();
    icon.src = 'images/Fairy03.png';
    function drawState(){
        var hpLength = (Fairy.hp <= 0)?0:(Fairy.hp / Fairy.maxHp) *400;
        var expBar = (Fairy.exp >= Fairy.lupExp) ? 400 :(Fairy.exp / Fairy.lupExp) * 400;
       
        //Fairy icon
        var icon = new Image();
        icon.src = 'images/Fairy03.png';
        ctx.save();
        ctx.strokeStyle = "#842B00";
        ctx.strokeRect(9, 20, 87, 87);
        ctx.fillStyle = "#CEDCC3";
        ctx.fillRect(10, 21, 85, 85);
        ctx.drawImage(icon, 96, 96, 96, 96, 11, 23, 80, 80);
        ctx.restore();
        
        //frame
        ctx.save();
        ctx.fillStyle = "#842B00";
        ctx.fillRect(96,20,410,48);
        
        //Fairy HP
        ctx.fillStyle = "#EA0000";
        ctx.fillRect(102,24, 400, 24);
        ctx.fillStyle = "#00AD00";
        ctx.fillRect(102,24, hpLength, 24);
        
        //Fairy EXP
        ctx.fillStyle = "#1B1F3A";
        ctx.fillRect(102,55, 400, 8);
        ctx.fillStyle = "#4781E7";
        ctx.fillRect(102,55, expBar, 8);
        ctx.restore();
        
        //state
        ctx.save();
        var lv = "Lv : " + Fairy.level;
        var hp = Fairy.hp+"/"+Fairy.maxHp;
        ctx.font = "30px oblique";
        
        ctx.fillStyle = "black";
        ctx.fillText(hp,253,46);
        ctx.fillStyle = "#FFDC35";
        ctx.fillText(hp,254,47);
        ctx.restore();
        
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
    
    //
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
            if(enermyCount >= 50 && stageTraner.count < 73) stageTraner.draw();
         
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
            for(var i = 0; i < enermyballs.length; i++){
                moveEnermyBall(enermyballs[i]);  
                drawEnermyBall(enermyballs[i]);
            }
            
            //道具
            for(var i = 0; i < items.length; i++){
                items[i].check();
                if(items[i] != null) items[i].draw();
            }
            
            //Boss進場
            bossStage();
            
            drawState();
            
            //破關
            endStage()
            
            //測試用
            var s =  
            "atk :"+ Fairy.atk +", enermyCount : "+ enermyCount +", Damage : "+ damage +", EndCount : " + imgEndCount;
            //+", X :" + Fairy.X + ", Y :"+Fairy.Y; 
            $("#report").text(s);
            window.requestAnimationFrame(animate);
        }
    }
    
    function startGame(){
        BGM.play();
        window.requestAnimationFrame(animate);
        myBackground = new component(2062, 600, "images/BG003.jpg", 0, 0, "background");
        if(isGaming){
            $(document).keydown(function(evt) {
                if(evt.keyCode == 32 && !Fairy.died && !Fairy.isCharging){
                    var timer = setInterval(charge, 10);
                    Fairy.isCharging = true;
                    $(document).keyup(function(evt) { 
                        if(evt.keyCode == 32) {
                            Fairy.isCharging = false;
                            Fairy.chargeNum = 1;
                            chargeSound.pause();
                            chargeSound.load();
                            clearInterval(timer);
                        } 
                    });
        
                }
            });
            
            $(document).keydown(function(evt) {
                // if(evt.keyCode == 13){
                //     enermys.push(new enermyKnight());   
                // }
                // if(evt.keyCode == 37){
                //     Fairy.Move = 'LEFT';   
                // }
                // if(evt.keyCode == 38){
                //     Fairy.Move = 'UP';   
                // }
                // if(evt.keyCode == 39){
                //     Fairy.Move = 'RIGHT';   
                // }
                // if(evt.keyCode == 40){
                //     Fairy.Move = 'DOWN';   
                // }
                switch (evt.keyCode) {
                    case 13:
                        enermys.push(new enermyKnight());   
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
                    //default:
                        // code
                }
             
            });         
            
            $(document).keyup(function(evt) {
                // if(evt.keyCode == 32 && !Fairy.died){
                //     Fairy.shot();   
                // }
                // if(evt.keyCode == 37){
                //     Fairy.Move = 'h-NONE';   
                // }
                // if(evt.keyCode == 38){
                //     Fairy.Move = 'v-NONE';   
                // }
                // if(evt.keyCode == 39){
                //     Fairy.Move = 'h-NONE';  
                // }
                // if(evt.keyCode == 40){
                //     Fairy.Move = 'v-NONE';   
                // }
                
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
                    //default:
                        // code
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