(function(){
  const track = document.getElementById('track');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  let index = 0;
  const imgs = Array.from(track.querySelectorAll('img'));

  function update(){
    const w = track.clientWidth;
    track.style.transform = `translateX(${-index * w}px)`;
  }

  window.addEventListener('resize', update);
  next.addEventListener('click', ()=>{ index = Math.min(index+1, imgs.length-1); update(); });
  prev.addEventListener('click', ()=>{ index = Math.max(index-1, 0); update(); });

  // touch support
  let startX=null;
  track.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; });
  track.addEventListener('touchmove', e=>{ if(!startX) return; const dx = e.touches[0].clientX - startX; track.style.transform = `translateX(${ -index*track.clientWidth + dx }px)`; });
  track.addEventListener('touchend', e=>{ if(!startX) return; const dx = e.changedTouches[0].clientX - startX; if(dx<-50) index = Math.min(index+1, imgs.length-1); else if(dx>50) index = Math.max(index-1,0); startX=null; update(); });

  // initial layout: make each image the width of the track container
  function layout(){ imgs.forEach(img=>img.style.width = `${track.clientWidth}px`); update(); }
  // when images load, layout
  let loaded=0; imgs.forEach(i=>{ if(i.complete){ loaded++; if(loaded===imgs.length) layout(); } else i.onload=()=>{ loaded++; if(loaded===imgs.length) layout(); }});
  window.requestAnimationFrame(layout);
  // reveal button navigates to poem page
  const revealBtn = document.getElementById('revealToPoem');
  revealBtn && revealBtn.addEventListener('click', ()=>{ window.location.href = 'poem.html'; });
})();