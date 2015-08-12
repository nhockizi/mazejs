game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // disable gravity
        this.body.gravity = 0;

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4, 0.4);

        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");

        // the main player spritesheet 
        var texture = new me.video.renderer.Texture({framewidth: 32, frameheight: 32}, me.loader.getImage("Blank_Sprite_Sheet_4_2_by_KnightYamato"));

        // create a new animationSheet object 
        this.renderable = texture.createAnimationFromName([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
        // define an additional basic walking animation
        this.renderable.addAnimation("walk_left", [12, 13, 14, 15]);
        this.renderable.addAnimation("walk_right", [24, 25, 26, 27]);
        this.renderable.addAnimation("walk_up", [36, 37, 38, 39, 40]);
        this.renderable.addAnimation("walk_down", [0, 1, 2, 3, 4]);
    },
    /* -----
     
     update the player pos
     
     ------            */
    update: function(dt) {
        if (me.input.isKeyPressed('left')) {
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            if (!this.renderable.isCurrentAnimation("walk_left")) {
                this.renderable.setCurrentAnimation("walk_left");
            }
        } else if (me.input.isKeyPressed('right')) {
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            if (!this.renderable.isCurrentAnimation("walk_right")) {
                this.renderable.setCurrentAnimation("walk_right");
            }
        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed('up')) {
            // update the entity velocity
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            if (!this.renderable.isCurrentAnimation("walk_up")) {
                this.renderable.setCurrentAnimation("walk_up");
            }
        } else if (me.input.isKeyPressed('down')) {
            // update the entity velocity
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            if (!this.renderable.isCurrentAnimation("walk_down")) {
                this.renderable.setCurrentAnimation("walk_down");
            }
        } else {
            this.body.vel.y = 0;
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x != 0 || this.body.vel.y != 0) {
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
    },
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function(response, other) {
        // Make all other objects solid
        return true;
    }
});
/**
 * Player Entity
 */
game.CoinEntity = me.CollectableEntity.extend(
        {
            init: function(x, y, settings)
            {
                // call the parent constructor
                this._super(me.CollectableEntity, 'init', [x, y, settings]);
            },
            /**
             * colision handler
             */
            onCollision: function(response, other) {

                // give some score
                game.data.score += 250;

                //avoid further collision and delete it
                this.body.setCollisionMask(me.collision.types.NO_OBJECT);

                me.game.world.removeChild(this);

                return false;
            }
        });
game.SpecialEntity = me.CollectableEntity.extend(
        {
            init: function(x, y, settings)
            {
                // call the parent constructor
                this._super(me.CollectableEntity, 'init', [x, y, settings]);
                var animationSheet = new me.AnimationSheet(100, 100, {
                    image: "spinning_coin_gold",
                    framewidth: 32,
                    frameheight: 32
                  });
            },
            /**
             * colision handler
             */
            onCollision: function(response, other) {

                // give some score
//                game.data.score += 250;

                //avoid further collision and delete it
                this.body.setCollisionMask(me.collision.types.NO_OBJECT);

                me.game.world.removeChild(this);

                return false;
            }
        });
game.PlaceManager = me.Entity.extend(
        {
            init: function()
            {
                this.places = [];

                this.timer = 0;
                var settings = {};
                settings.width = 10;
                settings.height = 10;
                // call the super constructor
                this._super(me.Entity, 'init', [0, 0, settings]);


                this.timer = 0;

                // end animation tween
                this.endTween = null;


            },
            /**
             * End Game
             */
            endAnimation: function() {
                me.game.viewport.fadeOut("#000", 100);
                var currentPos = this.pos.y;
                this.endTween = new me.Tween(this.pos);
                this.endTween.easing(me.Tween.Easing.Exponential.InOut);
                //this.flyTween.stop();
                this.angle = 1.5;
                this.alpha = 0;
                var finalPos = me.video.renderer.getHeight() - this.width / 2 - 96;
                this.endTween
                        //.to({y: currentPos}, 1000)
                        //.to({y: finalPos}, 1000)
                        .onComplete(function() {
                            me.state.change(me.state.GAME_OVER);
                            //alert("HERE2");
                        });
                this.endTween.start();
            },
            /**
             * Complete the game
             */
            glbCompleteGame: function() {
                for (var i = 0; i < glbPlaceManager.places.length; i++) {
                    var _place = glbPlaceManager.places[i];
                    _place.isClickable = false;
                }
                // Kết thúc Game
                glbCompleteGame = true;

                // Kết thúc Game
                this.endAnimation();

//    	window.setTimeout(alert("HOÀN TẤT ("  + game.data.score + " điểm)"), 5000);

                //;
            }
        });