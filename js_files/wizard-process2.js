/* Comes from the wizard2.html page */
let identityURL = "https://robohash.org/"                   // wizard's identity API

let potterURL = "https://www.potterapi.com/v1/"             // Harry potter API
let potterKey = "$2a$10$PMX2TriQkztzfvflLahMZ.Zq7q8UjxBd7wAub3yJ0KgPAvc2rI6E."

let searchButtonElement = document.querySelector("#search-username")
let wizardNameInputElement = document.querySelector("#wizardName")
let errorMessageForWizardName = document.querySelector("#error-message")
let welcomeMessage = document.querySelector("#welcome-wizard-message")
let instructionsElement = document.querySelector("#instructions")
let studentBioTableElement = document.querySelector("#bio")

// collect the wizard bio info
let wizardBio = { "Wizard Name": "", "House": "", "Mentor": "" }
let wizardName                                      // wizard's name
let assignedGroup                                   // wizard's house
let mentor                                          // wizard's mentor

// for creating wizard identity image
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

// after the user clicks the search button
searchButtonElement.addEventListener("click", function() {
    wizardName = wizardNameInputElement.value.trim()          // get the wizard's name

    // Validate that the user enters at least 1 letter
    if(wizardName.length < 1)
    {
        // If user does not enter at least 1 letter, display this message
        errorMessageForWizardName.innerHTML = "Please enter at least ONE letter."

        // clear the canvas if there was a previous image here
        context.clearRect(0, 0, canvas.width, canvas.height)

        return                          // stop processing
    }
    // when user enters at least 1 character
    else
    {
        searchButtonElement.disabled = true;                // disable the search button
        wizardNameInputElement.disabled = true;             // disable the input box
        errorMessageForWizardName.innerHTML = "";           // clear the error message

        // Once the user enters a name, change the Welcome innerHTML & add the name to the page
        welcomeMessage.innerHTML = `Welcome, ${wizardName.toUpperCase()} !`

        // Set the wizard's name in the wizardBio object
        wizardBio["Wizard Name"] = wizardName.toUpperCase()
        console.log("Wizard name is: " + wizardBio["Wizard Name"])      // debug

        // complete the API URL for the fetchingWizardImage function
        identityURL = identityURL + wizardName // + "?set=set2"
        console.log(identityURL)                                        // debug

        // clear the canvas, if there was a previous image here
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    fetchingWizardImage()                       // callback function to get the wizard's image

    // if there is no hat image
    if(hatImage == null)
    {
        hatImage = new Image();                 // create a new image element
        hatImage.src = "images/hat.png"         // set the image source
        hatImage.width = 100;                   // set the image width
        hatImage.height = 100;                  // set the image height
        hatImageElement.appendChild(hatImage)   // append the image to the html page
    }

    // instruct the wizard to click the hat
    instructionsElement.innerHTML = `${wizardName}, please click the hat.`
})

// after the wizard clicks the hat
hatImageElement.addEventListener("click", function() {
    let randomIndex = Math.floor(Math.random() * 4)                     // returns a random integer from 0 to 3
    console.log("Random index for House is: " + randomIndex)            // debug

    assignedGroup = houses[randomIndex]                                 // wizard's house

    // set the wizard's house in the wizardBio object
    wizardBio.House = assignedGroup
    console.log("House name" + wizardBio.House)

    // get the first character of the assigned group: r, s, g, or h
    groupFirstLetter = assignedGroup.charAt(0).toLowerCase()

    // if there is no group image
    if (groupImage == null)
    {
        groupImage = new Image()                                        // create a new image element
        groupImage.src = `images/houses/${groupFirstLetter}.png`        // set the image source
        groupImage.width = 200;                                         // set the image width
        groupImage.height = 200;                                        // set the image height
        sortingHatImageElement.appendChild(groupImage)                  // append the image to the html page
    }

    instructionsElement.innerHTML = "";                                 // clear the instructions

    // hide the hat so that the wizard cannot click the hat again
    hatImageElement.style.visibility = "hidden"

    fetchMentor()                   // callback function to fetch wizard's mentor

    generate_table()                    // callback function to create wizard's bio
})


// fetch the wizard's image from robohash API
function fetchingWizardImage() {
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
            // returns a URL pointing to the object.
            objectImageURL = URL.createObjectURL(myBlob);

            image = new Image();                // Create an image element

            image.src = objectImageURL;         // set the image source attribute
            console.log(image)                  // debug

            // document.body.appendChild(image);

            // listen for the event that the image is ready to load
            image.addEventListener("load", function () {
                // wizardImageElement.appendChild(image)
                context.drawImage(image, 25, 10, 200, 100);                 // draw the image
            })
        })
}


// fetch the wizard's mentor
function fetchMentor() {
    potterURL = potterURL + "characters" + "?key=" + potterKey
    console.log(potterURL)                                                  // debug

    let randomIndex = Math.floor(Math.random() * 196)                       // returns a random integer from 0 to 195

    fetch(potterURL)
        .then( (response) => {
            return response.json()
        })
        .then ( (mentorNameData) => {
            console.log(mentorNameData)

            console.log("Random index for Mentor is: " + randomIndex)       // debug
            mentor = mentorNameData[randomIndex].name

            // set the wizardBio Mentor data
            wizardBio.Mentor = mentor
            console.log("Mentor name is: " + wizardBio.Mentor)                        // debug
        })
}


function generate_table() {
    // create a table and a table body element
    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");

    // get the key values of the wizardBio
    let wizardBioKeys = Object.keys(wizardBio)
    let wizardBioValues = Object.values(wizardBio)

    // creating all cells
    for(let row = 0; row < 3; row++)
    {
        let row = document.createElement("tr");          // create a table row

        for(let col = 0; col < 1; col++)
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

            row.appendChild(cell)
        }

        // add the row to the end of the table body
        tblBody.appendChild(row)
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);

    // appends <table> into studentBioTableElement
    studentBioTableElement.appendChild(tbl);

    // sets the border attribute of tbl to 1;
    tbl.setAttribute("border", "2");

    console.log("This is the table")
    console.log(wizardBioKeys)
    console.log(wizardBioValues)
}


// enter button function for the search button
document.addEventListener("keyup", function(event) {
    if(event.key === "Enter" || event.keyCode === 13)
    {
        searchButtonElement.click()                         // click the search button
        wizardNameInputElement.value = ""                   // clear the input box
    }
})


// go back to welcome.html page
document.getElementById("go-back").onclick = function() {
    location.href = "welcome.html";
};

