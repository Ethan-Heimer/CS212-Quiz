function OnPageLoaded(){
    // Get the search input from the URL
    const url = window.location.search;
    const urlParams = new URLSearchParams(url)

    let filter = urlParams.get("search") 
    let filterBy = urlParams.get("options") 

    //if the values were found above, refill the forms
    if(filter){ 
        document.getElementById("quiz-search").value = filter
    }

    if(filterBy){
        document.getElementById("search-options").value = filterBy;
    }

    filter = filter ? filterBy+":"+filter : ""
    //Load past Scores
    let pastScoreParent = document.getElementById("past-scores-table-body");
    ForEachPastScore(null, (name, score, maxScore, time) => {
        PastScoreElement(pastScoreParent, name, score, maxScore, time)
    },() => DisplayEmptyTableMessage(pastScoreParent))
    
    // Create Quiz Cards
    CreateQuizCardElements(filter, (fileName, json) => {
        return CardElement(fileName, json);
    })

    document.getElementById("history-clear-button").addEventListener("click", ClearQuizHistory)
}

function CardElement(fileName, json){
    // return html for a quiz card
    const catagoryPreText = "Category:"
    const difficultyPreText = "Difficulty:"
    const quizButtonText = "Take Quiz!"
    const numberOfQuestions = "Questions:";

    const jsonHeader = json['header'];

    console.log(json['questions'])

    return `
        <div class="quiz-card">
            <h1 id="title">${jsonHeader.title}</h1>
            <h3 id="description">${jsonHeader.description}</h3>
            <p id="difficulty">${difficultyPreText} ${jsonHeader.difficulty}</p>
            <p id="number-questions">${numberOfQuestions} ${json['questions'].length}</p>
            <p id="catagory">${catagoryPreText} ${jsonHeader.category}</p>
            <button onclick="RedirectToQuiz('/pages/quiz', '${fileName}')">${quizButtonText}</button>
        </div>`
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
        <td id="no-scores-message">No past score data. Start taking some quizzes!</td>
    `

    let row = document.createElement('tr');
    row.innerHTML = rowTemplate;

    parent.appendChild(row)
}

function ClearQuizHistory(){
    localStorage.removeItem("Scores")
    location.reload();
}

OnPageLoaded();

