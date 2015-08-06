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
        this.addChild(new game.HUD.ScoreItem("score", "left", 650, 10));

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
        this.font = new me.BitmapFont("atascii", {x: 24});
        this.font.alignText = "bottom";
        this.font.set(align, 1.2);
        // ref to the score variable
        this.scoreRef = score;

        // make sure we use screen coordinates
        this.floating = true;
    },
    /**
     * draw the score
     */
    draw: function(context) {
        this.font.draw(context, game.data[this.scoreRef], this.pos.x, this.pos.y);
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
                // 5 minutes in milliseconds, count down to true
                this.timer = new game.HUD.TimerItem(2 * 60 * 1000, true, 200, 10, "timer");
		me.game.world.addChild(this.timer);
            },
            update: function()
            {
                
            }
        });
game.HUD.TimerItem = me.Renderable.extend({
    init: function(time, countdown, x, y, name, align) {
        // call the constructor
        this._super(me.Renderable, 'init', [x, y, 10, 10])
        // create a font
        this.font = new me.Font("Arial", 32, "#EE0000");
        this.font.textAlign = "center";
        // give a name
        this.name = name;
        this.pos.x = x;
        this.pos.y = y;
        this.time = time;
        this.time_remain = time;
        this.countdown = countdown;
        this.start_time = me.timer.getTime();
    },
    draw: function(ctx)
	{
        var context = ctx.getContext();
        this.font.draw(context, this.value, this.pos.x, this.pos.y);
	},
    convert: function(time_remain)
    {
        var x = parseInt(time_remain / 1000);
        var seconds = x % 60;
        x /= 60;
        var minutes = x % 60;

        var seconds_num = minutes * 60 + seconds;
        console.log(seconds_num);
        if (seconds_num > 0) {
            var aa = Math.floor(minutes) + ":" + Math.floor(seconds);
            console.log(aa);
            return Math.floor(minutes) + ":" + Math.floor(seconds);
        }
        else {
            return "0:0";
        }
    },
    update: function(dt)
    {
        
    }


});