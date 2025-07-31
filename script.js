// main.js - Main website functionality

// Main function called when user clicks generate button
async function generateExtension() {
    console.log('Generate button clicked!');
    
    // Get user inputs
    const threshold = parseFloat(document.getElementById('threshold').value);
    const audioSlow = document.getElementById('audioFileSlow').files[0];
    const audioMedium = document.getElementById('audioFileMedium').files[0];
    const audioFast = document.getElementById('audioFileFast').files[0];
    
    // Check if inputs are valid
    if (!validateInputs(threshold, audioSlow, audioMedium, audioFast)) {
        return; // Stop if validation fails
    }
    
    // Show loading state
    showLoading();
    
    try {
        // Create the extension ZIP file
        await createExtensionZip(threshold, audioSlow, audioMedium, audioFast);
        showSuccess();
    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Check if all required inputs are provided
function validateInputs(threshold, audioSlow, audioMedium, audioFast) {
    // Check if all audio files are uploaded
    if (!audioSlow || !audioMedium || !audioFast) {
        showError('Please upload all 3 audio files!');
        return false;
    }
    
    // Check if threshold is a valid number
    if (isNaN(threshold) || threshold <= 0) {
        showError('Please enter a valid threshold value!');
        return false;
    }
    
    return true;
}

// Show loading state
function showLoading() {
    const button = document.getElementById('generateBtn');
    button.disabled = true;
    button.textContent = '🔄 Generating...';
    
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = '<div class="status info">📦 Creating your extension...</div>';
}

// Hide loading state
function hideLoading() {
    const button = document.getElementById('generateBtn');
    button.disabled = false;
    button.textContent = '🚀 Generate Chrome Extension';
}

// Show success message
function showSuccess() {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = '<div class="status success">✅ Extension created! Check your downloads.</div>';
}

// Show error message
function showError(message) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `<div class="status error">❌ ${message}</div>`;
}

// Setup file validation when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, setting up file validation...');
    setupFileValidation();
});

// Validate uploaded files
function setupFileValidation() {
    const fileInputs = ['audioFileSlow', 'audioFileMedium', 'audioFileFast'];
    
    fileInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                validateAudioFile(file, this);
            }
        });
    });
}

// Check if uploaded file is valid
function validateAudioFile(file, inputElement) {
    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid audio file (MP3, WAV, or OGG)');
        inputElement.value = '';
        return false;
    }
    
    if (file.size > maxSize) {
        alert('File too large! Please use files under 5MB');
        inputElement.value = '';
        return false;
    }
    
    console.log('Valid audio file uploaded:', file.name);
    return true;
}