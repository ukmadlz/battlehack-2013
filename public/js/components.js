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
        this.speed = 1;
        this.health = 10;
        this.requires('Entity, Color, spr_enemy');
        this.vx = Math.min(Math.random()*15-5, this.speed);
        this.vy = Math.min(Math.random()*15-5, this.speed);
        this.color('rgb(200,200,200)');
        
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
            Game.destroyed();
            type = 3;
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
        this.speed = 2;
        this.safe = 0;
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
                    this.powerup(2);
                }
                
            });
        
        this.health = 10;
        this.bar = document.getElementById('bar');
        this.dir = 2;
        this.shuriken();
    },
    
    step : function(val) {
        var deg  = 0;
        var newx = this.x;
        var newy = this.y;
        
        switch(parseInt(val)) {
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
                return this.fire();
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
            case 10:
                this.powerup(1);
                return;
                break;
            case 11:
                this.powerup(2);
                return;
                break;
            case 12:
                this.powerup(3);
                return;
                break;
        }
        
        newx = Math.max(newx, 0+Game.tile);
        newx = Math.min(newx, Game.w-Game.tile*2);
        newy = Math.max(newy, 0+Game.tile);
        newy = Math.min(newy, Game.h-Game.tile*2);
        
        if(val < 10 && val != 5) {
            this.dir = val;
        }
        this.rotation = (90 * deg);
        this.weapon.changeDir(this.dir);
        this.tween({x: newx, y: newy}, this.speed);
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
        return true;
    },
    
    powerup : function(val) {
        Game.addMoney(val);
        if(val == 1) {
            if(this.weapon) {
                this.weapon.powerup(1)
                this.fire();
                
            }
        }
        else if(val == 2) {
            if(this.weapon) {
                var pos = this.at();
                var w1 = Crafty.e('Shuriken').at(pos.x, pos.y);
                var w2 = Crafty.e('Shuriken').at(pos.x, pos.y);
                var w3 = Crafty.e('Shuriken').at(pos.x, pos.y);
                
                var d1 = 1;
                var d2 = 2;
                var d3 = 3;
                
                switch(this.dir) {
                    case 1: d1 = 4; d2 = 1; d3 = 2; break;
                    case 2: d1 = 1; d2 = 2; d3 = 3; break;
                    case 3: d1 = 2; d2 = 3; d3 = 6; break;
                    case 4: d1 = 1; d2 = 4; d3 = 7; break;
                    case 5: d1 = 1; d2 = 2; d3 = 3; break;
                    case 6: d1 = 3; d2 = 6; d3 = 9; break;
                    case 7: d1 = 4; d2 = 7; d3 = 8; break;
                    case 8: d1 = 7; d2 = 8; d3 = 9; break;
                    case 9: d1 = 6; d2 = 9; d3 = 8; break;
                }
                
                w1.fire(d1);
                w2.fire(d2);
                w3.fire(d3);
            }
        }
        else if(val == 3) {
            if(this.weapon) {
                this.weapon.powerup(1)
                this.fire();
                
            }
        }
        else {
            if(this.weapon) {
                this.fire();
            }
        }
    },
    
    updateHealth : function(val) {
        var frame = Crafty.frame();
        if(frame - this.safe < 20) {
            return;
        }
        
        this.safe = frame;
        this.health += val;
        var color = 'green';
        
        if(this.health < 8) {
            color = 'yellow';
        }
        if(this.health < 6) {
            color = 'orange';
        }
        if(this.health < 3) {
            color = 'red';
        }
        
        var length = (this.health / 10)*100;
        
        bar.style.backgroundColor = color;
        bar.style.width = length+"%";
        
        if(this.health <= 0) {
            Game.lose();
        }
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
        if(this.fired) {
            return;
        }
        this.fired = true;
        switch(parseInt(val)) {
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
        switch(parseInt(dir)) {
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