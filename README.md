# Uniquiz - A Simple Quiz-taking platform.
[This is the link to the home page](https://ethan-heimer.github.io/CS212-Quiz/pages/home/)

## 1.0 Introduction and Problem Statement
Academic and professional environments are increasingly using digital learning
tools, however, as these tools are shipping with more features, student can start 
to feel overwhelmed. Our Quiz App project will be an interactive and simple web 
app that allows users to complete quizzes on a variety of subjects easly. 
We will show essential concepts of Web Programming by designing a platform where 
quizzes can be **searched**, **taken**, and **reviewed**.

## 1.1 Achieving our goals - ***Searched***
On the homepage of our website, there is a section for searching for a quiz. Quizzes
can be searched by using the following attributes assosiated with each quiz:

- Title - The Name of The Quiz
- Category - The Category Assigned to a Quiz (eg. Programming, Geology)
- Difficulty - The Difficulty Assigned to a Quiz (an integer from 1-5 to represent
how hard the quiz is)

When the user searches for quizzes that have 'Sedimetary' in the title, only
quizzes that satify that query will be shown on the home page.

## 1.2 Achieving our goals - ***Taken***
When the user clicks the 'Take Quiz!' button found on every quiz card on the home page
the user gets redirected to a new page for taking the quiz they've selected. This quiz
taking page has to states:

- Quiz-Taking State: The user is activly taking a quiz. Elements such as `score` and `time`
    are **mutable** in this state, as the user's actions will change the state of these variables.
- Review State: The user is finished taking the quiz. Elements such as `score` and `time` are
    **immutable**. The user has finished taking the quiz and their actions should not change the
    state of these variables.

The Quiz-Taking state is what will be focuses on in this section. A 'Quiz' in our
web app is defined as a JSON file, where that file contains a `header` portion with
details about the quiz and a `questions` section containing an array of `question`
objects. The exact details of how we store quiz information in JSON is covered later.

The exact details of how questions are represtented in JSON will be covered later too, 
however the two components that the this section cares about to properly display a question
are the following: 

- The **question** itself - A string like: "Which of the following is correct?"
- The list of possable **answers** - An array of strings where each string is a possable
answer to the question. 

Displaying a question on our webpage means displaying these two components to the user. 

The purpose of the 'Quiz Taking' state is to display each of thoes questions one-by-one.
When a question being displayed, the user can select 0 - *n* answers, 
where *n* is the amount of answers a question has. 

An answer is marked correct only of all correct answers are selected and submited
by the user. If the answer contains 2 correct answers, both must be selected to recieve
full points. If one but not the other the user will recieve partial credit, and if 
neither are correct the user will recieve 0 points towards their final score. For every 
correct answer that was not selected, `questionWeight/c` is subtracted from the 
questions weight to achieve the score for that question, where *c* is the *amount of correct answers that the current question has*

The *weight* of a question is how many points it attributes to the quiz's max (highest possable) score.
The max score is simply the sum of every question's weight. If a question has a *weight of 5*,
and the max score for a quiz is 10, then that question alone contributes *50%* of the total score.

The user's *final score* is the sum of all scores achieved on questions while the quiz 
was being taken. 

While the user is in this *Quiz-Taking* state, a timer is being incremented that represents 
how long the user has been taking a quiz. While this doesn't contribute to the final score of a quiz,
it is an important part to how the user may *review* a quiz. The user's final time is the
state of the timer when the quiz taking page's *Review-State* is reached. 

## 1.3 Achieving our goals - ***Reviewed***
'Reviewing' can mean different things to different projects and users. We've 
defined reviewing as:

*"The ability to see, compare, and understand past quiz performance"*

Giving the user the ability to compare and *review* past quiz performance gives
the user the ability to learn and improve through our website. The following data is
stored about a quiz so that the user may *review* their performance and improve later:

- The name of the quiz
- The user's score after taking the quiz
- The user's final time after taking the quiz

There's two sections on the webpage where the user can review past quiz data, both 
serve different purposes. 

 1. The user can look at every quiz they've taken, as well as their final score and time 
    on the home page. 
 2. After the user is done taking a quiz and in the quiz taking page's *Review* state, 
    the past scores and final times are displayed. 

Number 1 allows the user to review their perfomance across every quiz taken, while
Number 2 allows the user to review their performance across a single quiz. In both cases, 
the past quiz information is stored in a table. The quiz's *name*, *final score*, *percent
(final score/max score)*, and *final time* are displayed in this table. 

As mentioned before the 'quiz-taking` page contains two states, the *Quiz-Taking* state
and the *Review* state. While in the review state, the following occur:

- No questions are displayed
- The user's final score and final time is displayed
- The table of past quiz performance for this quiz only is displayed

The user only has 2 options to properly get out of this *Review* state:

- Retake the current quiz
- Go back to the home page

The purpose of all of the systems above is to encourage the user to *review* their past 
performance and incrementaly improve their knowledge using our quizzes.

## 2.0 Technical Details & Design
The following aims to describe how we've implemented our systems. There's many quirks
to how we've implemented different systems in this web app. These quirks were formed out 
of the challenged we've faced while developing this web app. The main challenges we've faced
were the following:

| Challange                                                              | Solution                                                                                                       |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| A challenge faced was how JSON files were going to be read and parsed. | JSON data is stored in a separate folder in the GitHub repository, and is read using the JavaScript fetch api. |
| As a backend server is not being used to deliver JSON files to the website, there is no way to fetch all possible JSON files from a server to then simply automatically display all quizzes into the page. | A custom HTML element was created named ‘quiz-card’ that has a property named ‘json’ used to store a JSON file corresponding to a quiz. JavaScript is used to read this property and display the correct quiz in a card format. |
| Creating the CSS for the application was a challenge as we wanted a modern and clean look to the webpage. Choosing the color scheme to represent the application was a challenge as well | e went through plenty of revisions and versions of the CSS until we found a style we liked best. With each revision, we found something that we thought should be changed and integrated on it. |
| Not only did redirecting to a different page have to work while running a web server on localhost, but it had to work on github pages as well. | Everytime the webpage needs to be redirected, we have to check whether the page is being accessed from github servers, or on localhost. To do this, we use the following code to check if we are visiting the webpage on github, and if so, make the proper changes to the URL to properly redirect a new page. |
| With the score being stored in the URL, It can be easily read and tempered with. This is not something we want the user to be able to change easily, we had to come up with a way to mask the score in the URL. | The masking algorithm we implemented takes a number like ‘3’, and turns it into a semi-random output like this: ‘UYT[[TVV-AHIEIE’. There's two numbers stored in this value, the first (before the -) is the score, the second (after the -) is a specific key number to decode the score. The original score is multiplied by both 3307 and 7919 to make it appear longer than just a single digit. Then the score is converted into ASCII, and shifted by a random value between 16 and 64. That random value is then taken, multiplied by 5417, ascii shifted by 16 and appended to the end of the decoded score value. |

## 2.1 Pages
Website pages are found at `pages/`. Each page is its own folder that contains an `index.html` file.
Its very important that a pages HTML file is named `index.html` as github pages expect pages to be named this
to render. 

Each page also has a `.css` file and `.js` file to make the page look nice and work correctly.

### 2.1.1 Page Redirection
Due to the fact that we wanted this project to work on github pages, and also on localhost,
redirecting the user to a different page is not as simple as setting calling `window.location.href`.
To correctly redirect the user, we check to see if the current domain is *github.com*, or if its 
somthing else. If we are on *github.com*, we mutate the URL in a way that will correctly redirect 
the user *(add CS212-Quiz after the domain but before where we actually want to redirect the user)*.

This is the actual code used:

```js
let isGitHub = window.location.hostname.includes("github");
window.location.href=`${isGitHub ? "/CS212-Quiz" : ""}${location}/index.html?quizdata=${quizFileName}`
```

## 2.2 Libraries
Libraries used for this project are found at `libs/`. Current Libraries: 
- `libquizjson.js` - A library developed for this project to help handle JSON data for quizzes.
- `libscore.js` - A library developed for this project used to help handle Score data for the quizzes. 

### 2.2.1 libquizjson.js

## 2.3 Assets
Assets for the webpage are found at `assets/`. Data for quizzes are found at `assets/quizzes`. 
'libquizjson.js' expects to find quiz data here.


## 2.4 How to add a quiz
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


## Important HTML IDs
| Id          | Description                                 |
|-------------|---------------------------------------------|
| `quiz-list` | The parent container for quiz card elements |

## Special CSS Selectors
### Quiz Cards

| Selector                    | Description                                              |
|-----------------------------|----------------------------------------------------------|
| `.quiz-card`                | Styles the outer, container element for the quiz cards.  |
| `.quiz-card > #title`       | Styles the title for quiz card elements.                 |
| `.quiz-card > #description` | Styles the description for quiz card elements.           |
| `.quiz-card > #difficulty`  | Styles the difficulty section for quiz card elements.    |
| `.quiz-card > button`       | Styles the 'take quiz' button for quiz card elements.    |

### Quiz answers

| Selector    | Description                                              |
|-------------|----------------------------------------------------------|
| `.selected` | Styles to apply to a answer when a button is selected    |



