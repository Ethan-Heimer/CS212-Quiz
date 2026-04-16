// -- Score Functions
function GetScoreParam(){
    const params = new URLSearchParams(window.location.search);
    const paramScore = params.get('score');

    if(!paramScore)
        return null;

    console.log(paramScore)
    return paramScore;
}

function EncodeScore(score){
    let primeScore = (score * 3307 * 7919);
    let primeScoreAsString = String(primeScore);

    let asciiKey = Math.floor((Math.random() * 48) + 16);

    let hashedString = [];
    let hashedAsciiKey = [];

    // hash score
    for(let i = 0; i < primeScoreAsString.length; i++){
        hashedString.push(String.fromCharCode(primeScoreAsString.charCodeAt(i) + asciiKey))
    }

    hashedString.push('-')

    // hash key
    asciiKey = asciiKey * 5417 
    let asciiKeyAsString = String(asciiKey);
    for(let i = 0; i < asciiKeyAsString.length; i++){
        hashedString.push(String.fromCharCode(asciiKeyAsString.charCodeAt(i) + 16))
    }

    return hashedString.join("")
}

function DecodeScore(encodedScore){
    //get shift key
    let tokens = encodedScore.split('-');

    let scoreToken = tokens[0];
    let keyToken = tokens[1]

    let unhashedKey = []
    for(let i = 0; i < keyToken.length; i++){ 
        unhashedKey.push(String.fromCharCode(keyToken.charCodeAt(i) - 16))
    }

    let key = Number(unhashedKey.join("")) / 5417;
    
    //shift ascii back
    let unhashedString = [];
    for(let i = 0; i < scoreToken.length; i++){
        unhashedString.push(String.fromCharCode(scoreToken.charCodeAt(i) - key))
    }

    let primeScore = Number(unhashedString.join(""))

    return primeScore / (3307 * 7919)
}

function AppendScore(quizName, score, maxScore){
    let pastScores = localStorage.getItem("Scores")
    if(pastScores == null)
        pastScores = [];
    else
        pastScores = JSON.parse(pastScores)

    pastScores.push({
        name: quizName,
        score: EncodeScore(score),
        maxScore: EncodeScore(maxScore),
    })

    localStorage.setItem("Scores", JSON.stringify(pastScores))
}

function GetPastScores(){
    let pastScores = localStorage.getItem("Scores")
    pastScores = JSON.parse(pastScores)

    return pastScores
}

// callbacka args: quizName: string, score: number, maxScore: number
function ForEachPastScore(filter, callback){
    let scores = GetPastScores();
    if(!scores)
        return;

    for(let i = scores.length-1; i >= 0; i--){
        let scoreData = scores[i];
        let score = DecodeScore(scoreData.score);
        let maxScore = DecodeScore(scoreData.maxScore);

        if(filter == null || scoreData.name == filter)
            callback(scoreData.name, score, maxScore)
    }
}
