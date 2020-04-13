var initialTime = 50;
var time = 50;
var score = 0;
var quizCount = 0;
var setTime;
var answers = document.querySelectorAll('#quizSpace button');
var clock;
var recordsArray = [];


var pageContentEl = function(element) {
	return document.querySelector(element);
};

var myTimer = function() {
	if (time > 0) {
		time = time - 1;
		pageContentEl('#time').innerHTML = time;
	} else {
		clearInterval(clock);
		pageContentEl('#score').innerHTML = score;
		onlyDisplaySection("#fin");
	}
};



var onlyDisplaySection = function(element) {
	let sections = document.querySelectorAll("section");
	Array.from(sections).forEach(function(userItem) {
		userItem.classList.add('hidden');
	});
	pageContentEl(element).classList.remove('hidden');
};

var quizUpdate = function(answerCopy) {
	pageContentEl('#scoreAlt p').innerHTML = answerCopy;
	pageContentEl('#scoreAlt').classList.remove('invis', scoreAlt());
	Array.from(answers).forEach(answer =>
	{
		answer.classList.add('disable');
	});

	setTimeout(function() {
		if (quizCount === questions.length) {
			onlyDisplaySection("#fin");
			time = 0;
			pageContentEl('#time').innerHTML = time;
		} else {
			setQuestionData();
			Array.from(answers).forEach(answer => {
				answer.classList.remove('disable');
			});
		}
	}, 1000);
};



var setQuestionData = function() {
	pageContentEl('#quizSpace p').innerHTML = questions[quizCount].title;
	pageContentEl('#quizSpace button:nth-of-type(1)').innerHTML = `1. ${questions[quizCount].choices[0]}`;
	pageContentEl('#quizSpace button:nth-of-type(2)').innerHTML = `2. ${questions[quizCount].choices[1]}`;
	pageContentEl('#quizSpace button:nth-of-type(3)').innerHTML = `3. ${questions[quizCount].choices[2]}`;
	pageContentEl('#quizSpace button:nth-of-type(4)').innerHTML = `4. ${questions[quizCount].choices[3]}`;
};

var scoreAlt = function() {
	clearTimeout(setTime);
	setTime = setTimeout(function() {
		pageContentEl('#scoreAlt').classList.add('invis');
	}, 1000);
};

var errorAlert = function() {
	clearTimeout(setTime);
	setTime = setTimeout(function() {
		pageContentEl('#errorAlt').classList.add('invis');
	}, 3000);
};

var enterInitials = function() {
	let initialsRecord = pageContentEl('#initials').value;
	if (initialsRecord === ''){
		pageContentEl('#errorAlt p').innerHTML = "You need at least 1 character";
		pageContentEl('#errorAlt').classList.remove('invis', errorAlert());
	} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
		pageContentEl('#errorAlt p').innerHTML = "Only letters and initials.";
		pageContentEl('#errorAlt').classList.remove('invis', errorAlert());
	} else if (initialsRecord.length > 5) {
		pageContentEl('#errorAlt p').innerHTML = "Maximum of 5 characters.";
		pageContentEl('#errorAlt').classList.remove('invis', errorAlert());
	} else {
		recordsArray.push({
			"initialRecord": initialsRecord,
			"score": score
		});
		
		localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
		pageContentEl('#highS div').innerHTML = '';
		onlyDisplaySection("#highS");
		recordsHtmlReset();
		pageContentEl("#initials").value = '';
		}
};


var quizReset = function () {
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#intro");
};

var startQuiz = function () {
  setQuestionData();
onlyDisplaySection("#quizSpace");
clock = setInterval(myTimer, 1000);
};

var clearHighScores = function () {
	recordsArray = [];
	pageContentEl('#highS div').innerHTML = "";
	localStorage.removeItem('recordsArray');
};



var viewHighScores = function (e) {
	e.preventDefault();
	clearInterval(clock);
	pageContentEl('#time').innerHTML = 0;
	time = initialTime;
	score = 0;
	quizCount = 0;
	onlyDisplaySection("#highS");
	recordsHtmlReset();
};

var scoreTimeAdjust = function () {
	if (this.innerHTML.substring(3, this.length) === questions[quizCount].answer) {
		score = score + 1;
		quizCount = quizCount + 1;
		quizUpdate("Correct");
	}else{
		time = time - 5;
		quizCount = quizCount + 1;
		quizUpdate("Incorrect");
	}
};



var recordsHtmlReset = function() {
	pageContentEl('#highS div').innerHTML = "";
	let i = 1;
	recordsArray.sort((a, b) => b.score - a.score);
	Array.from(recordsArray).forEach(check =>
	{
		var scores = document.createElement("div");
		scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
		pageContentEl('#highS div').appendChild(scores);
		i = i + 1;
	});
	i = 0;
	Array.from(answers).forEach(answer => {
		answer.classList.remove('disable');
	});
};



(localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];



Array.from(answers).forEach(check => {check.addEventListener('click', scoreTimeAdjust);});
pageContentEl("#reset").addEventListener("click", quizReset);

pageContentEl("#intro button").addEventListener("click", startQuiz);

pageContentEl("#scores").addEventListener("click", viewHighScores);

pageContentEl("#clearScores").addEventListener("click", clearHighScores);

pageContentEl("#rec button").addEventListener("click", enterInitials);





