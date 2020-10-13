/* Comes from the wizard.html page */
let identityURL = "https://robohash.org/"                   // wizard's identity API

let potterURL = "https://www.potterapi.com/v1/"             // Harry potter API
let potterKey = "$2a$10$PMX2TriQkztzfvflLahMZ.Zq7q8UjxBd7wAub3yJ0KgPAvc2rI6E."

let searchButtonElement = document.querySelector("#search-username")
let wizardNameInputElement = document.querySelector("#wizardName")
let errorMessageForWizardName = document.querySelector("#error-message")
let welcomeMessage = document.querySelector("#welcome-wizard-message")
let instructionsElement = document.querySelector("#instructions")
let studentBioElement = document.querySelector("#bio")              // for table

let wizardName                                      // wizard's name

// for creating wizard identity image
let canvas = document.querySelector("#canvas")      // get the reference to the canvas
let context = canvas.getContext("2d")               // create a context
let objectImageURL                                  // student image url
let image                                           // student photo

let hatImageElement = document.querySelector("#hatImage")
let hatImage

let houses = [ 'Gryffindor', 'Ravenclaw', 'Slytherin', 'Hufflepuff' ]
let sortingHatImageElement = document.querySelector("#sorting-hat-group")
let assignedGroup
let groupFirstLetter
let groupImage

let mentor


searchButtonElement.addEventListener("click", function() {
    wizardName = wizardNameInputElement.value.trim().toUpperCase()          // get the wizard's name

    // Validate that the user enters at least 1 letter
    if(wizardName.length < 1)
    {
        // If user does not enter at least 1 letter, display this message
        errorMessageForWizardName.innerHTML = "Please enter at least ONE letter."

        // clear the canvas if there was a previous image here
        context.clearRect(0, 0, canvas.width, canvas.height)

        return                          // stop processing
    }
    else
    {
        wizardNameInputElement.value = ""                   // clear the input box
        errorMessageForWizardName.innerHTML = ""            // clear the error message

        // Once the user enters a name, change the Welcome innerHTML & the name to the page
        welcomeMessage.innerHTML = `Welcome, ${wizardName} !`

        // complete the API URL
        identityURL = identityURL + wizardName // + "?set=set2"
        console.log(identityURL)                                        // debug

        // clear the canvas, if there was a previous image here
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    fetchingWizardImage()                       // callback function

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

    // set the student bio
    studentBioElement.innerHTML = `<table>
                                        <tr>
                                            <th>Wizard Name</th> 
                                            <td>${wizardName}</td>
                                        </tr>`
})

hatImageElement.addEventListener("click", function() {
    let randomIndex = Math.floor(Math.random() * 4)                     // returns a random integer from 0 to 3
    console.log("Random index for House is: " + randomIndex)            // debug

    assignedGroup = houses[randomIndex]
    console.log("House name: " + assignedGroup)

    // get the first character of the group: r, s, g, or h
    groupFirstLetter = assignedGroup.charAt(0).toLowerCase()

    if (groupImage == null)
    {
        groupImage = new Image()                                        // create a new image element
        groupImage.src = `images/houses/${groupFirstLetter}.png`        // set the image source
        groupImage.width = 200;                                         // set the image width
        groupImage.height = 200;                                        // set the image height
        sortingHatImageElement.appendChild(groupImage)                  // append the image to the html page
    }

    instructionsElement.innerHTML = "";

    studentBioElement.innerHTML += `<tr>
                                        <th>House</th> 
                                        <td>${assignedGroup}</td>
                                    </tr>`

    // hide the hat so that the wizard cannot click the hat again
    hatImageElement.style.visibility = "hidden"

    fetchMentor()           // callback function
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
            console.log("Mentor name is: " + mentor)                        // debug

            studentBioElement.innerHTML += `<tr>
                                                <th>Mentor</th> 
                                                <td>${mentor}</td>
                                            </tr>
                                        </table>`
        })
}


/*
// fetch information from the harry potter API
function fetchingPotterGroup() {
    potterURL = potterURL + "sortingHat" + "?key=" + potterKey
    console.log(potterURL)                                              // debug

    fetch(potterURL)
        .then( (response) => {
            return response.json()
        })
        .then( (sortingHatData) => {
            assignedGroup = sortingHatData
            console.log("Group name is: " + assignedGroup)                                      // debug

            // get the first character of the group: r, s, g, or h
            groupFirstLetter = assignedGroup.charAt(0).toLowerCase()

            if(groupImage == null)
            {
                groupImage = new Image()                            // create a new image element

                groupImage.src = `images/houses/${groupFirstLetter}.png`       // set the image source

                groupImage.width = 100;                   // set the image width
                groupImage.height = 100;                  // set the image height
                sortingHatImageElement.appendChild(groupImage)   // append the image to the html page
            }

            instructionsElement.innerHTML = "";
            // studentBioElement.innerHTML += `House: ${assignedGroup}<br>`
            studentBioElement.innerHTML += `<tr>
                                                <th>House</th> 
                                                <td>${assignedGroup}</td>
                                            </tr>
                                        </table>`
        })
}
*/

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

