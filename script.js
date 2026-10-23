    // ⚠️ WARNING: You posted this key publicly. Go to Groq and generate a NEW one! ⚠️
    const API_KEY = "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"; 
    const API_URL = "https://api.groq.com/openai/v1/chat/completions";
    const MODEL_NAME = "openai/gpt-oss-20b"; 

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Function to add a message to the UI
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    // Function to send message to Groq
    async function sendMessage() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        addMessage(userText, 'user');
        chatInput.value = '';
        sendButton.disabled = true; // Prevent multiple sends

        // Show a temporary "Thinking..." message
        const thinkingDiv = document.createElement('div');
        thinkingDiv.classList.add('message', 'ai-message');
        thinkingDiv.textContent = 'Thinking...';
        chatMessages.appendChild(thinkingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Groq requires the key to be sent in the Authorization header
                    'Authorization': `Bearer ${API_KEY}` 
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [
                        { 
                            role: "system", 
                            content: "You are a friendly and helpful AI assistant for a coffee shop owned by Tanavpreet Singh, located in Punjab. Our opening hours are 10:00 AM to 10:00 PM every day. If a customer asks for a contact number, provide this number: 6239....XX. If they ask about the menu, mention we have hot coffees, black coffees, and fresh pastries. Keep your answers short, polite, and welcoming" 
                        },
                        { role: "user", content: userText }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Remove the thinking message
            chatMessages.removeChild(thinkingDiv);

            // Extract the AI's reply (Groq's format is different from Gemini)
            if (data.choices && data.choices[0].message.content) {
                const aiText = data.choices[0].message.content;
                addMessage(aiText, 'ai');
            } else {
                addMessage('Sorry, I could not generate a response.', 'ai');
            }

        } catch (error) {
            console.error('Error:', error);
            // Ensure we don't try to remove a message that's already gone
            if (chatMessages.contains(thinkingDiv)) {
                chatMessages.removeChild(thinkingDiv); 
            }
            addMessage('Sorry, something went wrong. Please check the console for details.', 'ai');
        } finally {
            sendButton.disabled = false;
        }
    } // <--- THIS WAS THE MISSING BRACE THAT BROKE YOUR CODE

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Optional: Add a welcome message
    addMessage('Hello! How can I help you today?', 'ai');