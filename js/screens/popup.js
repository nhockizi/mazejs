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
        this.isPersistent = true;
    },
    onResetEvent: function() {
        var gImageBoard = me.loader.getImage('gameoverbg');
        me.game.world.addChild(new me.Sprite(
                me.game.viewport.width / 2 - gImageBoard.width / 2,
                me.game.viewport.height / 2 - gImageBoard.height / 2,
                {image: gImageBoard}
        ));
        if (glbBonusQuestion == true) {
            var quiz = 0;
            glbQuestion = quiz;
            var question = glbQuiz[quiz]["question"];
            var answers = glbQuiz[quiz]["answers"];
            var _top_answer = me.game.viewport.height / 2 - 40;
            var _left_answer = me.game.viewport.width / 2 - 200;

            this.dialog = new game.bonusDialog(question, answers, _left_answer, _top_answer);
            this.btnSubmit = new btnSubmit(me.game.viewport.width / 2 - 60, me.game.viewport.height / 2);
            for (var i = 0; i < answers.length; i++) {
                var _answer = new game.RadioInput(_left_answer + i * 150, _top_answer, answers[i]["strtitle"], i);
                me.game.world.addChild(_answer, i + 20);
                glbAnswers[i] = _answer;
            }
            me.game.world.addChild(this.btnSubmit, 15);

            me.game.world.addChild(this.dialog, 12);
        } else {
            this.btnPlayagain = new btnPlayagain(me.game.viewport.width / 2 - 60, me.game.viewport.height / 2);
            me.game.world.addChild(this.btnPlayagain, 12);

            this.dialog = new game.gameoverDialog();
            me.game.world.addChild(this.dialog, 12);
        }

    },
    onDestroyEvent: function() {
    }
});
game.bonusDialog = me.Renderable.extend(
        {
            init: function(question, answers, x, y)
            {
                this._super(me.Renderable, 'init', [0, 0, 10, 10]);
                this.pos.x = x;
                this.pos.y = y - 5;
                this.notice_1 = 'Bonus Question';
                this.font_notice_1 = new me.Font("Arial", 30, "#2ca606", "center");
                this.font_notice_1.bold();

                this.question = question;
                this.font_question = new me.Font("Arial", 29, "#2ca606", "center");

                this.answers = new Array();

                this.score = game.data.score.toString();
                this.font_score = new me.Font("Arial", 30, "#EE0000", "left");
            },
            draw: function(context)
            {
                var _top_popup = me.game.viewport.height / 2 - 120;
                this.font_notice_1.draw(
                        context,
                        this.notice_1,
                        me.game.viewport.width / 2,
                        _top_popup + 0
                        );
                this.font_question.draw(
                        context,
                        this.question,
                        me.game.viewport.width / 2,
                        _top_popup + 40
                        );
                return true;
            }
        });

game.RadioInput = me.Renderable.extend(
        {
            init: function(x, y, text, position)
            {
                this._super(me.Renderable, 'init', [x, y, 10, 10]);
                this.font = new me.Font("Arial", 20, "#EE0000");
                this.value = text;
                this.isPersistent = true;
                this.floating = true;
                this.status = "INIT";
                this.pos.x = x;
                this.pos.y = y;
                this.optionAnswer = new game.inputRadioStype(this.pos.x - 30, this.pos.y, "ansnothing", position);
                me.game.world.addChild(this.optionAnswer, 12);
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
                glbAnswers[this.position].onMouseDown();
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
    },
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
            if (glbQuiz[glbQuestion]["answers"][i]["isright"] == true) {
                _index_right = i;
            }
        }
        if (_num_select == 1) {
            if (_index_select == _index_right) {
                game.data.score += 50;
                this.onAddScore();
            }
            else {
                glbAnswers[_index_select].optionAnswer.status = "WRONG";
                glbAnswers[_index_select].optionAnswer.update();

                glbAnswers[_index_right].optionAnswer.status = "RIGHT";
                glbAnswers[_index_right].optionAnswer.update();
            }
            // @todo
            me.game.world.removeChild(this);
            glbBonusQuestion = false;
            me.state.change(me.state.POPUP);
        }
    },
    onAddScore: function(mark) {
    }
});