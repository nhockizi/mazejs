var glbQuiz = [
    {question: "Question 01",
        answers: [{strtitle: "Answer 1. 01", isright: true},
            {strtitle: "Answer 1. 02", isright: false},
            {strtitle: "Answer 1. 03", isright: false}
        ]
    },
    {question: "Question 02",
        answers: [{strtitle: "Answer 2. 01", isright: false},
            {strtitle: "Answer 2. 02", isright: true},
            {strtitle: "Answer 2. 03", isright: false}
        ]
    },
    {question: "Question 03",
        answers: [{strtitle: "Answer 3. 01", isright: false},
            {strtitle: "Answer 3. 02", isright: false},
            {strtitle: "Answer 3. 03", isright: true}
        ]
    },
    {question: "Question 04",
        answers: [{strtitle: "Answer 4. 01", isright: false},
            {strtitle: "Answer 4. 02", isright: false},
            {strtitle: "Answer 4. 03", isright: true}
        ]
    }


];
var glbAnswers = new Array();
var glbQuestion = null;
game.PopupScreen = me.ScreenObject.extend({
    init: function() {
        this.savedData = null;
        this.handler = null;
    },
    onResetEvent: function() {
        var gImageBoard = me.loader.getImage('gameoverbg');
        me.game.world.addChild(new me.Sprite(
                me.game.viewport.width / 2 - gImageBoard.width / 2,
                me.game.viewport.height / 2 - gImageBoard.height / 2,
                {image: gImageBoard}
        ));
        //me.game.world.addChild(new BackgroundLayer('bg', 1));
        // PlayAgain button
        if (glbBonusQuestion == true) {
            var quiz = 0;
            glbQuestion = quiz;
            var question = glbQuiz[quiz]["question"];
            var answers = glbQuiz[quiz]["answers"];
            // Answer
            var _top_answer = me.game.viewport.height / 2 - 40;
            var _left_answer = me.game.viewport.width / 2 - 200;

            this.dialog = new game.bonusDialog(question, answers, _left_answer, _top_answer);
            this.btnSubmit = new btnSubmit(me.game.viewport.width / 2 - 60, me.game.viewport.height / 2);

            for (var i = 0; i < answers.length; i++) {
//                    this.optionAnswer = new game.inputRadioStype(_left_answer + i * 150 - 30, _top_answer, "ansnothing", i);
//                    me.game.world.addChild(this.optionAnswer, 12);
                var _answer = new game.RadioInput(_left_answer + i * 150, _top_answer, answers[i]["strtitle"], i);
                me.game.world.addChild(_answer, i + 20);
//                    // Thêm vào mảng Entity
                glbAnswers[i] = _answer;
            }
            me.game.world.addChild(this.btnSubmit, 15);

            me.game.world.addChild(this.dialog, 12);
//                console.log("asd");return false;
            // Submit button
        } else {
            this.btnPlayagain = new btnPlayagain(me.game.viewport.width / 2 - 60, me.game.viewport.height / 2);
            me.game.world.addChild(this.btnPlayagain, 12);

            this.dialog = new game.gameoverDialog();
            me.game.world.addChild(this.dialog, 12);
        }

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
game.gameoverDialog = me.Renderable.extend({
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
    draw: function(context) {
        //var stepsText = this.font.measureText(context, '1');

        var _top_popup = me.game.viewport.height / 2 - 150;

        // Notice 1
        this.font_notice_1.draw(
                context,
                this.notice_1,
                me.game.viewport.width / 2,
                _top_popup + 0
                );

        // Notice 2
        this.font_notice_2.draw(
                context,
                this.notice_2,
                me.game.viewport.width / 2,
                _top_popup + 40
                );

        // Notice 2
        this.font_notice_3.draw(
                context,
                this.notice_3,
                me.game.viewport.width / 2 + 80,
                _top_popup + 80
                );

        // Score
        this.font_score.draw(context, this.score,
                me.game.viewport.width / 2 + 85,
                _top_popup + 80
                );
        return true;
        // Opacity
        //me.Renderable.alpha = 0.5;


    }
});
game.bonusDialog = me.Renderable.extend(
        {
            // constructor
            init: function(question, answers, x, y)
            {
                // size does not matter, it's just to avoid having a
                // renderable
                this._super(me.Renderable, 'init', [0, 0, 10, 10]);
                this.pos.x = x;
                this.pos.y = y - 5;
                //this.font.textAlign = "center";
                this.notice_1 = 'Bonus Question';
                this.font_notice_1 = new me.Font("Arial", 30, "#2ca606", "center");
                this.font_notice_1.bold();

                this.question = question;
                this.font_question = new me.Font("Arial", 29, "#2ca606", "center");

                this.answers = new Array();

                this.score = game.data.score.toString();
                this.font_score = new me.Font("Arial", 30, "#EE0000", "left");


//                 for (var i = 0; i < answers.length; i++) {
//                     if(i == 0){
//                        this.answer1 = answers[i]["strtitle"];
//                        this.font_answer1 = new me.Font("Arial", 16, "#EE0000", "left");
//                     }else if(i == 1){
//                        this.answer2 = answers[i]["strtitle"];
//                        this.font_answer2 = new me.Font("Arial", 16, "#EE0000", "left");
//                     }else{
//                        this.answer3 = answers[i]["strtitle"];
//                        this.font_answer3 = new me.Font("Arial", 16, "#EE0000", "left");
//                     }
//                }
            },
            /**
             * draw the score
             */
            draw: function(context)
            {
                var _top_popup = me.game.viewport.height / 2 - 120;

                // Notice 1
                this.font_notice_1.draw(
                        context,
                        this.notice_1,
                        me.game.viewport.width / 2,
                        _top_popup + 0
                        );

                // question
                this.font_question.draw(
                        context,
                        this.question,
                        me.game.viewport.width / 2,
                        _top_popup + 40
                        );
//                this.font_question.draw(
//                        context,
//                        this.answer1,
//                        this.pos.x + 40,
//                        this.pos.y
//                        );
//                this.font_question.draw(
//                        context,
//                        this.answer2,
//                        this.pos.x + 190,
//                        this.pos.y
//                        );
//                this.font_question.draw(
//                        context,
//                        this.answer3,
//                        this.pos.x + 350,
//                        this.pos.y
//                        );
                return true;
            }
        });

//game.RadioInput = me.Renderable.extend({
game.RadioInput = me.Renderable.extend(
        {
            init: function(x, y, text, position)
            {
                this._super(me.Renderable, 'init', [x, y, 10, 10]);
                this.font = new me.Font("Arial", 20, "#EE0000");
                this.value = text;
                //this.optionAnswer = null;
                this.floating = false;
                this.status = "INIT";
                this.pos.x = x;
                this.pos.y = y;

                this.optionAnswer = new game.inputRadioStype(this.pos.x - 30, this.pos.y, "ansnothing", position);
                // Add Radio Check
                me.game.world.addChild(this.optionAnswer, 12);
                // register on mouse event
                //me.input.registerPointerEvent("pointerdown", this, this.onMouseDown.bind(this));
                // register on mouse event
                me.input.registerPointerEvent("pointerdown", this, this.onMouseDown.bind(this));


            },
            onMouseDown: function()
            {
                for (var i = 0; i < glbAnswers.length; i++) {
                    glbAnswers[i].optionAnswer.reset();
                }
                this.optionAnswer.status = "SELECTED";
                this.optionAnswer.update();
            },
            draw: function(context)
            {
                this.font.draw(context, this.value, this.pos.x, this.pos.y);
            },
            destroy: function()
            {
                me.game.world.removeChild(this.optionAnswer);
            }
        });

game.inputRadioStype = me.GUI_Object.extend(
        {
            init: function(x, y, ans_img, position)
            {
                var settings = {};
                settings.image = "ansnothing";
                settings.spritewidth = 17;
                settings.spriteheight = 17;
                this.z = 1000;
                this._super(me.GUI_Object, 'init', [x, y, settings]);
                this.position = position;
                this.status = "INIT";
                this.floating = true;
                this.isPersistent = true;
            },
            update: function(dt)
            {
                switch (this.status)
                {
                    case "INIT":
                        this.image = me.loader.getImage("ansnothing");
                        this.status = "INIT";
                        break;

                    case "SELECTED":
                        this.image = me.loader.getImage("ansselected");
                        this.status = "SELECTED";
                        break;

                    case "RIGHT":
                        this.image = me.loader.getImage("ansright");
                        this.status = "RIGHT";
                        break;
                    case "WRONG":
                        this.image = me.loader.getImage("answrong");
                        this.status = "WRONG";
                        break;
                }
            },
            reset: function()
            {
                this.image = me.loader.getImage("ansnothing");
                this.status = "INIT";
            },
            onClick: function()
            {
//                glbAnswers[this.position].onMouseDown();
                this.image = me.loader.getImage("ansselected");
                this.status = "SELECTED";
            }
        });

var btnSubmit = me.GUI_Object.extend({
    init: function(x, y) {

        var settings = {};
        settings.image = "btnsubmit";
        settings.spritewidth = 119;
        settings.spriteheight = 34;
        this.z = 1000;
        this._super(me.GUI_Object, 'init', [x, y, settings]);

        this.mouseover = false;

        // register on mouse event
        //me.input.registerPointerEvent("pointermove", me.game.world, this.moved.bind(this));         

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
    onClick: function() {
        var _num_select = 0;
        var _index_select = null;
        var _index_right = null;
        for (var i = 0; i < glbAnswers.length; i++) {
            if (glbAnswers[i].optionAnswer.status == "SELECTED") {
                _num_select += 1;
                _index_select = i;
            }
            // Câu trả lời đúng
            if (glbQuiz[glbQuestion]["answers"][i]["isright"] == true) {
                _index_right = i;
            }
        }
        // Có chọn câu trả lời
        if (_num_select == 1) {
            if (_index_select == _index_right) {
                game.data.score += 50;
                this.onAddScore();
                //me.state.change(me.state.GAME_OVER);
                //alert("Cộng điểm");
                //this.optionAnswer.status = "SELECTED";
                //this.optionAnswer.update();
            }
            else {
                //alert("Không Cộng điểm");
                // Hiện trả lời sai
                glbAnswers[_index_select].optionAnswer.status = "WRONG";
                glbAnswers[_index_select].optionAnswer.update();

                // Hiện trả lời đúng
                glbAnswers[_index_right].optionAnswer.status = "RIGHT";
                glbAnswers[_index_right].optionAnswer.update();
            }
//            console.log('asd');
            // Không cho ấn Submit nhiều lần
            // @todo
            me.game.world.removeChild(this);
            glbBonusQuestion = false;
            me.state.change(me.state.POPUP);
        }
    },
    /**
     * callback when fully visible
     */
    onAddScore: function(mark) {
//        var str_score_add = "score_add_50";
//        var image = me.loader.getImage(str_score_add);
//
//        var emitter = new me.ParticleEmitter(this.pos.x, this.pos.y, {
//            image: image,
//            totalParticles: 1,
//            speed: 1,
//            speedVariation: 0,
//            minLife: 500,
//            maxLife: 500
//                    //angleVariation: 0.3490658503988659,
//                    //frequency: 50
//        });
//        emitter.name = 'fire';
//        emitter.z = 11;
//        me.game.world.addChild(emitter);
//        me.game.world.addChild(emitter.container);
//        //emitter.streamParticles();
//        emitter.burstParticles(1);
    }

});