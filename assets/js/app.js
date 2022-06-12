const startGameButton = document.getElementById('start-game');
const sectionTimer = document.getElementById('section-timer');
let timerEl = document.getElementById('timer');
const sectionQuestion = document.getElementById('section-question');

const sectionLanding = document.getElementById('section-landing');
const sectionEndGame = document.getElementById('section-end-game');

const questionTitleEl = document.getElementById('question-title');
const questionChoices = document.getElementById('question-choices');
const saveButton = document.getElementById("save");
let initialsEl = document.getElementById('input-initials');
//const highScore = document.getElementById('result-span');
const highScoresListEl = document.getElementById('section-highscore')
const feedbackEl = document.getElementById('feedback');
let finalScoreEl = document.getElementById('result-span');
let list = document.getElementById('myList');
const clearHighScoreBtn = document.getElementById('clearHighScoreBtn'); 
const goBackBtn = document.getElementById('goBackBtn'); 
let viewHighScore = document.getElementById('viewHighScore');
let timeRemaining = 101;
let timerId;
let correctAns = 0;
let finalScore=0;


function renderQuestion(questionIndex) {

  // get the question
  const question = questions[questionIndex]

  // create the structure
  // set the question title
  questionTitleEl.textContent = question.title;

  // set the choices
  const choices = question.choices;
  questionChoices.textContent = "";

  for (let index = 0; index < choices.length; index++) {
    const choice = choices[index];

    // <li>
    //   <button class="question-choice">Good</button>
    // </li>;

    const li = document.createElement('li');

    const button = document.createElement('button');



    button.setAttribute('class', 'question-choice');
    button.textContent = choice.title;


    button.addEventListener('click', function (event) {
      // question
      // user click on choice
      //var targetEl = event.target;
      // if user click on the correct answer
      let feedbackText = "";
      if (choice.isAnswer) {
        // give feedback correct
        feedbackText = "True";
        console.log("Feedbak", feedbackText);
        // feedbackEl.innerHTML =feedbackText;
        correctAns = correctAns + 10;
       // event.target.classList.add('correct');
      } else {
        // if user click on the wrong answer
        // deduct 10 sec away from timer
        timeRemaining = timeRemaining - 10;
        feedbackText = "False";
        // show feedback -- wrong
      //  event.target.classList.add('wrong');
        console.log("Feedback", feedbackText);
      }

      // if user click on the choice of the final question
      const nextQuestionIndex = questionIndex + 1;

      if (nextQuestionIndex >= questions.length) {
        // end game
        return endGame()
      }

      feedbackEl.innerHTML = feedbackText;
      // move on to the next question
      //renderQuestion(nextQuestionIndex);
      setTimeout(
        () => {
          //event.target.className = 'btn';
          feedbackEl.innerHTML = "";
          renderQuestion(nextQuestionIndex);
        }, 500);


    });


    li.appendChild(button);

    questionChoices.append(li);
  }



}


viewHighScore.addEventListener("click", function(event) { 
  showHighScores(event);
});


// when i click on the start button
startGameButton.addEventListener('click', function (event) {
  // start the timer
  timeRemaining = 100;
  timerEl.textContent = timeRemaining;
  initialsEl.value ="";
  list.innerHTML = "";
  startTimer();
  // show the question
  sectionQuestion.classList.remove('hide');
  // hide the landing
  sectionLanding.classList.add('hide');

  renderQuestion(0);

});

function endGame() {
  // (show the end game screen)
  sectionEndGame.classList.remove('hide');
  // hide question section
  sectionQuestion.classList.add('hide');
  // document.getElementById("result-span").innerText=score;
  finalScore = correctAns;
  finalScoreEl.textContent = finalScore;
  // hide timer
  sectionTimer.classList.add('hide');

  // stop the timer
  clearInterval(timerId);
  timerEl.textContent=0;
}

function startTimer() {
  // timer
  // show the timer
  sectionTimer.classList.remove('hide');
  // once the timer starts
  timerId = setInterval(function () {
    // we will subtract 1 from the current timer count
    timeRemaining = timeRemaining - 1;
    // and update the dom for every passing sec
    timerEl.textContent = timeRemaining;

    // if timer expires while the game is not completed yet
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      // end game 
      endGame();

    }
  }, 1000);

}

saveBtn.addEventListener("click", function (event) {
  storeHighScores(event);
});

function storeHighScores(event) {
  event.preventDefault();
  //clearInterval(timerId);
  let initials = initialsEl.value;
  if (initials === "") {
    alert("Please enter your initials!");
   return;
  }
  highScoresListEl.classList.remove('hide');
  sectionLanding.classList.add('hide');
  sectionQuestion.classList.add('hide');
  sectionTimer.classList.add('hide');
  sectionEndGame.classList.add('hide');
 
  let savedHighScores = localStorage.getItem('highScores');
  let highScoresList;
  if (savedHighScores === null) {
    highScoresList = [];
  } else {
    highScoresList = JSON.parse(savedHighScores);
  }
  var userScore = {
    initials: initials,
    score: finalScoreEl.textContent
  };
  // push new score to array
  highScoresList.push(userScore);
  console.log("highScoresList" + highScoresList);

  localStorage.setItem('highScores', JSON.stringify(highScoresList));
  console.log("calling populateHighScores");
  showHighScores();

}

function showHighScores() {
  highScoresListEl.classList.remove('hide');
  sectionLanding.classList.add('hide');
  sectionQuestion.classList.add('hide');
  sectionTimer.classList.add('hide');
  sectionEndGame.classList.add('hide');
  console.log("calling populateHighScores1");
  let storedHighScores = localStorage.getItem('highScores');
  console.log("inside populateHighScores1" + storedHighScores);
  if (storedHighScores === null) {
    return;
  }
  var savedHighScores = JSON.parse(storedHighScores);
  console.log(savedHighScores.length);
  for (let i = 0; i < savedHighScores.length; i++) {
    var eachNewHighScore = document.createElement("p");
    eachNewHighScore.innerHTML = savedHighScores[i].initials + ": " + savedHighScores[i].score;
    list.appendChild(eachNewHighScore);
  }
}

goBackBtn.addEventListener("click", function() {
  highScoresListEl.classList.add('hide');
  sectionLanding.classList.remove('hide');
  sectionQuestion.classList.add('hide');
  sectionTimer.classList.add('hide');
  sectionEndGame.classList.add('hide');
  clearInterval(timerId);
});

 clearHighScoreBtn.addEventListener("click", function(){
  window.localStorage.removeItem('highScores');
  list.innerHTML = "High Scores Cleared!";
  clearInterval(timerId);
 //list.setAttribute("style", "font-family: 'Archivo', sans-serif; font-style: italic;")
});
