var Pryssac = Pryssac || {};

Pryssac.GameState = {
    init: function() {
        this.PLAYER_MAX_LIFE = 3;
        this.PLAYER_FIRING_RATE = 300;
        this.MONSTER_FIRING_RATE = 1200;
        this.TILE_WIDTH = 16;
        this.TILE_HEIGHT = 16;
        this.CHANCE_OF_MONSTER = 0.002;

        this.killCount = 0;

        //Level generation
        this.level = [];
        this.levelNumber = 1;
        this.FLOOR = 0;
        this.WALL = 1;
        this.MONSTER = 2;
        this.EXIT = 3;

        //input keys
        this.keys = this.game.input.keyboard.createCursorKeys();

        this.moveUp = this.game.input.keyboard.addKey(87);
        this.moveDown = this.game.input.keyboard.addKey(83);
        this.moveLeft = this.game.input.keyboard.addKey(65);
        this.moveRight = this.game.input.keyboard.addKey(68);
    },
    create: function() {
        //create player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.anchor.setTo(0.5);
        this.player.kills = 0;
        this.player.powerUps = {};

        //groups
        this.walls = this.add.group();
        this.playerBullets = new Pryssac.Bullets(this, true);
        this.monsterBullets = this.add.group();
        this.monsters = this.add.group();
        this.lives = this.add.group();
        this.drops = this.add.group();
        this.tutorials = this.add.group();

        //text blocks
        this.deathText = this.add.text(this.game.world.centerX, this.game.world.centerY - 100, "", {fontSize: 48, fill: 'white'});
        this.deathText.anchor.setTo(0.5);
        this.killsText = this.add.text(this.game.world.centerX, this.game.world.centerY, "", {fontSize: 32, fill: 'white'});
        this.killsText.anchor.setTo(0.5);
        this.restartText = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, "", {fontSize: 24, fill: 'white'});
        this.restartText.anchor.setTo(0.5);

        this.generateLevel();
        this.renderLevel();
        this.renderUI();

        //brings player back to top level so other sprites don't cover it
        this.player.bringToTop();
    },
    update: function() {
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        //collisions
        this.game.physics.arcade.collide(this.player, this.walls);
        this.game.physics.arcade.collide(this.player, this.monsters);
        this.game.physics.arcade.overlap(this.player, this.exit, this.nextLevel, null, this);
        this.game.physics.arcade.collide(this.player, this.monsterBullets, this.hitPlayer, null, this);
        this.game.physics.arcade.collide(this.monsters, this.playerBullets, this.hitMonster, null, this);
        this.game.physics.arcade.overlap(this.walls, this.playerBullets, this.killBullet);
        this.game.physics.arcade.overlap(this.walls, this.monsterBullets, this.killBullet);

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
                this.playerBullets.fire("left");
            }
            else if (this.keys.right.isDown) {
                this.playerBullets.fire("right");
            }
            else if (this.keys.up.isDown) {
                this.playerBullets.fire("up");
            }
            else if (this.keys.down.isDown) {
                this.playerBullets.fire("down");
            }
        }
    },
    killBullet: function(wall, bullet) {
        bullet.kill();
    },
    renderUI: function() {
        var life;

        for(var i = 0; i < this.PLAYER_MAX_LIFE; i++) {
            life = this.lives.create(854 + 25 * i, 0, 'life', 0);
        }

        this.levelText = this.add.text(20, 0, 'Level: ' + this.levelNumber, { font: '16px arial', fill: '#fff' });
    },
    generateLevel: function() {
        var i, j, levelRow;
        var levelRows = Math.floor(Pryssac.game.height / this.TILE_HEIGHT);
        var levelCols = Math.floor(Pryssac.game.width / this.TILE_WIDTH);

        for(i = 0; i <= levelRows; i++) {
            levelRow = [];
            for(j = 0; j < levelCols; j++) {
                if(i === 0 || i === levelRows) {
                    levelRow.push(this.WALL);
                }
                else if (j === 0 || j === levelCols - 1) {
                    levelRow.push(this.WALL);
                }
                else {
                    levelRow.push(this.FLOOR);
                }
            }
            this.level.push(levelRow);
        }

        this.addMonsters();
    },
    renderLevel: function() {
        var i, j, cell;

        for(i = 0; i < this.level.length; i++) {
            for(j = 0; j < this.level[i].length; j++) {
                if(this.level[i][j] == this.WALL) {
                    this.placeWall(j * this.TILE_WIDTH, i * this.TILE_HEIGHT);
                }
                else if (this.level[i][j] == this.MONSTER) {
                    this.placeMonster(j * this.TILE_WIDTH, i * this.TILE_HEIGHT);
                }
            }
        }
    },
    addExit: function() {
        row = this.rnd.integerInRange(1, this.level.length - 1);
        col = this.rnd.integerInRange(1, this.level[1].length - 1);

        this.exit = this.add.sprite(col * this.TILE_WIDTH, row * this.TILE_HEIGHT, 'exit');
        this.game.physics.arcade.enable(this.exit);
    },
    addMonsters: function() {
        var i,j, chance;

        for(i = 0; i < this.level.length; i++) {
            for(j = 0; j < this.level[i].length; j++) {
                chance = Math.random();

                if(chance < this.CHANCE_OF_MONSTER && this.level[i][j] === 0) {
                    this.level[i][j] = 2;
                }
            }
        }
    },
    placeMonster: function(col, row) {
        var monster = this.monsters.getFirstExists(false);

        if (!monster) {
            //create a bullet if there is no bullet found in the group
            monster = new Pryssac.Monster(this, col, row, 'monster');
            this.game.physics.arcade.enable(monster);
            this.monsters.add(monster);
        }
        else {
            //reset dead bullet
            monster.reset(col, row);
        }
    },
    placeWall: function(col, row) {
        var wall = this.walls.getFirstExists(false);

        if (!wall) {
            //create a bullet if there is no bullet found in the group
            wall = new Pryssac.Wall(this, col, row, 'wall');
            this.game.physics.arcade.enable(wall);
            this.walls.add(wall);
        }
        else {
            //reset dead bullet
            wall.reset(col, row);
        }
    },
    hitPlayer: function(player, bullet) {
        bullet.kill();

        life = this.lives.getFirstAlive();

        if(life) {
            life.kill();
        }

        if (this.lives.countLiving() < 1) {
            player.kill();
            player.visible = true;
            player.frame = 1;

            this.gameOver();
        }
    },
    hitMonster: function(monster, bullet) {
        bullet.kill();
        monster.damage(1);

        if(monster.health === 0) {
            this.killCount++;
        }

        //check to see if it was the last monster, and if so add exit
        if(!this.monsters.getFirstAlive()) {
            this.addExit();
        }
    },
    gameOver: function() {
        this.player.sendToBack();

        this.deathText.text = "YOU'RE DEAD!";
        this.killsText.text = "YOU KILLED " + this.killCount + " MONSTERS";
        // this.restartText.text = "Click anywhere to return to the main menu";
        //
        // this.game.input.onTap.addOnce(this.restart);
    },
    nextLevel: function() {
        this.exit.kill();

        this.levelNumber++;
        this.levelText.text = "Level: " + this.levelNumber;

        this.level = [];

        this.generateLevel();
        this.renderLevel();
    }
    // restart: function() {
    //     this.state.start('Menu');
    // }
};


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
