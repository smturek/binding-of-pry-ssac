var Pryssac = Pryssac || {};

Pryssac.TutorialState = {
    create: function() {
        this.tutTitle = this.add.text(this.game.world.centerX, this.game.world.centerY - 200, 'The Tutorial', {font: '42px Arial', fill: '#fff'});
        this.tutTitle.anchor.setTo(0.5);
    }
};
