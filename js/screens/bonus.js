
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

game.BonusQuestionScreen = me.ScreenObject.extend(
{
	init: function()
	{
		this.savedData = null;
		this.handler = null;
		
	},

	onResetEvent: function()
	{
		var gImageBoard = me.loader.getImage('bonusbg');
		me.game.world.addChild(new me.Sprite(
			me.game.viewport.width / 2 - gImageBoard.width / 2,
			me.game.viewport.height / 2 - gImageBoard.height / 2,
			gImageBoard
		), 3);
		
		var quiz = 1;
		glbQuestion = quiz;
		var question = glbQuiz[quiz]["question"];
		var answers = glbQuiz[quiz]["answers"];
		

		// Answer
		var _top_answer = me.game.viewport.height / 2 - 40;
		var _left_answer = me.game.viewport.width / 2 - 200;
		
		for (var i = 0; i < answers.length; i++) {
			var _answer = new game.RadioInput(_left_answer + i*150, _top_answer, answers[i]["strtitle"], i);
			me.game.world.addChild(_answer, i + 20);
			// Thêm vào mảng Entity
			glbAnswers[i] = _answer;
        }
		
		this.dialog = new game.bonusDialog(question);
		me.game.world.addChild(this.dialog, 12);

		// Submit button
		this.btnSubmit = new btnSubmit(me.game.viewport.width / 2 - 60, me.game.viewport.height / 2);
		me.game.world.addChild(this.btnSubmit, 15);
		
	},

	onDestroyEvent: function() {
		me.game.world.removeChild(this.dialog);
		me.game.world.removeChild(this.btnSubmit);
	}
});

game.bonusDialog = me.Renderable.extend(
{
	// constructor
	init: function(question)
	{
		// size does not matter, it's just to avoid having a
		// renderable
		this._super(me.Renderable, 'init', [0, 0, 100, 100]);

		//this.font.textAlign = "center";
		this.notice_1 = 'Bonus Question';
		this.font_notice_1 = new me.Font("Arial", 30, "#2ca606", "center");
		this.font_notice_1.bold();

		this.question = question;
		this.font_question = new me.Font("Arial", 29, "#2ca606", "center");

		this.answers = new Array();

		this.score = game.data.score.toString();
		this.font_score = new me.Font("Arial", 30, "#EE0000", "left");
	},

	/**
	 * draw the score
	 */
	draw: function(renderer)
	{
		var context = renderer.getContext();
		//var stepsText = this.font.measureText(context, '1');

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

	}
});

//game.RadioInput = me.Renderable.extend({
game.RadioInput = me.Renderable.extend(
{
	init: function(x, y, text, position)
	{

		this._super(me.Renderable, 'init', [x, y, 100, 50]);
		this.font = new me.Font("Arial", 20, "#EE0000");

		this.value = text;
		//this.optionAnswer = null;
		
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

	draw: function(ctx)
	{
		var context = ctx.getContext();
		//this.font.draw(context, this.value, this.pos.x, this.pos.y);
		this.font.draw(context, this.value, this.pos.x, this.pos.y);
	},

	destroy: function()
	{
		//me.game.world.removeChild(this.optionAnswer);
	},

	/**
	 * update the place
	 */
	update: function(dt)
	{
		return true;
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
		//this.image = me.loader.getImage("ansselected");
		//this.status = "SELECTED";
		//alert("onClick");
	}
});

var btnSubmit = me.GUI_Object.extend({
    init: function(x, y) {
    	
        var settings = {};
        settings.image = "btnsubmit";
        settings.spritewidth = 119;
        settings.spriteheight = 34;
        this.z=1000;
        this._super(me.GUI_Object, 'init', [x, y, settings]);
        
        this.mouseover = false;
        
        // register on mouse event
        //me.input.registerPointerEvent("pointermove", me.game.world, this.moved.bind(this));         
        
    },
    
    /**
     * function callback for the pointermove event
     * @ignore
     */
     moved : function (event) {
 	    if(
 		    event.gameX >= this.pos.x &&
 		    event.gameX <= this.pos.x + this.width &&
 		    event.gameY >= this.pos.y &&
 		    event.gameY <= this.pos.y + this.height
 		    )
 	    {
 		    console.log(this);
 		    this.mouseover = true;
 		    return this.mouseover(event);
 	    } 
 	    else {
 		    this.mouseover = false;
 	    }
     },
      
     mouseover : function (event) {
     	return false;
     },         
    
    onClick: function() {
    	
    	var _num_select = 0;
    	var _index_select = null;
    	var _index_right = null;
		for (var i = 0; i < glbAnswers.length; i++) {
			if(glbAnswers[i].optionAnswer.status == "SELECTED"){
				_num_select += 1;
				_index_select = i;
			}
			// Câu trả lời đúng
			if(glbQuiz[glbQuestion]["answers"][i]["isright"] == true){
				_index_right = i;
			}
        }
		// Có chọn câu trả lời
		if(_num_select == 1){
			if(_index_select == _index_right){
				game.data.score +=50;
				this.onAddScore();
				
				//me.state.change(me.state.GAME_OVER);
				
				
				//alert("Cộng điểm");
				//this.optionAnswer.status = "SELECTED";
				//this.optionAnswer.update();
			}
			else{
				//alert("Không Cộng điểm");
				// Hiện trả lời sai
				glbAnswers[_index_select].optionAnswer.status = "WRONG";
				glbAnswers[_index_select].optionAnswer.update();
				
				// Hiện trả lời đúng
				glbAnswers[_index_right].optionAnswer.status = "RIGHT";
				glbAnswers[_index_right].optionAnswer.update();
			}
			// Không cho ấn Submit nhiều lần
			// @todo
			me.game.world.removeChild(this);
	    	me.state.change(me.state.GAME_OVER);

		}
		
    },
    
    /**
     * callback when fully visible
     */
    onAddScore : function(mark) {
    	var str_score_add = "score_add_50";
    	var image = me.loader.getImage(str_score_add);
    	
    	var emitter = new me.ParticleEmitter(this.pos.x, this.pos.y, {
    	    image: image,
    	    totalParticles: 1,
    	    speed: 1,
    	    speedVariation: 0,    	    
    	    minLife: 500,
    	    maxLife: 500
    	    //angleVariation: 0.3490658503988659,
    	    //frequency: 50
    	});
    	emitter.name = 'fire';
    	emitter.z = 11;
    	me.game.world.addChild(emitter);
    	me.game.world.addChild(emitter.container);
    	//emitter.streamParticles();
    	emitter.burstParticles(1);
    }	    

});