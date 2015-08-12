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


    },
    /**
     *  action to perform on state change
     */
    onDestroyEvent: function() {
    }
});