let answerArray = [];
let score = 0
let time = 0
let answered = false;

// -- Functions for displaying quiz data to HTML -- //
function CreatePage(jsonData){
    const questionsContainer = document.getElementById('questions');
    const questionData = jsonData['questions']
    const questionIndex = GetQuestionID();

    const encodedScore = GetScoreParam();
    const encodedTime = GetTime();

    pastAnswerBitMask = null;

    if(encodedScore)
        score = DecodeScore(encodedScore);
    if(encodedTime){
        time = DecodeScore(encodedTime);
    }

    let maxScore = GetQuizMaxScore(questionData);
    console.log(maxScore)

    if(IsAtEndOfQuiz(questionData, questionIndex)){
        let quizName = jsonData['header'].title;

        ShowSummary(quizName, score, time);
        
        //avoid adding the score again if the page is reloaded
        const navigationEntries = window.performance.getEntriesByType('navigation');
        if (!(navigationEntries.length > 0 && navigationEntries[0].type === 'reload')) {
            let maxScore = GetQuizMaxScore(questionData);
            AppendScore(quizName, score, maxScore, time)
        }
    }

    InitQuizTitle(jsonData['header'].title);
    InitSubmitButton(questionData, questionIndex);
    InitNextButton(questionIndex)

    answerArray = CreateQuestion(questionData, questionIndex)

    //start timer
    UpdateTimer(time);
    StartTimer();
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
            if(answered)
                return;

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
       GotoQuestion(questionIndex+1, score, time) 
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
    answered = true;

    let gradedScore = GradeAnswer(questionData, answerArray, questionIndex)
    SetButtonCorrectState(questionData, answerArray, questionIndex)

    score += gradedScore;

    let correct = gradedScore == GetAnswerWeight(questionData[questionIndex]);
    
    document.getElementById("feedback").innerText = `${correct ? `You Got it Right!` : `Wrong or partial credit.`} +${gradedScore}`

    document.getElementById("submit-answer-btn").style.display = "none";
    document.getElementById("next-question-btn").style.display = "block";
}

function GradeAnswer(questionData, answerData, index){
    let correctAnswerIndexs = questionData[index].CorrectIndex;
    const hasMultipleAnswers = correctAnswerIndexs.length != null

    //convert correntAnswerIndexs into an array
    if(!hasMultipleAnswers)
        correctAnswerIndexs = [correctAnswerIndexs];

    let weight = GetAnswerWeight(questionData[index]);

    let score = weight;
    let wrongPenalty = weight/correctAnswerIndexs.length;

    for(let i = 0; i < answerData.length; i++){
        if(correctAnswerIndexs.includes(i)){
            if(answerData[i] != true)
                score -= wrongPenalty;        
        }
    }

    return score;
}

function SetButtonCorrectState(questionData, answerData, index){
    const answerContainer = document.getElementById('answer-container')
    const answerButtons = [...answerContainer.children]

    let correctAnswerIndexs = questionData[index].CorrectIndex;
    const hasMultipleAnswers = correctAnswerIndexs.length != null

    //convert correntAnswerIndexs into an array
    if(!hasMultipleAnswers)
        correctAnswerIndexs = [correctAnswerIndexs];

    for(let i = 0; i < answerData.length; i++){
        if(correctAnswerIndexs.includes(i)){
            answerButtons[i].classList.add("correct")
        }else{
            answerButtons[i].classList.add("incorrect")
        }
    }
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
    GotoQuestion(0, 0, 0)
}

function GotoQuestion(questionIndex, rawScore, rawTime){
    // change the windows location to the 'location' string + index.html + quiz data file name
    const params = new URLSearchParams(window.location.search);
    const currentQuiz = params.get('quizdata');

    let encodedScore = EncodeScore(rawScore);
    let encodedTime = EncodeScore(rawTime);

    let isGitHub = window.location.hostname.includes("github");
    window.location.href =`${isGitHub ? "/CS212-Quiz" : ""}/pages/quiz/index.html?quizdata=${currentQuiz}&question=${questionIndex}&score=${encodedScore}&time=${encodedTime}`
}

function GotoHome(){
    let isGitHub = window.location.hostname.includes("github");
    window.location.href =`${isGitHub ? "/CS212-Quiz" : ""}/pages/home/`
}

// -- Summary Functions --

function IsAtEndOfQuiz(questionData, questionIndex){
    return questionIndex >= questionData.length;
}

function ShowSummary(quizName, score, time){
    document.getElementById("score-summary").style.display = "block";
    document.getElementById("quiz-container").style.display = "none"

    document.getElementById('final-score').innerText = `Final Score: ${score}` 
    document.getElementById('final-time').innerText = `Final Time: ${Math.floor(time/60)}:${(time%60) <= 9 ? 0 : ""}${time%60}`

    document.getElementById('retake-quiz-btn').addEventListener('click', () => {
        RestartQuiz();
    })

    document.getElementById('another-quiz-button').addEventListener('click', () => {
        GotoHome();
    })

    let pastScoreParent = document.getElementById("past-scores-table-body");
    ForEachPastScore(quizName, (name, score, maxScore, time) => {
        PastScoreElement(pastScoreParent, name, score, maxScore, time)
    }, () => DisplayEmptyTableMessage(pastScoreParent))
}

function PastScoreElement(parent, name, score, maxScore, time){
    let rowTemplate = `
        <td>${name}</td>
        <td>${score}/${maxScore}</td>
        <td>${Math.floor((score/maxScore)*100)}%</td>
        <td>${Math.floor(time/60)}:${(time%60) <= 9 ? 0 : ""}${time%60}</td>
    `

    let row = document.createElement('tr');
    row.innerHTML = rowTemplate;

    parent.appendChild(row)
}

function DisplayEmptyTableMessage(parent){
    let rowTemplate = `
        <td id="no-scores-message">No past data for this quiz! Retake it and compare your results!</td>
    `

    let row = document.createElement('tr');
    row.innerHTML = rowTemplate;

    parent.appendChild(row)
}

/* Timer functions */
function StartTimer(){
    setInterval(() => {
        time += 1;

        UpdateTimer(time)
    }, 1000)
}

function UpdateTimer(time){
    document.getElementById("timer").textContent = `Time: ${Math.floor(time/60)}:${(time%60) <= 9 ? 0 : ""}${time%60}`;
}

function GetTime(){
    const params = new URLSearchParams(window.location.search);
    const paramTime = params.get('time');

    if(!paramTime)
        return 0;

    return paramTime;
}

function GetAnswerWeight(questionData){
    if(!questionData.ScoreWeight)
        return 1;

    return questionData.ScoreWeight;
}

function GetQuizMaxScore(quiestions){
    let length = quiestions.length;
    let sum = 0;

    for(let i = 0; i < length; i++){
        sum += GetAnswerWeight(quiestions[i])
    }

    return sum;
}

GetJsonFromURL().then((json)=>{
    CreatePage(json)
})


