(function(){
  // Controls a background audio element if the file exists.
  const controlId = 'audioControl';
  const toggleId = 'audioToggle';
  const audioId = 'bgAudio';
  const labelId = 'audioLabel';

  const control = document.getElementById(controlId);
  if(!control) return;

  const audio = document.getElementById(audioId);
  const btn = document.getElementById(toggleId);
  const label = document.getElementById(labelId);
  if(!audio || !btn) { control.style.display = 'none'; return; }

  // hide if audio fails to load
  audio.addEventListener('error', ()=>{ control.style.display = 'none'; });

  function updateButton(){
    if(!audio) return;
    if(!audio.paused){
      btn.classList.add('playing');
      btn.textContent = 'Pause ♫';
      if(label) label.textContent = 'Playing';
    } else {
      btn.classList.remove('playing');
      btn.textContent = 'Play ♫';
      if(label) label.textContent = 'Music';
    }
  }

  // persist play state across pages
  function setPlayingState(isPlaying){
    try{ localStorage.setItem('bgAudioPlaying', isPlaying ? 'true' : 'false'); }catch(e){}
  }

  // persist playback position so music feels continuous across page loads
  const TIME_KEY = 'bgAudioTime';
  function saveTime(){
    try{ if(!isNaN(audio.currentTime)) localStorage.setItem(TIME_KEY, String(audio.currentTime)); }catch(e){}
  }
  function restoreTime(){
    try{
      const s = localStorage.getItem(TIME_KEY);
      if(!s) return;
      const t = parseFloat(s);
      if(isNaN(t) || t <= 0) return;
      // if duration available, clamp to duration
      if(audio.duration && !isNaN(audio.duration)){
        audio.currentTime = Math.min(t, audio.duration - 0.01);
      } else {
        // wait for metadata then set
        const onMeta = ()=>{ try{ audio.currentTime = Math.min(t, audio.duration - 0.01); }catch(e){}; audio.removeEventListener('loadedmetadata', onMeta); };
        audio.addEventListener('loadedmetadata', onMeta);
      }
    }catch(e){}
  }

  // save periodically and on page hide
  audio.addEventListener('timeupdate', ()=>{ saveTime(); });
  window.addEventListener('beforeunload', saveTime);
  document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'hidden') saveTime(); });

  // restore saved playback time before attempting autoplay
  try{ restoreTime(); }catch(e){}

  async function tryPlayAutoplay(){
    if(!audio) return;
    // first try to play normally
    try{
      // if we have a stored time but metadata isn't loaded yet, wait for it
      const storedTime = (function(){ try{ return localStorage.getItem(TIME_KEY); }catch(e){ return null; }})();
      if(storedTime && audio.readyState < 1){
        await new Promise((res)=>{ audio.addEventListener('loadedmetadata', res, { once: true }); setTimeout(res, 1000); });
      }
      await audio.play();
      setPlayingState(true);
      updateButton();
      return;
    }catch(e){
      // normal autoplay blocked: try muted autoplay as a fallback
    }
    try{
      const wasMuted = audio.muted;
      audio.muted = true;
      await audio.play();
      // unmute on first user gesture to restore sound
      function unmuteOnGesture(){ audio.muted = wasMuted; window.removeEventListener('click', unmuteOnGesture); }
      window.addEventListener('click', unmuteOnGesture, { once: true });
      setPlayingState(true);
      updateButton();
      return;
    }catch(e){
      // autoplay completely blocked
      updateButton();
    }
  }

  // initial autoplay attempt: prefer stored state but always try once
  const stored = (function(){ try{ return localStorage.getItem('bgAudioPlaying'); }catch(e){ return null; }})();
  if(stored === 'true'){
    tryPlayAutoplay();
  } else {
    // still attempt autoplay to honor "automatic" request
    tryPlayAutoplay();
  }

  btn.addEventListener('click', async ()=>{
    try{
      if(audio.paused){
        await audio.play();
        setPlayingState(true);
      } else {
        audio.pause();
        setPlayingState(false);
      }
    }catch(e){
      // user gesture required; nothing else to do
    }
    updateButton();
  });

  // keep UI in sync
  audio.addEventListener('play', ()=>{ updateButton(); setPlayingState(true); });
  audio.addEventListener('pause', ()=>{ updateButton(); setPlayingState(false); });

  // ensure audio element is at least loaded so attempt can be made
  audio.addEventListener('canplay', ()=>{});

  // init
  updateButton();
})();
