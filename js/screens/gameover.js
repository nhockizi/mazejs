game.GameOverScreen = me.ScreenObject.extend({
    init: function() {
        this.savedData = null;
        this.handler = null;
    },
    onResetEvent: function() {
        var gImageBoard = me.loader.getImage('gameoverbg');
        me.game.world.addChild(new me.Sprite(
            me.game.viewport.width / 2 - gImageBoard.width / 2,
            me.game.viewport.height / 2 - gImageBoard.height / 2,
            {image : gImageBoard}
        ));
        //me.game.world.addChild(new BackgroundLayer('bg', 1));

        // PlayAgain button
        this.btnPlayagain = new btnPlayagain(me.game.viewport.width / 2 - 60, me.game.viewport.height / 2);
        me.game.world.addChild(this.btnPlayagain, 12);
        
        this.dialog = new (me.Renderable.extend({
            // constructor
            init: function() {
                // size does not matter, it's just to avoid having a
                // renderable
                this._super(me.Renderable, 'init', [0, 0, 10, 10]);
                
                
                //this.font.textAlign = "center";
                this.notice_1 = 'Congratulations!';
                this.font_notice_1 = new me.Font("Arial", 30, "#2ca606", "center");
                this.font_notice_1.bold();
                
                this.notice_2 = 'You have completed a great game.';
                this.font_notice_2 = new me.Font("Arial", 29, "#2ca606", "center");
                
                this.notice_3 = 'YOUR SCORES:';
                this.font_notice_3 = new me.Font("Arial", 30, "#d09b2c", "right");
                
                
                this.score = game.data.score.toString();
                this.font_score = new me.Font("Arial", 30, "#EE0000", "left");
            },
            
            /**
             * draw the score
             */
             draw : function (context) {
                 //var stepsText = this.font.measureText(context, '1');
                 
                 var _top_popup =  me.game.viewport.height/2 - 150;

                 // Notice 1
                 this.font_notice_1.draw(
                     context,
                     this.notice_1,
                     me.game.viewport.width/2,
                     _top_popup + 0
                 );
                 
                 // Notice 2
                 this.font_notice_2.draw(
                     context,
                     this.notice_2,
                     me.game.viewport.width/2,
                     _top_popup + 40
                 );
                 
                 // Notice 2
                 this.font_notice_3.draw(
                     context,
                     this.notice_3,
                     me.game.viewport.width/2 + 80,
                     _top_popup + 80
                 );
                 
                 // Score
            	 this.font_score.draw(context, this.score, 
            			 me.game.viewport.width/2 + 85,
            			 _top_popup + 80
            	 );
            	 
            	 // Opacity
            	 //me.Renderable.alpha = 0.5;
            	 
            	 
             }            
        }));
        me.game.world.addChild(this.dialog, 12);
        
    },
    onDestroyEvent: function() {
        // unregister the event
        //me.event.unsubscribe(this.handler);
        /*
         me.input.unbindKey(me.input.KEY.ENTER);
         me.input.unbindKey(me.input.KEY.SPACE);
         me.input.unbindPointer(me.input.mouse.LEFT);
         this.ground1 = null;
         this.ground2 = null;
         this.font = null;
         me.audio.stop("theme");
         */
    }
});
