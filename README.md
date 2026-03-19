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
