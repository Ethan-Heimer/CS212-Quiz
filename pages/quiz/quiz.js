function CreatePage(jsonData){
    console.log(jsonData)

    const title = document.getElementById("title");
    title.innerText = `Taking ${jsonData.title}`;
}

GetJsonFromURL().then((json)=>{
    CreatePage(json)
})


