// zipCreator.js - Handles creating the ZIP file

// Main function to create the extension ZIP
async function createExtensionZip(threshold, audioSlow, audioMedium, audioFast) {
    console.log('Creating ZIP with threshold:', threshold);
    
    // Create a new ZIP file
    const zip = new JSZip();
    
    // Add the manifest.json file
    const manifestContent = createManifestContent();
    zip.file("manifest.json", manifestContent);
    
    // Add the content script file
    const scriptContent = createScriptContent(threshold);
    zip.file("script.js", scriptContent);
    
    // Add audio files
    await addAudioFiles(zip, audioSlow, audioMedium, audioFast);
    
    // Generate and download the ZIP
    await downloadZip(zip);
}

// Create the manifest.json content
function createManifestContent() {
    const manifest = {
        "manifest_version": 3,
        "name": "Malayalam Typing Judge",
        "version": "1.0",
        "description": "Plays Malayalam audio based on typing speed",
        "permissions": [],
        "content_scripts": [
            {
                "matches": ["<all_urls>"],
                "js": ["script.js"]
            }
        ],
        "web_accessible_resources": [
            {
                "resources": ["audio/*.mp3"],
                "matches": ["<all_urls>"]
            }
        ]
    };
    
    // Convert to JSON string with nice formatting
    return JSON.stringify(manifest, null, 2);
}

// Add audio files to the ZIP
async function addAudioFiles(zip, audioSlow, audioMedium, audioFast) {
    console.log('Adding audio files to ZIP...');
    
    // Create audio folder in ZIP
    const audioFolder = zip.folder("audio");
    
    // Get file extensions
    const slowExt = getFileExtension(audioSlow.name);
    const mediumExt = getFileExtension(audioMedium.name);
    const fastExt = getFileExtension(audioFast.name);
    
    // Add files with correct names
    audioFolder.file("slow" + slowExt, audioSlow);
    audioFolder.file("medium" + mediumExt, audioMedium);
    audioFolder.file("fast" + fastExt, audioFast);
    
    console.log('Audio files added successfully');
}

// Get file extension from filename
function getFileExtension(filename) {
    return '.' + filename.split('.').pop().toLowerCase();
}

// Generate ZIP and trigger download
async function downloadZip(zip) {
    console.log('Generating ZIP file...');
    
    // Generate the ZIP as a blob
    const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
    });
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(zipBlob);
    downloadLink.download = 'malayalam-typing-judge-extension.zip';
    
    // Trigger download
    downloadLink.click();
    
    console.log('ZIP download triggered');
}