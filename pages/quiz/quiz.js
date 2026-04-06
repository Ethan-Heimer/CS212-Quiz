// [questionIndex][answerIndex]
let answerMatrix = [];

// -- Functions for displaying quiz data to HTML -- //
function CreatePage(jsonData){
    const title = document.getElementById("title");
    title.innerText = `Taking ${jsonData['header'].title}`;

    const questions = document.getElementById('questions');
    const questionData = jsonData['questions']

    for(let i = 0; i < questionData.length; i++){
        let answerData = CreateQuestion(questions, questionData[i], i)
        answerMatrix.push(answerData); 
    }

    const submitButton = document.createElement('button')
    submitButton.addEventListener('click', () => {
        let score = GradeQuiz(questionData, answerMatrix)

        document.getElementById("score").innerText = `You Scored: ${score}/${questionData.length}!`
    })
    submitButton.innerText = "Submit!"

    questions.appendChild(submitButton)
}

function CreateQuestion(parent, questionData, index){
    let answerArray=[];

    const questionContainer = document.createElement('div');

    const questionText = document.createElement('h3');
    questionText.innerText = questionData.Q;

    const answerContainer = document.createElement('div');

    //create answers
    for(var i = 0; i < questionData.A.length; i++){
        const answerText = questionData.A[i]

        const answerButton = document.createElement('button')

        const answerIndex = i;

        answerButton.innerText = answerText;
        answerButton.addEventListener('click', () => {
            let selected = ToggleAnswer(answerMatrix, index, answerIndex)
            if(selected){
                answerButton.classList.remove('deselected')
                answerButton.classList.add('selected')
            }
            else{
                answerButton.classList.remove('selected')
                answerButton.classList.add('deselected')
            }
        })

        answerContainer.appendChild(answerButton);
        answerArray.push(false)
    }

    questionContainer.appendChild(questionText);
    questionContainer.appendChild(answerContainer);

    parent.appendChild(questionContainer); 

    return answerArray;
}

// -- functions for interpreting answer data for quizs and grading -- //
function SelectAnswer(quizAnswers, questionIndex, answerIndex){
    quizAnswers[questionIndex][answerIndex] = true;
}

function DeselectAnswer(quizAnswers, questionIndex, answerIndex){
    quizAnswers[questionIndex][answerIndex] = false;
}

function ToggleAnswer(quizAnswers, questionIndex, answerIndex){
    quizAnswers[questionIndex][answerIndex] = !quizAnswers[questionIndex][answerIndex];

    return quizAnswers[questionIndex][answerIndex];
}

function GradeQuiz(questionData, answerData){
    let score = 0;
    for(let i = 0; i < questionData.length; i++){
        const correctAnswerIndex = questionData[i].CorrectIndex;

        if(answerMatrix[i][correctAnswerIndex] == true)
            score ++;
    }

    return score;
}

GetJsonFromURL().then((json)=>{
    CreatePage(json)
})


