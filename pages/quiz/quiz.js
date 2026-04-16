let answerArray = [];
let score = 0

let answered = false;

// -- Functions for displaying quiz data to HTML -- //
function CreatePage(jsonData){
    const questionsContainer = document.getElementById('questions');
    const questionData = jsonData['questions']
    const questionIndex = GetQuestionID();

    const encodedScore = GetScoreParam();

    if(encodedScore)
        score = DecodeScore(encodedScore);

    if(IsAtEndOfQuiz(questionData, questionIndex)){
        let quizName = jsonData['header'].title;
        ShowSummary(quizName, score);

        //avoid adding the score again if the page is reloaded
        const navigationEntries = window.performance.getEntriesByType('navigation');
        if (!(navigationEntries.length > 0 && navigationEntries[0].type === 'reload')) {
            AppendScore(quizName, score, questionData.length)
        }
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
    answered = true;

    let correct = GradeAnswer(questionData, answerArray, questionIndex)
    SetButtonCorrectState(questionData, answerArray, questionIndex)

    if(correct)
        score++;
    
    document.getElementById("feedback").innerText = `${correct ? "You Got it Right!" : "You got it wrong."}` 

    document.getElementById("submit-answer-btn").style.display = "none";
    document.getElementById("next-question-btn").style.display = "block";
}

function GradeAnswer(questionData, answerData, index){
    let correctAnswerIndexs = questionData[index].CorrectIndex;
    const hasMultipleAnswers = correctAnswerIndexs.length != null

    //convert correntAnswerIndexs into an array
    if(!hasMultipleAnswers)
        correctAnswerIndexs = [correctAnswerIndexs];

    for(let i = 0; i < answerData.length; i++){
        if(correctAnswerIndexs.includes(i)){
            if(answerData[i] != true)
                return false
        }else{
            if(answerData[i] != false)
                return false
        }
    }

    return true;
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

// -- Summary Functions --

function IsAtEndOfQuiz(questionData, questionIndex){
    return questionIndex >= questionData.length;
}

function ShowSummary(quizName, score){
    document.getElementById("score-summary").style.display = "block";
    document.getElementById("quiz-container").style.display = "none"

    document.getElementById('final-score').innerText = `Final Score: ${score}` 
    document.getElementById('retake-quiz-btn').addEventListener('click', () => {
        RestartQuiz();
    })

    document.getElementById('another-quiz-button').addEventListener('click', () => {
        GotoHome();
    })

    let pastScoreParent = document.getElementById("past-scores-table-body");
    ForEachPastScore(quizName, (name, score, maxScore) => {
        PastScoreElement(pastScoreParent, name, score, maxScore)
    })
}

function PastScoreElement(parent, name, score, maxScore){
    let rowTemplate = `
        <td>${name}</td>
        <td>${score}/${maxScore}</td>
        <td>${Math.floor((score/maxScore)*100)}%</td>
    `

    let row = document.createElement('tr');
    row.innerHTML = rowTemplate;

    parent.appendChild(row)
}

GetJsonFromURL().then((json)=>{
    CreatePage(json)
})


