(function(){
  const yes = document.getElementById('yesBtn');
  const no = document.getElementById('noBtn');
  const actions = document.getElementById('actions');

  // typewriter for the question
  const question = "Will you be my Valentine's date forever?";
  const qEl = document.getElementById('questionText');
  const cursor = document.getElementById('cursor');
  let pos = 0;
  function typeChar(){
    if(pos <= question.length){
      qEl.textContent = question.slice(0,pos);
      qEl.classList.add('typing');
      pos++;
      setTimeout(typeChar, 55);
    } else {
      cursor.style.opacity = 0;
      document.querySelector('.card').classList.add('fade-in');
    }
  }
  requestAnimationFrame(typeChar);

  function swapChildren(){
    const children = Array.from(actions.children);
    actions.innerHTML = '';
    children.reverse().forEach(c=>actions.appendChild(c));
  }

  // continuously swap the buttons until the user clicks Yes
  let swappingActive = true;
  let swapInterval = setInterval(()=>{ if(swappingActive) swapChildren(); }, 800);

  // clicking No: stop swaps, hide the No button and show the widget
  no.addEventListener('click', (e)=>{
    e.preventDefault();
    swappingActive = false;
    clearInterval(swapInterval);
    // hide the No button
    no.classList.add('hidden');
    // reveal the no-widget
    const widget = document.getElementById('noWidget');
    if(widget){ widget.classList.remove('hidden'); setTimeout(()=>widget.classList.add('show'), 20); }
  });

  yes.addEventListener('click', ()=>{
    clearInterval(swapInterval);
    const card = document.getElementById('card');
    card.innerHTML = `\n      <h1 class="success-title">Congratulations!</h1>\n      <p class="success-text">I'll be your Valentine for the rest of your life. ❤️</p>\n      <div style="text-align:center;margin-top:1rem">\n        <a class=\"back-link\" href=\"index.html\">← Back to Home</a>\n      </div>`;
  });

  // hover swap only while swappingActive
  no.addEventListener('mouseenter', ()=>{
    if(swappingActive && Math.random() > 0.45) swapChildren();
  });
})();
