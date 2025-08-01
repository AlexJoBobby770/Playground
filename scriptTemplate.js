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

// Listen for keydown events (more responsive than input)
document.addEventListener('keydown', function(event) {
    handleKeyPress(event);
});

// Handle when user presses keys
function handleKeyPress(event) {
    // Only count actual typing keys (letters, numbers, space, etc.)
    const key = event.key;
    
    // Ignore special keys like Ctrl, Alt, Shift, Arrow keys, etc.
    if (key.length > 1 && !['Backspace', 'Enter', 'Tab', 'Space'].includes(key)) {
        return; // Ignore function keys, arrow keys, etc.
    }
    
    // Only monitor when typing in input fields or textareas
    const element = event.target;
    const tagName = element.tagName.toLowerCase();
    
    if (tagName !== 'input' && tagName !== 'textarea') {
        return; // Ignore typing outside input fields
    }
    
    // Start timing on first keystroke
    if (!startTime) {
        startTime = Date.now();
        charCount = 0;
        console.log('Started timing typing session');
    }
    
    // Count the keystroke (including Backspace for realism)
    charCount++;
    
    // Calculate typing speed
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const charactersPerSecond = charCount / elapsedSeconds;
    
    console.log('Key pressed:', key, '| Speed:', charactersPerSecond.toFixed(2), 'CPS');
    
    // Check speed every 10 keystrokes (more frequent feedback)
    if (charCount % 10 === 0) {
        checkTypingSpeed(charactersPerSecond);
    }
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
    const audioUrl = chrome.runtime.getURL(`audio/${audioType}.mp3`);
    const audio = new Audio(audioUrl);
    audio.volume = 0.8;
    
    audio.play()
        .then(() => {
            console.log('Played audio:', audioType + '.mp3');
            showNotification(message, cps);
        })
        .catch(error => {
            console.log('Failed to play audio:', error);
        });
}

// Show notification on screen
function showNotification(message, cps) {
    // Create notification element
    const notification = document.createElement('div');
    notification.innerHTML = message + '<br><small>' + cps.toFixed(1) + ' CPS</small>';
    
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
    \`;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
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
});
`;
    
    return scriptCode;
}