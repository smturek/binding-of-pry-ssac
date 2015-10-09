var Pryssac = Pryssac || {};

Pryssac.Item = function(state, x, y, asset) {
    Phaser.Sprite.call(this, state.game, x, y, asset);

    this.state = state;
    this.game = state.game;

    //init physics body
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;

};

Pryssac.Item.prototype = Object.create(Phaser.Sprite.prototype);
Pryssac.Item.prototype.constructor = Pryssac.Item;
