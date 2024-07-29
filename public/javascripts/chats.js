function openChat(){
    document.getElementById("chat").style.display = "block";
    document.getElementById("start").style.display = "none";
    initial()
}

function closeChat(){
    document.getElementById("chat").style.display = "none";
    document.getElementById("start").style.display = "block";
}

function initial(){
    fetch("/api/data")
    .then((response) => response.json())
    .then((data) => display(data));  
}

function display(dataset){
    let chats = document.getElementById("message-section")
    chats.innerHTML = ""
    dataset.forEach(element => {
        chats.innerHTML += `
          <div class="message user">
            <span id="user-response"> ${element["queries"]} </span>
          </div>
          <div class="message bot">
          <div id="bot-response" >
              ${element["answers"]}
          </div>
          </div>
        `;
    });
    chats.scrollTop = chats.scrollHeight;

}

function submit(){
    let chats = document.getElementById("message-section")
    let input = document.getElementById("input")
    let query = input.value
    input.value = ""
    chats.innerHTML += `
          <div class="message user">
            <span id="user-response">
            ${query}
            </span>
          </div>
          <div class="message bot" id="loading">
          <div id="bot-response" >
              . . .
          </div>
          </div>
        `;
    chats.scrollTop = chats.scrollHeight;

    fetch('/api/input', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "input": query })
    })
    .then(response => response.json())
    .then(data => {
        loading = document.getElementById("loading")
        chats.removeChild(loading)
        chats.innerHTML += `
          <div class="message bot">
          <div id="bot-response" >
              ${data}
          </div>
          </div>
        `;
        chats.scrollTop = chats.scrollHeight;
    });
}

