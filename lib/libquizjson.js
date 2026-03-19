console.log("Testing")

const defaultQuizDir="../../assets/quizzes"

function ParseQuizElement(element){
    const fileName = element.getAttribute("json")
    const fullPath = `${defaultQuizDir}/${fileName}`

    fetch(fullPath)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json);
            element.innerText = json.test;
        })
        .catch((error) => {
            console.warn(`Error parsing ${fullPath}: \n ${error}`)
        })
}
