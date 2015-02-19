var game = new Phaser.Game(940, 540, Phaser.AUTO, 'foo',
  { preload: preload, create: create, update: update });

var walls;
var exit;
var noExit = false;
var PowerUp;

var level = 0
var levelString = "";
var levelText;
var announcement;
var gameOver;
var kills

var player;
var playerMaxLife = 3;
var playerFiringRate = 300;
var lives;
var life;

var tutorials;
var tutorial;
var textRight;
var textLeft;
var exitText;

var drops;
var drop;
var doubleSpeed = false;
var doubleShot = false;

var monsters;
var monster;
var monsterFireRate = 1200;
var killCount = 0;
var livingMonsters;
var variant = false;

var bullets;
var bulletTimer = 0;

var enemyBullets
var enemyTimer = 0;

var moveUp;
var moveDown;
var moveRight;
var moveLeft;

function preload() {

  game.load.image('wide', 'assets/wide.png');
  game.load.image('tall', 'assets/tall.png');
  game.load.image('exit', 'assets/exit.png');
  game.load.image('player', 'assets/player.png');
  game.load.image('monster', 'assets/monster.png');
  game.load.image('blastMonster', 'assets/blastmonster.png');
  game.load.image('monster2', 'assets/monster2.png');
  game.load.image('monster3', 'assets/monster3.png');
  game.load.image('boss', 'assets/boss.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('enemyBullet', 'assets/ebullet.png');
  game.load.spritesheet('life', 'assets/life.png', 16, 16, 2);
  game.load.image('powerUp', 'assets/powerup.png')
  game.load.image('lifeUp', 'assets/lifeup.png')

}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  moveUp = game.input.keyboard.addKey(87);
  moveDown = game.input.keyboard.addKey(83);
  moveLeft = game.input.keyboard.addKey(65);
  moveRight = game.input.keyboard.addKey(68);

  //walls
  walls = game.add.group();
  walls.enableBody = true;

  var wall = walls.create(0, 0, 'wide');
  wall.body.immovable = true;

  wall = walls.create(0, 520, 'wide');
  wall.body.immovable = true;

  wall = walls.create(0, 0, 'tall');
  wall.body.immovable = true;

  wall = walls.create(920, 0, 'tall');
  wall.body.immovable = true;

  //player's bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  //enemy's bullet group
  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(100, 'enemyBullet');
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  monsters = game.add.group()
  monsters.enableBody = true;

  lives = game.add.group();
  for(var i = 0; i < playerMaxLife; i++) {
    life = lives.create(854 + 25 * i, 2, 'life', 0);
  }

  drops = game.add.group();
  drops.enableBody = true;

  tutorials = game.add.group();

  tutorial = tutorials.create(225, game.world.centerY, 'powerUp');
  tutorial.anchor.setTo(0.5, 0.5);

  textLeft = game.add.text(225, game.world.centerY + 30, 'Power Up', {font: '20px Arial', fill: '#fff'});
  textLeft.anchor.setTo(0.5, 0.5);

  tutorial = tutorials.create(675, game.world.centerY, 'lifeUp');
  tutorial.anchor.setTo(0.5, 0.5);

  textRight = game.add.text(675, game.world.centerY + 30, 'Life Up', {font: '20px Arial', fill: '#fff'});
  textRight.anchor.setTo(0.5, 0.5);

  exitText = game.add.text(880, 460, 'Exit', {font: '20px Arial', fill: '#fff'});
  exitText.anchor.setTo(0.5, 0.5);

  gameOver = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
  gameOver.anchor.setTo(0.5, 0.5);
  gameOver.visible = false;

  kills= game.add.text(game.world.centerX, game.world.centerY + 70, ' ', {font: '26px Arial', fill: '#fff'});
  kills.anchor.setTo(0.5, 0.5);
  kills.visible = false;

  announcement = game.add.text(game.world.centerX, 50, ' ', {font: '26px Arial', fill: '#fff'});
  announcement.anchor.setTo(0.5, 0.5);
  announcement.alpha = 0;

  player = game.add.sprite(game.world.centerX,game.world.centerY, 'player');
  game.physics.arcade.enable(player);
  player.body.collideWorldBounds= true;
  player.anchor.setTo(0.5, 0.5);

  levelString = 'Level: ';
  levelText = game.add.text(20, 1, levelString + level, { font: '16px arial', fill: '#fff' });

  showExit();

}

function update() {
  game.physics.arcade.collide(player, walls);
  game.physics.arcade.collide(player, monsters);
  game.physics.arcade.collide(monsters, walls);
  game.physics.arcade.overlap(bullets, walls, hitsWall);
  game.physics.arcade.overlap(enemyBullets, walls, hitsWall);
  game.physics.arcade.overlap(monsters, bullets, monsterHit);
  game.physics.arcade.overlap(enemyBullets, player, playerHit, null, this);
  game.physics.arcade.overlap(exit, player, renderLevel);
  game.physics.arcade.overlap(drops, player, pickUp);

  keys = game.input.keyboard.createCursorKeys();

  player.body.velocity.y = 0;
  player.body.velocity.x = 0;

  if(player.alive) {
    if (moveUp.isDown) {
      player.body.velocity.y -= 250;
    }
    else if (moveDown.isDown) {
      player.body.velocity.y += 250;
    }
    else if (moveRight.isDown) {
      player.body.velocity.x += 250;
    }
    else if (moveLeft.isDown) {
      player.body.velocity.x -= 250;
    }

    if (keys.left.isDown)
      {
        fireBullet("left");
      }
    else if (keys.right.isDown)
      {
        fireBullet("right");
      }
    else if (keys.up.isDown)
      {
        fireBullet("up");
      }
    else if (keys.down.isDown)
      {
        fireBullet("down");
      }

    if (monsters.getFirstAlive() === null && noExit)
      {
        showExit();
      }
  }

  if (game.time.now > enemyTimer) {
      enemyFires();
      enemyTimer = game.time.now + monsterFireRate;
  }

} // end update function

function renderLevel() {
  textLeft.visible = false;
  textRight.visible = false;
  exitText.visible = false;
  variant = false;
  level++;
  announcement.text = "Level " + level;
  game.add.tween(announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
  //get rid of everything from the previous level
  exit.kill();
  drops.callAll("kill");
  bullets.callAll("kill");
  enemyBullets.callAll("kill");
  tutorials.callAll('kill');
  noExit = true;

  //if player has all powerups don't drop anymore
  if(doubleShot && doubleSpeed) {
    PowerUp = false;
  }
  else {
    PowerUp = true;
  }

  if(level % 10 === 0) {
    monster = monsters.create(game.world.centerX,  game.world.centerY, 'boss');
    monster.anchor.setTo(0.5, 0.5);
    monster.health = 5 + level;
  }
  else if(level === 1) {
    monster = monsters.create(225, game.world.centerY, 'monster');
    monster.anchor.setTo(0.5, 0.5);
    textLeft.text = "Bug";
    textLeft.visible = true;

    monster = monsters.create(675, game.world.centerY, 'monster');
    monster.anchor.setTo(0.5, 0.5);
    textRight.text = "Kill all bugs to reveal exit";
    textRight.visible = true;

    exitText.text = "It is said other variants exist, but no one has proof.  Take care.";
    exitText.x = game.world.centerX;
    exitText.y = 490;
    exitText.visible = true;
  }
  else {
    //monster fire rate
    if(level < 21) {
      monsterFireRate = monsterFireRate - 50;
    }

    var min;
    var max;
    var x;
    var y;

    if(level < 5) {
      min = 3;
      max = level;
    }
    else if(level < 10) {
      min = 4;
      max = 8;
    }
    else {
      min = 6;
      max = 12;
    }

    var randMonsters = game.rnd.integerInRange(min, max);

    for(var i = 0; i < randMonsters; i++) {
      x = game.rnd.integerInRange(50, 860);
      y = game.rnd.integerInRange(50, 460);
      randomMonster(x, y);
    }
  }
  levelText.text = levelString + level;
  if(level === 1) {
    enemyTimer = game.time.now + 2000;
  }
  else {
  enemyTimer = game.time.now + 500;
  }
}

function showExit() {
  var x;
  var y;
  if(level === 0 || level === 1) {
    x = 870;
    y = 470;
  }
  else {
    x = game.rnd.integerInRange(40, 870);
    y = game.rnd.integerInRange(40, 470);
  }
  exit = game.add.sprite(x, y, 'exit');
  game.physics.arcade.enable(exit);
  noExit = false;
}

function fireBullet(direction) {
  if (game.time.now > bulletTimer) {
    bullet = bullets.getFirstExists(false);
    bullet.anchor.setTo(0.5, 0.5);
    if (bullet)
    {
        if(doubleShot) {
          bullet.reset(player.x - 6, player.y - 6);
        }
        else {
          bullet.reset(player.x, player.y);
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

        if(doubleShot) {
          bullet = bullets.getFirstExists(false);
          if (bullet)
          {
            bullet.reset(player.x + 6, player.y + 6);
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
          }
        }
        bulletTimer = game.time.now + playerFiringRate;
    }
  }
}

function pickUp(player, drop) {
  drop.kill();
  if(drop.key === "lifeUp") {
    // makes sure to add the life at the end of the missing lives so that diplay is consistent
    var missingLife = lives.getFirstDead();
    if(missingLife) {
      //probably better as a for loop if I start adding more lives
      var missingLifeIndex = lives.getChildIndex(missingLife);
      if(lives.getChildAt(missingLifeIndex + 1).alive === false) {
        missingLife = lives.getChildAt(missingLifeIndex + 1);
      }
      missingLife.reset(missingLife.x, missingLife.y);
      missingLife.frame = 0;
    }
  }
  else if(drop.key === "powerUp") {
    if(!doubleSpeed && !doubleShot) {
      var rand = game.rnd.integerInRange(0, 1);
    }
    else if(doubleSpeed) {
      rand = 1;
    }
    else if(doubleShot) {
      rand = 0;
    }

    if(rand === 0 && !doubleSpeed) {
      playerFiringRate = playerFiringRate - (playerFiringRate / 2);
      doubleSpeed = true;
      announcement.text = "Speed Shot";
      game.add.tween(announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
    }
    else if(rand === 1 && !doubleShot) {
      doubleShot = true;
      announcement.text = "Double Shot";
      game.add.tween(announcement).to( { alpha: 1 }, 2000, "Linear", true, 0, 0, true);
    }
  }

}

function monsterHit(monster, bullet) {
  bullet.kill();
  monster.damage(1);
  if(monster.key === 'boss' && monster.health % 2 === 0) {
      var x = game.rnd.integerInRange(50, 860);
      var y = game.rnd.integerInRange(50, 460);
      randomMonster(x, y);
  }

  if(monster.health === 0) {
    killCount++;
    if(monster.key === 'monster2') {
      //create two monsters
      var offspring = monsters.create(monster.x - 20, monster.y - 20, 'monster');
      offspring = monsters.create(monster.x + 20, monster.y + 20, 'monster');
    }
    else{
      var rand = game.rnd.integerInRange(0, 10);
      if(rand < 1 && PowerUp && level > 4) {
        drop = drops.create(monster.x, monster.y, "powerUp")
        drop.body.immovable = true;
        PowerUp = false;
      }
      else if(rand < 3 && level != 1) {
        drop = drops.create(monster.x, monster.y, "lifeUp")
        drop.body.immovable = true;
      }
    }
  }
}

function playerHit(player, bullet) {
  bullet.kill();

  life = lives.getFirstAlive();

  if(life) {
    life.kill();
    life.visible = true;
    life.frame = 1;
  }

  if (lives.countLiving() < 1) {
    player.kill();
    gameOver.text = "YOU HAVE DIED";
    kills.text = "YOU HAVE SLAIN " + killCount + " MONSTERS!" ;
    kills.visible = true;
    gameOver.visible = true;
  }
}

function hitsWall(bullet) {
  bullet.kill();
}

function randomMonster(x, y) {
  var monsterType;

  if(level < 4) {
    monsterType = 0
  }
  else if(level === 4) {
    if(!variant) {
      monsterType = 1;
      variant = true;
    }
    else {
      monsterType = 0;
    }
  }
  else if(level === 5) {
    if(!variant) {
      monsterType = 2;
      variant = true;
    }
    else {
      monsterType = 0;
    }
  }
  else if(level === 6) {
    if(!variant) {
      monsterType = 3;
      variant = true;
    }
    else {
      monsterType = 0;
    }
  }
  else {
    monsterType = game.rnd.integerInRange(0, 3);
  }

  if(monsterType === 0) {
    monster = monsters.create(x, y, 'monster');
  }
  else if(monsterType === 1) {
    monster = monsters.create(x, y, 'blastMonster');
  }
  else if(monsterType === 2) {
    monster = monsters.create(x, y, 'monster2');
  }
  else if(monsterType === 3) {
    monster = monsters.create(x, y, 'monster3');
    monster.health = 3;
  }
  monster.body.immovable = true;
  monster.anchor.setTo(0.5, 0.5);
}

function enemyFires() {
  livingMonsters = [];
  monsters.forEachAlive(function(monster) {
    livingMonsters.push(monster)
  });

  if(livingMonsters.length > 0) {
    for(var i = 0; i < livingMonsters.length; i++) {
      enemyBullet = enemyBullets.getFirstExists(false);
      if(enemyBullet) {
        enemyBullet.anchor.setTo(0.5, 0.5);
        if(livingMonsters[i].key === "monster") {
          enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
          game.physics.arcade.moveToObject(enemyBullet,player,200);
        }
        else if(livingMonsters[i].key === "blastMonster") {
          enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
          enemyBullet.body.velocity.y = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
          enemyBullet.body.velocity.y = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
          enemyBullet.body.velocity.x = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
          enemyBullet.body.velocity.x = 200;
        }
        else if(livingMonsters[i].key === "monster2") {
          enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
          game.physics.arcade.moveToObject(enemyBullet,player,200);
        }
        else if(livingMonsters[i].key === "monster3") {
          enemyBullet.reset(livingMonsters[i].x, livingMonsters[i].y);
          game.physics.arcade.moveToObject(enemyBullet,player,400);
        }
        else if(livingMonsters[i].key === "boss") {
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.y = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.y = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.x = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.x = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.y = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.y = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.x = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.x = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.y = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.y = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.x = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x + 20, livingMonsters[i].y - 20);
          enemyBullet.body.velocity.x = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.y = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.y = 200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.x = -200;

          enemyBullet = enemyBullets.getFirstExists(false);
          enemyBullet.reset(livingMonsters[i].x - 20, livingMonsters[i].y + 20);
          enemyBullet.body.velocity.x = 200;
        }
      }
    }
  }
}
