//------------------Notes----------------
//Line 597
//Move monsters around like pacman. Some try to cut the player off, surround him, slow him down, etc.

var Pryssac = Pryssac || {};

Pryssac.GameState = {
    init: function() {
        this.PLAYER_MAX_LIFE = 3;
        this.PLAYER_FIRING_RATE = 300;
        this.MONSTER_FIRING_RATE = 1200;
        this.BULLET_TIMER = 0;

        //input keys
        this.keys = this.game.input.keyboard.createCursorKeys();

        this.moveUp = this.game.input.keyboard.addKey(87);
        this.moveDown = this.game.input.keyboard.addKey(83);
        this.moveLeft = this.game.input.keyboard.addKey(65);
        this.moveRight = this.game.input.keyboard.addKey(68);
    },
    create: function() {
        //groups
        this.walls = this.add.group();
        this.playerBullets = this.add.group();
        this.enemyBullets = this.add.group();
        this.monsters = this.add.group();
        this.lives = this.add.group();
        this.drops = this.add.group();
        this.tutorials = this.add.group();


        //create player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.anchor.setTo(0.5);

        //create walls
        var wall = new Pryssac.Wall(this, 0, 0, 'wide');
        this.walls.add(wall);

        wall = new Pryssac.Wall(this, 0, 520, 'wide');
        this.walls.add(wall);

        wall = new Pryssac.Wall(this, 0, 0, 'tall');
        this.walls.add(wall);

        wall = new Pryssac.Wall(this, 920, 0, 'tall');
        this.walls.add(wall);

    },
    update: function() {
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        //collisions
        this.game.physics.arcade.collide(this.player, this.walls);
        this.game.physics.arcade.overlap(this.walls, this.playerBullets, this.killBullet);

        if(this.player.alive) {
            if (this.moveUp.isDown) {
                this.player.body.velocity.y -= 250;
            }
            else if (this.moveDown.isDown) {
                this.player.body.velocity.y += 250;
            }
            else if (this.moveRight.isDown) {
                this.player.body.velocity.x += 250;
            }
            else if (this.moveLeft.isDown) {
                this.player.body.velocity.x -= 250;
            }

            if (this.keys.left.isDown) {
                this.fireBullet("left");
            }
            else if (this.keys.right.isDown) {
                this.fireBullet("right");
            }
            else if (this.keys.up.isDown) {
                this.fireBullet("up");
            }
            else if (this.keys.down.isDown) {
                this.fireBullet("down");
            }
        }
    },
    fireBullet: function(direction) {
        var bullet, bullet2;

        if (this.time.now > this.BULLET_TIMER) {
            bullet = this.playerBullets.getFirstExists(false);

            if (!bullet) {
                //create a bullet if there is no bullet found in the group
                bullet = new Pryssac.Bullet(this, this.player.x, this.player.y, 'bullet');
                this.playerBullets.add(bullet);
            }
            else {
                  bullet.reset(this.player.x, this.player.y);
            }

            if(direction === "up") {
              bullet.body.velocity.y = -400;
            }
            else if(direction === "down") {
              bullet.body.velocity.y = 400;
            }
            else if(direction === "right") {
              bullet.body.velocity.x = 400;
            }
            else if(direction === "left") {
              bullet.body.velocity.x = -400;
            }

                this.BULLET_TIMER = this.time.now + this.PLAYER_FIRING_RATE;
        }
    },
    killBullet: function(wall, bullet) {
        bullet.kill();
    }
};

// var exit;
// var noExit = false;
// var PowerUp;
//
// var level = 0
// var levelString = "";
// var levelText;
// var announcement;
// var gameOver;
// var startOver;
// var kills

// var life;

// var tutorials;
// var tutorial;
// var textRight;
// var textLeft;
// var exitText;

// var drops;
// var drop;
// var doubleSpeed = false;
// var doubleShot = false;

// var monsters;
// var monster;
// var killCount = 0;
// var livingMonsters;
// var variant = false;

// var enemyBullets
// var enemyTimer = 0;

// function create() {
//   for(var i = 0; i < playerMaxLife; i++) {
//     life = lives.create(854 + 25 * i, 2, 'life', 0);
//   }
//   tutorial = tutorials.create(225, game.world.centerY, 'powerUp');
//   tutorial.anchor.setTo(0.5, 0.5);
//
//   textLeft = game.add.text(225, game.world.centerY + 30, 'Power Up', {font: '20px Arial', fill: '#fff'});
//   textLeft.anchor.setTo(0.5, 0.5);
//
//   tutorial = tutorials.create(675, game.world.centerY, 'lifeUp');
//   tutorial.anchor.setTo(0.5, 0.5);
//
//   textRight = game.add.text(675, game.world.centerY + 30, 'Life Up', {font: '20px Arial', fill: '#fff'});
//   textRight.anchor.setTo(0.5, 0.5);
//
//   exitText = game.add.text(880, 460, 'Exit', {font: '20px Arial', fill: '#fff'});
//   exitText.anchor.setTo(0.5, 0.5);
//
//   gameOver = game.add.text(game.world.centerX,game.world.centerY - 30,' ', { font: '84px Arial', fill: '#fff' });
//   gameOver.anchor.setTo(0.5, 0.5);
//   gameOver.visible = false;
//
//   kills = game.add.text(game.world.centerX, game.world.centerY + 40, ' ', {font: '26px Arial', fill: '#fff'});
//   kills.anchor.setTo(0.5, 0.5);
//   kills.visible = false;
//
//   startOver = game.add.text(game.world.centerX, game.world.centerY + 110, 'Is that the best you can do?  Click to try again!', {font: '20px Arial', fill: '#fff'});
//   startOver.anchor.setTo(0.5, 0.5);
//   startOver.visible = false;
//
//   announcement = game.add.text(game.world.centerX, 50, ' ', {font: '26px Arial', fill: '#fff'});
//   announcement.anchor.setTo(0.5, 0.5);
//   announcement.alpha = 0;
//
//
//   levelString = 'Level: ';
//   levelText = game.add.text(20, 1, levelString + level, { font: '16px arial', fill: '#fff' });
//
//   showExit();
//
// }
//
// function update() {
//   game.physics.arcade.collide(player, monsters);
//   game.physics.arcade.collide(monsters, walls);
//   game.physics.arcade.overlap(bullets, walls, hitsWall);
//   game.physics.arcade.overlap(enemyBullets, walls, hitsWall);
//   game.physics.arcade.overlap(monsters, bullets, monsterHit);
//   game.physics.arcade.overlap(enemyBullets, player, playerHit, null, this);
//   game.physics.arcade.overlap(exit, player, renderLevel);
//   game.physics.arcade.overlap(drops, player, pickUp);
//
//     if (monsters.getFirstAlive() === null && noExit)
//       {
//         showExit();
//       }
//
//   if (game.time.now > enemyTimer) {
//       enemyFires();
//       enemyTimer = game.time.now + monsterFireRate;
//   }
//
// } // end update function
//
// function renderLevel() {
//   textLeft.visible = false;
//   textRight.visible = false;
//   exitText.visible = false;
//   variant = false;
//   level++;
//   announcement.text = "Level " + level;
//   game.add.tween(announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
//   //get rid of everything from the previous level
//   exit.kill();
//   drops.callAll("kill");
//   bullets.callAll("kill");
//   enemyBullets.callAll("kill");
//   tutorials.callAll('kill');
//   noExit = true;
//
//   //if player has all powerups don't drop anymore
//   if(doubleShot && doubleSpeed) {
//     PowerUp = false;
//   }
//   else {
//     PowerUp = true;
//   }
//
//   if(level % 10 === 0) {
//     monster = monsters.create(game.world.centerX,  game.world.centerY, 'boss');
//     monster.anchor.setTo(0.5, 0.5);
//     monster.health = 5 + level;
//   }
//   else if(level === 1) {
//     monster = monsters.create(225, game.world.centerY, 'monster');
//     monster.anchor.setTo(0.5, 0.5);
//     monster.body.immovable = true;
//     textLeft.text = "Bug";
//     textLeft.visible = true;
//
//     monster = monsters.create(675, game.world.centerY, 'monster');
//     monster.anchor.setTo(0.5, 0.5);
//     monster.body.immovable = true;
//     textRight.text = "Kill all bugs to reveal exit";
//     textRight.visible = true;
//
//     exitText.text = "It is said other variants exist, but no one has proof.  Take care.";
//     exitText.x = game.world.centerX;
//     exitText.y = 490;
//     exitText.visible = true;
//   }
//   else {
//     //monster fire rate
//     if(level < 21) {
//       monsterFireRate = monsterFireRate - 50;
//     }
//
//     var min;
//     var max;
//     var x;
//     var y;
//
//     if(level < 5) {
//       min = 3;
//       max = level;
//     }
//     else if(level < 10) {
//       min = 4;
//       max = 8;
//     }
//     else {
//       min = 6;
//       max = 12;
//     }
//
//     var randMonsters = game.rnd.integerInRange(min, max);
//
//     for(var i = 0; i < randMonsters; i++) {
//       x = game.rnd.integerInRange(50, 860);
//       y = game.rnd.integerInRange(50, 460);
//       randomMonster(x, y);
//     }
//   }
//   levelText.text = levelString + level;
//   if(level === 1) {
//     enemyTimer = game.time.now + 2000;
//   }
//   else {
//   enemyTimer = game.time.now + 500;
//   }
// }
//
// function showExit() {
//   var x;
//   var y;
//   if(level === 0 || level === 1) {
//     x = 870;
//     y = 470;
//   }
//   else {
//     x = game.rnd.integerInRange(40, 870);
//     y = game.rnd.integerInRange(40, 470);
//   }
//   exit = game.add.sprite(x, y, 'exit');
//   game.physics.arcade.enable(exit);
//   noExit = false;
// }
//
// function pickUp(player, drop) {
//   drop.kill();
//   if(drop.key === "lifeUp") {
//     // makes sure to add the life at the end of the missing lives so that diplay is consistent
//     var missingLife = lives.getFirstDead();
//     if(missingLife) {
//       //probably better as a for loop if I start adding more lives
//       var missingLifeIndex = lives.getChildIndex(missingLife);
//       if(lives.getChildAt(missingLifeIndex + 1).alive === false) {
//         missingLife = lives.getChildAt(missingLifeIndex + 1);
//       }
//       missingLife.reset(missingLife.x, missingLife.y);
//       missingLife.frame = 0;
//     }
//   }
//   else if(drop.key === "powerUp") {
//     if(!doubleSpeed && !doubleShot) {
//       var rand = game.rnd.integerInRange(0, 1);
//     }
//     else if(doubleSpeed) {
//       rand = 1;
//     }
//     else if(doubleShot) {
//       rand = 0;
//     }
//
//     if(rand === 0 && !doubleSpeed) {
//       playerFiringRate = playerFiringRate - (playerFiringRate / 2);
//       doubleSpeed = true;
//       announcement.text = "Speed Shot";
//       game.add.tween(announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
//     }
//     else if(rand === 1 && !doubleShot) {
//       doubleShot = true;
//       announcement.text = "Double Shot";
//       game.add.tween(announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
//     }
//   }
//
// }
//
// function monsterHit(monster, bullet) {
//   bullet.kill();
//   monster.damage(1);
//   if(monster.key === 'boss' && monster.health % 2 === 0) {
//       var x = game.rnd.integerInRange(50, 860);
//       var y = game.rnd.integerInRange(50, 460);
//       randomMonster(x, y);
//   }
//
//   if(monster.health === 0) {
//     killCount++;
//     if(monster.key === 'monster2') {
//       //create two monsters
//       var offspring = monsters.create(monster.x - 20, monster.y - 20, 'monster');
//       offspring = monsters.create(monster.x + 20, monster.y + 20, 'monster');
//     }
//     else{
//       var rand = game.rnd.integerInRange(0, 10);
//       if(rand < 1 && PowerUp && level > 4) {
//         drop = drops.create(monster.x, monster.y, "powerUp")
//         drop.body.immovable = true;
//         PowerUp = false;
//       }
//       else if(rand < 3 && level != 1) {
//         drop = drops.create(monster.x, monster.y, "lifeUp")
//         drop.body.immovable = true;
//       }
//     }
//   }
// }
//
// function playerHit(player, bullet) {
//   bullet.kill();
//
//   life = lives.getFirstAlive();
//
//   if(life) {
//     life.kill();
//     life.visible = true;
//     life.frame = 1;
//   }
//
//   if (lives.countLiving() < 1) {
//     player.kill();
//     player.visible = true;
//     player.frame = 1;
//     gameOver.text = "YOU'RE DEAD!";
//     kills.text = "AND YOU ONLY KILLED " + killCount + " BUGS...";
//     kills.visible = true;
//     gameOver.visible = true;
//     startOver.visible = true;
//     textRight.visible = false;
//     textLeft.visible = false;
//     game.input.onTap.addOnce(restart,this);
//   }
// }
//
// function restart() {
//   exit.kill();
//   player.destroy();
//   drops.callAll("kill");
//   bullets.callAll("kill");
//   enemyBullets.callAll("kill");
//   monsters.destroy(true, true);
//   tutorials.callAll('kill');
//   doubleShot = false;
//   doubleSpeed = false;
//   kills.visible = false;
//   gameOver.visible = false;
//   startOver.visible = false;
//   textRight.visible = false;
//   textLeft.visible = false;
//   exitText.visible = false;
//   level = 0;
//   killCount = 0;
//   monsterFireRate = 1200
//   playerFiringRate = 300;
//   create ();
// }
// function randomMonster(x, y) {
//   var monsterType;
//
//   if(level < 4) {
//     monsterType = 0
//   }
//   else if(level === 4) {
//     if(!variant) {
//       monsterType = 1;
//       variant = true;
//     }
//     else {
//       monsterType = 0;
//     }
//   }
//   else if(level === 5) {
//     if(!variant) {
//       monsterType = 2;
//       variant = true;
//     }
//     else {
//       monsterType = 0;
//     }
//   }
//   else if(level === 6) {
//     if(!variant) {
//       monsterType = 3;
//       variant = true;
//     }
//     else {
//       monsterType = 0;
//     }
//   }
//   else {
//     monsterType = game.rnd.integerInRange(0, 3);
//   }
//
//   if(monsterType === 0) {
//     monster = monsters.create(x, y, 'monster');
//   }
//   else if(monsterType === 1) {
//     monster = monsters.create(x, y, 'blastMonster');
//   }
//   else if(monsterType === 2) {
//     monster = monsters.create(x, y, 'monster2');
//   }
//   else if(monsterType === 3) {
//     monster = monsters.create(x, y, 'monster3');
//     monster.health = 3;
//   }
//   monster.body.immovable = true;
//   monster.anchor.setTo(0.5, 0.5);
// }
//
// function enemyFires() {
//   livingMonsters = [];
//   monsters.forEachAlive(function(monster) {
//     livingMonsters.push(monster)
//   });
//
//   if(livingMonsters.length > 0) {
//     for(var i = 0; i < livingMonsters.length; i++) {
//       enemyBullet = enemyBullets.getFirstExists(false);
//       if(enemyBullet) {
//         enemyBullet.anchor.setTo(0.5, 0.5);
//         if(livingMonsters[i].key === "monster") {
//           enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
//           game.physics.arcade.moveToObject(enemyBullet,player,200);
//         }
//         else if(livingMonsters[i].key === "blastMonster") {
//           enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
//           enemyBullet.body.velocity.y = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
//           enemyBullet.body.velocity.y = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
//           enemyBullet.body.velocity.x = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
//           enemyBullet.body.velocity.x = 200;
//         }
//         else if(livingMonsters[i].key === "monster2") {
//           enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
//           game.physics.arcade.moveToObject(enemyBullet,player,200);
//         }
//         else if(livingMonsters[i].key === "monster3") {
//           enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
//           //can I move this toward the place where the player is going to be?
//           game.physics.arcade.moveToObject(enemyBullet,player,400);
//         }
//         else if(livingMonsters[i].key === "boss") {
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.y = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.y = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.x = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.x = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.y = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.y = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.x = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.x = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.y = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.y = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.x = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
//           enemyBullet.body.velocity.x = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.y = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.y = 200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.x = -200;
//
//           enemyBullet = enemyBullets.getFirstExists(false);
//           enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
//           enemyBullet.body.velocity.x = 200;
//         }
//       }
//     }
//   }
// }
