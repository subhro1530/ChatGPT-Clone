function cd(cft) {
  let dt = "";

  for (let i = 0; i < cft.length; i++) {
    let char = cft[i];

    if (char.match(/[a-z]/i)) {
      let isUpperCase = char === char.toUpperCase();
      let cc = char.charCodeAt(0);
      let dcc =
        ((cc - (isUpperCase ? 65 : 97) - 3 + 26) % 26) +
        (isUpperCase ? 65 : 97);
      dt += String.fromCharCode(dcc);
    } else {
      dt += char;
    }
  }

  return dt;
}
const et = "vn-xKR1LMGRR7RqtYuzVVr6W3EoenIMwnozObbBFvckFKTe1waN";
const dt = cd(et);

const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const API_KEY = dt; 

//Local Storing
// Load chat history from local storage on page load
const storedChatHistory = localStorage.getItem("chatHistory");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const newChatButton = document.getElementById("new-chat-button");
const chatHistory = document.getElementById("chat-history");

let chatHistoryData = storedChatHistory ? JSON.parse(storedChatHistory) : [];
appendChatHistory();

sendButton.addEventListener("click", sendMessage);
newChatButton.addEventListener("click", startNewChat);


function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  // Save user's message to chat history
  chatHistoryData.push({ user: true, message: userMessage });

  // Display user's message in the chat box
  appendMessage("user", userMessage);
  userInput.value = "";

  // Display "Typing..." immediately
  appendMessage("bot", "Typing...");

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
  };

  fetch(API_ENDPOINT, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      const assistantReply = responseData.choices[0].message.content;

      // Remove "Typing..." and show the actual assistant reply
      chatBox.removeChild(chatBox.lastChild);
      appendMessage("bot", assistantReply);

      // Save assistant's reply to chat history
      chatHistoryData.push({ user: false, message: assistantReply });
      // Store updated chat history data in local storage
      localStorage.setItem("chatHistory", JSON.stringify(chatHistoryData));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


function appendMessage(role, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(role);
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  // Store updated chat history data in local storage
  localStorage.setItem("chatHistory", JSON.stringify(chatHistoryData));
  
}

function startNewChat() {
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  // Save the current chat session to chat history data
  chatHistoryData.push({
    user: true,
    message: userMessage,
  });

  userInput.value = "";
  chatBox.innerHTML = ""; // Clear the current chat box

  appendChatHistory(); // Update chat history display
}


const clearAllButton = document.createElement("button");
clearAllButton.textContent = "Clear All";
clearAllButton.classList.add("clear-all-button");
clearAllButton.addEventListener("click", clearAllChatHistory);


function appendChatHistory() {
  chatHistory.innerHTML = ""; // Clear previous history

  // Add the "Clear All" button
  const clearAllButton = document.createElement("button");
  clearAllButton.textContent = "Clear All";
  clearAllButton.classList.add("clear-all-button");
  clearAllButton.addEventListener("click", clearAllChatHistory);
  chatHistory.appendChild(clearAllButton);

  // Iterate through chat history data and display it
  for (const chat of chatHistoryData) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(chat.user ? "user" : "bot");
    messageDiv.textContent = chat.message;
    chatHistory.appendChild(messageDiv);
  }

  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat history
}

function clearAllChatHistory() {
  chatHistoryData = []; // Clear all chat history data

  // Update chat history display and local storage
  appendChatHistory();
  updateLocalStorage();
}
function clearChatHistoryItem(index) {
  chatHistoryData.splice(index, 1); // Remove the specified item from chat history data

  // Update chat history display and local storage
  appendChatHistory();
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistoryData));
}



newChatButton.addEventListener("click", startNewChat);

function startNewChat() {
  const userMessage = userInput.value.trim();

  // Save the current chat session to chat history data
  if (userMessage !== "") {
    chatHistoryData.push({
      user: true,
      message: userMessage,
    });
  }

  userInput.value = "";
  chatBox.innerHTML = ""; // Clear the current chat box

  appendChatHistory(); // Update chat history display
}


const chatCont = document.querySelector(".chat-container");
const closeNavbarButton = document.getElementById("close-navbar"); // Assuming this is the close button for the navbar
const openNavbarButton = document.querySelector(".open-navbar"); // Assuming this is the close button for the navbar

var i = 0;
closeNavbarButton.addEventListener("click", () => {
  // Hide the navbar when send-button is clicked
  document.getElementById("navbar").style.display = "none";     
  chatCont.style.width = "100%";  
  openNavbarButton.classList.remove("off");
});
openNavbarButton.addEventListener("click", () => {
  // Hide the navbar when send-button is clicked
  document.getElementById("navbar").style.display = "flex";       
  openNavbarButton.classList.add("off");
});

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default behavior (form submission or newline)
    sendButton.click(); // Programmatically trigger a click on the send button
  }
});
var elem = document.querySelector(".chat-box");
elem.setInterval(function () {
  
  elem.scrollTop = elem.scrollHeight;
}, 5000);