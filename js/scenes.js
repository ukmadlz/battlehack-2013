
Crafty.scene("Game", function() {
    Player = Crafty.e('Player').at(Game.width()/2, Game.height()/2);
    
    setTimeout(Game.default_enemies, 4000);
    
});

Crafty.scene("Loading", function() {
    Crafty.sprite(64, 'assets/player.jpg', {spr_player: [0,0]});
    Crafty.sprite(64, 'assets/shuriken.png', {spr_shuriken: [0,0]});
    Crafty.scene("Game");
});
