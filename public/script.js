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
      if (!regenerateButtonGenerated) {
        const regenerateButton = document.createElement("button");
        regenerateButton.textContent = "Regenerate";
        regenerateButton.classList.add("regenerate-button");
        regenerateButton.addEventListener("click", () => {
          const lastUserMessage = getLastUserMessage();
          if (lastUserMessage) {
            // Display "Typing..." immediately
            appendMessage("bot", "Typing...");

            // Resend the last user message
            sendMessage(lastUserMessage);
          }
        });

        // Append the regenerate button to the messageDiv
        messageDiv.appendChild(regenerateButton);

        regenerateButtonGenerated = true; // Set to true after generating the button
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getLastUserMessage() {
  for (let i = chatHistoryData.length - 1; i >= 0; i--) {
    if (chatHistoryData[i].user) {
      return chatHistoryData[i].message;
    }
  }
  return null;
}
userInput.addEventListener("input", () => {
  const userMessage = userInput.value.trim();

  if (userMessage === "") {
    sendButton.style.backgroundColor = "transparent";
    sendButton.style.color = "grey";
  } else {
    sendButton.style.backgroundColor = "#19c37d";
    sendButton.style.color = "white";
  }
});

function appendMessage(role, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(role);

  const messageContent = document.createElement("div");
  messageContent.textContent = message;

  if (role === "user") {
    const userImage = document.createElement("img");
    userImage.src = "images/user-icon.png"; // Replace with the path to your user icon image
    userImage.alt = "User Icon"; // Alt text for accessibility
    userImage.classList.add("user-image");

    messageDiv.appendChild(userImage);
  }

  if (role === "bot") {
    const botImage = document.createElement("img");
    botImage.src = "images/chatgpt-logo.png"; // Replace with the correct path to your image
    botImage.alt = "ChatGPT Logo"; // Alt text for accessibility
    botImage.classList.add("bot-image");

    messageDiv.appendChild(botImage);
  }

  messageDiv.appendChild(messageContent);

  if (role === "bot") {
    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<i class="fas fa-copy"></i>'; // Use a copy icon
    copyButton.classList.add("copy-button");
    copyButton.addEventListener("click", () => {
      copyToClipboard(message);
    });

    // Append the copy button to the messageDiv
    messageDiv.appendChild(copyButton);
  }

  // Add a "Regenerate" button for bot responses
  if (role === "bot") {
    const regenerateButton = document.createElement("button");
    regenerateButton.textContent = "Regenerate";
    regenerateButton.classList.add("regenerate-button");
    regenerateButton.addEventListener("click", () => {
      const lastUserMessage = getLastUserMessage();
      if (lastUserMessage) {
        // Display "Typing..." immediately
        appendMessage("bot", "Typing...");

        // Resend the last user message
        sendMessage(lastUserMessage);
      }
    });

    // Append the regenerate button to the messageDiv
    messageDiv.appendChild(regenerateButton);
  }

  chatBox.appendChild(messageDiv);

  // Update scroll position to keep the chat-box scrolled to the bottom
  chatBox.scrollTop = chatBox.scrollHeight;

  // Store updated chat history data in local storage
  localStorage.setItem("chatHistory", JSON.stringify(chatHistoryData));

  // Update scroll position to keep the chat-box scrolled to the bottom
  scrollToBottom();
}

function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text; 
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  console.log("Copied to clipboard:", text);
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
    // appendChatEntry(role, chat.message);
  }

  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat history
}

function appendChatEntry(role, message) {
  const entryDiv = document.createElement("div");
  entryDiv.classList.add(role);

  const messageIcon = document.createElement("img");
  messageIcon.src = "https://icons.veryicon.com/png/o/miscellaneous/ios-icon-library/message-message-3.png"; // Replace with the path to your message icon image
  messageIcon.alt = "Message Icon"; // Alt text for accessibility
  messageIcon.classList.add("message-icon");

  const messageContent = document.createElement("div");
  messageContent.textContent = message;

  entryDiv.appendChild(messageIcon);
  entryDiv.appendChild(messageContent);

  chatHistory.appendChild(entryDiv);
}


function clearAllChatHistory() {
  chatHistoryData = []; // Clear all chat history data

  // Update chat history display and local storage
  appendChatHistory();
  updateLocalStorage();

  chatHistoryData = []; // Clear all chat history data

  // Update chat history display and local storage
  appendChatHistory();
  updateLocalStorage();

  // Scroll to the bottom after clearing history
  scrollToBottom();
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

// Function to scroll the chat-box to the bottom
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Create a function that simulates the typewriter animation:
function typeWriterEffect(message, callback) {
  let i = 0;
  const typingInterval = 50; // Adjust this interval for typing speed

  const typingIntervalId = setInterval(() => {
    if (i < message.length) {
      appendMessage("bot", message.substring(0, i + 1));
      i++;
    } else {
      clearInterval(typingIntervalId);
      if (typeof callback === "function") {
        callback();
      }
    }
  }, typingInterval);
}