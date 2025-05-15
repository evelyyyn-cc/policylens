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
    chatForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const message = userInput.value.trim();
      if (message !== '') {
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        userInput.value = '';

        // Show a typing indicator (optional)
        addBotMessage("<p><em>PolicyBot is thinking...</em></p>");
        
        try {
          const response = await fetch('/chat/', { // API call
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // If you're using Django's CSRF protection, you'll need to include the CSRF token
              // 'X-CSRFToken': getCookie('csrftoken') // You'll need a getCookie function
            },
            body: JSON.stringify({ question: message })
          });

          if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          // Remove typing indicator if you added one
          const typingIndicator = chatWindow.querySelector('.bot-message:last-child');
          if (typingIndicator && typingIndicator.innerHTML.includes("PolicyBot is thinking...")) {
            typingIndicator.remove();
          }

          // Display the actual bot response
          // You might want to format the sources as well if you plan to display them
          let botResponseHtml = `<p>${escapeHTML(data.answer)}</p>`;
          if (data.sources && data.sources.length > 0) {
            botResponseHtml += "<p><strong>Sources:</strong></p><ul>";
            data.sources.forEach(source => {
              // Assuming source.Title and a snippet of source.text might be relevant
              // Adjust based on what metadata you have and want to show
              const title = source.Title ? escapeHTML(source.Title) : "Unknown Source";
              botResponseHtml += `<li>${title}</li>`; 
            });
            botResponseHtml += "</ul>";
          }
          addBotMessage(botResponseHtml);

        } catch (error) {
          console.error('Error fetching bot response:', error);
          // Remove typing indicator if it exists
          const typingIndicator = chatWindow.querySelector('.bot-message:last-child');
          if (typingIndicator && typingIndicator.innerHTML.includes("PolicyBot is thinking...")) {
            typingIndicator.remove();
          }
          // For now, simulate a response since the backend isn't implemented
          addBotMessage("<p>I'm sorry, I encountered an error or the backend is not available yet. This is a frontend simulation.</p>");
        }
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

  // function to get the CSRF token if you're using Django's CSRF protection
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
}

/**
 * Predefined Questions Module
 * Handles the quick questions buttons below the chatbot
 */
export function initPredefinedQuestions() {
  const questionButtons = document.querySelectorAll('.question-button');
  const chatWindow = document.getElementById('chatWindow');
  
  // Handle predefined question buttons
  if (questionButtons && chatWindow) {
    questionButtons.forEach(button => {
      button.addEventListener('click', async function() {
        const question = this.textContent.trim();
        console.log("Predefined question clicked:", question);
        
        // Add user message to chat
        addUserMessageDirectly(question);
        
        // Show typing indicator
        addBotResponseDirectly("<em>PolicyBot is thinking...</em>");
        
        try {
          // Call the backend API with isPredefined flag
          const response = await fetch('/chat/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // If you're using Django's CSRF protection, uncomment the line below
              // 'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ 
              question: question,
              isPredefined: true  // Flag to indicate this is a predefined question
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          // Remove typing indicator
          const typingIndicator = chatWindow.querySelector('.bot-message:last-child');
          if (typingIndicator && typingIndicator.innerHTML.includes("PolicyBot is thinking")) {
            typingIndicator.remove();
          }

          // Format the response with sources
          let botResponseHtml = data.answer;
          if (data.sources && data.sources.length > 0) {
            botResponseHtml += "<p><strong>Sources:</strong></p><ul>";
            data.sources.forEach(source => {
              const title = source.Title ? escapeHTML(source.Title) : "Unknown Source";
              botResponseHtml += `<li>${title}</li>`; 
            });
            botResponseHtml += "</ul>";
          }
          
          // Add the bot's response
          addBotResponseDirectly(botResponseHtml);

        } catch (error) {
          console.error('Error fetching bot response:', error);
          
          // Remove typing indicator
          const typingIndicator = chatWindow.querySelector('.bot-message:last-child');
          if (typingIndicator && typingIndicator.innerHTML.includes("PolicyBot is thinking")) {
            typingIndicator.remove();
          }
          
          // Show error message
          addBotResponseDirectly("I'm sorry, I encountered an error. Please try again later.");
        }
      });
    });
  }
  
  // Function to directly add user message to chat
  function addUserMessageDirectly(message) {
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
  
  // Function to directly add bot response to chat
  function addBotResponseDirectly(message) {
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
  
  // Function to get CSRF token
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
    // Initialize all chatbot components
    initChatbot();
    initPredefinedQuestions();
    initCategoryTabs();
    initCollapsibleCategories(); // Add this new function call
    
    console.log('Chatbot initialized successfully');
  }
}