CreateQuizCardElements((jsonData) => {
    return `
        <h1>${jsonData.title}<h1>
        <h3>${jsonData.description}<h3>
        <p>Difficulty: ${jsonData.difficulty}</p>
        <button>Play!</button>`
})

