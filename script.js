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
const et = "vn-2fHDAKvtdLIufCEGIKZ5W3EoenIMxAn0aMoU1TR4nkUmZUHH";
const dt = cd(et);

const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const API_KEY = dt; 
// API_KEY = "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";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const newChatButton = document.getElementById("new-chat-button");
const chatHistory = document.getElementById("chat-history");

const chatHistoryData = []; // To store chat history data

sendButton.addEventListener("click", sendMessage);
newChatButton.addEventListener("click", startNewChat);

function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  appendMessage("user", userMessage);
  userInput.value = "";

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
  };

  // Display "Typing..." immediately
  appendMessage("bot", "Typing...");

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

function appendChatHistory() {
  chatHistory.innerHTML = ''; // Clear previous history

  // Iterate through chat history data and display it
  for (const chat of chatHistoryData) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(chat.user ? "user" : "bot");
    messageDiv.textContent = chat.message;
    chatHistory.appendChild(messageDiv);
  }
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