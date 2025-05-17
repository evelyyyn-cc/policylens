// modules/chatbot/chatbot.js

/**
 * ChatBot Module
 * Handles all chatbot interaction functionality
 */

// Shared utility functions

let conversation = [];
let promptCount = 0;

function trimConversation() {
  if (promptCount >= 5) {
    conversation = [];
    promptCount = 0;
  }
}

function saveConversation() {
  localStorage.setItem('policyLensChatHistory', JSON.stringify(conversation));
}

// Load conversation from localStorage
function loadConversation() {
  const savedConversation = localStorage.getItem('policyLensChatHistory');
  if (savedConversation) {
    conversation = JSON.parse(savedConversation);
    return true;
  }
  return false;
}

function clearConversation() {
  localStorage.removeItem('policyLensChatHistory');
  conversation = [];
  promptCount = 0;
}

function scrollToBottom() {
  const chatWindow = document.getElementById('chatWindow');
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Shared message functions
function addUserMessage(message) {
  const chatWindow = document.getElementById('chatWindow');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', 'user-message');
  
  messageElement.innerHTML = `
    <div class="message-avatar">
      <img src="/static/assets/images/user-avatar.svg" alt="User">
    </div>
    <div class="message-content">
      <div class="message-text">
        <p>${escapeHTML(message)}</p>
      </div>
    </div>
  `;
  
  chatWindow.appendChild(messageElement);
  scrollToBottom();
}

function addBotMessage(message, isHTML = true) {
  const chatWindow = document.getElementById('chatWindow');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', 'bot-message');
  
  // If the message isn't already HTML and isn't meant to be treated as HTML, escape it
  const messageContent = isHTML ? message : `<p>${escapeHTML(message)}</p>`;
  
  messageElement.innerHTML = `
    <div class="message-avatar">
      <img src="/static/assets/images/bot-avatar.svg" alt="PolicyBot">
    </div>
    <div class="message-content">
      <div class="message-sender">
        <span class="bot-name">PolicyBot</span>
        <span class="bot-badge">🤖</span>
      </div>
      <div class="message-text">
        ${messageContent}
      </div>
    </div>
  `;
  
  chatWindow.appendChild(messageElement);
  setupChatbotLinks(messageElement);
  scrollToBottom();
}

// Set up internal link handling for chatbot responses
function setupChatbotLinks(messageElement) {
  // Find all links in the message
  const links = messageElement.querySelectorAll('a');
  
  links.forEach(link => {
    // Check if it's an internal link (starts with /)
    if (link.getAttribute('href') && link.getAttribute('href').startsWith('/')) {
      // Add click handler to prevent default behavior for internal links
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the URL
        const url = this.getAttribute('href');
        
        // Navigate to the URL
        window.location.href = url;
      });
    }
  });
}

// Remove typing indicator if present
function removeTypingIndicator() {
  const chatWindow = document.getElementById('chatWindow');
  const typingIndicator = chatWindow.querySelector('.bot-message:last-child');
  if (typingIndicator && typingIndicator.innerHTML.includes("PolicyBot is thinking")) {
    typingIndicator.remove();
  }
}

// Shared API call function
async function fetchBotResponse(question, isPredefined = false) {
  try {
    const response = await fetch('/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Uncomment if using CSRF protection
        // 'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ 
        question: question,
        isPredefined: isPredefined,
        conversation: conversation
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Remove typing indicator
    removeTypingIndicator();

    // Format the response with sources
    let botResponseHtml = data.answer;
    console.log("Raw answer from API:", data.answer);
    if (data.sources && data.sources.length > 0) {
      botResponseHtml += "<p><strong>Sources:</strong></p><ul>";
      data.sources.forEach(source => {
        const title = source.Title ? escapeHTML(source.Title) : "Unknown Source";
        botResponseHtml += `<li>${title}</li>`; 
      });
      botResponseHtml += "</ul>";
    }
    
    // Add the bot's response
    addBotMessage(botResponseHtml);
    console.log("Formatted HTML:", botResponseHtml);
    conversation.push({role:'assistant',content:data.answer})
    promptCount++;
    trimConversation();
    saveConversation();

    return true;
  } catch (error) {
    console.error('Error fetching bot response:', error);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Show error message
    addBotMessage("I'm sorry, I encountered an error. Please try again later.");
    
    return false;
  }
}

// Core chatbot functionality
export function initChatbot() {
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatWindow = document.getElementById('chatWindow');

  const hasSavedConversation = loadConversation();
  
  if (hasSavedConversation) {
    chatWindow.innerHTML = '';

    conversation.forEach(msg => {
      if(msg.role == 'user'){
        addUserMessage(msg.content);
      } else if (msg.role == 'assistant'){
        addBotMessage(msg.content)
      }
    });
  } else {
    const initialBotMessage = document.querySelector('.bot-message .message-text');
    if (initialBotMessage){
      const initialContent = initialBotMessage.textContent || "";
      if (initialContent){
        conversation.push({role:'assistant',content:initialContent});
        promptCount++;
      }
    }
  }
  // Initialize - scroll to bottom of chat
  scrollToBottom();
  
  // Send message when form is submitted
  if (chatForm) {
    chatForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const message = userInput.value.trim();
      if (message !== '') {
        // Add user message to chat
        addUserMessage(message);
        conversation.push({role:'user',content:message})
        promptCount++;
        trimConversation();
        saveConversation();
        
        // Clear input
        userInput.value = '';

        // Show a typing indicator
        addBotMessage("<p><em>PolicyBot is thinking...</em></p>");
        
        // Call API to get bot response
        await fetchBotResponse(message, false);
      }
    });
  }
  // Add initial messages to conversation history
  // const initialBotMessage = document.querySelector('.bot-message .message-text');
  // if (initialBotMessage) {
  //   // Extract text content (simplified, this won't include formatting but good enough for context)
  //   const initialContent = initialBotMessage.textContent || "";
  //   if (initialContent) {
  //     conversation.push({role: 'assistant', content: initialContent});
  //     promptCount++;
  //   }
  // }
}



/**
 * Predefined Questions Module
 * Handles the quick questions buttons below the chatbot
 */
export function initPredefinedQuestions() {
  const questionButtons = document.querySelectorAll('.question-button');
  
  // Handle predefined question buttons
  if (questionButtons) {
    questionButtons.forEach(button => {
      button.addEventListener('click', async function() {
        const question = this.textContent.trim();
        console.log("Predefined question clicked:", question);
        
        // Add user message to chat
        addUserMessage(question);
        conversation.push({role:'user',content: question});
        promptCount++;
        trimConversation();
        saveConversation();
        // Show typing indicator
        addBotMessage("<p><em>PolicyBot is thinking...</em></p>");
        
        // Call API to get bot response
        await fetchBotResponse(question, true);
      });
    });
  }
}

/**
 * Category Tabs Handler
 * For the tabbed categories in the predefined questions section
 */
export function initCategoryTabs() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  const questionCategories = document.querySelectorAll('.question-category');
  
  if (categoryTabs.length > 0 && questionCategories.length > 0) {
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Get the category to show
        const category = this.getAttribute('data-category');
        
        // Hide all question categories
        questionCategories.forEach(cat => {
          cat.style.display = 'none';
        });
        
        // Show the selected category
        if (category === 'all') {
          questionCategories.forEach(cat => {
            cat.style.display = 'block';
          });
        } else {
          const selectedCategory = document.querySelector(`.question-category[data-category="${category}"]`);
          if (selectedCategory) {
            selectedCategory.style.display = 'block';
          }
        }
      });
    });
  }
}

/**
 * Function to handle collapsible question categories
 */
export function initCollapsibleCategories() {
  const collapsibles = document.querySelectorAll('.collapsible');
  
  collapsibles.forEach(collapsible => {
    collapsible.addEventListener('click', function() {
      // Toggle active class on this button
      this.classList.toggle('active');
      
      // Get the next element (the content panel)
      const content = this.nextElementSibling;
      
      // Toggle icon
      const icon = this.querySelector('i');
      
      // If the panel is already open, close it
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.classList.remove('active');
        if (icon) icon.className = 'fas fa-chevron-down';
      } else {
        // Close all other panels first
        document.querySelectorAll('.content').forEach(panel => {
          panel.style.maxHeight = null;
          panel.classList.remove('active');
        });
        
        // Reset all other icons
        document.querySelectorAll('.collapsible i').forEach(i => {
          i.className = 'fas fa-chevron-down';
        });
        
        // Remove active class from all other collapsibles
        document.querySelectorAll('.collapsible').forEach(coll => {
          if (coll !== this) coll.classList.remove('active');
        });
        
        // Then open this one
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.className = 'fas fa-chevron-up';
      }
    });
  });
}

/**
 * Main initialization function for the chatbot page
 */
export function initChatbotPage() {
  // Check if we're on the chatbot page
  const isChatbotPage = document.querySelector('.chatbot-page') !== null;
  
  if (isChatbotPage) {
    addChatbotStyles();
    // Initialize all chatbot components
    initChatbot();
    initPredefinedQuestions();
    initCategoryTabs();
    initCollapsibleCategories();
    
    console.log('Chatbot initialized successfully');
  }
}

/**
 * Add custom CSS styles for chatbot links
 */
function addChatbotStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Button-style links */
    .chat-message .btn-link {
        display: inline-block;
        padding: 10px 16px;
        background-color: #0073e6;
        color: white !important;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 10px 0;
        transition: background-color 0.3s ease;
    }

    .chat-message .btn-link:hover {
        background-color: #0056b3;
        text-decoration: none;
    }

    /* Standard text links */
    .chat-message a:not(.btn-link) {
        color: #0073e6;
        text-decoration: underline;
        font-weight: 500;
    }

    .chat-message a:not(.btn-link):hover {
        color: #0056b3;
        text-decoration: underline;
    }

    /* Sources section styling */
    .chat-message .sources-section {
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #e0e0e0;
        font-size: 0.9em;
        color: #666;
    }

    .chat-message .sources-section p {
        margin-bottom: 5px;
    }

    .chat-message .sources-section ul {
        margin-top: 5px;
        padding-left: 20px;
    }

    .chat-message .sources-section li {
        margin-bottom: 3px;
    }
  `;
  
  document.head.appendChild(styleElement);
}