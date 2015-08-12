/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        this.addChild(new game.HUD.ScoreItem(0, "left", 600, 10));
    }
});


/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /** 
     * constructor
     */
    init: function(score, align, x, y) {
        // call the super constructor 
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create a font
//        this.font = new me.BitmapFont("atascii", {x: 24});
//        this.font.alignText = "bottom";
//        this.font.set(align, 1.2);
        this.font = new me.Font("Arial", 32, "#FFFFFF");
        this.font.textAlign = "center";
        // ref to the score variable
        game.data.score = score;
        this.pos.x = x;
        this.pos.y = y;
        // make sure we use screen coordinates
        this.floating = true;
    },
    /**
     * update function
     */
    update: function() {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
//        if (this.score !== game.data.score) {
//            game.data.score  = this.score;
//            return true;
//        }
//        return false;
    },
    /**
     * draw the score
     */
    draw: function(context) {
        this.font.draw(context, game.data.score, this.pos.x, this.pos.y);
    }
});
game.HUD.TimerManager = me.Entity.extend(
        {
            init: function()
            {
                // call the super constructor
                var settings = {};
                settings.width = 10;
                settings.height = 10;
                // call the super constructor
                this.complete = false;
                this._super(me.Container, 'init');
                // persistent across level change
                this.isPersistent = true;
                

                // make sure our object is always draw first
                this.z = Infinity;
                this.floating = true;
                // 5 minutes in milliseconds, count down to true
                this.timer = new game.HUD.TimerItem(1 * 60 * 1000, false, 50, 10, "timer");
                me.game.world.addChild(this.timer);
            },
            update: function()
            {
                if (glbCompleteGame == false) {
                    this.timer.update();
                }
                else {
                    // Coutdown timer
                    this.timer.update(1);

                    // Dành cho trường hợp có tính điểm Bonus
                    if (this.timer.time_remain >= 0) {
                        if (glbBonusManager == null)
                        {
                            // Bonus HUD
                            this.timer.time_remain += 2000;
                            glbBonusManager = new game.HUD.BonusManager(this.timer.time_remain);
                            me.game.world.addChild(glbBonusManager);
                        }

                        // Bonus Show
                        glbBonusManager.bonus.update();

                    }
                }
                if (glbCompleteGame == true && this.timer.time_remain <= 0 && glbCompleteMessage == false) {
//                    glbPlaceManager.glbCompleteGame();
                    glbCompleteMessage = true;
                    me.state.change(me.state.GAME_OVER);
                }

            }
        });
game.HUD.TimerItem = me.Renderable.extend({
    init: function(time, countdown, x, y, name) {
        // call the constructor
        this._super(me.Renderable, 'init', [x, y, 10, 10])
        // create a font
        this.font = new me.Font("Arial", 32, "#FFFFFF");
        this.font.textAlign = "center";
        // give a name
        this.name = name;
        this.pos.x = x;
        this.pos.y = y;
        this.time = time;
        this.time_remain = time;
        this.countdown = countdown;
        this.start_time = me.timer.getTime();
        this.floating = false;
    },
    draw: function(context)
    {
        this.font.draw(context, this.value, this.pos.x, this.pos.y);
    },
    convert: function(time_remain)
    {
        var x = parseInt(time_remain / 1000);
        var seconds = x % 60;
        x /= 60;
        var minutes = x % 60;

        var seconds_num = minutes * 60 + seconds;
        if (seconds_num > 0) {
            return Math.floor(minutes) + ":" + Math.floor(seconds);
        }
        else {
            return "0:0";
        }
    },
    update: function(dt)
    {
        if (dt > 0) {// Bonus điểm
            this.time_remain -= 1000;
            var time_remain = this.time_remain;
        }
        else {// Mặc định
            var time_remain = this.time - (me.timer.getTime()) + this.start_time;
            this.time_remain = time_remain;
        }
        if (time_remain <= 0) {
            glbCompleteGame = true;
        }
        else {
            this.value = this.convert(time_remain);
        }
        return true;
    }
});
game.Exit = me.Entity.extend({
    "onCollision" : function (res, obj) {
        glbCompleteGame = true;
        return true;
//        me.state.change(me.state.GAME_OVER);
    }
});
/* BONUS */
game.HUD.BonusManager = me.Entity.extend(
        {
            init: function(time_remain)
            {
                // call the super constructor
                var settings = {};
                settings.width = 10;
                settings.height = 10;
                // call the super constructor
                this._super(me.Entity, 'init', [0, 0, settings]);
                this.complete = true;
                // 5 minutes in milliseconds, count down to true
//                console.log(time_remain);
                this.bonus = new game.HUD.BonusItem(time_remain, true, 50, 40, "bonus");
                me.game.world.addChild(this.bonus);
            },
            update: function()
            {
//                 this.bonus.time_remain -= 1000;//(me.timer.getTime()) + this.start_time;
                if (this.bonus.time_remain >= 0) {
                    this.bonus.update();
                }
                return true;
            }
        });

game.HUD.BonusItem = me.Renderable.extend({
    init: function(time_remain, countdown, x, y, name) {
        // call the constructor
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        this.font = new me.Font("Arial", 32, "#FFFFFF");
        this.font.textAlign = "center";
        // give a name
        this.pos.x = x;
        this.pos.y = y;
        this.bonus_mark = 0;
        this.time_remain = time_remain;
        this.start_time = me.timer.getTime();
        this.floating = false;
    },
    draw: function(context)
    {
        this.font.draw(context, this.value, this.pos.x, this.pos.y);
    },
    convert: function(time_remain)
    {
        var x = parseInt(time_remain / 1000);
        var seconds = x % 60;
        x /= 60;
        var minutes = x % 60;
        var seconds_num = minutes * 60 + seconds;
        if (seconds > 0) {
            game.data.score += 3;
            this.bonus_mark += 3;
            return "+" + this.bonus_mark;
        }
        else {
            return "";
        }
    },
    update: function()
    {
        this.time_remain -= 1000;
        this.value = this.convert(this.time_remain);
        return true;
    }
});
var btnPlayagain = me.GUI_Object.extend({
    init: function(x, y) {

        var settings = {};
        settings.image = "btnplayagain";
        settings.spritewidth = 119;
        settings.spriteheight = 34;
        this._super(me.GUI_Object, 'init', [x, y, settings]);

        this.mouseover = false;
    },
    /**
     * function callback for the pointermove event
     * @ignore
     */
    moved: function(event) {
        if (
                event.gameX >= this.pos.x &&
                event.gameX <= this.pos.x + this.width &&
                event.gameY >= this.pos.y &&
                event.gameY <= this.pos.y + this.height
                )
        {
            this.mouseover = true;
            return this.mouseover(event);
        }
        else {
            this.mouseover = false;
        }
    },
    mouseover: function(event) {
        return false;
    },
    onClick: function(event) {
        location.href = _base_url + 'index.html';
    }

});