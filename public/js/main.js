var Game = {
    h : 500,
    w : 500,
    tile : 64,
    speed : 10,
    pusher : {},
    channel : {},
    enemies : {},
    enemy_count: 0,
    kill_count : 0,
    cost : 0,
    payer_id : 0,
    
    
    width : function() {
        return this.w / this.tile;
    },
    
    height : function() {
        return this.h / this.tile;
    },
    
    init : function() {
        //this.canvas  = document.getElementById('my_canvas');
        //this.context = this.canvas.getContext('2d');
        var div      = document.getElementById('content');
        
        this.h = div.offsetHeight;
        this.w = div.offsetWidth;
        
        this.price = document.getElementById('price');
        
        Crafty.init(this.w, this.h);
        Crafty.background('rgb(0, 67, 171)');
        Crafty.scene("Loading");
    },
    
    enemy : function(data) {
        var x = Math.round(Math.random() * 10);
        var y = Math.random() > 0.5 ? -1 : Game.h;
        Game.enemy_count++;
        if(data) {
            var enemy = Crafty.e('Player_enemy').at(1, y).image(data.handle_pic);
            enemy.setUser(data.user_id);
            Game.enemies[data.user_id] = enemy;
        }
        else {
            var enemy = Crafty.e('Enemy').at(1, y);
        }
    },
    
    default_enemies : function() {
        for(var i=0; i<5; i++) {
            Game.enemy();
        }
    },
    
    destroyed : function() {
        Game.kill_count++;
        
        if(this.kill_count == this.enemy_count) {
            alert('win condition');
        }
    },
    
    move : function(data) {
        if(data) {
            var enemy = Game.enemies[data.user_id];
            enemy.changeDir(data.num);
        }
    },
    
    post : function(user_id, val) {
        var url = "http://awesomeportal.co.uk/battlehack/callback.php?type="+val+"&user_id="+user_id;
        /*
         * 3 - kill
         * 4 - end game
         * 5 - player hit
         */
        $.post(url);
    },
    
    leap : function(data) {
        Player.step(data.message);
    },
    
    lose : function() {
        alert('lose');
    },
    
    end : function() {
        var url = "/takePayment?payer_id="+Game.payer_id+"&price="+Game.price;
        $.post(url);
        window.location = "/game.html?price="+Game.price;
    },
    
    addMoney : function(val) {
        var cost = 0;
        switch(val) {
            case 1: cost = 0.50; break;
            case 2: cost = 1; break;
            case 3: cost = 1.50; break;
            default: break;
        }
        
        this.cost += cost;
        this.price.innerHTML = parseFloat(this.cost);
    }
}

function parseUrl() {
    var path = window.location.search.substr(1);
    var bits = path.split("=");
    Game.payer_id = bits[1];
}

window.onload = function() {
    Game.init();
    
    pusher = new Pusher('3bd6278ea3f874361959');
    //pusher = new Pusher('8def7b01e65d881cdd9f');
    channel = pusher.subscribe('test_channel');
    channel.bind('newUser', Game.enemy);
    channel.bind('moveUser', Game.move);
    channel.bind('player_events', Game.leap);
}