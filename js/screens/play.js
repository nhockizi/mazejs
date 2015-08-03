game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // load a level
        me.levelDirector.loadLevel("index");
        game.data.score = 0;

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
//        me.levelDirector.loadLevel("isometric");
    },

    /**
     *  action to perform on state change
     */
    onDestroyEvent: function() {
        me.game.world.removeChild(this.HUD);
    }
});
