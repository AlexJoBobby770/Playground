let startTime = null;
let charCount = 0;
const box = document.getElementById('typingBox');
box.addEventListener('input', () => {
  if (!startTime) 
    startTime = Date.now();
  charCount++;

  const elapsed = (Date.now() - startTime) / 1000;
  const cps = charCount / elapsed;
  console.log(cps);

  if (charCount % 15 === 0) {
    checkSpeed(cps);
  }
  function checkSpeed(cps) 
  {

    let file = '';
    

    if (cps < 2) file = 'sounds/slow.mp3';
    else if (cps < 4) file = 'sounds/medium.mp3';
    else file = 'sounds/fast.mp3';

    const audio = new Audio(file);
    audio.play();
}
});