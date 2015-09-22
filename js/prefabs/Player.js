var Pryssac = Pryssac || {};

Pryssac.Player = function(state, x, y, asset) {
    Phaser.Sprite.call(this, state.game, x, y, asset);

    this.state = state;
    this.game = state.game;

    //init physics body
    this.game.physics.arcade.enable(this);
};

Pryssac.Player.prototype = Object.create(Phaser.Sprite.prototype);
Pryssac.Player.prototype.constructor = Pryssac.Player;
