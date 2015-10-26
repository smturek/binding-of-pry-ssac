var Pryssac = Pryssac || {};

Pryssac.MenuState = {
    create: function() {
        this.gameTitle = this.add.text(this.game.world.centerX, this.game.world.centerY - 200, 'The Binding of Pryssac', {font: '42px Arial', fill: '#fff'});
        this.gameTitle.anchor.setTo(0.5);

        this.startGame = this.add.button(this.game.world.centerX, this.game.world.centerY - 100, 'player');
        this.startGame.anchor.setTo(0.5);
        this.startGame.scale.setTo(7, 3);
        this.startGame.events.onInputDown.add(function() {
            this.state.start('Game');
        }, this);

        this.startText = this.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'Start', {font: '36px Arial', fill: '#fff'});
        this.startText.anchor.setTo(0.5);

        this.startTutorial = this.add.button(this.game.world.centerX, this.game.world.centerY, 'monster3');
        this.startTutorial.anchor.setTo(0.5);
        this.startTutorial.scale.setTo(7, 3);
        this.startTutorial.events.onInputDown.add(function() {
            this.state.start('Tutorial');
        }, this);

        this.tutorialText = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Tutorial', {font: '36px Arial', fill: '#fff'});
        this.tutorialText.anchor.setTo(0.5);
    }
};
