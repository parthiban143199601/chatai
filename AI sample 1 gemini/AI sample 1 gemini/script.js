const API_KEY = 'AIzaSyD7YIr-KO8Sd44BEyB6kvdzterBsbIZqJY'; // Make sure to keep your API key secure
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent'; // Updated to the latest stable version

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatContent = document.querySelector('.chat-content');

    // Auto-resize textarea
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Handle enter key press
    textarea.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Handle send button click
    sendButton.addEventListener('click', sendMessage);

    async function sendMessage() {
        const userInput = textarea.value.trim();
        if (!userInput) return;

        // Add user message to chat
        addMessageToChat('user', userInput);
        textarea.value = '';
        textarea.style.height = '40px';

        // Show loading indicator
        const loadingDiv = addLoadingIndicator();

        try {
            const response = await fetchGeminiResponse(userInput);
            // Remove loading indicator
            loadingDiv.remove();
            // Add AI response to chat
            addMessageToChat('ai', response);
        } catch (error) {
            loadingDiv.remove();
            addMessageToChat('error', 'Sorry, there was an error processing your request.');
            console.error('Error:', error);
        }
    }

    async function fetchGeminiResponse(userInput) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: userInput
                }]
            }]
        };

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        // Log the response for debugging
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API request failed:', errorData);
            throw new Error('API request failed: ' + errorData.error.message);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    function addMessageToChat(type, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (type === 'user') {
            contentDiv.innerHTML = `
                <div class="message-header">
                    <span class="user-icon">👤</span>
                    <span class="user-name">You</span>
                </div>
                <div class="message-text">${message}</div>
            `;
        } else if (type === 'ai') {
            contentDiv.innerHTML = `
                <div class="message-header">
                    <span class="ai-icon">🤖</span>
                    <span class="ai-name">BDT-AI</span>
                </div>
                <div class="message-text">${formatAIResponse(message)}</div>
            `;
        } else {
            contentDiv.innerHTML = `
                <div class="message-text error">${message}</div>
            `;
        }

        messageDiv.appendChild(contentDiv);
        chatContent.appendChild(messageDiv);
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    function formatAIResponse(text) {
        text = text.replace(/\#\#/g, '')
        text = text.replace(/\*\*/g, '*');
        text = text.replace(/\*/g, '');
        return text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                   .replace(/\n/g, '<br>');
    }

    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message loading';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="ai-icon">🤖</span>
                    <span class="ai-name BDT-AI</span>
                </div>
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatContent.appendChild(loadingDiv);
        chatContent.scrollTop = chatContent.scrollHeight;
        return loadingDiv;
    }
});

document.getElementById('system-dropdown').addEventListener('change', function() {
    const selectedSystem = this.value;
    console.log('Selected System:', selectedSystem); 
    if (selectedSystem === 'c4h') {
        alert('You selected C4H!');
    } else if (selectedSystem === 'iseries') {
        alert('You selected iSeries!');
    }
});

function setBackgroundImage(imageUrl) {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    // Set the specific image
    setBackgroundImage('https://imgcdn.stablediffusionweb.com/2024/9/5/62e04ff5-98e1-4254-8380-05debab8e527.jpg');
});

