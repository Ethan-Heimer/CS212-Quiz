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

    // get the filter as 2 tokens that represent 
    // [0] what to filter by
    // [1] the value to search for
    const filterTokens = filter.split(':');
    console.log(filterTokens)

    // for each 'quiz-card' element...
    for(let i = 0; i < quizzes.length; i++){
        // get current 'quiz-card's json file name
        const fileName = quizzes[i].getAttribute("json");

        // Create Quiz Card HTML
        CreateQuizCardElement(filterTokens, quizzes[i], fileName, callback);
    } 
}

/*
 * CreateQuizCardElement(HTMLElement quizElement, string fileName, function callback)
 * -- Gets the json object from a file and executes the callback function to build
 *    the quizElement's HTML body
 * -- returns nothing
 *
 */
function CreateQuizCardElement(filterTokens, quizElement, fileName, callback){
    // Get the json object from 'fileName'
    GetJsonFromFile(fileName)
        .then((json) => { // <== process json object
            //check if this card should be displayed given the tokens of in the filter
            let filterBy="title"
            let search=""

            //in the case where one token is passed in, assume filter by title and 
            //token is search value
            if(filterTokens.length == 1)
                search = filterTokens[0]
            //in the case where two tokens are passed in, assume first is filter by value 
            //and second is the search value
            else if(filterTokens.length >= 2){
               filterBy=filterTokens[0]
               search=filterTokens[1]
            }

            console.log(json)
 
            //if json data does not match filter, dont execute the callback
            if(!json['header'][filterBy].includes(search))
                return; 

            // get the HTML body for the quiz's cards and set it
            const html = callback(fileName, json["header"]);
            quizElement.innerHTML = html;
        })
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
    let isGitHub = window.location.hostname.includes("github");

    window.location.href=`${isGitHub ? "/CS212-Quiz" : ""}${location}/index.html?quizdata=${quizFileName}`
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
            return response.json();
        })
        .then((json) => {
            // return the json object to be processed
            return json;
        })
        // if an error occured while parsing
        .catch((error) => {
            // diplay a waring in the console
            console.warn(`Error parsing ${fullPath}: \n ${error}`)
        })
}
