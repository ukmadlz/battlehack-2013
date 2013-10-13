var Game = {
    h : 500,
    w : 500,
    tile : 64,
    speed : 10,
    pusher : {},
    channel : {},
    enemies : {},
    
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
        
        //this.canvas.height = this.h;
        //this.canvas.width  = this.w;
        
        Crafty.init(this.w, this.h);
        Crafty.background('rgb(0, 67, 171)');
        Crafty.scene("Loading");
    },
    

    enemy : function(data) {
        var x = Math.round(Math.random() * 10);
        var y = Math.random() > 0.5 ? -1 : Game.h;
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
    }
}


window.onload = function() {
    Game.init();
    pusher = new Pusher('3bd6278ea3f874361959');
    channel = pusher.subscribe('test_channel');
    channel.bind('newUser', Game.enemy);
    channel.bind('moveUser', Game.move);
}