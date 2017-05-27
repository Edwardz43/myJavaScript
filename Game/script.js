    $(document).ready(function(){
        var canvas = $('#myCanvas')[0];
        var ctx = canvas.getContext('2d');
       
        //開場畫面
        var demoCount = 0;
        function drawTitle(){
            if(gameStage == 0){
            var c = $('#myCanvas')[0];
            var ctx = c.getContext('2d');
            var title = new Image();
            var gameTitle = 'Fairy Quest';
            ctx.clearRect(0,0,300,150);
            //title
            ctx.save();
            ctx.font = "30px oblique";
            ctx.strokeStyle = 'orange';
            ctx.strokeText(gameTitle, 100, 80, 156, 60);
            ctx.fillStyle = 'blue';
            ctx.fillText(gameTitle, 101, 81, 156, 60);
            
            //start game
            var startHint = 'Press Enter to Start';
            ctx.font = "10px Arial";
            ctx.strokeStyle = 'black';
            ctx.strokeText(startHint, 111, 111, 200, 60);
            ctx.font = "10px Arial";
            ctx.strokeStyle = 'white';
            if(demoCount % 60 > 5) ctx.strokeText(startHint, 110, 110, 200, 60);
            ctx.restore();
            
            ctx.save();
            ctx.clearRect(60, 48, 35 , 35);
            title.src = 'images/Fairy02.png',
            ctx.drawImage(
                title, Math.floor(demoCount / 20) *50 , 0, 50, 42,
                60, 48, 35 , 35
                );
       
            demoCount++;
            if(demoCount >=60) demoCount = 0;
            ctx.restore();
           
            }
        }
        
        function demo(){
            BGM.src = 'BGM/OP.mp3';
            BGM.volume = 0.3;
            BGM.play();
            var demoLoop = setInterval(drawTitle, 20);
            $(document).keyup(function(e){
                if(e.keyCode == 13 && gameStage == 0){
                    clearInterval(demoLoop);
                    gameStage = 1;
                    isGaming = true;
                    setTimeout(startGame, 1000);
                    setTimeout(function(){
                        BGM.src = 'BGM/Battle.mp3';
                        BGM.volume = 0.2;
                        BGM.play();
                    },1000);
                }
            });    
        }
        
        //測試用
        var damage = 0;
        var gameLoop;
        
        //遊戲狀態  跟暫停有關
        var isGaming = false;
        
        var balls = [];
        var enermyballs = [];
        
        //各種圖
        var imgFairy = new Image();
        imgFairy.src = 'images/Fairy02.png';
        var imgShadow = new Image();
        imgShadow.src = 'images/shadow.png';
        var imgHarpy = new Image();
        imgHarpy.src = 'images/grif05b.png';
        var imgKnight = new Image();
        imgKnight.src = 'images/knight.png';
        var imgBoss = new Image();
        imgBoss.src = 'images/Boss.png';
        var imgBossB01 = new Image();
        imgBossB01.src = 'images/bossB01.png';
        var imgBossB02 = new Image();
        imgBossB02.src = 'images/bossB02.png';
        var enermyCount = 0;
        var gameStage = 0;
        var imgEnermyDown = new Image();
        imgEnermyDown.src = 'images/boom.png';
                        
        var imgCharge = new Image();
        imgCharge.src = 'images/charging.png';
       
        var mBall = new Image();
        mBall.src = 'images/magicball.png';
        
        var bBall = new Image();
        bBall.src = 'images/bigball.png';
   
        var imgKnightBall = new Image();
        imgKnightBall.src = 'images/knightball.png';
        
        var i01Img = new Image();
        i01Img.src = 'images/item03.png';
        var i02Img = new Image();
        i02Img.src = 'images/item02.png';
        
        var imgTranStage = new Image();
        imgTranStage.src = 'images/tran.png';
        
        var imgCong = new Image();
        imgCong.src = 'images/cong.png';
        var countCong = 0;
        
        var chargeNum = 1;
        var isCharging = false;
        
        var chargeSound = new Audio('BGM/charge.wav');
        chargeSound.volume = 0.1;
        chargeSound.loop = true;
        
        var BGM = new Audio();
        BGM.loop = true;
        
        var enermys = [];
        var items = [];
        
        //主角妖精
        var Fairy = {
            level : 1,
            exp : 0,
            lupExp : 100,
            maxHp : 12000000,
            hp : 12000000,
            X : 100,
            Y : 100,
            dx : 0,
            dy : 0,
            speed : 1.2,
            width : 25,
            height : 21,
            Move : "none",
            beHit : false,
            atk : 10,
            died : false,
            dir : 'r',
            shot : function (){
                var power = Math.floor(chargeNum/50 +1);
                var dirBall = Fairy.dir=="r"?3:-3;
            	if(power > 3){
            	    balls.push(new Ball(Fairy.X - 5, Fairy.Y , power, dirBall, -0.5));
            	    balls.push(new Ball(Fairy.X - 5, Fairy.Y + 8, power, dirBall, 0.5));
            	}
                balls.push(new Ball(Fairy.X - 5, Fairy.Y + 4, power, dirBall, 0));
                var fireSound = new Audio('BGM/fire.ogg');
                fireSound.volume = 0.1;
                fireSound.play();
            }
        };
        
        //集氣
        function charge (){
            chargeNum++;
            if(chargeNum >= 200) {
                chargeNum = 200;
            }
            if(chargeNum > 50){
                chargeSound.play();
            }
        }
        
         //扣HP    
        function reduceHp(x){
            var hpMinus = x;
            //alert(hpMinus);
            var timer = setInterval(function(){
                Fairy.hp--;
                hpMinus--;
                //alert(hpMinus)
                if(hpMinus <= 0){
                    clearInterval(timer);
                }
            },15);
        }
        
        //回HP
        function recoverHp(x){
            var hpPlus = x;
            var timer = setInterval(function(){
                Fairy.hp++;
                if(Fairy.hp >= Fairy.maxHp) Fairy.hp = Fairy.maxHp;
                x--;
                if(x <= 0)clearInterval(timer);    
            },5);
        }
        
        //移動主角
        function moveFairy(){
            if(Fairy.hp > 0){
                
                if(Fairy.Move == 'LEFT'){
                    Fairy.dx = -Fairy.speed;
                    Fairy.dir = 'l';
                }
                if( Fairy.Move =='RIGHT'){
                    Fairy.dx = Fairy.speed;
                    Fairy.dir = 'r';
                }
                if(Fairy.Move == 'UP'){
                    Fairy.dy = -Fairy.speed;    
                }
                if(Fairy.Move =='DOWN'){
                    Fairy.dy = Fairy.speed; 
                }
                if(Fairy.Move == 'l-NONE' || Fairy.Move == 'r-NONE'){
                    Fairy.dx = 0;    
                }
                if(Fairy.Move == 'u-NONE' || Fairy.Move == 'd-NONE'){
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
        }
        
        //畫主角
        var drawCount = 0;
        var hitCount = 0;
        var chargeCount = 0;
        var deadCount = 0;
        function drawFairy(){
            if(!Fairy.died){
                if(!Fairy.beHit){
                    if (drawCount >= 18) drawCount = 0;
                    ctx.save();
                    if(Fairy.dir == "r"){
                        ctx.drawImage(
                        imgFairy, Math.floor(drawCount / 6)*50 , 85, 50, 42,
                        Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                        );    
                    }else{
                        ctx.drawImage(
                        imgFairy, Math.floor(drawCount / 6)*50 , 43, 50, 42,
                        Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                        );    
                    }
                    //alert(imgFairy.src);
                    ctx.restore();   
                    drawCount++;
                }else{
                    if(drawCount >= 18)drawCount = 0;
                    if (drawCount % 4 == 0 && hitCount <= 50) {
                        ctx.save();
                         //ctx.drawImage(imgFairy, Fairy.X, Fairy.Y, Fairy.width , Fairy.height );
                        if(Fairy.dir == "r"){
                            ctx.drawImage(
                            imgFairy, Math.floor(drawCount / 6)*50 , 85, 50, 42,
                            Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                            );    
                        }else{
                            ctx.drawImage(
                            imgFairy, Math.floor(drawCount / 6)*50 , 43, 50, 42,
                            Fairy.X, Fairy.Y, Fairy.width , Fairy.height
                            );    
                        }
                        ctx.restore();
                    }else if(hitCount > 50){
                        Fairy.beHit = false;
                        hitCount =0;
                    }
                    hitCount++
                    drawCount++;
                }
                if(chargeNum >= 50){
                    if(chargeCount >= 60)chargeCount = 0;
                    ctx.save();
                    ctx.drawImage(
                        imgCharge, Math.floor(chargeCount / 6)*240 , 0, 240, 240,
                        Fairy.X - 10, Fairy.Y - 10, 45 , 45
                        );
                    chargeCount++
                    ctx.restore();
                }
            }else{
                Fairy.hp = 0;
                if(deadCount < 42){
                    ctx.save();
                    imgFairy.src = 'images/deadeffect.png',
                    ctx.drawImage(
                        imgFairy, 0, Math.floor(deadCount / 6)*240, 640, 240,
                        Fairy.X - 150, Fairy.Y - 50, 320 , 120
                        );
                    deadCount++
                    ctx.restore(); 
                }
            }
        }
        
        //魔法球 
        function Ball(X, Y, power,dx, dy){
            this.X = X;
            this.Y = Y;
            this.width = 25, 
            // + Fairy.level;   
            this.height = 25,
            // + Fairy.level;
            this.deltaX = dx,
            this.deltaY = dy;
            //集氣攻擊太強  要調整
            this.power = (Fairy.level + Fairy.atk) * power;
            this.hit = false;
            this.counter = 0;
        }
            
        function moveBall(ball){
            //攻擊命中
            for(var i=0; i < enermys.length; i++){
                var midX = enermys[i].X + enermys[i].width / 2;    
                var midY = enermys[i].Y + enermys[i].height / 2;
            
                if (enermys[i].hp > 0) {
                    if ((
                        ball.X + ball.deltaX + ball.width >= midX  && 
                        ball.X - ball.deltaX  <= midX + enermys[i].width /2 &&
                        ball.Y + ball.height * 0.5 >= midY - enermys[i].height * 0.5 && 
                        ball.Y - ball.deltaY * 0.7 <= midY + enermys[i].height * 0.2
                        )){
                        var hitSound = new Audio('BGM/enermy.wav');
                        hitSound.volume = 0.1;
                        hitSound.play();
        
                        if(ball.power / Fairy.level <= 20) ball.hit = true;
                        else ball.power -= 12;
                        
                        enermys[i].hp -= ball.power * 0.8;
                        if(enermys[i].hp <= 0) {
                            var enermyDown = new Audio('BGM/enermydown01.wav');
                            enermyDown.volume = 0.1;
                            enermyDown.play();
                        }
                        
                        if(ball.power ==0 )balls.splice(balls.indexOf(ball), 1);
                    }
                }
            }
            
            if (Boss.hp > 0 && Boss.X <= 200) {
                if (
                        ball.X + ball.deltaX  >= Boss.X - Boss.width*0.2 && 
                        ball.X - ball.deltaX  <= Boss.X + Boss.width*0.2 &&
                        ball.Y + ball.height  >= 40 + Boss.Y - Boss.height*0.2 && 
                        ball.Y - ball.deltaY  <= 60 + Boss.Y + Boss.height*0.2
                    ){
                    // var hitSound = new Audio('BGM/enermy.wav');
                    // hitSound.volume = 0.5;
                    // hitSound.play();
            
                    if(ball.power / Fairy.level <= 20) ball.hit = true;
                    else ball.power -= 15;
                    Boss.hp -= ball.power * 0.6;
                    if(Boss.hp <= 0) {
                        Boss.hp = 0;
                        Boss.died = true;
                    }
                    if(ball.power ==0 )balls.splice(balls.indexOf(ball), 1);
                }
            }
            //火球飛超過銀幕 就從陣列中移除火球
            if (ball.X + ball.deltaX  > canvas.width ){
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
            this.X = 300;
            this.Y = 110 + Math.random()* 10;
            this.dx = -(0.3 + Math.random()* 0.2);
            this.dy = 0;
            this.width = 25;
            this.height = 25;
            this.exp = 10 + this.level * 7;
            this.power = 20* this.level;
            
            
            this.shot = function (){
                if(this.hp > 0 && !Fairy.died){
                    var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                    var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                    enermyballs.push(new enermyBall(this.X + 5, this.Y + 10, -deltaX, -deltaY, this.level, "shadow"));
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
                                reduceHp(this.power);
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
                if(this.hp > 0){
                    if(liveCount >= 18) liveCount = 0;
                    ctx.drawImage(
                        imgShadow, 
                        Math.floor(liveCount / 6)*60, 60, 60, 60, 
                        this.X, this.Y, this.width, this.height
                        );
                    if(this.hp < this.maxHp){
                        var hpLen = (this.hp / this.maxHp)*15;
                        ctx.fillStyle="#EA0000";
                        ctx.fillRect(this.X + 6,this.Y - 5, 15, 1);
                        ctx.fillStyle="#FFD306";
                        ctx.fillRect(this.X + 6,this.Y - 5, hpLen, 1);
                    }    
                    liveCount++;
                }else{
                    if (deadCount < 41){
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
            this.X = 300;
            this.Y = 50 + Math.random()* 20;
            this.dx = -(0.5 + Math.random()* 0.5);
            this.dy = 0;
            this.width = 25;
            this.height = 25;
            this.exp = 10 + this.level * 8;
            this.power = 25* this.level;
            
            
            this.shot = function (){
                if(this.hp > 0 && !Fairy.died){
                    var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                    var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                    enermyballs.push(new enermyBall(this.X + 5, this.Y + 10, -deltaX, -deltaY, this.level, "harpy"));
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
                if(this.hp > 0){
                    if(liveCount >= 18) liveCount = 0;
                    ctx.drawImage(
                        imgHarpy, 
                        Math.floor(liveCount / 6)*45, 50, 45, 50, 
                        this.X, this.Y, this.width, this.height
                        );
                    if(this.hp < this.maxHp){
                        var hpLen = (this.hp / this.maxHp)*15;
                        ctx.fillStyle="#EA0000";
                        ctx.fillRect(this.X + 6,this.Y - 5, 15, 1);
                        ctx.fillStyle="#FFD306";
                        ctx.fillRect(this.X + 6,this.Y - 5, hpLen, 1);
                    }    
                    liveCount++;
                }else{
                    if (deadCount < 41){
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
            this.X = 300;
            this.Y = 105;
            this.dx = -(0.5 + Math.random()* 0.3);
            this.dy = 0;
            this.width = 40;
            this.height = 40;
            this.exp = 80 + this.level * 20;
            this.power = 20* this.level;
            this.dir;
            this.jumpTimer = 0;
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
                                reduceHp(this.power);
                                //test
                                damage += this.power;
                                Fairy.beHit = true;
                        }
                    }
                    //轉向
                    if(this.X - this.width >= Fairy.X){
                        this.dir = "left";
                        this.dx = -(0.6 + Math.random()* 0.4);
                    }    
                    if(this.X + this.width <= Fairy.X) {
                        this.dir = "right";
                        this.dx = (0.3 + Math.random()* 0.3);
                    }
                    //跳躍
                    if(this.X + this.width*0.5 >= Fairy.X &&this.X - this.width*0.5 <= Fairy.X){
                        if(this.jumpTimer == 60 && this.Y <= 105) 
                            this.dy = -8;
                    }
                    this.dy += 0.7;
                    this.X += this.dx;
                    this.Y += this.dy;
                    if(this.Y >= 105) this.Y = 105;
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
                        var hpLen = (this.hp / this.maxHp)*20;
                        ctx.fillStyle="#EA0000";
                        ctx.fillRect(this.X + 10,this.Y - 5, 20, 1);
                        ctx.fillStyle="#FFD306";
                        ctx.fillRect(this.X + 10,this.Y - 5, hpLen, 1);
                    }
                    liveCount++;
                }else{
                    if (deadCount < 41){
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
        
        function enermyBall(X, Y, deltaX, deltaY,level,type){
            this.X = X;
            this.Y = Y;
            this.width = 3;   
            this.height = 3;
            this.deltaX = deltaX;
            this.deltaY = deltaY;
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
                    ball.Y + ball.deltaY  >= midY - Fairy.height *0.5 && 
                    ball.Y - ball.deltaY  <= midY + Fairy.height *0.5
                    ){
                    var hitSound = new Audio('BGM/hurt02.wav');
                    hitSound.volume = 0.1;
                    hitSound.play();
                    ball.hit = true;
                    Fairy.beHit = true;
                    if(Fairy.hp - ball.power <= 0) {
                        Fairy.died = true;
                        Fairy.hp = 0;
                    }
                    else reduceHp(ball.power);
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
                            ctx.drawImage(
                                imgBossB01, (Math.floor(ball.count / 10) % 10)*240 , 
                                Math.floor(ball.count / 100)*240, 240, 240,
                                ball.X, ball.Y - 10, 20, 20
                            );
                            ball.count++;
                            if (ball.count >= 101) ball.count = 0;
                	        break;
                	    case "boss2":
                            ctx.drawImage(
                                imgBossB02, (Math.floor(ball.count / 10) % 5)*240 , 
                                Math.floor(ball.count / 50)*240, 240, 240,
                                ball.X, ball.Y - 10, 20, 20
                            );
                            ball.count++;
                            if (ball.count >= 101) ball.count = 0;
                	        break;     
                	    case "knight":
                            ctx.drawImage(
                                imgKnightBall, (Math.floor(ball.count / 10) % 5)*400 , 
                                Math.floor(ball.count / 50)*400, 400, 400,
                                ball.X + 5, ball.Y, 20, 20
                            );
                            ball.count++;
                            if (ball.count >= 101) ball.count =0
                	        break;
                	    default:
                	        var grd = ctx.createRadialGradient(
                                ball.X, ball.Y, 3 , ball.X - 1, ball.Y - 1, 0);
                            grd.addColorStop(0, "yellow");
                            grd.addColorStop(1, "white");
                            ctx.fillStyle = grd;
                            ctx.beginPath();
                            ctx.arc(ball.X, ball.Y,3, 0, Math.PI * 2, true);
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
            X : 350,
            Y : 35,
            dx : -0.2,
            //dy : 0, 
            width : 90,
            height : 90,
            //Move : "none",
            atk : 10,
            died : false,
            imgCount : 0,
            shotTimer : 0,
            //散彈
            shot1 : function (){
                if(Boss.X <= 200 && Boss.hp > 0){
                    var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                    var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y + 60 - Fairy.Y));
                    for(var i = 0; i < 5; i++){
                        enermyballs.push(new enermyBall(Boss.X + 20, Boss.Y + 40 , -deltaX* 0.7, - deltaY + i*0.4,  this.atk, 'boss1'));
                    }
                    var fireSound = new Audio('BGM/fire.ogg');
                    fireSound.volume = 0.1;
                    fireSound.play();
                }
            },
            //黑洞
            shot2 : function (){
                if(Boss.X <= 200 && Boss.hp > 0){
                    var deltaX = 3* Math.sin(Math.atan2(this.X - Fairy.X, this.Y - Fairy.Y));
                    var deltaY = 3* Math.cos(Math.atan2(this.X - Fairy.X, this.Y + 30 - Fairy.Y));
                	enermyballs.push(new enermyBall(Boss.X + 20 , Boss.Y + 40 , -deltaX, -deltaY ,  this.atk*1.2, 'boss2'));
                    var fireSound = new Audio('BGM/fire.ogg');
                    fireSound.volume = 0.1;
                    fireSound.play();
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
                    if(Boss.X <= 200) Boss.dx = 0;
                    Boss.X += Boss.dx;
                    //this.Y += this.dy;
                }    
            },
            draw : function(){
                var hpLen = (Boss.hp / Boss.maxHp)*240;
                ctx.save();
                //hp bar
                if(Boss.X <= 200){
                    ctx.strokeStyle = "#615DEC";
                    ctx.font = "18px Arial";
                    ctx.strokeText('Boss',262,147,34,34);
                    ctx.strokeStyle = "#190B50";
                    ctx.fillText('Boss',262,147,34,34);
                    ctx.fillStyle="#842B00";
                    ctx.fillRect(14.5, 139.5, 241, 9);
                    ctx.fillStyle="#00AD00";
                    ctx.fillRect(15, 140, hpLen, 8);
                }
                imgBoss.src = 'images/Boss.png',
                ctx.drawImage(
                                imgBoss, 0, Math.floor(Boss.imgCount/10) * 200, 200, 200,
                                Boss.X, Boss.Y, Boss.width, Boss.height
                             );
                Boss.imgCount++;
                if(Boss.imgCount >= 40) Boss.imgCount = 0;
                ctx.restore();
            }
        };
        
        //道具
        var Item = function(x, y, type){
            this.x = x;
            this.y = y;
            this.type = type;
            this.width = 30;
            this.height = 30;
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
                        ctx.drawImage(
                            i01Img , (Math.floor(this.count /4) % 5)*192, Math.floor(this.count / 20)*192,192, 192,
                            this.x, this.y, this.width *0.7, this.height *0.7
                            );
                        this.count++
                        if(this.count >= 81) this.count = 0;    
                        break;
                    case 3: case 4:
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
            ctx.save();
            // var star = new Image();
            // star.src = 'images/star.png';
            // ctx.drawImage(star, 0, 0, canvas.width, canvas.height);
            var hpLength = (Fairy.hp <= 0)?0:(Fairy.hp / Fairy.maxHp) * 98;
            var expBar = (Fairy.exp / Fairy.lupExp) * 98;
            var chargeBar = (chargeNum/50 / 4) * 28;
            //state
            var lv = "Lv : " + Fairy.level + " HP : "+ Fairy.hp+"/"+Fairy.maxHp;
            ctx.font = "10px oblique";
            //ctx.strokeText(lv,130,13);
            ctx.fillStyle = "black";
            ctx.fillText(lv,130,13);
            //ctx.strokeText(lv,131,13);
            ctx.fillStyle = "#FFDC35";
            ctx.fillText(lv,131,14);
            ctx.restore();
            
            //Fairy icon
            ctx.save();
            ctx.strokeStyle = "#842B00";
            ctx.strokeRect(2.5, 5.5, 21, 21);
            ctx.fillStyle = "#CEDCC3";
            ctx.fillRect(3, 6, 20, 20);
            ctx.drawImage(icon, 96, 96, 96, 96, 3, 6, 20, 20);
            ctx.restore();
            
            ctx.save();
            ctx.fillStyle = "#842B00";
            ctx.fillRect(24,5,100,12);
            
            //Fairy HP
            ctx.fillStyle = "#EA0000";
            ctx.fillRect(25,6, 98, 6);
            ctx.fillStyle = "#00AD00";
            ctx.fillRect(25,6, hpLength, 6);
            
            //Fairy EXP
            ctx.fillStyle = "#1B1F3A";
            ctx.fillRect(25,14, 98, 2);
            ctx.fillStyle = "#4781E7";
            ctx.fillRect(25,14, expBar, 2);
            
            //Fairy ChargeBar
            ctx.fillStyle = "#1B1F3A";
            ctx.fillRect(24.5,18, 28, 4);
            ctx.fillStyle = "#BE77FF";
            ctx.fillRect(24.5,18, chargeBar, 4);
            ctx.restore();
            
            //gameover
            if(Fairy.died){
                ctx.save();
                ctx.font = "30px oblique";
                ctx.fillStyle = "white";
                ctx.fillText("Game Over",85,85);
                ctx.fillStyle = "red";
                ctx.fillText("Game Over",86,86);
                ctx.restore();
            }
        }
        
        var TranStage = {
            count : 0,
            draw : function(){
                if(TranStage.count < 73){
                    //alert('ok');
                    ctx.drawImage(
                         imgTranStage, Math.floor(TranStage.count / 6)%3 *1280, Math.floor(TranStage.count / 18) *960, 1280, 960,
                         0, 0, canvas.width, canvas.height
                    );
                    TranStage.count++;
                }
            }
        };
        
        //恭喜訊息
        function drawCong(){
            ctx.save();
            ctx.drawImage(
                imgCong, 0, Math.floor(countCong / 6)*480, 640, 480, 
                0, 0, canvas.width, canvas.height
            );
            countCong++;
            if(countCong >= 37) countCong = 0;
            ctx.restore();    
        }

        function animate(){
            if(isGaming){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                //特效
                if(enermyCount >= 50 && TranStage.count < 73) TranStage.draw();
                   
                moveFairy();
                drawFairy();
                //判斷升級
                if(Fairy.exp >= Fairy.lupExp){
                    Fairy.level++;
                    Fairy.lupExp += Math.pow(Fairy.level, 1.5) * 100; 
                    Fairy.maxHp += Fairy.level * 20;
                    Fairy.atk += 1;
                    recoverHp(Fairy.maxHp);
                    //升級音效
                    var lvupSound = new Audio('BGM/lvup.mp3');
                    lvupSound.volume = 0.2;
                    lvupSound.play();
                    Fairy.exp = 0;
                }
                for(var i=0; i<balls.length; i++){
                    moveBall(balls[i]);  
                    drawBall(balls[i]);
                }
                
                //生怪機制
                if(gameStage == 1){
                    if(Math.random() * 600 < 1) enermys.push(new enermyShadow());
                    if(Math.random() * 600 < 1) enermys.push(new enermyHarpy());
                    if(enermys.length == 0) Math.random() > 0.5 ? enermys.push(new enermyShadow()) : enermys.push(new enermyHarpy());
                }
                
                //敵人
                for(var i = 0; i < enermys.length; i++){
                    enermys[i].move();
                    if(enermys[i] != null){
                        enermys[i].draw();
                        if(Math.random() * 200 < 1)enermys[i].shot(); 
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
                if(enermyCount >= 50 && gameStage == 1){
                    gameStage = 2;
                    setTimeout(function() {
                        BGM.src = 'BGM/BossBattle.mp3';
                        //alert('tran');
                        $('#bGImg').css("background", "").css("background-color", "black");
                    }, 500);
                    setTimeout(function(){
                        BGM.play();    
                    }, 2500);
                    
                }
                //if(Boss.X <=320) BossStage.draw();
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
                
                //破關
                if(gameStage == 2 && Boss.died){
                    gameStage = 3;
                    BGM.pause();
                    setTimeout(function() {
                        BGM.src = 'BGM/Victory.mp3';
                        BGM.play();
                        setTimeout(function() {
                            gameStage = 4;
                        }, 1500);
                    }, 1000);
                }
                if(gameStage == 4){
                    drawCong();
                    setTimeout(function() {
                        $('#bGImg').css("background", "url('images/BG011.png')").css("background-color", "");
                        setTimeout(function() {
                            gameStage = 5;
                        }, 2500);
                    }, 1500);
                }
                drawState();
                
                //測試用
                var s =  
                "nextlv :" + Math.floor(Fairy.lupExp - Fairy.exp)+
                ", atk :"+ Fairy.atk +", enermyCount : "+ enermyCount +", Damage : "+ damage;
                //+", X :" + Fairy.X + ", Y :"+Fairy.Y; 
                $("#report").text(s);
                window.requestAnimationFrame(animate);
            }
        }
        
        function startGame(){
            BGM.play();
            gameLoop = window.requestAnimationFrame(animate);
            if(isGaming){
                $(document).keydown(function(evt) {
                    if(evt.keyCode == 32 && !Fairy.died && !isCharging){
                        var timer = setInterval(charge, 10);
                        isCharging = true;
                        $(document).keyup(function(evt) { 
                            if(evt.keyCode == 32) {
                                isCharging = false;
                                chargeNum = 1;
                                chargeSound.pause();
                                chargeSound.load();
                                clearInterval(timer);
                            } 
                        });
            
                    }
                });
                
                $(document).keydown(function(evt) {
                    if(evt.keyCode == 13){
                        enermys.push(new enermyKnight());   
                    }
                    if(evt.keyCode == 37){
                        Fairy.Move = 'LEFT';   
                    }
                    if(evt.keyCode == 38){
                        Fairy.Move = 'UP';   
                    }
                    if(evt.keyCode == 39){
                        Fairy.Move = 'RIGHT';   
                    }
                    if(evt.keyCode == 40){
                        Fairy.Move = 'DOWN';   
                    }
                 
                });         
                
                $(document).keyup(function(evt) {
                    if(evt.keyCode == 32 && !Fairy.died){
                        Fairy.shot();   
                    }
                    if(evt.keyCode == 37){
                        Fairy.Move = 'l-NONE';   
                    }
                    if(evt.keyCode == 38){
                        Fairy.Move = 'u-NONE';   
                    }
                    if(evt.keyCode == 39){
                        Fairy.Move = 'r-NONE';  
                    }
                    if(evt.keyCode == 40){
                        Fairy.Move = 'd-NONE';   
                    }
                });
            }
        }
        //開場畫面
        demo();
          
        // 暫停功能
        $('#resetBtn').click(function() {
            demo();
        })
        $('#myBtn').click(function(){
            if(isGaming){
                $('#myModal').css("display", "block");
                isGaming = false;
                BGM.pause();
            }
        })
        
        $('.close').click(function(){
            $('#myModal').css("display", "none");
            isGaming = true;
            animate();
            BGM.play();    
        });
    });