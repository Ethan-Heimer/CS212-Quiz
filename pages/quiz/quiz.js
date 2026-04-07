let answerArray = [];
let score = 0

// -- Functions for displaying quiz data to HTML -- //
function CreatePage(jsonData){
    const questionsContainer = document.getElementById('questions');
    const questionData = jsonData['questions']
    const questionIndex = GetQuestionID();

    const encodedScore = GetScoreParam();
    score = DecodeScore(encodedScore);

    if(IsAtEndOfQuiz(questionData, questionIndex)){
        ShowSummary(score);
    }

    InitQuizTitle(jsonData['header'].title);
    InitSubmitButton(questionData, questionIndex);
    InitNextButton(questionIndex)

    answerArray = CreateQuestion(questionData, questionIndex);
}


function CreateQuestion(questionData, index){
    const question = questionData[index];

    let answerArray=[];

    const questionText = document.getElementById('question-text')
    const answerContainer = document.getElementById('answer-container')

    questionText.innerText = question.Q

    //create answers
    for(var i = 0; i < question.A.length; i++){
        const answerText = question.A[i]
        const answerButton = document.createElement('button')

        const answerIndex = i;

        answerButton.innerText = answerText;
        answerButton.addEventListener('click', () => {
            let selected = ToggleAnswer(answerArray, answerIndex)

            if(selected){
                answerButton.classList.add('selected')
            }
            else{
                answerButton.classList.remove('selected')
            }
        })

        answerContainer.appendChild(answerButton);
        answerArray.push(false)
    }

    return answerArray;
}

function InitSubmitButton(questionData, questionIndex){
    const submitButton = document.getElementById('submit-answer-btn')
    submitButton.addEventListener('click', () => {
        OnAnswerSubmit(questionData, questionIndex)
    })
}

function InitNextButton(questionIndex){
    document.getElementById("next-question-btn").addEventListener('click', () => {
       GotoQuestion(questionIndex+1, score) 
    })
}

function InitQuizTitle(title){
    const titleElement = document.getElementById("quiz-title");
    titleElement.innerText = `Taking ${title}`;
}

// -- quiz answering and taking functions --
function ToggleAnswer(answerArray, index){
    let value = answerArray[index]
    answerArray[index] = !value

    return !value;
}

function OnAnswerSubmit(questionData, questionIndex){
    let correct = GradeAnswer(questionData, answerArray, questionIndex)
    if(correct)
        score++;
    
    document.getElementById("feedback").innerText = `${correct ? "You Got it Right!" : "You got it wrong."}` 

    document.getElementById("submit-answer-btn").style.display = "none";
    document.getElementById("next-question-btn").style.display = "block";
}

function GradeAnswer(questionData, answerData, index){
    const correctAnswerIndex = questionData[index].CorrectIndex;

    for(let i = 0; i < answerData.length; i++){
        if(i == correctAnswerIndex){
            if(answerData[i] != true)
                return false
        }else{
            if(answerData[i] != false)
                return false
        }
    }

    return true;
}

// -- functions for getting and setting question ids --
function GetQuestionID(){
    const params = new URLSearchParams(window.location.search);
    const question = params.get('question');

    if(!question)
        return 0;

    return Number(question);
}

// -- redirect functions --
function RestartQuiz(){
    GotoQuestion(0, 0)
}

function GotoQuestion(questionIndex, rawScore){
    // change the windows location to the 'location' string + index.html + quiz data file name
    const params = new URLSearchParams(window.location.search);
    const currentQuiz = params.get('quizdata');

    let encodedScore = EncodeScore(rawScore);

    let isGitHub = window.location.hostname.includes("github");
    window.location.href =`${isGitHub ? "/CS212-Quiz" : ""}/pages/quiz/index.html?quizdata=${currentQuiz}&question=${questionIndex}&score=${encodedScore}`
}

function GotoHome(){
    let isGitHub = window.location.hostname.includes("github");
    window.location.href =`${isGitHub ? "/CS212-Quiz" : ""}/pages/home/`
}

// -- Score Functions
function GetScoreParam(){
    const params = new URLSearchParams(window.location.search);
    const paramScore = params.get('score');

    if(!paramScore)
        return 0;

    return Number(paramScore);
}

function EncodeScore(score){
    return (score * 3307 * 7919);
}

function DecodeScore(encodedScore){
    return encodedScore / (3307 * 7919)
}

// -- Summary Functions --

function IsAtEndOfQuiz(questionData, questionIndex){
    return questionIndex >= questionData.length;
}

function ShowSummary(score){
    document.getElementById("score-summary").style.display = "block";
    document.getElementById("quiz-container").style.display = "none"

    document.getElementById('final-score').innerText = `Final Score: ${score}` 
    document.getElementById('retake-quiz-btn').addEventListener('click', () => {
        RestartQuiz();
    })

    document.getElementById('another-quiz-button').addEventListener('click', () => {
        GotoHome();
    })
}

GetJsonFromURL().then((json)=>{
    CreatePage(json)
})


