let key = "$2a$10$PMX2TriQkztzfvflLahMZ.Zq7q8UjxBd7wAub3yJ0KgPAvc2rI6E."
let url = `https://www.potterapi.com/v1/spells?key=${key}`

let unorderedListElementSpells = document.querySelector("#cast-spell")
// console.log(orderedListElementSpells)                                // debug

let wrongLiElements
let rightLiElement
let muggleMessageElement = document.querySelector("#muggle-message")
let numberOfSpells
let spells = []

fetching()              // callback function

function fetching() {
    fetch(url)
        .then( (response) => {
            return response.json()
        })
        .then( (spellData) => {
            console.log(spellData)                                      // debug: list of all spells data
            numberOfSpells = spellData.length
            console.log(`There are ${numberOfSpells} spells.`)          // debug

            console.log("Spells that includes the word 'opens': ")      // debug
            spellData.forEach(function(eachSpell) {
                if(eachSpell.effect.includes("opens"))
                {
                    console.log(`${eachSpell.effect}: ${eachSpell.spell}`)      // debug: list of spell effects that opens
                    spells.push(eachSpell.spell)
                }
            })

            displaySpells()         // callback function to display the list
            liListens()             // callback function to display muggle error messages
        })
        .catch(err => {
            console.log("Error: " + err)
        })
}


function displaySpells() {
    unorderedListElementSpells.innerHTML = spells.map( (eachSpell) => {
        if(eachSpell === "Alohomora")
        {
            return `<a href="./wizard.html"><li id="enter-hogwarts">${eachSpell}</li></a>`
        }
        else
        {
            return `<li class="not-permitted">${eachSpell}</li>`
        }
    }).join("")
}


function liListens() {
    wrongLiElements = document.querySelectorAll(".not-permitted")
    console.log(`There are ${wrongLiElements.length} list items for wrong spells.`)            // debug

    rightLiElement = document.querySelectorAll("#enter-hogwarts")
    console.log(`There is ${rightLiElement.length} list item for the right spell.`)            // debug

    unorderedListElementSpells.addEventListener("click", function() {
        if(rightLiElement.onclick)                      // THIS IS NOT WORKING
        {
            muggleMessageElement.innerHTML = "";
            console.log("right one clicked")
        }
        else
        {
            console.log("wrong one clicked")
            wrongLiElements.forEach(function(element) {
                muggleMessageElement.innerHTML = `You are an imposter !<br>
                                          Worse than Frankenstein, the Monster !<br>
                                          Get out of here !`
            })

            // error message disappears after 3 seconds (3000 milliseconds)
            setTimeout( function() { muggleMessageElement.innerHTML = "" }, 3000 )
            // setInterval( function() { muggleMessageElement.innerHTML = "" }, 3000)
        }
    })
}


// go back to welcome.html page when user clicks return button
document.getElementById("go-back").onclick = function() {
    location.href = "welcome.html";
};
