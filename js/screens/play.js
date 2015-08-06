game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // load a level

        game.data.score = 0;

        // add count down timer
        this.TimerHUD = new game.HUD.TimerManager();
        me.game.world.addChild(this.TimerHUD);

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        
        me.levelDirector.loadLevel("index");
    },
    /**
     *  action to perform on state change
     */
    onDestroyEvent: function() {
    }
});