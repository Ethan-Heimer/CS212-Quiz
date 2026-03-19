// The quiz json library will look for quiz data in this directory 
const defaultQuizDir="../../assets/quizzes"

/*
 * CreateQuizCardElements(string filter, function callback)
 * -- finds all 'quiz-card' elements and runs the callback function for each of 
 *    them. the callback is expected to return a string, that represents the child
 *    HTML for the quiz-card
 * -- the filter paramater tells the function to only display cards that have this 
 *    substring in the title.
 * -- returns nothing
 *
 */

function CreateQuizCardElements(filter, callback){
    // get all 'quiz-card' elements
    let quizzes = document.getElementsByTagName('quiz-card');

    // for each 'quiz-card' element...
    for(let i = 0; i < quizzes.length; i++){
        // get current 'quiz-card's json file name
        const fileName = quizzes[i].getAttribute("json");

        // get the title of the quiz
        const title = ParseQuizTitle(fileName);

        // check to see if the quiz's card should be rendered
        if(!title.includes(filter)){
            // if it should not be rendered, hide quiz and move on to the quiz element
            quizzes[i].style.display="none"
            continue;
        }

        // Create Quiz Card HTML
        CreateQuizCardElement(quizzes[i], fileName, callback);
    } 
}

/*
 * CreateQuizCardElement(HTMLElement quizElement, string fileName, function callback)
 * -- Gets the json object from a file and executes the callback function to build
 *    the quizElement's HTML body
 * -- returns nothing
 *
 */

function CreateQuizCardElement(quizElement, fileName, callback){
    // Get the json object from 'fileName'
    GetJsonFromFile(fileName)
        .then((json) => { // <== process json object
            // get the HTML body for the quiz's cards and set it
            const html = callback(fileName, json);
            quizElement.innerHTML = html;
        })
}

/*
 * string ParseQuizTitle(string fileName)
 * -- Takes a json file name and returns the title of the quiz
 * -- Returns a string
 */

function ParseQuizTitle(fileName){
    // remove '.json' from the string, then split the string where '_' is found
    let inputString = fileName.replace(".json", "")
    let tokens = inputString.split("_"); 

    // for each word in the title, capitalize the first letter
    for(let i = 0; i < tokens.length; i++){
        tokens[i] = (tokens[i].charAt(0).toUpperCase() + tokens[i].slice(1))
    }

    // return the title as a string
    return tokens.join(" ")
}

/*
 * RedirectToQuiz(string location, string quizFileName)
 * -- redirects the webpage to 'location', adds the 'quizFileName' to the URL as 
 *    a search param (url variable) 
 * -- returns nothing
 *
 */

function RedirectToQuiz(location, quizFileName){
    // change the windows location to the 'location' string + index.html + quiz data file name
    window.location.href=`${location}/index.html?quizdata=${quizFileName}`
}

/*
 * GetJsonFromURL()
 * -- Gets the json object from the file stored in the webpage URL
 * -- returns a promise object that can be used to read the json object
 */

async function GetJsonFromURL(){
    // get the quiz data file name from the URL and return the json from 
    // the file as a promise
    const fileName = GetQuizFileFromURL();
    return GetJsonFromFile(fileName)
}

/*
 * GetQuizFileFromURL()
 * -- reads the current URL and returns the json file name that's stored in the URL
 * -- returns the file name as a string
 *
 */

function GetQuizFileFromURL(){
    // Get the current url
    const url = window.location.search;
    
    // create URL Params object
    const urlParams = new URLSearchParams(url);

    // return the quiz data file name
    return urlParams.get("quizdata")
}

/*
 * GetJsonFromFile(string fileName)
 * -- Gets the json object from the a file
 * -- returns a promise object that can be used to read the json object
 */

async function GetJsonFromFile(fileName){
    // get the full path if the quiz
    const fullPath = `${defaultQuizDir}/${fileName}`

    // get the json file from 'the server'
    return fetch(fullPath)
        .then((response) => {
            // pasrse the response as json (this just parses the content of the 
            // file as json)
            let json = response.json();

            // add the quiz's title as a field in the json
            json["title"] = ParseQuizTitle(fileName)

            // return the json object to be processed
            return json;
        })
        // if an error occured while parsing
        .catch((error) => {
            // diplay a waring in the console
            console.warn(`Error parsing ${fullPath}: \n ${error}`)
        })
}
