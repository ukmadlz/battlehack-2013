Crafty.c('Grid', {
    init : function() {
        this.requires('2D, Canvas')
            .attr({w: Game.tile, h: Game.tile});
    },
    
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x/Game.tile, y: this.y/Game.tile };
        }
        else {
            this.attr({ x: x * Game.tile, y: y * Game.tile });
            return this;
        }
    }
});

Crafty.c('Entity', {
    init : function() {
        this.requires('Grid, Collision')
    },
    
});

Crafty.c('Enemy', {
    init : function() {
        this.speed = 2;
        this.health = 100;
        this.requires('Entity, Color');
        this.vx = Math.min(Math.random()*15-5, this.speed);
        this.vy = Math.min(Math.random()*15-5, this.speed);
        this.color('rgb(100,100,100)');
        
        this.bind('EnterFrame', function() {
            var newx = this.x + this.vx;
            var newy = this.y + this.vy;
            
            if(newx < -Game.tile) {  newx = Game.w; }
            else if(newx > Game.w) { newx = -Game.tile; }
            
            if(newy < -Game.tile) {  newy = Game.h; }
            else if(newy > Game.h) { newy = -Game.tile; }
            
            this.x = newx;
            this.y = newy;
            
        })
        .onHit('Player', function() {
            //this.destroy();
            Player.updateHealth(-1);
        });
    },

    updateHealth : function() {
        this.health -= 1;
        var type = 5;
        if(this.health <= 0) {
            this.destroy();
        }
        
        if(this.user_id) {
            Game.post(this.user_id, type);
        }
    },
    
    setUser : function(val) {
        this.user_id = val;
    }
});

Crafty.c('Player_enemy', {
    init : function() {
        this.requires('Enemy, Image');
    },
    
    changeDir : function(val) {
        this.vx = 0;
        this.vy = 0;
        switch(parseInt(val)) {
            case 1: this.vx = -this.speed; this.vy = -this.speed; break
            case 2: this.vy = -this.speed; break;
            case 3: this.vx = this.speed; this.vy = -this.speed; break;
            case 4: this.vx = -this.speed; break;
            case 5: break;
            case 6: this.vx = this.speed; break;
            case 7: this.vx = -this.speed; this.vy = this.speed; break;
            case 8: this.vy = this.speed; break;
            case 9: this.vx = this.speed; this.vy = this.speed; break;
            default: break;
        }
    },

});

Crafty.c('Player', {
    init : function() {
        this.requires('Entity, Keyboard, Tween, spr_player')
            .origin("center")
            .bind('KeyDown', function() {
                if(this.isDown('UP_ARROW')) {
                    this.step(2);
                }
                else if(this.isDown('RIGHT_ARROW')) {
                    this.step(6);
                }
                else if(this.isDown('DOWN_ARROW')) {
                    this.step(8);
                }
                else if(this.isDown('LEFT_ARROW')) {
                    this.step(4);
                }
                else if(this.isDown('SPACE')) {
                    this.fire();
                }
                else if(this.isDown('Q')) {
                    this.step(1);
                }
                else if(this.isDown('E')) {
                    this.step(3);
                }
                else if(this.isDown('A')) {
                    this.step(7);
                }
                else if(this.isDown('D')) {
                    this.powerup();
                }
                
            });
        
        this.health = 5;
        this.dir = 2;
        this.shuriken();
    },
    
    step : function(val) {
        this.dir = val;
        var deg  = 0;
        var newx = this.x;
        var newy = this.y;
        
        switch(val) {
            case 1:
                newx -= Game.tile;
                newy -= Game.tile;
                deg = 3.5;
                break;
            case 2:
                newy -= Game.tile;
                break;
            case 3:
                newx += Game.tile;
                newy -= Game.tile;
                deg = 0.5;
                break;
            case 4:
                newx -= Game.tile;
                deg = 3;
                break;
            case 5:
                break;
            case 6:
                newx += Game.tile;
                deg = 1;
                break;
            case 7:
                newx -= Game.tile;
                newy += Game.tile;
                deg = 2.5;
                break;
            case 8:
                newy += Game.tile;
                deg = 2;
                break;
            case 9:
                newx += Game.tile;
                newy += Game.tile;
                deg = 1.5;
                break;
            default: break;
        }
        
        newx = Math.max(newx, 0);
        newx = Math.min(newx, Game.w);
        newy = Math.max(newy, 0);
        newy = Math.min(newy, Game.h);
        
        /*
        switch(deg) {
            case 3:  pos.x -= 0.2; pos.y += 0.4; break;
            case 2:  pos.x += 0.4; pos.y += 1;   break;
            case 1:  pos.x += 1;   pos.y += 0.4; break;
            case 0: 
            default:  break;
        }
        */
        this.rotation = (90 * deg);
        this.weapon.changeDir(this.dir);
        this.tween({x: newx, y: newy}, Game.speed);
    },
    
    shuriken : function() {
        if(this.weapon) {
            return;
        }
        var pos = this.at();
        var shuriken = Crafty.e('Shuriken');
        this.attach(shuriken);
        this.weapon = shuriken;
        this.weapon.changeDir(this.dir);
    },
    
    fire : function() {
        var shuriken = this.weapon;
        this.detach(this.weapon.fire(this.dir));
        this.weapon = false;
        this.shuriken();
    },
    
    powerup : function() {
        if(this.weapon) {
            this.weapon.powerup(1)
            this.fire();
            
        }
    },
    
    updateHealth : function(val) {
        this.health += val;
    },
});

Crafty.c('Shuriken', {
    init : function() {
        this.fired = false;
        this.size = 31;
        this.vx = 0;
        this.vy = 0;
        this.speed = 10;
        
        this.requires('Entity, spr_shuriken')
            .attr({w:this.size, h:this.size})
            .origin("center")
            .onHit('Enemy', this.kill)
            .bind('EnterFrame', function() {
                var newx = this.x + this.vx;
                var newy = this.y + this.vy;
                
                if(this.fired && (newx < -Game.tile || newx > Game.w || newy < -Game.tile || newy > Game.h)) {
                    this.destroy();
                    return;
                }
                
                this.rotation = this.rotation + 10;
                this.x = newx;
                this.y = newy;
            });
    },
    
    kill : function(data) {
        var enemy = data[0].obj;
        enemy.updateHealth();
        
        if(this.fired) {
            this.destroy();
        }
    },
    
    powerup : function(val) {
        if(val == 1) {
            this.size = 80;
            this.attr({w:Game.tile, h: Game.tile});
            var pos = this._parent.at();
            this.at(pos.x, pos.y);
        }
        
        if(val == 2) {
            
        }
        
    },
    
    fire : function(val) {
        this.fired = true;
        switch(val) {
            case 1: this.vx = -this.speed; this.vy = -this.speed; break;
            case 2: this.vy = -this.speed; break;
            case 3: this.vx = this.speed; this.vy = -this.speed; break;
            case 4: this.vx = -this.speed; break;
            case 5: break;
            case 6: this.vx = this.speed; break;
            case 7: this.vx = -this.speed; this.vy = this.speed; break;
            case 8: this.vy = this.speed; break;
            case 9: this.vx = this.speed; this.vy = this.speed; break;
            default: break;
        }
        
        return this;
    },
    
    changeDir : function(dir) {
        if(!this._parent) { return; }
        var pos = this._parent.at();
        switch(dir) {
            case 1: pos.y += 0.05; break;
            case 2: pos.x += 0.4; pos.y -= 0.2; break;
            case 3: pos.x += 0.8; pos.y += 0.02; break;
            case 4: pos.x -= 0.2; pos.y += 0.4; break;
            case 5: break;
            case 6: pos.x += 1; pos.y += 0.4; break;
            case 7: pos.y += 0.8; break;
            case 8: pos.x += 0.4; pos.y += 1; break;
            case 9: pos.x += 0.8; pos.y += 0.8; break;
            case 0:
            default:
                break;
        }
        this.at(pos.x, pos.y);
    },
});