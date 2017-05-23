    $(document).ready(function(){

        //開場畫面
        var demoCount = 0;
        var isDemo = true;
        function drawTitle(){
            if(isDemo){
            var c = $('#myCanvas')[0];
            var ctx = c.getContext('2d');
            var title = new Image();
            var gameTitle = 'Fairy Story';
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
            title.src = 'images/fairy02.png',
            ctx.drawImage(
                title, Math.floor(demoCount / 20) *50 , 0, 50, 42,
                60, 48, 35 , 35
                );
       
            demoCount++;
            if(demoCount >=60) demoCount = 0;
            ctx.restore();
            window.requestAnimationFrame(drawTitle);
            }
        }
        
        function demo(){
            BGM.src = 'BGM/BGM02.ogg';
            BGM.volume = 0.8;
            BGM.play();
            if(isDemo){
                var demoLoop = window.requestAnimationFrame(drawTitle);
                $(document).keyup(function(e){
                    if(e.keyCode == 13){
                        window.cancelAnimationFrame(demoLoop);
                        isDemo = false;
                        isGaming = true
                        setTimeout(startGame, 1000);
                        setTimeout(function(){
                            BGM.src = 'BGM/BGM03.ogg';
                            BGM.volume = 0.5;
                            BGM.play();
                        },1000);
                    }
                });
            }
        }
        
        var isGaming = false;
        var canvas = $('#myCanvas')[0];
        var ctx = canvas.getContext('2d');
        var gameLoop;
        var balls = [];
        var enermyballs = [];
        var dImg = new Image();
        var eImg = new Image();
        var e2Img = new Image();
        var vImg = new Image();
        var v2Img = new Image();
        var cImg = new Image();
        var mBall = new Image();
        var bBall = new Image();
        
        var i01Img = new Image();
        i01Img.src = 'images/item01.png'
        var i02Img = new Image();
        i02Img.src = 'images/item02.png'
        
        var chargeNum = 1;
        var isCharging = false;
        
        var chargeSound = new Audio('BGM/charge.wav');
        chargeSound.volume = 0.2;
        chargeSound.loop = true;
        var BGM = new Audio();
        BGM.loop = true;
        
        var mbCount = 0;
        var cbCount = 0;
        var enermys = [];
        var items = [];
        
        
        var dragon = {
            level : 1,
            exp : 0,
            lupExp : 100,
            maxHp : 120,
            hp : 120,
            X : 100,
            Y : 100,
            dx : 0,
            dy : 0,
            speed : 1.5,
            width : 25,
            height : 21,
            Move : "none",
            beHit : false,
            atk : 7,
            shot : function (){
                var power = chargeNum > 50 ? chargeNum/50 : 1;
    
            	if(power > 3){
            	    balls.push(new Ball(dragon.X - 5, dragon.Y , power, 3 , -0.5));
            	    balls.push(new Ball(dragon.X - 5, dragon.Y + 8, power, 3, 0.5));
            	}
            	
            // 	if(power >3) {
        	   //     balls.push(new Ball(dragon.X + 15, dragon.Y, power,3 , -1));
            // 	    balls.push(new Ball(dragon.X + 15, dragon.Y + 8, power, 3, 1));    
            // 	}
                balls.push(new Ball(dragon.X - 5, dragon.Y + 4, power,3 ,0));
                var fireSound = new Audio('BGM/fire.ogg');
                fireSound.volume = 0.3;
                fireSound.play();
            }
        }
        
        //集氣
        function charge (){
            chargeNum++;
            if(chargeNum >= 200) {
                chargeNum = 200;
            }
            if(chargeNum > 50){
                isCharging = true;
                chargeSound.play();
            }
        }
        
        function moveDragon(){
            if(dragon.hp > 0){
                
                if(dragon.Move == 'LEFT'){
                    dragon.dx = -dragon.speed;    
                }
                if( dragon.Move =='RIGHT'){
                    dragon.dx = dragon.speed; 
                }
                if(dragon.Move == 'UP'){
                    dragon.dy = -dragon.speed;    
                }
                if(dragon.Move =='DOWN'){
                    dragon.dy = dragon.speed; 
                }
                if(dragon.Move == 'l-NONE' || dragon.Move == 'r-NONE'){
                    dragon.dx = 0;    
                }
                if(dragon.Move == 'u-NONE' || dragon.Move == 'd-NONE'){
                    dragon.dy = 0;    
                }
                
                if (dragon.X + dragon.dx < 0 || dragon.X + dragon.dx + dragon.width >= canvas.width){
                    dragon.dx = 0; 
                }
                if (dragon.Y + dragon.dy < 0 || dragon.Y + dragon.dy +dragon.height > canvas.height){
                    dragon.dy = 0; 
                }
                dragon.X = dragon.X + dragon.dx;
                dragon.Y = dragon.Y + dragon.dy;
            }
        }
        
        var drawCount = 0;
        var hitCount = 0;
        var chargeCount = 0;
        var deadCount = 0;
        function drawDragon(){
            if(dragon.hp >0){
                if(!dragon.beHit){
                    if (drawCount >= 18) drawCount = 0;
                    ctx.save();
                    dImg.src = 'images/fairy02.png',
                    ctx.drawImage(
                        dImg, Math.floor(drawCount / 6)*50 ,84 , 50, 42,
                        dragon.X, dragon.Y, dragon.width , dragon.height
                        );
                    //alert(dImg.src);
                    ctx.restore();   
                    drawCount++;
                
                }else{
                    if(drawCount >= 18)drawCount = 0;
                    if (drawCount % 4 == 0 && hitCount <= 50) {
                        ctx.save();
                        dImg.src = 'images/fairy02.png',
                        //ctx.drawImage(dImg, dragon.X, dragon.Y, dragon.width , dragon.height );
                        ctx.drawImage(
                            dImg, Math.floor(drawCount / 6)*50 , 84, 50, 42,
                            dragon.X, dragon.Y, dragon.width , dragon.height
                            );
                        ctx.restore();
                    }else if(hitCount > 50){
                        dragon.beHit = false;
                        hitCount =0;
                    }
                    hitCount++
                    drawCount++;
                }
                if(isCharging){
                    if(chargeCount >= 60)chargeCount = 0;
                    ctx.save();
                    cImg.src = 'images/charging.png',
                    ctx.drawImage(
                        cImg, Math.floor(chargeCount / 6)*240 , 0, 240, 240,
                        dragon.X - 2, dragon.Y - 7, 40 , 40
                        );
                    chargeCount++
                    ctx.restore();
                }
            }else{
                if(deadCount < 42){
                    ctx.save();
                    dImg.src = 'images/deadeffect.png',
                    ctx.drawImage(
                        dImg, 0, Math.floor(deadCount / 6)*240, 640, 240,
                        dragon.X - 150, dragon.Y - 50, 320 , 120
                        );
                    deadCount++
                    ctx.restore();    
                }else{
                    deadCount = 0;
                    // isGaming = false;
                }
            }
            
        }
        
        //魔法球 
        function Ball(X, Y, power,dx, dy){
            this.X = X;
            this.Y = Y;
            this.width = 25, 
            // + dragon.level;   
            this.height = 25,
            // + dragon.level;
            this.deltaX = dx,
            this.deltaY = dy;
            this.power = dragon.level * dragon.atk * power;
            this.hit = false;
        }
            
        function moveBall(ball){
            //攻擊命中
            for(var i=0; i < enermys.length; i++){
                var midX = enermys[i].X + enermys[i].width / 2;    
                var midY = enermys[i].Y + enermys[i].height / 2;
                var ballx = ball.X + ball.width / 2;
                var bally = ball.y + ball.height /2;
            
                if (enermys[i].hp > 0) {
                    if ((
                        ball.X + ball.deltaX + ball.width >= midX  && 
                        ball.X - ball.deltaX  <= midX + enermys[i].width /2 &&
                        ball.Y + ball.height * 0.5 >= midY - enermys[i].height * 0.5 && 
                        ball.Y - ball.deltaY * 0.7 <= midY + enermys[i].height * 0.2
                        )){
                        var hitSound = new Audio('BGM/enermy.wav');
                        hitSound.volume = 0.5;
                        hitSound.play();
        
                        if(ball.power / dragon.level <= 20) ball.hit = true;
                        else ball.power -= 5;
                        
                        enermys[i].hp -= ball.power;
                        if(enermys[i].hp <= 0) {
                            var enermyDown = new Audio('BGM/enermydown01.wav');
                            enermyDown.volume = 0.5;
                            enermyDown.play();
                        }
                        
                        if(ball.power ==0 )balls.splice(balls.indexOf(ball), 1);
                    }
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
                	var power = ball.power /(dragon.level * dragon.atk);
                	
                	//集氣就丟大球
                	if(power > 1){
                	    bBall.src = 'images/bigball.png'
                	    ctx.drawImage(
                        bBall, (cbCount % 5)*480 , Math.floor(cbCount/5)*480,
                        480, 480,
                        ball.X + 5, ball.Y, ball.width, ball.height
                        );
                        cbCount++;
                        if (cbCount >= 31) cbCount =0
                    
                    //沒集氣就丟小球    
                	}else{
                	    
                	    mBall.src = 'images/magicball.png'
                	    ctx.drawImage(
                        mBall, (mbCount %3 )*320 , Math.floor(mbCount/3)*240, 320, 240,
                        ball.X + 5, ball.Y, ball.width, ball.height
                        );
                        mbCount++;
                        if(mbCount >= 31) mbCount = 0;
                	}
                	
                    ctx.restore();
                    
                }else {
                    balls.splice(balls.indexOf(ball), 1);
                }
            }
        }
        
        //敵人
        var enermy = function () {
            this.level = dragon.level;
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
                if(this.hp > 0){
                    var deltaX = 3* Math.sin(Math.atan2(this.X - dragon.X, this.Y - dragon.Y));
                    var deltaY = 3* Math.cos(Math.atan2(this.X - dragon.X, this.Y - dragon.Y));
                    enermyballs.push(new EnermyBall(this.X + 5, this.Y + 10, -deltaX, -deltaY, this.level));
                }
            }
            
            this.moveEnermy = function (){
                if(this.hp > 0){
                    //判斷是否撞到
                    if(!dragon.beHit){
                        if(this.X - this.width*0.7 <= dragon.X  &&
                            this.X + this.width*0.7 >= dragon.X  &&
                            this.Y - this.height*0.7 <= dragon.Y  &&
                            this.Y + this.height*0.7 >= dragon.Y){
                                reduceHp(this.power);
                                dragon.beHit = true;
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
            this.drawEnermy = function() {
                if(this.hp > 0){
                    if(liveCount >= 18) liveCount = 0;
                    eImg.src = 'images/shadow.png';
                    ctx.drawImage(
                        eImg, 
                        Math.floor(liveCount / 6)*60, 60, 60, 60, 
                        this.X, this.Y, this.width, this.height
                        );
                    liveCount++;
                }else{
                    if (deadCount < 41){
                        vImg.src = 'images/boom.png';
                        ctx.drawImage(vImg, Math.floor(deadCount / 5)* 240, 0, 240, 240,
                        this.X, this.Y, this.width, this.height
                        );
                        deadCount++;    
                    }else{
                        dragon.exp += this.exp;
                        if(Math.random() < 0.3){
                            items.push(new Item(this.X, this.Y, Math.floor(Math.random()*4 +1)));
                        }
                        enermys.splice(enermys.indexOf(this),1);
                        deadCount = 0; 
                    }
                }
            }
        }
        
        var enermy2 = function () {
            this.level = dragon.level;
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
                if(this.hp > 0){
                    var deltaX = 3* Math.sin(Math.atan2(this.X - dragon.X, this.Y - dragon.Y));
                    var deltaY = 3* Math.cos(Math.atan2(this.X - dragon.X, this.Y - dragon.Y));
                    enermyballs.push(new EnermyBall(this.X + 5, this.Y + 10, -deltaX, -deltaY, this.level));
                }
            }
            
            this.moveEnermy = function (){
                if(this.hp > 0){
                    //判斷是否撞到
                    if(!dragon.beHit){
                        if(this.X - this.width*0.7 <= dragon.X  &&
                            this.X + this.width*0.7 >= dragon.X  &&
                            this.Y - this.height*0.7 <= dragon.Y  &&
                            this.Y + this.height*0.7 >= dragon.Y){
                                reduceHp(this.power);
                                dragon.beHit = true;
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
            this.drawEnermy = function() {
                if(this.hp > 0){
                    if(liveCount >= 18) liveCount = 0;
                    e2Img.src = 'images/grif05b.png';
                    ctx.drawImage(
                        e2Img, 
                        Math.floor(liveCount / 6)*45, 50, 45, 50, 
                        this.X, this.Y, this.width, this.height
                        );
                    liveCount++;
                }else{
                    if (deadCount < 41){
                        vImg.src = 'images/boom.png';
                        ctx.drawImage(vImg, Math.floor(deadCount / 5)* 240, 0, 240, 240,
                        this.X, this.Y, this.width, this.height
                        );
                        deadCount++;    
                    }else{
                        dragon.exp += this.exp;
                        if(Math.random() < 0.3){
                            items.push(new Item(this.X, this.Y, Math.floor(Math.random()*4 +1)));
                        }
                        enermys.splice(enermys.indexOf(this),1);
                        deadCount = 0;
                       
                    }
                }
            }
        }
        
        function EnermyBall(X, Y, deltaX, deltaY,level){
            this.X = X;
            this.Y = Y;
            this.width = 3;   
            this.height = 3;
            this.deltaX = deltaX;
            this.deltaY = deltaY;
            this.power = level * 10;
            this.hit = false;
        }
        
        function moveEnermyBall(ball){
            var midX = dragon.X + dragon.width / 2;
            var midY = dragon.Y + dragon.height / 2;
            //攻擊命中
            if (dragon.hp > 0 && dragon.beHit == false) {
                if (
                    ball.X + ball.deltaX  >= midX - dragon.width *0.5 && 
                    ball.X - ball.deltaX  <= midX + dragon.width *0.5 &&
                    ball.Y + ball.deltaY  >= midY - dragon.height *0.5 && 
                    ball.Y - ball.deltaY  <= midY + dragon.height *0.5
                    ){
                    var hitSound = new Audio('BGM/hurt02.wav');
                    hitSound.volume = 0.5;
                    hitSound.play();
                    ball.hit = true;
                    dragon.beHit = true;
                    reduceHp(ball.power);
                    //alert(ball.power)
                }
            }
            //火球飛超過銀幕 就從陣列中移除火球
            if (ball.X + ball.deltaX  - ball.width> canvas.width||
                ball.X + ball.deltaX  < 0){
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
                    var grd = ctx.createRadialGradient(
                        ball.X, ball.Y, 3 , ball.X - 1, ball.Y - 1, 0);
                    grd.addColorStop(0, "yellow");
                    grd.addColorStop(1, "white");
                    ctx.fillStyle = grd;
                    ctx.beginPath();
                    ctx.arc(ball.X, ball.Y,3, 0, Math.PI * 2, true);
                    ctx.fill();
                    ctx.restore();
                }else{
                    enermyballs.splice(enermyballs.indexOf(ball), 1);
                    return;
                }
            }
        }
        
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
                // var midX = dragon.X + dragon.width / 2;
                // var midY = dragon.Y + dragon.height / 2;
                if (
                    this.x + this.width*0.5  >= dragon.X && 
                    this.x - this.width*0.5  <= dragon.X &&
                    this.y + this.height*0.5  >= dragon.Y && 
                    this.y - this.height*0.5  <= dragon.Y 
                    ){
                    
                    switch(this.type){
                        case 1: case 2:
                            var cureSound = new Audio('BGM/cure.wav');
                            cureSound.volume = 0.5;
                            cureSound.play();
                            //alert("recover");
                            recoverHp(dragon.maxHp*0.1);
                            items.splice(items.indexOf(this),1)
                            break;
                        case 3: case 4:
                            var puSound = new Audio('BGM/powerup.wav');
                            puSound.volume = 0.5;
                            puSound.play();
                           // alert("powerup");
                            dragon.atk += 2;
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
                            i01Img , (this.count % 5)*192, Math.floor(this.count / 5)*192,192, 192,
                            this.x, this.y, this.width, this.height
                            );
                        break;
                    case 3: case 4:
                        ctx.drawImage(
                            i02Img , (this.count % 5)*192, Math.floor(this.count / 5)*192,192, 192,
                            this.x, this.y, this.width, this.height
                            );
                        break;
                }
                ctx.save();
                this.count++
                if(this.count >= 31) this.count = 0;
                ctx.restore();    
            }
        }
  
    
        //畫狀態
        var icon = new Image();
        icon.src = 'images/fairy03.png';
        
        function drawState(){
            ctx.save();
            var hpLength = (dragon.hp <= 0)?0:(dragon.hp / dragon.maxHp) * 98;
            var expBar = (dragon.exp / dragon.lupExp) * 98;
            var chargeBar = (chargeNum/50 / 4) * 28;
            //state
            var lv = "Lv : " + dragon.level + " HP : "+ dragon.hp+"/"+dragon.maxHp;
            ctx.font = "10px oblique";
            ctx.strokeText(lv,130,13);
            ctx.fillStyle = "black";
            ctx.fillText(lv,130,13);
            ctx.strokeText(lv,131,13);
            ctx.fillStyle = "#FFDC35";
            ctx.fillText(lv,131,13);
            
            //dragon icon
            ctx.drawImage(icon, 96, 96, 96, 96, 3, 5, 20, 20);
            
            //dragon HP
            ctx.fillStyle="#842B00";
            ctx.strokeRect(25,5,100,8);
            ctx.fillStyle="#EA0000";
            ctx.fillRect(26,6, 98, 6);
            ctx.fillStyle="#FFD306";
            ctx.fillRect(26,6, hpLength, 6);
            
            //dragon EXP
            ctx.fillStyle="#842B00";
            ctx.strokeRect(25,13,100,4);
            ctx.fillStyle="#000079";
            ctx.fillRect(26,14, 98, 2);
            ctx.fillStyle="#28FF28";
            ctx.fillRect(26,14, expBar, 2);
            
            //dragon ChargeBar
            ctx.fillStyle="#842B00";
            ctx.strokeRect(25,17,30,6);
            ctx.fillStyle="#000079";
            ctx.fillRect(26,18, 28, 4);
            ctx.fillStyle="#BE77FF";
            ctx.fillRect(26,18, chargeBar, 4);
            ctx.restore();
        }
      
        function animate(){
            if(isGaming){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                moveDragon();
                drawDragon();
                //判斷升級
                if(dragon.exp >= dragon.lupExp){
                    dragon.level++;
                    dragon.lupExp += Math.pow(dragon.level, 1.5) * 100; 
                    dragon.maxHp += dragon.level * 20;
                    recoverHp(dragon.maxHp);
                    //升級音效
                    var lvupSound = new Audio('BGM/lvup.mp3');
                    lvupSound.volume = 0.8;
                    lvupSound.play();
                    dragon.exp = 0;
                }
                     
                for(var i=0; i<balls.length; i++){
                    moveBall(balls[i]);  
                    drawBall(balls[i]);
                }
                
                if(Math.random() * 600 < 3) enermys.push(new enermy());
                if(Math.random() * 600 < 3) enermys.push(new enermy2());
                if(enermys.length == 0) Math.random() > 0.5 ? enermys.push(new enermy()) : enermys.push(new enermy2()) ;
                for(var i = 0; i < enermys.length; i++){
                    enermys[i].moveEnermy();
                    if(enermys[i] != null){
                        enermys[i].drawEnermy();
                        if(Math.random()*300 < 1)enermys[i].shot(); 
                    }
                }
           
                for(var i=0; i<enermyballs.length; i++){
                    moveEnermyBall(enermyballs[i]);  
                    drawEnermyBall(enermyballs[i]);
                }
                
                for(var i=0; i<items.length; i++){
                    items[i].check();
                    if(items[i] != null) items[i].draw();
                }
                
                drawState();
                
                //測試用
                var s = "level : " + dragon.level +  ", HP :"+ dragon.hp + 
                ", nextlv :" + Math.floor(dragon.lupExp - dragon.exp)+", items :"+
                items.length + ", atk :"+ dragon.atk + ", X :" + dragon.X + ", Y :"+dragon.Y; 
                $("#report").text(s);
                window.requestAnimationFrame(animate);
            }
        }
        
        function reduceHp(x){
            var hpMinus = x;
            //alert(hpMinus);
            var timer = setInterval(function(){
                dragon.hp--;
                hpMinus--;
                //alert(hpMinus)
                if(hpMinus <= 0){
                    clearInterval(timer);
                }
            },25);
        }
        
        function recoverHp(x){
            var hpPlus = x;
            var timer = setInterval(function(){
                dragon.hp++;
                if(dragon.hp >= dragon.maxHp) dragon.hp = dragon.maxHp;
                x--;
                if(x <= 0)clearInterval(timer);    
            },5);
        }
        
        function startGame(){
            
            BGM.play();
            gameLoop = window.requestAnimationFrame(animate);
             
            $(document).keydown(function(evt) {
                if(evt.keyCode == 32){
                    var timer = setInterval(charge, 10);
                    
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
                    enermys.push(new enermy());   
               }
               if(evt.keyCode == 37){
                    dragon.Move = 'LEFT';   
               }
               if(evt.keyCode == 38){
                    dragon.Move = 'UP';   
               }
               if(evt.keyCode == 39){
                    dragon.Move = 'RIGHT';   
               }
               if(evt.keyCode == 40){
                    dragon.Move = 'DOWN';   
               }
               
            });         
            
            $(document).keyup(function(evt) {
                    
                    if(evt.keyCode == 32){
                        dragon.shot();   
                    }
                    if(evt.keyCode == 37){
                        dragon.Move = 'l-NONE';   
                    }
                    if(evt.keyCode == 38){
                        dragon.Move = 'u-NONE';   
                    }
                    if(evt.keyCode == 39){
                        dragon.Move = 'r-NONE';  
                    }
                    if(evt.keyCode == 40){
                        dragon.Move = 'd-NONE';   
                    }
                });
        }
        //開場畫面
        demo();
          
        // Get the modal  暫停功能
        var modal = document.getElementById('myModal');
        
        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");
        
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        
        // When the user clicks the button, open the modal 
        btn.onclick = function() {
            modal.style.display = "block";
            isGaming = false;
            BGM.pause();
            // alert("pause");
        }
        
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
            isGaming = true;
            startGame();
            BGM.play();
        }
        
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                isGaming = true;
                startGame();
                BGM.play();
            }
        }
    });
