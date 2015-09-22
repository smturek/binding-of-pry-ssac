var Pryssac = Pryssac || {};

Pryssac.PreloadState = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(2);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('wide', 'assets/wide.png');
        this.load.image('tall', 'assets/tall.png');
        this.load.image('exit', 'assets/exit.png');
        this.load.image('monster', 'assets/monster.png');
        this.load.image('blastMonster', 'assets/blastmonster.png');
        this.load.image('monster2', 'assets/monster2.png');
        this.load.image('monster3', 'assets/monster3.png');
        this.load.image('boss', 'assets/boss.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('enemyBullet', 'assets/ebullet.png');
        this.load.image('powerUp', 'assets/powerup.png');
        this.load.image('lifeUp', 'assets/lifeup.png');

        this.load.spritesheet('player', 'assets/player.png', 20, 20, 2);
        this.load.spritesheet('life', 'assets/life.png', 16, 16, 2);

    },
    create: function() {
        this.state.start('Game');
    }
};
