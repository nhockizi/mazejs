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
//                game.data.score += 250;

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

                var _place_first_top = 400;
                var _place_first_left = 40;

                var _place_width = 175;
                var _place_height = 120;

                // 3 enemy items 
                var list_sprite_enemy = [
                    ["carrots", 160, 352, -25],
                    ["carrots", 225, 160, -25],
                    ["carrots", 416, 224, -25]
                ];
                // 7 Coin items
                var list_sprite_coin = [
                    ["spinning_coin_gold", 95, 32, 50],
                    ["spinning_coin_gold", 160, 160, 50],
                    ["spinning_coin_gold", 160, 225, 50],
                    ["spinning_coin_gold", 95, 480, 50],
                    ["spinning_coin_gold", 288, 479, 50],
                    ["spinning_coin_gold", 415, 480, 50],
                    ["spinning_coin_gold", 480, 480, 50],
                    ["spinning_coin_gold", 351, 96, 50],
                    ["spinning_coin_gold", 480, 352, 50],
                    ["spinning_coin_gold", 480, 288, 50],
                    ["spinning_coin_gold", 544, 479, 50],
                    ["spinning_coin_gold", 544, 160, 50],
                    ["spinning_coin_gold", 478, 32, 50],
                    ["spinning_coin_gold", 512, 95, 50]
                ];
//                var list_sprite_coin_2 = list_sprite_coin_1;
//                var list_sprites_coin_tmp = list_sprite_coin_1.concat(list_sprite_coin_2);
                var list_sprites_coin_shuffle = this.shuffle(list_sprite_coin);

                // 9 Coin items
                var list_sprites_coin = [];
                for (var j = 0; j < 9; j++) {
                    list_sprites_coin[j] = list_sprites_coin_shuffle[j];
                }

                // 3 enemy items + 9 Coin items
                var list_sprites_tmp = list_sprite_enemy.concat(list_sprites_coin);
                var list_sprites = this.shuffle(list_sprites_tmp);
                var _width = 32;
                var _height = 32;
                var data_sprite_enemy = this.shuffle(list_sprite_enemy);
                var data_sprite_coin = this.shuffle(list_sprite_coin);
//                console.log(data_sprite_enemy);
                // add the first row of places
                for (var i = 0; i < 2; i++) {
                    var _item_sprite = data_sprite_enemy[i];
                    var _sprite = _item_sprite[0];
                    var _x = _item_sprite[1];
                    var _y = _item_sprite[2];
                    var _mark = _item_sprite[3];
                    this.places[i] = new game.PlaceEntity(_x, _y, _sprite, _width, _height, _mark);
                    me.game.world.addChild(this.places[i], 4);
                }
                // add the 2nd row of places
                
                for (var i = 2; i < 8; i++) {
                    var _item_sprite = data_sprite_coin[i];
                    var _sprite = _item_sprite[0];
                    var _x = _item_sprite[1];
                    var _y = _item_sprite[2];
                    var _mark = _item_sprite[3];
                    this.places[i] = new game.PlaceEntity(_x, _y, _sprite, _width, _height, _mark);
                    me.game.world.addChild(this.places[i], 8);
                }
//                // add the 3rd row of places
//                for (var i = 5; i < 9; i++) {
//                    var _item_sprite = data_sprite_coin[i];
//                    var _sprite = _item_sprite[0];
//                    var _x = _item_sprite[1];
//                    var _y = _item_sprite[2];
//                    var _mark = _item_sprite[3];
//                    this.places[i] = new game.PlaceEntity(_x, _y, _sprite, _width, _height, _mark);
//                    me.game.world.addChild(this.places[i], 12);
//                }
                this.timer = 0;
            },
            /*
             * update function
             */
            update: function(dt)
            {

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
                        .onComplete(function() {
                            me.state.change(me.state.BONUS_QUESTION);
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

                //window.setTimeout(alert("HOÀN TẤT ("  + game.data.score + " điểm)"), 5000);

                //;
            },
            shuffle: function(array) {
                var counter = array.length, temp, index;

                // While there are elements in the array
                while (counter > 0) {
                    // Pick a random index
                    index = Math.floor(Math.random() * counter);

                    // Decrease counter by 1
                    counter--;

                    // And swap the last element with it
                    temp = array[counter];
                    array[counter] = array[index];
                    array[index] = temp;
                }

                return array;
            }

        });
game.PlaceEntity = me.Entity.extend(
        {
            //init:function (x, y, sprite, pwidth, pheight) {

            init: function(x, y, sprite, pwidth, pheight, pmark) {

                // call the parent constructor
                this._super(me.Entity, 'init', [x, y,
                    {
                        image: sprite,
                        width: 32,
                        height: 32
                    }]);
                this.isVisible = false;
                this.isOut = false;
                this.timer = 0;
                this.initialPos = this.pos.y;

                // Status Complete
                this.isComplete = false;

                // Image
                this.sprite = sprite;
                this.mark = pmark;

                // tween to display/hide the places
                this.displayTween = null;
                this.hideTween = null;

                // Variables
                this.alwaysUpdate = !0;
                this.status = "AIR";
                this.hand = null;

                //this.body.addShape(new me.Rect(0, 0, pwidth, pheight));
                this.body.addShape(new me.Rect(pwidth * 0.2, pheight * 0.2, pwidth * 0.6, pheight * 0.6));
                this.body.onCollision = this.onCollision.bind(this);

            },
            onCollision: function(a, c)
            {
                if(this.mark == 50){
                    game.data.item += 1;
                }
                game.data.score += this.mark;
                me.game.world.removeChild(this);
                this.body.setCollisionMask(me.collision.types.NO_OBJECT);
                this.status = "BIN_" + this.status;
            }
        }
);
game.UI = me.Renderable.extend({
    init : function () {
        this._super(me.Renderable, 'init', [35, 395, 50, 50]);
        this.isPersistent = true;
        this.floating = true;
        this.dpad = me.loader.getImage("ui-dpad");
        this.button = me.loader.getImage("ui-button");
//         Button areas
        var buttons = this.buttons = {
            // Directional pad
            "up"    : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(-20, 360),
                new me.Vector2d(300, 360)
            ),
            "down"  : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(300, 640),
                new me.Vector2d(-20, 640)
            ),
            "left"  : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(0, 660),
                new me.Vector2d(0, 340)
            ),
            "right" : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(280, 340),
                new me.Vector2d(280, 660)
            ),
            // Action buttons
//            "b"     : new me.Rect(new me.Vector2d(690, 460), 80, 80),
//            "a"     : new me.Rect(new me.Vector2d(810, 460), 80, 80)
            "b"     : new me.Rect(690, 460, 80, 80),
            "a"     : new me.Rect(810, 460, 80, 80)
        };

        // Set keys
        buttons.up.key      = me.input.KEY.UP;
        buttons.down.key    = me.input.KEY.DOWN;
        buttons.left.key    = me.input.KEY.LEFT;
        buttons.right.key   = me.input.KEY.RIGHT;
        buttons.b.key       = me.input.KEY.SHIFT;
        buttons.a.key       = me.input.KEY.SHIFT;

        // Set default button properties
        for (var name in buttons) {
            buttons[name].pressed = false;
            buttons[name].id = 0;
        }

        // Event handlers
        function mousemove(e) {
            // Iterate each button
            for (var name in buttons) {
                var button = buttons[name];

                // Check if button is pressed by this touch
                var pressed = button.containsPoint(e.gameX, e.gameY);

                if (pressed && !button.pressed) {
                    // Button down
                    button.pressed = true;
                    button.id = e.pointerId;
                    me.input.triggerKeyEvent(button.key, true);
                }
                else if ((button.id === e.pointerId) &&
                    !pressed && button.pressed) {
                    // Button up
                    button.pressed = false;
                    button.id = 0;
                    me.input.triggerKeyEvent(button.key, false);
                }
            }
        }

        function mouseup(e) {
            // Iterate each button
            for (var name in buttons) {
                var button = buttons[name];

                // Check if button is released by this touch
                var released = (button.id === e.pointerId);

                if (button.pressed && released) {
                    // Button up
                    button.pressed = false;
                    button.id = 0;
                    me.input.triggerKeyEvent(button.key, false);
                }
            }
        }

        me.input.registerPointerEvent("pointermove", this, mousemove, true);
        me.input.registerPointerEvent("pointerdown", this, mouseup, true);
    },

    "destroy" : function () {
        me.input.releasePointerEvent("pointermove", this);
        me.input.releasePointerEvent("pointerdown", this);
    },

    "draw" : function (context) {
        context.drawImage(this.dpad, 200, 420);
        if (me.debug.renderHitBox) {
            this.buttons.up.draw(context, "#00f");
            this.buttons.down.draw(context, "#0f0");
            this.buttons.left.draw(context, "#0ff");
            this.buttons.right.draw(context, "#f00");
//            this.buttons.b.draw(context, "#f0f");
//            this.buttons.a.draw(context, "#ff0");
        }
    }
});

game.Triangle = Object.extend({

    /**
     * Constructor
     * @name game.Triangle#init
     * @function
     * @param {me.Vector2d} a Point a
     * @param {me.Vector2d} b Point b
     * @param {me.Vector2d} c Point c
     */
    "init" : function (a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    },

    /**
     * Check if a point lies within the triangle
     * @name game.Triangle#containsPoint
     * @function
     * @param {me.Vector2d} p Point to check
     * @return {Boolean}
     * @see http://goo.gl/6sAFR
     */
    "containsPoint" : function (x, y) {
        function sign(u, v) {
            return (x - v.x) * (u.y - v.y) - (u.x - v.x) * (y - v.y);
        }

        return (
            sign(this.a, this.b) > 0 &&
            sign(this.b, this.c) > 0 &&
            sign(this.c, this.a) > 0
        );
    },

    "draw" : function (context, color) {
//        context.beginPath();
//        context.moveTo(this.a.x, this.a.y);
//        context.lineTo(this.b.x, this.b.y);
//        context.lineTo(this.c.x, this.c.y);
//        context.closePath();

        context.strokeStyle = color;
//        context.stroke();

        if (this.pressed) {
            context.fillStyle = color;
            context.fill();
        }
    }
});