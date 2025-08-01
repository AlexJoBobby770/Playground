// scriptTemplate.js - Creates the content script for the Chrome extension

// Create the content script that will run in the Chrome extension
function createScriptContent(threshold) {
    console.log('Creating content script with threshold:', threshold);
    
    // This is the JavaScript code that will run on every webpage
    const scriptCode = `
// Extension Content Script - Runs on every webpage
console.log('Malayalam Typing Judge Extension Loaded!');

// Variables to track typing
let startTime = null;
let charCount = 0;
let lastAudioTime = 0;
const THRESHOLD = ${threshold};
const COOLDOWN_TIME = 8000; // 8 seconds between audio plays

// Listen for keydown events EVERYWHERE
document.addEventListener('keydown', function(event) {
    handleKeyPress(event);
}, true); // Use capture to catch ALL events

// Handle when user presses keys
function handleKeyPress(event) {
    // Only count actual typing keys (letters, numbers, space, etc.)
    const key = event.key;
    
    // Ignore special keys like Ctrl, Alt, Shift, Arrow keys, etc.
    if (key.length > 1 && !['Backspace', 'Enter', 'Tab', 'Space'].includes(key)) {
        return; // Ignore function keys, arrow keys, etc.
    }
    
    // Check if user is typing in ANY editable element
    const element = event.target;
    
    if (!isEditableElement(element)) {
        return; // Only track typing in editable areas
    }
    
    // Start timing on first keystroke
    if (!startTime) {
        startTime = Date.now();
        charCount = 0;
        console.log('Started timing typing session on:', element.tagName, element.className);
    }
    
    // Count the keystroke (including Backspace for realism)
    charCount++;
    
    // Calculate typing speed
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const charactersPerSecond = charCount / elapsedSeconds;
    
    console.log('Key pressed:', key, '| Speed:', charactersPerSecond.toFixed(2), 'CPS | Element:', element.tagName);
    
    // Check speed every 10 keystrokes (more frequent feedback)
    if (charCount % 10 === 0) {
        checkTypingSpeed(charactersPerSecond);
    }
}

// Check if element is editable (works for ALL websites)
function isEditableElement(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    
    // Standard input elements
    if (tagName === 'input' || tagName === 'textarea') {
        return true;
    }
    
    // Content editable elements (like Gmail, WhatsApp Web, Discord, etc.)
    if (element.contentEditable === 'true') {
        return true;
    }
    
    // Check if element has editable attributes
    if (element.isContentEditable) {
        return true;
    }
    
    // Check for specific website patterns
    
    // YouTube comments
    if (element.getAttribute('aria-label') && 
        element.getAttribute('aria-label').toLowerCase().includes('comment')) {
        return true;
    }
    
    // WhatsApp Web message input
    if (element.getAttribute('data-tab') === '10' || 
        element.classList.contains('_13NKt')) {
        return true;
    }
    
    // Discord message input
    if (element.getAttribute('role') === 'textbox') {
        return true;
    }
    
    // Gmail compose
    if (element.getAttribute('aria-label') && 
        element.getAttribute('aria-label').toLowerCase().includes('message')) {
        return true;
    }
    
    // Twitter/X tweet box
    if (element.getAttribute('data-testid') === 'tweetTextarea_0' ||
        element.classList.contains('DraftEditor-editorContainer')) {
        return true;
    }
    
    // Facebook post/comment
    if (element.getAttribute('aria-label') && 
        (element.getAttribute('aria-label').toLowerCase().includes('post') ||
         element.getAttribute('aria-label').toLowerCase().includes('comment'))) {
        return true;
    }
    
    // Instagram comment
    if (element.getAttribute('aria-label') && 
        element.getAttribute('aria-label').toLowerCase().includes('add a comment')) {
        return true;
    }
    
    // Reddit comment/post
    if (element.classList.contains('notranslate') && 
        element.getAttribute('contenteditable') === 'true') {
        return true;
    }
    
    // Generic catch-all for any div/span that's editable
    if ((tagName === 'div' || tagName === 'span') && 
        (element.getAttribute('contenteditable') === 'true' ||
         element.getAttribute('role') === 'textbox' ||
         element.classList.contains('editable'))) {
        return true;
    }
    
    return false;
}

// Check if we should play audio based on typing speed
function checkTypingSpeed(cps) {
    const currentTime = Date.now();
    
    // Don't play audio too frequently (cooldown)
    if (currentTime - lastAudioTime < COOLDOWN_TIME) {
        return;
    }
    
    console.log('Current typing speed:', cps.toFixed(2), 'CPS');
    
    // Determine which audio to play
    let audioType = '';
    let message = '';
    
    if (cps < THRESHOLD) {
        audioType = 'slow';
        message = '🐌 Slow typing detected!';
    } else if (cps < THRESHOLD * 2) {
        audioType = 'medium';
        message = '⚖️ Average typing speed';
    } else {
        audioType = 'fast';
        message = '🚀 Fast typing!';
    }
    
    playAudio(audioType, message, cps);
    lastAudioTime = currentTime;
}

function playAudio(audioType, message, cps) {
    // Enhanced error handling for chrome.runtime
    if (!chrome || !chrome.runtime) {
        console.error('Chrome runtime not available - extension not loaded properly');
        return;
    }
    
    try {
        const audioUrl = chrome.runtime.getURL(\`audio/\${audioType}.mp3\`);
        console.log('Attempting to play:', audioUrl);
        
        const audio = new Audio(audioUrl);
        audio.volume = 0.8;
        
        audio.play()
            .then(() => {
                console.log('✅ Successfully played audio:', audioType + '.mp3');
                showNotification(message, cps);
            })
            .catch(error => {
                console.log('❌ Failed to play audio:', error);
                // Still show notification even if audio fails
                showNotification(message + ' (Audio failed)', cps);
            });
    } catch (error) {
        console.error('Error creating audio:', error);
    }
}

// Show notification on screen
function showNotification(message, cps) {
    // Create notification element
    const notification = document.createElement('div');
    notification.innerHTML = message + '<br><small>' + cps.toFixed(1) + ' CPS</small>';
    
    // Generate unique ID to avoid conflicts
    const notificationId = 'malayalam-typing-notification-' + Date.now();
    notification.id = notificationId;
    
    // Style the notification
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: bold;
        font-size: 14px;
        z-index: 999999;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 250px;
        text-align: center;
        font-family: Arial, sans-serif;
        animation: slideInRight 0.3s ease-out;
    \`;
    
    // Add animation styles if not already present
    if (!document.getElementById('malayalam-typing-styles')) {
        const style = document.createElement('style');
        style.id = 'malayalam-typing-styles';
        style.textContent = \`
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        \`;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        const element = document.getElementById(notificationId);
        if (element && element.parentNode) {
            element.remove();
        }
    }, 4000);
}

// Reset typing session after inactivity
let inactivityTimer;
document.addEventListener('keydown', function() {
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
        startTime = null;
        charCount = 0;
        console.log('Typing session reset due to inactivity');
    }, 10000); // Reset after 10 seconds of no typing
}, true);

// Log when extension starts
console.log('🎯 Malayalam Typing Judge Extension Ready!');
console.log('Threshold:', THRESHOLD, 'CPS');
console.log('Will monitor typing on ALL editable elements across websites!');
`;
    
    return scriptCode;
}
