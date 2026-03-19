# Internal Documentation for CS212 Quiz App

## Home page 
The site is currently hosted on github pages.

[This is the link to the home page](https://ethan-heimer.github.io/CS212-Quiz/pages/home/)

## Project Map
### Pages
Website pages are found at `pages/`. Each page is its own folder that contains an `index.html` file.
Its very important that a pages HTML file is named `index.html` as github pages expect pages to be named this
to render. 
You can access a page by typing 'pages/{folder name}' after this project's github pages URL.

### Libraries
Libraries used for this project are found at `libs/`. Current Libraries: 
- `libquizjson.js` - A library developed for this project to help handle JSON data for quizzes.

### Assets
Assets for the webpage are found at `assets/`. Data for quizzes are found at `assets/quizzes`. 
'libquizjson.js' expects to find quiz data here.

## libquizjson
Documentation on how to use this library can be found [here](https://github.com/Ethan-Heimer/CS212-Quiz/blob/master/lib/libquizjson.js)

## How to add a quiz
### HTML
libquizjson defines a custon HTML tag called '<quiz-card>'. This is used to define a quiz card using a corrisponding json file.
You define the json file a quiz should use using it's `json` property.

Example:
```html
<quiz-card json="testquiz.json"></quiz-card>
```

another example can be found [here](https://github.com/Ethan-Heimer/CS212-Quiz/blob/master/pages/home/index.html)

### JavaScript
Calling `CreateQuizCardElements` from `libquizjson.js` genertates the html for all 
`<quiz-card>` elements. It does this by using a callback function that returns what
the HTML for the `<quiz-card>` should be.

Example
```JavaScript
CreateQuizCardElements("", (fileName, jsonBody) => {
    return `
        <h1>${jsonBody.title}</h1>
        <h3>${jsonBody.description}</h3>
        <p>Difficulty: ${jsonBody.difficulty}</p>
        <button onclick="RedirectToQuiz('/pages/quiz', '${fileName}')">Take Quiz!</button>`
})
```



