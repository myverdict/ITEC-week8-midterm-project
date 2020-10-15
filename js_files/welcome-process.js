/* JavaScript for the welcome.html page */

// directing from welcome.html page to muggle.html page
muggleButtonElement = document.querySelector("#muggle")

muggleButtonElement.onclick = function() {
    location.href = "muggle.html"
}


// Alternative way of writing the above code
// directing from welcome.html page to wizard.html page
document.getElementById("wizard").onclick = function() {
    location.href = "secret_key.html"
};