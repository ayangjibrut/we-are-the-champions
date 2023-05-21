// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endrosement-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementDB = ref(database, "endorsementlist")

const endorsementEl = document.getElementById("endorsement-el") // textarea
const publishBtn = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")

publishBtn.addEventListener("click", function() {
    let data = {
        text: endorsementEl.value,
        from: fromEl.value,
        to: toEl.value
    }

    if (fromEl.value || toEl.value || endorsementEl.value)

    push(endorsementDB, data)

    clearInputEl()
})

onValue(endorsementDB, function(snapshot) {
    if (snapshot.exists()) {
        let entriesArray = Object.entries(snapshot.val())
    
        clearEndorsementListEl()
        
        for (let i = 0; i < entriesArray.length; i++) {
            let currentEntry = entriesArray[i]
            
            appendEntryToEndorsementListEl(currentEntry)
        }    
    } else {
        endorsementListEl.innerHTML = "No endorsement here... yet"
    }
})

function clearInputEl() {
    endorsementEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function appendEntryToEndorsementListEl(entry) {
    let entryText = entry[1].text
    let entryFrom = entry[1].from
    let entryTo = entry[1].to

    let itemID = entry[0]
    
    let newEl = document.createElement("li")
    newEl.innerHTML = `<p class="bold-p">To: ${entryTo}</p> 
    <p>${entryText}</p>`

    let divEl = document.createElement("div")
    divEl.innerHTML = `<span class="bold-p">From: ${entryFrom}</span>`

    newEl.addEventListener("click", function() {
         let exactLocationOfItemInDB = ref(database, `endorsementlist/${itemID}`)
        
         remove(exactLocationOfItemInDB)
    })
    newEl.append(divEl)
    endorsementListEl.append(newEl)
}


