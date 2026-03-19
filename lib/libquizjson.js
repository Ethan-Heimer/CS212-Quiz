const defaultQuizDir="../../assets/quizzes"

function CreateQuizCardElements(callback){
    let quizzes = document.getElementsByTagName('quiz-card');

    for(let i = 0; i < quizzes.length; i++){
        let parent = quizzes[i].parentElement;
        CreateQuizCardElement(quizzes[i], parent, callback);

        console.log(quizzes);
    } 

    while(quizzes.length > 0){
        console.log(quizzes);
        quizzes[quizzes.length-1].remove()  
    }
}

function CreateQuizCardElement(quizElement, parentElement, callback){
    const fileName = quizElement.getAttribute("json")
    const fullPath = `${defaultQuizDir}/${fileName}`

    console.log(quizElement.style);

    fetch(fullPath)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json);
            
            const html = callback(json);

            const newElement = document.createElement("div");
            newElement.innerHTML = html;
        
            newElement.classList = quizElement.classList;
            newElement.style.cssText = quizElement.style.cssText;

            parentElement.appendChild(newElement);
        })
        .catch((error) => {
            console.warn(`Error parsing ${fullPath}: \n ${error}`)
        })
}
