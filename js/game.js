/**
 * main
 */
var game = {
    data: {
        // score information
        score: 0,
        item: 0,
    },
    /**
     *
     * Initialize the application
     */
    onload: function() {

        // init the video
        if (!me.video.init(640, 640, {wrapper: "screen", scale: 'auto'})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Set some default debug flags
        me.debug.renderHitBox = true;

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function() {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // set all ressources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set all ressources to be loaded
        me.loader.preload(game.resources);

        // load everything & display a loading screen
//        me.state.change(me.state.LOADING);
    },
    /**
     * callback when everything is loaded
     */
    loaded: function() {

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.BONUS_QUESTION, new game.BonusQuestionScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());
        
        
        
        me.pool.register("mainPlayer", game.PlayerEntity);
//        me.pool.register("CoinEntity", game.CoinEntity);
//        me.pool.register("SpecialEntity", game.SpecialEntity);
            
        me.pool.register("exit", game.Exit);
        me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {

            // change global volume setting
            if (keyCode === me.input.KEY.PLUS) {
                // increase volume
                me.audio.setVolume(me.audio.getVolume() + 0.1);
            } else if (keyCode === me.input.KEY.MINUS) {
                // decrease volume
                me.audio.setVolume(me.audio.getVolume() - 0.1);
            }
            // toggle fullscreen on/off
            if (keyCode === me.input.KEY.F) {
                if (!me.device.isFullscreen) {
                    me.device.requestFullscreen();
                } else {
                    me.device.exitFullscreen();
                }
            }
        });
        // switch to PLAY state
        me.state.change(me.state.PLAY);
    }
};
