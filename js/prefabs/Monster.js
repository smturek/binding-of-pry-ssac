var Pryssac = Pryssac || {};

Pryssac.Monster = function(state, x, y, asset) {
    Phaser.Sprite.call(this, state.game, x, y, asset);

    this.state = state;
    this.game = state.game;

    //init physics body
    this.game.physics.arcade.enable(this);

};

Pryssac.Monster.prototype = Object.create(Phaser.Sprite.prototype);
Pryssac.Monster.prototype.constructor = Pryssac.Monster;
