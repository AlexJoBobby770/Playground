let startTime = null;
let charCount = 0;

document.addEventListener('input', (e) => {
    if (!e.target || !e.target.tagName) return;

    const tag = e.target.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'textarea') return;

    if (!startTime) startTime = Date.now();

    charCount++;

    const elapsed = (Date.now() - startTime) / 1000; 
    const cps = charCount / elapsed; 

    if (charCount % 15 === 0) {
        let file = '';

        if (cps < 2) file = 'audio/slow.mp3';
        else if (cps < 4) file = 'audio/medium.mp3';
        else file = 'audio/fast.mp3';

        const audio = new Audio(chrome.runtime.getURL(file));
        audio.play();
    }
});
