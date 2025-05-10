// modules/chatbot/chatbot.js

/**
 * ChatBot Module
 * Handles all chatbot interaction functionality
 */

// Core chatbot functionality
export function initChatbot() {
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatWindow = document.getElementById('chatWindow');
  
  // Initialize - scroll to bottom of chat
  scrollToBottom();
  
  // Send message when form is submitted
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const message = userInput.value.trim();
      if (message !== '') {
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        userInput.value = '';
        
        // Simulate bot response after a short delay
        setTimeout(() => {
          // In a real implementation, this would be replaced with an API call
          simulateBotResponse(message);
        }, 750);
      }
    });
  }
  
  // Function to add user message to chat
  function addUserMessage(message) {
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
  
  // Function to add bot message to chat
  function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', 'bot-message');
    
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
          ${message}
        </div>
      </div>
    `;
    
    chatWindow.appendChild(messageElement);
    scrollToBottom();
  }
  
  // Function to scroll chat to bottom
  function scrollToBottom() {
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }
  
  // Helper function to escape HTML to prevent XSS
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
  
  // Simulate bot response (placeholder for actual API integration)
  function simulateBotResponse(userMessage) {
    // This is where you would normally call your actual chatbot API
    // For now, we'll just simulate some responses
    
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = `<p>Hello! How can I help you understand Malaysia's diesel subsidy policy today?</p>`;
    } 
    else if (lowerMessage.includes('subsidy') && lowerMessage.includes('policy')) {
      response = `
        <p>Malaysia's diesel subsidy policy was reformed in June 2024, moving from a blanket subsidy to a targeted approach.</p>
        <p>Here are some key points:</p>
        <ul>
          <li>The price increased from RM2.15 to RM3.35 per liter in Peninsular Malaysia</li>
          <li>Sabah, Sarawak & Labuan maintained the subsidized price of RM2.15</li>
          <li>Eligible low-income individuals can apply for cash assistance of RM200 monthly</li>
          <li>The reform aims to save the government approximately RM4 billion annually</li>
        </ul>
        <p>Would you like more specific information about any aspect of the policy?</p>
      `;
    }
    else if (lowerMessage.includes('eligibility') || lowerMessage.includes('qualify')) {
      response = `
        <p>To be eligible for the targeted diesel subsidy in Malaysia, you need to meet these criteria:</p>
        <ul>
          <li>Valid Malaysian citizenship</li>
          <li>Meet the individual or household income threshold</li>
          <li>Own a private diesel vehicle registered with JPJ</li>
          <li>Vehicle should be non-luxury and under 10 years old</li>
        </ul>
        <p>Applications can be submitted through the official portal at budimadani.gov.my</p>
      `;
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      response = `
        <p>Current diesel prices in Malaysia (as of June 2024):</p>
        <ul>
          <li>Peninsular Malaysia: RM3.35 per liter (market price)</li>
          <li>Sabah, Sarawak & Labuan: RM2.15 per liter (subsidized)</li>
        </ul>
        <p>This represents a 56% increase for Peninsular Malaysia from the previous subsidized price of RM2.15 per liter.</p>
      `;
    }
    else {
      response = `
        <p>I'm here to help you understand Malaysia's diesel subsidy policy. You can ask me about:</p>
        <ul>
          <li>The details and objectives of the current policy</li>
          <li>How this policy might affect your personal finances</li>
          <li>The broader economic impacts on prices and industries</li>
          <li>Eligibility criteria for targeted assistance</li>
          <li>Regional price differences</li>
        </ul>
        <p>What specific aspect would you like to know more about?</p>
      `;
    }
    
    addBotMessage(response);
  }
}

/**
 * Predefined Questions Module
 * Handles the quick questions buttons below the chatbot
 */
export function initPredefinedQuestions() {
  const questionButtons = document.querySelectorAll('.question-button');
  const userInput = document.getElementById('userInput');
  
  // Handle predefined question buttons
  if (questionButtons && userInput) {
    questionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const question = this.textContent.trim();
        userInput.value = question;
        
        // Focus on input and trigger input event for any listeners
        userInput.focus();
        userInput.dispatchEvent(new Event('input'));
        
        // Optional: automatically submit the form
        // const chatForm = document.getElementById('chatForm');
        // if (chatForm) chatForm.dispatchEvent(new Event('submit'));
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
 * Main initialization function for the chatbot page
 */
export function initChatbotPage() {
  // Check if we're on the chatbot page
  const isChatbotPage = document.querySelector('.chatbot-page') !== null;
  
  if (isChatbotPage) {
    // Initialize all chatbot components
    initChatbot();
    initPredefinedQuestions();
    initCategoryTabs();
    
    console.log('Chatbot initialized successfully');
  }
}