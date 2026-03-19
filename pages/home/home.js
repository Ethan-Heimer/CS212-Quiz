// Get the search input from the URL
const url = window.location.search;
const urlParams = new URLSearchParams(url)
const filter = urlParams.get("search")

// Create Quiz Cards
CreateQuizCardElements(filter, (fileName, jsonBody) => {
    return `
        <h1>${jsonBody.title}</h1>
        <h3>${jsonBody.description}</h3>
        <p>Difficulty: ${jsonBody.difficulty}</p>
        <button onclick="RedirectToQuiz('/pages/quiz', '${fileName}')">Take Quiz!</button>`
})

