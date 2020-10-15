/* Comes from the muggle.html page */

let url = "https://favqs.com/api/qotd"          // Quotes API

let saveButtonElement = document.querySelector("#save-username")
let nameInputElement = document.querySelector("#username")
let welcomeMessage = document.querySelector("#welcome-message")
let quoteOfTheDay = document.querySelector("#quote-of-the-day")

// Add an event listener for the mouse click of the save button
saveButtonElement.addEventListener("click", function() {
    let name = nameInputElement.value                       // get the user's name

    if(name.length < 2)                                     // Validate that the user enters at least 2 letters
    {
        // If user does not enter at least 2 letters, display thi message
        welcomeMessage.innerHTML = "Please enter at least 2 letters."
    }
    else                                                    // if user enters valid characters
    {
        nameInputElement.value = ""                         // clear the input box

        welcomeMessage.innerHTML = `Welcome, ${name}! `     // Create a welcomeMessage for the user
    }

    fetchingQuote()                                         // callback function that fetches the quote from an API
})

// function that fetches a quote from an API
function fetchingQuote() {
    fetch(url)
        .then( (res) => {
            return res.json()
        })
        .then( (quoteData) => {
            // display the quote of the day
            quoteOfTheDay.innerHTML = "<label>Quote of the day</label><br>" + quoteData.quote.body
        })
        .catch( (err) => {
            alert("Error: " + err)
            console.log("Error", err)
        })
}


// go back to welcome.html page when the user clicks the return button
document.getElementById("go-back").onclick = function() {
    location.href = "welcome.html";
};


// enter key button function for the save button
document.addEventListener("keyup", function(event) {
    if(event.key === "Enter" || event.keyCode === 13)
    {
        saveButtonElement.click()               // click the save button
        nameInputElement.value = ""             // clear the input box
    }
})