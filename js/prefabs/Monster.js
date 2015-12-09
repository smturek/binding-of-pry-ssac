var Pryssac = Pryssac || {};

Pryssac.Monster = function(state, x, y, asset) {
    Phaser.Sprite.call(this, state.game, x, y, asset);

    this.state = state;
    this.game = state.game;
    this.shotTimer = 0;

    //init physics body
    this.game.physics.arcade.enable(this);

};

Pryssac.Monster.prototype = Object.create(Phaser.Sprite.prototype);
Pryssac.Monster.prototype.constructor = Pryssac.Monster;

Pryssac.Monster.prototype.update = function() {
    if (this.game.time.now > this.shotTimer) {
        this.fire();
        this.shotTimer = this.game.time.now + this.state.MONSTER_FIRING_RATE;
    }
};

Pryssac.Monster.prototype.fire = function() {
    if(this.alive) {
        bullet = this.state.monsterBullets.getFirstExists(false);

        if (!bullet) {
            //create a bullet if there is no bullet found in the group
            bullet = new Phaser.Sprite(this.game, this.x, this.y, 'monsterBullet');
            this.game.physics.arcade.enable(bullet);
            bullet.anchor.setTo(0.5);
            this.state.monsterBullets.add(bullet);
        }
        else {
            //reset dead bullet
            bullet.reset(this.x, this.y);
        }

        this.game.physics.arcade.moveToObject(bullet, this.state.player, 200);
    }
};
