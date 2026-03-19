console.log("Home JS")

let quizzes = document.getElementsByTagName('quiz')
console.log(quizzes);

for(let i = 0; i < quizzes.length; i++){
   ParseQuizElement(quizzes[i]);
}
