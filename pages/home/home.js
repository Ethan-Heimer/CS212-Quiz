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
    ForEachPastScore(null, (name, score, maxScore) => {
        PastScoreElement(pastScoreParent, name, score, maxScore)
    })
    
    // Create Quiz Cards
    CreateQuizCardElements(filter, (fileName, jsonBody) => {
        return CardElement(fileName, jsonBody);
    })
}

function CardElement(fileName, jsonBody){
    // return html for a quiz card
    const catagoryPreText = "Catagory:"
    const difficultyPreText = "Difficulty:"
    const quizButtonText = "Take Quiz!"

    return `
        <div class="quiz-card">
            <h1 id="title">${jsonBody.title}</h1>
            <h3 id="description">${jsonBody.description}</h3>
            <p id="difficulty">${difficultyPreText} ${jsonBody.difficulty}</p>
            <p id="catagory">${catagoryPreText} ${jsonBody.catagory}</p>
            <button onclick="RedirectToQuiz('/pages/quiz', '${fileName}')">${quizButtonText}</button>
        </div>`
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

OnPageLoaded();

