var title;
var instructions;
var highscore = 0;

WebFont.load({
    google: {
        families: ['Press Start 2P']
    }
});

// var button1;
// var button2;
// var background;

// var selectVersion = {
//     preload: function() {
//         game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
//     },
//
//     create: function() {
//
//         game.stage.backgroundColor = '#000000';
//
//         button1 = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
//         button2 = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
//
//         button1.onInputIcaru.add(out, this);
//         button2.onInputElJinete.add(over, this);
//
//         console.log(button1);
//         console.log(button2);
//
//     }
//
//     // actionOnClick: function() {
//     //   if
//     // }
// };

// ORIGINAL GAME

var spaceKey;
var tap;
var column_timer;
var thunder_timer;
var thunder;
var tabButton;
var jinete;
var chatButton;

var mainMenu = {

    preload: function() {
        game.load.image('background', 'assets/cloud_final_noclouds.png');
        game.load.image('clouds', 'assets/clouds-alone.png');
        game.load.audio('jinete', 'assets/eljinete2.mp3');
        // game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },
    create: function() {
        game.add.image(0, 0, 'background');

        this.clouds = this.game.add.tileSprite(0,
            this.game.height - 550,
            this.game.width,
            this.game.cache.getImage('clouds').height,
            'clouds'
        );

        var title = this.game.add.text(350, 50, 'ICARU', {
            font: "32px Press Start 2P",
            fill: "#000000"
        });
        title.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var instructions = this.game.add.text(150, 300, 'Tap SPACEBAR or TAP to JUMP. \n\nTo start the game, use the same function.', {
            font: "14px Press Start 2P",
            align: "center",
            fill: "#000000"
        });
        instructions.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var credits = this.game.add.text(30, 500, "Credits:\nDesigns: José Daniel 'Mansuper' Vélez\nProgramming: Miguel Vacas", {
            font: "10px Press Start 2P",
            align: "left",
            fill: "#000000"
        });
        credits.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var hs = this.game.add.text(600, 20, "High Score: " + highscore, {
            font: "14px Press Start 2P",
            fill: "#000"
        });

        spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR
        );

        tabButton = game.input.keyboard.addKey(
            Phaser.Keyboard.TAB
        );

        chatButton = game.input.keyboard.addKey(
            Phaser.Keyboard.C
        );

        if (!jinete) {
            jinete = game.add.audio('jinete');
        }
        jinete.stop();

    },

    update: function() {
        this.clouds.tilePosition.x -= 0.50;

        if (this.game.input.activePointer.justPressed() || spaceKey.isDown === true) {
            this.game.state.start('main');
        }
        if (tabButton.isDown === true) {
            this.game.state.start('menu_b');
        }
        if (chatButton.isDown === true) {
            this.game.state.start('menu_chat');
        }
    },

};

var mainState = {
    preload: function() {
        game.load.image('hero', 'assets/icarus-full.png');
        game.load.image('column', 'assets/col-full.png');
        game.load.image('columnBroken', 'assets/col-broken.png');
        game.load.image('columnUp', 'assets/col-full-upside.png');
        game.load.image('columnBrokenUp', 'assets/col-broken-upside.png');
        game.load.image('background', 'assets/cloud_final_noclouds.png');
        game.load.image('clouds', 'assets/clouds-alone.png');
        game.load.image('thunder_bg', 'assets/thunder-bg.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('point', 'assets/point.wav');
        game.load.audio('gameover', 'assets/gameover.wav');
        // game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },

    create: function() {
        game.add.image(0, 0, 'background');

        // thunder = game.add.image(0, 0, 'thunder_bg');

        // thunder.visible = false;

        this.clouds = this.game.add.tileSprite(0,
            this.game.height - 550,
            this.game.width,
            this.game.cache.getImage('clouds').height,
            'clouds'
        );

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.hero = game.add.sprite(100, 245, 'hero');

        game.physics.arcade.enable(this.hero);

        this.hero.body.gravity.y = 1000;

        spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR
        );

        tap = game.input.onDown.add(this.jump, this);

        spaceKey.onDown.add(this.jump, this);

        this.columns = game.add.group();

        this.columnsUp = game.add.group();

        this.columnsBroken = game.add.group();

        this.columnsBrokenUp = game.add.group();

        this.allColumns = [this.columns, this.columnsUp, this.columnsBroken, this.columnsBrokenUp];

        this.column_timer = game.time.events.loop(2250, this.addRowOfCol, this);

        // this.thunder_timer = game.time.events.loop(1000, this.thunder_strike, this);

        this.score = 0;

        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Press Start 2P",
            fill: "#000"
        });

        this.hero.anchor.setTo(-0.2, 0.5);

        this.jumpSound = game.add.audio('jump');

        this.pointSound = game.add.audio('point');

        this.gameoverSound = game.add.audio('gameover');

        // console.log(thunder);
    },

    update: function() {
        // game.time.events.add(this.thunder_timer);

        this.clouds.tilePosition.x -= 0.50;

        if (this.hero.y < 0 || this.hero.y > 600) {
            this.restartGame();
        }
        game.physics.arcade.overlap(
            this.hero, this.allColumns, this.hitCol, null, this
        );

        if (this.hero.angle < 20) {
            this.hero.angle += 1;
        }

        if (this.columnsUp.getBounds().x <= -49 && this.columnsUp.getBounds().x >= -50 || this.columns.getBounds().x <= -49 && this.columns.getBounds().x >= -50) {
            this.score += 1;
            this.labelScore.text = this.score;
            if (this.score > highscore) {
                highscore = this.score;
            }
            this.pointSound.play();
        } else if (this.columnsBrokenUp.getBounds().x >= -100 && this.columnsBrokenUp.getBounds().x <= -99 || this.columnsBroken.getBounds().x >= -100 && this.columnsBroken.getBounds().x <= -99) {
            this.score += 1;
            this.labelScore.text = this.score;
            if (this.score > highscore) {
                highscore = this.score;
            }
            this.pointSound.play();
        }
    },

    // thunder_strike: function() {
    //     for (var i = 0; i < 1; i++) {
    //         game.time.events.add(2500, flash, this, thunder);
    //         game.time.events.add(10000, flash, this, thunder);
    //     }
    //
    //     function flash() {
    //         if (thunder.visible === false) {
    //             console.log("flash " + this.timer);
    //             thunder.visible = true;
    //         } else {
    //             console.log("sky " + this.timer);
    //             thunder.visible = false;
    //             game.time.events.remove(this.thunder_timer);
    //         }
    //     }
    // },

    jump: function() {
        this.hero.body.velocity.y = -350;
        game.add.tween(this.hero).to({
            angle: -20
        }, 100).start();
        if (this.hero.alive === false) {
            return;
        }

        this.jumpSound.play();
    },

    restartGame: function() {
        game.state.start('menu');
    },

    addOneCol: function(x, y) {
        var column = game.add.sprite(x, y, 'column');

        this.columns.add(column);

        game.physics.arcade.enable(column);

        column.body.velocity.x = -200;

        column.checkWorldBounds = true;
        column.outOfBoundsKill = true;
    },

    addOneColUpside: function(x, y) {
        var columnUp = game.add.sprite(x, y, 'columnUp');

        this.columnsUp.add(columnUp);

        game.physics.arcade.enable(columnUp);

        columnUp.body.velocity.x = -200;

        columnUp.checkWorldBounds = true;
        columnUp.outOfBoundsKill = true;


    },

    addOneColBroken: function(x, y) {
        var columnBroken = game.add.sprite(x, y, 'columnBroken');

        this.columnsBroken.add(columnBroken);

        game.physics.arcade.enable(columnBroken);

        columnBroken.body.velocity.x = -400;

        columnBroken.checkWorldBounds = true;
        columnBroken.outOfBoundsKill = true;
    },

    addOneColBrokenUpside: function(x, y) {
        var columnBrokenUp = game.add.sprite(x, y, 'columnBrokenUp');

        this.columnsBrokenUp.add(columnBrokenUp);

        game.physics.arcade.enable(columnBrokenUp);

        columnBrokenUp.body.velocity.x = -400;

        columnBrokenUp.checkWorldBounds = true;
        columnBrokenUp.outOfBoundsKill = true;
    },

    addRowOfCol: function() {
        var hole = Math.floor(Math.random() * 300) + 1;
        var realHole = Math.random();

        // Rightside up columns
        for (var i = 1; i < 2; i++) {
            if (i != hole && i != hole + 300) {
                var otherside = realHole * -350;
                var othersideBroken = realHole * -500;
                if (Math.ceil(Math.random() * 3) == 3) {
                    this.addOneColBroken(800, i * (othersideBroken + 650));
                    this.addOneColBrokenUpside(800, i * (othersideBroken));
                } else {
                    this.addOneCol(600, i * (otherside + 650));
                    this.addOneColUpside(600, i * (otherside));
                }
            }
        }
    },

    hitCol: function() {
        if (this.hero.alive === false) {
            return;
        }

        this.hero.alive = false;

        this.gameoverSound.play();

        game.time.events.remove(this.column_timer);

        this.columns.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsUp.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsBroken.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsBrokenUp.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        spaceKey = game.input.keyboard.removeKey(
            Phaser.Keyboard.SPACEBAR
        );

        tap = game.input.onDown.remove(this.jump, this);

    },


};

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('main', mainState);

game.state.add('menu', mainMenu);

game.state.start('menu');





//
//
//
//
//
//
//
//
// EL JINETE GAME
//
var mainMenu_b = {

    preload: function() {
        game.load.image('background', 'assets/cloud_final_noclouds.png');
        game.load.image('clouds', 'assets/clouds-alone.png');
        game.load.audio('jinete', 'assets/eljinete2.mp3');
        // game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },
    create: function() {
        game.add.image(0, 0, 'background');

        this.clouds = this.game.add.tileSprite(0,
            this.game.height - 550,
            this.game.width,
            this.game.cache.getImage('clouds').height,
            'clouds'
        );

        var title = this.game.add.text(300, 50, 'EL JINETE', {
            font: "32px Press Start 2P",
            fill: "#000000"
        });
        title.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var instructions = this.game.add.text(150, 300, 'Tap SPACEBAR or TAP to JUMP. \n\nTo start the game, use the same function.', {
            font: "14px Press Start 2P",
            align: "center",
            fill: "#000000"
        });
        instructions.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var credits = this.game.add.text(30, 500, "Credits:\nDesigns: José Daniel 'Mansuper' Vélez\nProgramming: Miguel Vacas\nMusic: 'El Jinete' by Jose Alfredo Jimenez", {
            font: "10px Press Start 2P",
            align: "left",
            fill: "#000000"
        });
        credits.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var hs = this.game.add.text(600, 20, "High Score: " + highscore, {
            font: "14px Press Start 2P",
            fill: "#000"
        });

        spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR
        );

        tabButton = game.input.keyboard.addKey(
            Phaser.Keyboard.TAB
        );

        if (!jinete.isPlaying || !jinete) {
            jinete = game.add.audio('jinete', 1, true);
            jinete.play();
        }

    },

    update: function() {
        this.clouds.tilePosition.x -= 0.50;

        if (this.game.input.activePointer.justPressed() || spaceKey.isDown === true) {
            this.game.state.start('main_b');
        }

        if (tabButton.isDown === true) {
            this.game.state.start('menu');
            // jinete.pause();
        }
    }

};

var mainState_b = {
    preload: function() {
        game.load.image('hero', 'assets/icarus-full.png');
        game.load.image('column', 'assets/col-full.png');
        game.load.image('columnBroken', 'assets/col-broken.png');
        game.load.image('columnUp', 'assets/col-full-upside.png');
        game.load.image('columnBrokenUp', 'assets/col-broken-upside.png');
        game.load.image('background', 'assets/cloud_final_noclouds.png');
        game.load.image('clouds', 'assets/clouds-alone.png');
        game.load.image('thunder_bg', 'assets/thunder-bg.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('point', 'assets/point.wav');
        game.load.audio('gameover', 'assets/gameover.wav');
        // game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },

    create: function() {
        game.add.image(0, 0, 'background');

        thunder = game.add.image(0, 0, 'thunder_bg');

        thunder.alpha = 0;

        this.clouds = this.game.add.tileSprite(0,
            this.game.height - 550,
            this.game.width,
            this.game.cache.getImage('clouds').height,
            'clouds'
        );

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.hero = game.add.sprite(100, 245, 'hero');

        game.physics.arcade.enable(this.hero);

        this.hero.body.gravity.y = 1000;

        spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR
        );

        tap = game.input.onDown.add(this.jump, this);

        spaceKey.onDown.add(this.jump, this);

        this.columns = game.add.group();

        this.columnsUp = game.add.group();

        this.columnsBroken = game.add.group();

        this.columnsBrokenUp = game.add.group();

        this.allColumns = [this.columns, this.columnsUp, this.columnsBroken, this.columnsBrokenUp];

        this.column_timer = game.time.events.loop(2250, this.addRowOfCol, this);

        // this.thunder_timer = game.time.events.loop(1000, this.thunder_strike, this);

        this.score = 0;

        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Press Start 2P",
            fill: "#000"
        });

        this.hero.anchor.setTo(-0.2, 0.5);

        this.jumpSound = game.add.audio('jump');

        this.pointSound = game.add.audio('point');

        this.pointSound.volume = 0.1;

        this.gameoverSound = game.add.audio('gameover');

        this.gameoverSound.volume = 0.1;

        thunder.visible = true;

        // console.log(thunder);

    },

    update: function() {


        this.clouds.tilePosition.x -= 0.50;

        if (this.hero.y < 0 || this.hero.y > 600) {
            this.restartGame();
        }

        game.physics.arcade.overlap(
            this.hero, this.allColumns, this.hitCol, null, this
        );

        if (this.hero.angle < 20) {
            this.hero.angle += 1;
        }

        if (this.columnsUp.getBounds().x <= -49 && this.columnsUp.getBounds().x >= -50 || this.columns.getBounds().x <= -49 && this.columns.getBounds().x >= -50) {
            this.score += 1;
            this.labelScore.text = this.score;
            if (this.score > highscore) {
                highscore = this.score;
            }
            this.pointSound.play();
        } else if (this.columnsBrokenUp.getBounds().x >= -100 && this.columnsBrokenUp.getBounds().x <= -99 || this.columnsBroken.getBounds().x >= -100 && this.columnsBroken.getBounds().x <= -99) {
            this.score += 1;
            this.labelScore.text = this.score;
            if (this.score > highscore) {
                highscore = this.score;
            }
            this.pointSound.play();
        }

        if(this.score >= 5){
          game.add.tween(thunder).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
          this.labelScore.fill = "#ffffff";
        }


    },

    jump: function() {
        this.hero.body.velocity.y = -350;
        game.add.tween(this.hero).to({
            angle: -20
        }, 100).start();
        if (this.hero.alive === false) {
            return;
        }
        this.jumpSound.volume = 0.1;
        this.jumpSound.play();
    },

    twilight: function(){
      thunder.alpha += 0.1;
    },

    restartGame: function() {
        game.state.start('menu_b');
    },

    addOneCol: function(x, y) {
        var column = game.add.sprite(x, y, 'column');

        this.columns.add(column);

        game.physics.arcade.enable(column);

        column.body.velocity.x = -200;

        column.checkWorldBounds = true;
        column.outOfBoundsKill = true;
    },

    addOneColUpside: function(x, y) {
        var columnUp = game.add.sprite(x, y, 'columnUp');

        this.columnsUp.add(columnUp);

        game.physics.arcade.enable(columnUp);

        columnUp.body.velocity.x = -200;

        columnUp.checkWorldBounds = true;
        columnUp.outOfBoundsKill = true;


    },

    addOneColBroken: function(x, y) {
        var columnBroken = game.add.sprite(x, y, 'columnBroken');

        this.columnsBroken.add(columnBroken);

        game.physics.arcade.enable(columnBroken);

        columnBroken.body.velocity.x = -400;

        columnBroken.checkWorldBounds = true;
        columnBroken.outOfBoundsKill = true;
    },

    addOneColBrokenUpside: function(x, y) {
        var columnBrokenUp = game.add.sprite(x, y, 'columnBrokenUp');

        this.columnsBrokenUp.add(columnBrokenUp);

        game.physics.arcade.enable(columnBrokenUp);

        columnBrokenUp.body.velocity.x = -400;

        columnBrokenUp.checkWorldBounds = true;
        columnBrokenUp.outOfBoundsKill = true;
    },

    addRowOfCol: function() {
        var hole = Math.floor(Math.random() * 300) + 1;
        var realHole = Math.random();

        // Rightside up columns
        for (var i = 1; i < 2; i++) {
            if (i != hole && i != hole + 300) {
                var otherside = realHole * -350;
                var othersideBroken = realHole * -500;
                if (Math.ceil(Math.random() * 3) == 3) {
                    this.addOneColBroken(800, i * (othersideBroken + 650));
                    this.addOneColBrokenUpside(800, i * (othersideBroken));
                } else {
                    this.addOneCol(600, i * (otherside + 650));
                    this.addOneColUpside(600, i * (otherside));
                }
            }
        }
    },

    hitCol: function() {
        if (this.hero.alive === false) {
            return;
        }

        this.hero.alive = false;

        this.gameoverSound.play();

        game.time.events.remove(this.column_timer);

        this.columns.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsUp.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsBroken.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsBrokenUp.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        spaceKey = game.input.keyboard.removeKey(
            Phaser.Keyboard.SPACEBAR
        );

        tap = game.input.onDown.remove(this.jump, this);

    },


};

game.state.add('main_b', mainState_b);

game.state.add('menu_b', mainMenu_b);




//
//
//
//
//
// CHAT VERSION

var mainMenu_chat = {

    preload: function() {
        game.load.image('background', 'assets/cloud_final_noclouds.png');
        game.load.image('clouds', 'assets/clouds-alone.png');
        // game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },
    create: function() {
        game.add.image(0, 0, 'background');

        this.clouds = this.game.add.tileSprite(0,
            this.game.height - 550,
            this.game.width,
            this.game.cache.getImage('clouds').height,
            'clouds'
        );

        var title = this.game.add.text(350, 50, 'VICARUS', {
            font: "32px Press Start 2P",
            fill: "#000000"
        });
        title.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var instructions = this.game.add.text(150, 300, 'Tap SPACEBAR or TAP to JUMP. \n\nTo start the game, use the same function.', {
            font: "14px Press Start 2P",
            align: "center",
            fill: "#000000"
        });
        instructions.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var credits = this.game.add.text(30, 500, "Credits:\nDesigns: José Daniel 'Mansuper' Vélez\nProgramming: Miguel Vacas", {
            font: "10px Press Start 2P",
            align: "left",
            fill: "#000000"
        });
        credits.setShadow(-3, 3, 'rgba(0,0,0,0.2)', 0);

        var hs = this.game.add.text(600, 20, "High Score: " + highscore, {
            font: "14px Press Start 2P",
            fill: "#000"
        });

        spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR
        );

        tabButton = game.input.keyboard.addKey(
            Phaser.Keyboard.TAB
        );

        chatButton = game.input.keyboard.addKey(
            Phaser.Keyboard.C
        );

        jinete.stop();

    },

    update: function() {
        this.clouds.tilePosition.x -= 0.50;

        if (this.game.input.activePointer.justPressed() || spaceKey.isDown === true) {
            this.game.state.start('main_chat');
        }
        if (tabButton.isDown === true) {
            this.game.state.start('menu_b');
        }
        if (chatButton.isDown === true) {
            this.game.state.start('menu');
        }
    },

};

var wine;

var mainState_chat = {
    preload: function() {
        game.load.image('hero', 'assets/vicarus.png');
        game.load.image('column', 'assets/col-full.png');
        game.load.image('columnBroken', 'assets/col-broken.png');
        game.load.image('columnUp', 'assets/col-full-upside.png');
        game.load.image('columnBrokenUp', 'assets/col-broken-upside.png');
        game.load.image('background', 'assets/cloud_final_noclouds.png');
        game.load.image('clouds', 'assets/clouds-alone.png');
        game.load.image('thunder_bg', 'assets/thunder-bg.png');
        game.load.image('wine-b', 'assets/8-bit-wine.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('point', 'assets/point.wav');
        game.load.audio('gameover', 'assets/gameover.wav');
        // game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },

    create: function() {
        game.add.image(0, 0, 'background');

        // thunder = game.add.image(0, 0, 'thunder_bg');

        // thunder.visible = false;

        this.clouds = this.game.add.tileSprite(0,
            this.game.height - 550,
            this.game.width,
            this.game.cache.getImage('clouds').height,
            'clouds'
        );

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.hero = game.add.sprite(100, 245, 'hero');

        game.physics.arcade.enable(this.hero);

        this.hero.body.gravity.y = 1000;

        spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR
        );

        tap = game.input.onDown.add(this.jump, this);

        spaceKey.onDown.add(this.jump, this);

        this.columns = game.add.group();

        this.columnsUp = game.add.group();

        this.columnsBroken = game.add.group();

        this.columnsBrokenUp = game.add.group();

        this.wine = game.add.group();

        this.allItems = [this.columns, this.columnsUp, this.columnsBroken, this.columnsBrokenUp, this.wine];

        this.column_timer = game.time.events.loop(2250, this.addRowOfCol, this);

        this.wine_timer = game.time.events.loop(3050, this.addWine, this);

        // this.thunder_timer = game.time.events.loop(1000, this.thunder_strike, this);

        this.score = 0;

        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Press Start 2P",
            fill: "#000"
        });

        this.hero.anchor.setTo(-0.2, 0.5);

        this.jumpSound = game.add.audio('jump');

        this.pointSound = game.add.audio('point');

        this.gameoverSound = game.add.audio('gameover');

        // console.log(thunder);
    },

    update: function() {
        // game.time.events.add(this.thunder_timer);

        this.clouds.tilePosition.x -= 0.50;

        if (this.hero.y < 0 || this.hero.y > 600) {
            this.restartGame();
        }
        game.physics.arcade.overlap(
            this.hero, this.allItems, this.hitCol, null, this
        );

        if (this.hero.angle < 20) {
            this.hero.angle += 1;
        }

        if (this.columnsUp.getBounds().x <= -49 && this.columnsUp.getBounds().x >= -50 || this.columns.getBounds().x <= -49 && this.columns.getBounds().x >= -50) {
            this.score += 1;
            this.labelScore.text = this.score;
            if (this.score > highscore) {
                highscore = this.score;
            }
            this.pointSound.play();
        } else if (this.columnsBrokenUp.getBounds().x >= -100 && this.columnsBrokenUp.getBounds().x <= -99 || this.columnsBroken.getBounds().x >= -100 && this.columnsBroken.getBounds().x <= -99) {
            this.score += 1;
            this.labelScore.text = this.score;
            if (this.score > highscore) {
                highscore = this.score;
            }
            this.pointSound.play();
        }

        // this.wine.angle++;

        console.log(this.wine.angle);

    },

    jump: function() {
        this.hero.body.velocity.y = -350;
        game.add.tween(this.hero).to({
            angle: -20
        }, 100).start();
        if (this.hero.alive === false) {
            return;
        }

        this.jumpSound.play();
    },

    restartGame: function() {
        game.state.start('menu_chat');
    },

    addWine: function() {
        var y = Math.floor(Math.random() * 600);
        var wine = game.add.sprite(800, y, 'wine-b');

        // wine.anchor.setTo(0.5, 0.5);

        this.wine.add(wine);

        // game.add.tween(wine).to({
        //   anchor: 0.5,0.5
        // }, 10).start();

        // console.log(this.wine.angle);

        game.physics.arcade.enable(this.wine);

        wine.body.velocity.x = -300;

        wine.checkWorldBounds = true;
        wine.outOfBoundsKill = true;
        // wineRotate(this.wine);

    },

    // wineRotate: function(sprite){
    //   sprite.angle++;
    // },

    addOneCol: function(x, y) {
        var column = game.add.sprite(x, y, 'column');

        this.columns.add(column);

        game.physics.arcade.enable(column);

        column.body.velocity.x = -200;

        column.checkWorldBounds = true;
        column.outOfBoundsKill = true;
    },

    addOneColUpside: function(x, y) {
        var columnUp = game.add.sprite(x, y, 'columnUp');

        this.columnsUp.add(columnUp);

        game.physics.arcade.enable(columnUp);

        columnUp.body.velocity.x = -200;

        columnUp.checkWorldBounds = true;
        columnUp.outOfBoundsKill = true;


    },

    addOneColBroken: function(x, y) {
        var columnBroken = game.add.sprite(x, y, 'columnBroken');

        this.columnsBroken.add(columnBroken);

        game.physics.arcade.enable(columnBroken);

        columnBroken.body.velocity.x = -400;

        columnBroken.checkWorldBounds = true;
        columnBroken.outOfBoundsKill = true;
    },

    addOneColBrokenUpside: function(x, y) {
        var columnBrokenUp = game.add.sprite(x, y, 'columnBrokenUp');

        this.columnsBrokenUp.add(columnBrokenUp);

        game.physics.arcade.enable(columnBrokenUp);

        columnBrokenUp.body.velocity.x = -400;

        columnBrokenUp.checkWorldBounds = true;
        columnBrokenUp.outOfBoundsKill = true;
    },

    addRowOfCol: function() {
        var hole = Math.floor(Math.random() * 300) + 1;
        var realHole = Math.random();

        // Rightside up columns
        for (var i = 1; i < 2; i++) {
            if (i != hole && i != hole + 300) {
                var otherside = realHole * -350;
                var othersideBroken = realHole * -500;
                if (Math.ceil(Math.random() * 3) == 3) {
                    this.addOneColBroken(800, i * (othersideBroken + 650));
                    this.addOneColBrokenUpside(800, i * (othersideBroken));
                } else {
                    this.addOneCol(600, i * (otherside + 650));
                    this.addOneColUpside(600, i * (otherside));
                }
            }
        }
    },

    hitCol: function() {
        if (this.hero.alive === false) {
            return;
        }

        this.hero.alive = false;

        this.gameoverSound.play();

        game.time.events.remove(this.column_timer);

        this.columns.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsUp.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsBroken.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        this.columnsBrokenUp.forEach(function(col) {
            col.body.velocity.x = 0;
        }, this);

        spaceKey = game.input.keyboard.removeKey(
            Phaser.Keyboard.SPACEBAR
        );

        tap = game.input.onDown.remove(this.jump, this);

    },


};

// var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('main_chat', mainState_chat);

game.state.add('menu_chat', mainMenu_chat);