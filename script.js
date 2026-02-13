(function(){
  const btn = document.getElementById('revealBtn');
  const title = document.getElementById('title');
  const message = document.getElementById('message');
  const heart = document.getElementById('heart');
  const confettiCanvas = document.getElementById('confetti');
  let confettiActive = false;
  // click sequence: 0 = reveal message, 1 = gallery, 2 = poem
  let step = 0;
  btn.addEventListener('click', ()=>{
    if(step === 0){
      title.textContent = "To My Favorite Person";
      message.textContent = "hello my love love! happy 1st valinetines to us, today is the day of love and i want to make you feel special and treasured. I love you to heaven and back and i will continue to do so until the day i die. i love you so much my love. always and forever. Every moment with you is my favorite. Happy Valentine's Day! ❤️";
      heart.classList.add('beat');
      launchConfetti();
      setTimeout(()=>heart.classList.remove('beat'), 2400);
      step = 1;
    } else if(step === 1){
      // go to carousel
      window.location.href = 'carousel.html';
    } else if(step === 2){
      // go to poem
      window.location.href = 'poem.html';
    }
  });

  // Simple confetti implementation
  function launchConfetti(){
    if(confettiActive) return;
    confettiActive = true;
    const ctx = confettiCanvas.getContext('2d');
    const w = confettiCanvas.width = window.innerWidth;
    const h = confettiCanvas.height = window.innerHeight;
    const colors = ['#ff4d8b','#ffd166','#06d6a0','#4cc9f0','#f72585'];
    const pieces = [];
    for(let i=0;i<120;i++){
      pieces.push({
        x:Math.random()*w,
        y:Math.random()*h - h,
        r:Math.random()*6+4,
        cx:Math.random()*2-1,
        vy:Math.random()*2+2,
        color:colors[Math.floor(Math.random()*colors.length)],
        tilt:Math.random()*0.5
      });
    }

    let t0 = null;
    function frame(ts){
      if(!t0) t0 = ts;
      const elapsed = ts - t0;
      ctx.clearRect(0,0,w,h);
      for(let p of pieces){
        p.x += p.cx;
        p.y += p.vy + Math.sin((elapsed+p.x)/100)*0.5;
        p.tilt += 0.05;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.8);
        ctx.restore();
      }
      // remove when out of view
      const alive = pieces.filter(p=>p.y < h + 50);
      if(alive.length===0 || elapsed>5000){
        ctx.clearRect(0,0,w,h);
        confettiActive = false;
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // resize canvas on window resize
  window.addEventListener('resize', ()=>{
    if(confettiCanvas.width !== window.innerWidth || confettiCanvas.height !== window.innerHeight){
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });
})();
