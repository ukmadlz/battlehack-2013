var Player = {
    health : 5,
    init : function() {
        this.obj = Crafty.e('Player').at(Game.width()/2, Game.height()/2);
    },
    
    move : function(val) {
        var newx = this.obj.x;
        var newy = this.obj.y;
        
        switch(val) {
            case 1: newx -= Game.tile; newy -= Game.tile; break;
            case 2: newy -= Game.tile; break;
            case 3: newx += Game.tile; newy -= Game.tile; break;
            case 4: newx -= Game.tile; break;
            case 5:  break;
            case 6: newx += Game.tile; break;
            case 7: newx -= Game.tile; newy += Game.tile; break;
            case 8: newy += Game.tile; break;
            case 9: newx += Game.tile; newy += Game.tile; break;
            default: break;
        }
        
        newx = Math.max(newx, 0);
        newx = Math.min(newx, Game.w);
        newy = Math.max(newy, 0);
        newy = Math.min(newy, Game.h);
        
        this.obj.tween({x: newx, y: newy}, Game.speed);
    },
    
    updateHealth : function(val) {
        this.health += val;
    },
    
    shuriken : function() {
        
    },
    
    
    
};
