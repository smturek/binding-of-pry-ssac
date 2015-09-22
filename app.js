var Pryssac = Pryssac || {};

Pryssac.game = new Phaser.Game(940, 540, Phaser.AUTO, 'foo');

Pryssac.game.state.add('Boot', Pryssac.BootState);
Pryssac.game.state.add('Preload', Pryssac.PreloadState);
Pryssac.game.state.add('Game', Pryssac.GameState);

Pryssac.game.state.start('Boot');
