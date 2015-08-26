var glbPlaceManager = null;
var glbTimerManager = null;
var glbBonusManager = null;
var glbCompleteGame = false;
var glbCompleteMessage = false;
var glbSoundEffects = true;
game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // load a level
        this.exit = false;
        this.restart = true;
        me.levelDirector.loadLevel("index");
        game.data.score = 0;

        var placeManager = new game.PlaceManager(0, 0);
        glbPlaceManager = placeManager;

        // add count down timer
        this.TimerHUD = new game.HUD.TimerManager();
        glbTimerManager = this.TimerHUD;
        me.game.world.addChild(this.TimerHUD);

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        this.mobile_ui = null;
//        if (me.device.isMobile) {
            this.mobile_ui = new game.UI();
            me.game.add(this.mobile_ui, Infinity);
//        }

    },
    /**
     *  action to perform on state change
     */
    onDestroyEvent: function() {
//        if (this.mobile_ui) {
            me.game.remove(this.mobile_ui, true);
            this.mobile_ui = null;
//        }
    }
});