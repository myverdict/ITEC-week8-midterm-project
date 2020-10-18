/* Comes from the wizard2.html page */
let identityURL = "https://robohash.org/"                   // wizard's identity API from robohash

let potterURL = "https://www.potterapi.com/v1/"             // Harry potter API
let potterKey = "$2a$10$PMX2TriQkztzfvflLahMZ.Zq7q8UjxBd7wAub3yJ0KgPAvc2rI6E."      // Key for the Harry Pooter API

let searchButtonElement = document.querySelector("#search-username")            // Search button
let wizardNameInputElement = document.querySelector("#wizardName")              // name input box
let errorMessageForWizardName = document.querySelector("#error-message")        // error message for input box
let welcomeMessage = document.querySelector("#welcome-wizard-message")          // welcome wizard message
let instructionsElement = document.querySelector("#instructions")               // give instructions to wizard
let studentBioTableElement = document.querySelector("#bio")                     // wizard table
let storyElement = document.querySelector("#story")                             // story for wizard
let clickMeButtonElement = document.querySelector("#click-me")                  // Click Me button
let acceptContractButtonElement = document.querySelector("#accept")             // Accept contract button

// hide the click me button until table data is displayed
clickMeButtonElement.style.visibility = "hidden"

// hide the accept contract button until contract is displayed.
acceptContractButtonElement.style.visibility = "hidden"

// collect the wizard bio info
let wizardBio = { "Wizard Name": "", "House": "", "Mentor": "" }
let wizardName                                      // wizard's name
let assignedGroup                                   // wizard's house
let mentor                                          // wizard's mentor

// Collect other information from the potter API
let mentorHouse
let mentorRole
let mentorSpecies
let mentorBloodStatus

// for creating wizard identity image
// get the reference for the loader
let loadingWizardImageElement = document.querySelector("#loading-wizard-image")
let canvas = document.querySelector("#canvas")      // get the reference to the canvas
let context = canvas.getContext("2d")               // create a context
let objectImageURL                                  // student image url
let image                                           // student photo

// to get the hat image
let hatImageElement = document.querySelector("#hatImage")
let hatImage

// to assign house image
let houses = [ 'Gryffindor', 'Ravenclaw', 'Slytherin', 'Hufflepuff' ]
let sortingHatImageElement = document.querySelector("#sorting-hat-group")
let groupFirstLetter                                // taken from assignedGroup variable
let groupImage

let contractText

// after the user clicks the search button
searchButtonElement.addEventListener("click", function() {
    wizardName = wizardNameInputElement.value.trim()          // get the wizard's name

    if(wizardName.length < 1)               // Validate that the user enters at least 1 letter
    {
        // If user does not enter at least 1 letter, display this message
        errorMessageForWizardName.innerHTML = "Please enter at least ONE character"
        return                              // stop processing
    }
    else                                    // when user enters at least 1 character
    {
        searchButtonElement.disabled = true;                // disable the search button
        wizardNameInputElement.disabled = true;             // disable the input box
        errorMessageForWizardName.innerHTML = "";           // clear the error message

        // Once the user enters a name, change the Welcome innerHTML & add the name to the page
        welcomeMessage.innerHTML = `Welcome, ${wizardName.toUpperCase()} !`

        // Set the wizard's name in the wizardBio object
        wizardBio["Wizard Name"] = wizardName.toUpperCase()

        // complete the API URL for the fetchingWizardImage function
        identityURL = identityURL + wizardName + "?set=set5"
    }

    fetchingWizardImage()                       // callback function to get the wizard's image
})


// after the wizard clicks the hat
hatImageElement.addEventListener("click", function() {
    wizardNameInputElement.remove();                                    // remove the wizardNameInputElement
    searchButtonElement.remove();                                       // remove the search button element
    hatImageElement.remove();                                           // remove the hat image element

    let randomIndex = Math.floor(Math.random() * 4)                     // returns a random integer from 0 to 3

    assignedGroup = houses[randomIndex]                                 // wizard's house
    wizardBio.House = assignedGroup                                     // set the wizard's house in the wizardBio object

    // get the first character of the assigned group: r, s, g, or h
    groupFirstLetter = assignedGroup.charAt(0).toLowerCase()

    // set up the house crest image
    if(groupImage == null)                                              // if there is no group image
    {
        groupImage = new Image()                                        // create a new image element
        groupImage.src = `images/houses/${groupFirstLetter}.png`        // set the image source
        groupImage.width = 200;                                         // set the image width
        groupImage.height = 200;                                        // set the image height
        sortingHatImageElement.appendChild(groupImage)                  // append the image to the html page
    }

    instructionsElement.innerHTML = "";                                 // clear the instructions

    fetchMentor()               // callback function to fetch wizard's mentor & display table
})


// after the user clicks the click me button to display contract
clickMeButtonElement.addEventListener("click", function() {
    // for typing effect
    let i = 0;
    contractText = `CONTRACT: I, ${mentor.toUpperCase()}, declare thee, ${wizardName.toUpperCase()}, 
                    mine own mentee. `
    let speed = 40;

    if(mentorSpecies != "human" && mentorSpecies != undefined)
    {
        contractText += `I desire thee knoweth yond i am not a human, but a ${mentorSpecies}. `
    }
    else if(mentorBloodStatus === "muggle")
    {
        contractText += `What i signeth h're, i shalt f'rget the next minute. 
                         So, rememb'r yond ev'ry sir is on his owneth. `
    }

    if(mentorHouse === wizardBio.House)
    {
        contractText += `Hurray, we belongeth to the same house. We art going to has't so much excit'ment. `
    }
    else if(mentorHouse != undefined)
    {
        contractText += `I belongeth to house ${mentorHouse} and thee belongeth to house ${wizardBio.House}. 
                         Sweet w'rds shall not beest off'red, but training and practiceth shalt beest adh'r'd. `
    }
    else
    {
        contractText += `Trusteth me and i shall guideth thee through heaven and hell. 
                         Doubteth me and thou shall not knoweth what to doth. `

        if(mentorBloodStatus === "muggle")
        {
            contractText += `That is a Joke! Ha Ha Ha! `
        }
    }

    // for typing effects
    function typeWriter() {
        if(i < contractText.length)
        {
            storyElement.innerHTML += contractText.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
        else
        {
            // display the accept contract button, so that the wizard can click it.
            acceptContractButtonElement.style.visibility = "visible"
        }
    }

    typeWriter();                               // callback function

    clickMeButtonElement.remove()               // remove the click me button element
})


let textBlockInsideImageElement = document.querySelector("#text-block")
textBlockInsideImageElement.style.visibility = 'hidden'                     // initially hide the contract element

// When the wizard accepts the contract
acceptContractButtonElement.addEventListener("click", function(){
    textBlockInsideImageElement.style.visibility = 'visible'                // now show the contract element

    // set the contract in the wizard info section
    contractText += "<hr>Signed & Sealed: " + wizardBio.Mentor + " & " + wizardName;
    textBlockInsideImageElement.innerHTML = contractText;

    // remove the story element div and accept contract button from the html
    storyElement.innerHTML = "";
    acceptContractButtonElement.remove();

    // display final message after 2 seconds
    setTimeout(function() { storyElement.innerHTML = `Your documents have been filed. 
                            Now enough of the greetings, and get to your classes!` }, 2000);
})


// fetch the wizard's image from robohash API & displaying the wizard's hat
function fetchingWizardImage() {
    // set loader icon from bootstrap until image comes through
    // set the class & role for the div id loading-wizard-image in the html
    loadingWizardImageElement.className = "spinner-border text-warning"
    loadingWizardImageElement.role = "status"

    fetch(identityURL)
        .then( (response) => {
            if(!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else
            {
                return response.blob()
            }
        })
        .then( (myBlob) => {
            loadingWizardImageElement.style.visibility = "hidden";          // hide the loader

            objectImageURL = URL.createObjectURL(myBlob);       // returns a URL pointing to the object.
            image = new Image();                                // Create an image element
            image.src = objectImageURL;                         // set the image source attribute

            // listen for the event that the image is ready to load
            image.addEventListener("load", function () {
                context.drawImage(image, 25, 10, 200, 100);                 // draw the image
            })
        })
        .catch( (err) => {
            alert("Error: " + err)
            console.log("ERROR: ", err)
        })
        .finally( () => {
            if(hatImage == null)                        // if there is no hat image
            {
                hatImage = new Image();                 // create a new image element
                hatImage.src = "images/hat.png"         // set the image source
                hatImage.width = 100;                   // set the image width
                hatImage.height = 100;                  // set the image height
                hatImageElement.appendChild(hatImage)   // append the image to the html page
            }

            // instruct the wizard to click the hat
            instructionsElement.innerHTML = `${wizardName}, if you see the hat, click the hat`
        })
}


// fetch the wizard's mentor from the Potter API, generate wizard's table, & show the click me button
function fetchMentor() {
    potterURL = potterURL + "characters" + "?key=" + potterKey

    let randomIndex = Math.floor(Math.random() * 196)           // returns a random integer from 0 to 195
    console.log(randomIndex)

    fetch(potterURL)
        .then( (response) => {
            return response.json()
        })
        .then ( (data) => {
            mentor = data[randomIndex].name                     // allot the random mentor to the wizard
            wizardBio.Mentor = mentor                           // set the wizardBio Mentor data
            console.log("Mentor name: " + mentor)

            if(data[randomIndex].role != undefined)             // Get mentor's role if any
            {
                mentorRole = data[randomIndex].role
                console.log("Mentor role: " + mentorRole)
            }

            if(data[randomIndex].house != undefined)            // Get mentor's house if any
            {
                mentorHouse = data[randomIndex].house
                console.log("Mentor House: " + mentorHouse)
            }

            if(data[randomIndex].bloodStatus === "muggle")
            {
                mentorBloodStatus = data[randomIndex].bloodStatus
                console.log("Mentor Blood Status: " + mentorBloodStatus)
            }

            if(data[randomIndex].species != "human")            // Get mentor's species if other than human
            {
                mentorSpecies = data[randomIndex].species
                console.log("Mentor Species: " + mentorSpecies)
            }
        })
        .catch( (err) => {
            alert("Error: " + err)
            console.log("ERROR: ", err)
        })
        .finally( () => {
            generate_table()                            // callback function to generate the table

            // hide the click me button until table data is displayed
            clickMeButtonElement.style.visibility = "visible"
        })
}


// function to generate wizard's bio data
function generate_table() {
    // create a table and a table body element
    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");

    // get the key values of the wizardBio
    let wizardBioKeys = Object.keys(wizardBio)
    let wizardBioValues = Object.values(wizardBio)

    for(let row = 0; row < 3; row++)                        // creating all cells
    {
        let tblRow = document.createElement("tr");          // create a table row

        for(let col = 0; col < 2; col++)
        {
            let cell
            let cellText

            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            if(col === 0)
            {
                cell = document.createElement("th")
                cellText = document.createTextNode(wizardBioKeys[row])
                cell.appendChild(cellText)
            }
            else
            {
                cell = document.createElement("td")
                cellText = document.createTextNode(wizardBioValues[row])
                cell.appendChild(cellText)
            }

            tblRow.appendChild(cell)
        }

        tblBody.appendChild(tblRow)             // add the row to the end of the table body
    }

    tbl.appendChild(tblBody);                   // put the <tbody> in the <table>
    studentBioTableElement.appendChild(tbl);    // appends <table> into studentBioTableElement
    tbl.setAttribute("border", "2");            // sets the border attribute of tbl to 2;
}


// enter key button function for the search button
document.addEventListener("keyup", function(event) {
    if(event.key === "Enter" || event.keyCode === 13)
    {
        searchButtonElement.click()                         // click the search button
        wizardNameInputElement.value = ""                   // clear the input box
    }
})


// go back to welcome.html page when the wizard clicks the return button
document.getElementById("go-back").onclick = function() {
    location.href = "welcome.html";
};

