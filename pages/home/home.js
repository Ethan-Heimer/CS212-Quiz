function OnPageLoaded(){
    // Get the search input from the URL
    const url = window.location.search;
    const urlParams = new URLSearchParams(url)
    let filter = urlParams.get("search")
    
    filter = filter ? filter : ""
    
    console.log("Host:" + window.location.hostname)
    
    // Create Quiz Cards
    CreateQuizCardElements(filter, (fileName, jsonBody) => {
        console.log(jsonBody)
        return CardElement(fileName, jsonBody);
    })
}

function CardElement(fileName, jsonBody){
    // return html for a quiz card
    const quizButtonText = "Take Quiz!"

    return `
        <div class="quiz-card">
            <h1 id="title">${jsonBody.title}</h1>
            <h3 id="description">${jsonBody.description}</h3>
            <p id="difficulty">Difficulty: ${jsonBody.difficulty}</p>
            <button onclick="RedirectToQuiz('/pages/quiz', '${fileName}')">${quizButtonText}</button>
        </div>`
}

OnPageLoaded();

