/* Comes from the muggle.html page */

let url = "https://favqs.com/api/qotd"

let saveButtonElement = document.querySelector("#save-username")
let nameInputElement = document.querySelector("#username")
let welcomeMessage = document.querySelector("#welcome-message")
let quoteOfTheDay = document.querySelector("#quote-of-the-day")

// Add an event listener for the mouse click of the save button
saveButtonElement.addEventListener("click", function() {
    // get the user's name
    let name = nameInputElement.value

    // Validate that the user enters at least 2 letters
    if(name.length < 2)
    {
        // If user does not enter at least 2 letters, display thi message
        welcomeMessage.innerHTML = "Please enter at least 2 letters."
    }
    else
    {
        nameInputElement.value = ""             // clear the input box
        // Once the user enters a name, change the Welcome innerHTML & the name to the page
        welcomeMessage.innerHTML = `Welcome, ${name}! `
    }

    fetchingQuote()     // callback function
})

function fetchingQuote() {
    fetch(url)
        .then( (res) => {
            return res.json()
        })
        .then( (quoteData) => {
            quoteOfTheDay.innerHTML = "<label>Quote of the day</label><br>" + quoteData.quote.body
        })
        .catch( (err) => {
            alert("Error: " + err)
            console.log("Error", err)
        })
}

// go back to welcome.html page
document.getElementById("go-back").onclick = function() {
    location.href = "welcome.html";
};

// enter button function for the save button
document.addEventListener("keyup", function(event) {
    if(event.key === "Enter" || event.keyCode === 13)
    {
        saveButtonElement.click()               // click the save button
        nameInputElement.value = ""             // clear the input box
    }
})