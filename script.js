const menuToggle=document.getElementById('menuToggle');const nav=document.getElementById('siteNav');menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('active');menuToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.dropbtn').forEach(button=>button.addEventListener('click',()=>{const item=button.parentElement;const open=item.classList.toggle('open');button.setAttribute('aria-expanded',String(open));document.querySelectorAll('.nav-group').forEach(other=>{if(other!==item){other.classList.remove('open');other.querySelector('button').setAttribute('aria-expanded','false');}});}));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('active');menuToggle.setAttribute('aria-expanded','false');}));
const video=document.getElementById('inkVideo');const play=document.getElementById('videoToggle');function syncVideo(){play.innerHTML=video.paused?'▶ <span>Play the film</span>':'❚❚ <span>Pause the film</span>';play.setAttribute('aria-label',video.paused?'Play cinematic video':'Pause cinematic video');}play.addEventListener('click',async()=>{if(video.paused){try{await video.play();}catch(e){console.warn('Video playback unavailable',e);}}else{video.pause();}syncVideo();});video.addEventListener('play',syncVideo);video.addEventListener('pause',syncVideo);document.getElementById('year').textContent=new Date().getFullYear();

// Entrance controls: no automatic playback, no required waiting, and reduced-motion support.
(() => {
 const portal=document.getElementById('portal'), opening=document.getElementById('openBook');
 const worlds=document.getElementById('portalWorlds'), initial=document.getElementById('portalInitial');
 const modal=document.getElementById('filmModal'), film=document.getElementById('portalFilm');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let timer=null, lastFocus=null;
 const focusTarget=()=>document.querySelector('.site-header .logo');
 function closePortal(target){clearTimeout(timer); portal.classList.add('portal-exit'); document.body.classList.remove('entrance-active'); const after=()=>{portal.hidden=true;portal.classList.remove('portal-exit');if(target){document.getElementById(target)?.scrollIntoView({behavior:reduced?'instant':'smooth'});}else{window.scrollTo({top:0,behavior:'instant'});} (target?document.getElementById(target):focusTarget())?.focus({preventScroll:true});}; if(reduced)after(); else setTimeout(after,440);}
 function resetPortal(){clearTimeout(timer);portal.hidden=false;portal.classList.remove('portal-exit','book-open','worlds-ready');worlds.hidden=true;initial.hidden=false;document.getElementById('portalTitle').innerHTML='Some stories <em>wait to be found.</em>';document.getElementById('portalLead').textContent='At the edge of the known, a book waits. Open it—and discover the worlds of S.D. Elschinger.';document.getElementById('portalChapter').textContent='AN INVITATION BEYOND THE PAGE';document.getElementById('portalStep').textContent='I / THE BOOK';document.body.classList.add('entrance-active');opening.focus();}
 function openPortalBook(){if(portal.classList.contains('book-open'))return;opening.disabled=true;portal.classList.add('book-open');document.getElementById('portalStep').textContent='II / THE WORLDS';timer=setTimeout(()=>{document.getElementById('portalTitle').innerHTML='Every page <em>opens a world.</em>';document.getElementById('portalLead').textContent='Two doorways. Two journeys into the extraordinary. Your story begins with a choice.';document.getElementById('portalChapter').textContent='THE ARCHIVE IS OPEN';initial.hidden=true;worlds.hidden=false;portal.classList.add('worlds-ready');worlds.querySelector('button').focus();opening.disabled=false;},reduced?0:950);}
 opening.addEventListener('click',openPortalBook);
 document.getElementById('skipPortal').addEventListener('click',()=>closePortal());
 document.getElementById('enterLibrary').addEventListener('click',()=>closePortal('books'));
 document.querySelectorAll('[data-world]').forEach(b=>b.addEventListener('click',()=>closePortal(b.dataset.world)));
 document.getElementById('reopenPortal').addEventListener('click',resetPortal);
 document.getElementById('watchFilm').addEventListener('click',()=>{lastFocus=document.activeElement;modal.hidden=false;document.body.classList.add('film-active');document.getElementById('closeFilm').focus();});
 function closeFilm(){film.pause();modal.hidden=true;document.body.classList.remove('film-active');lastFocus?.focus();}
 document.getElementById('closeFilm').addEventListener('click',closeFilm);
 modal.addEventListener('click',e=>{if(e.target===modal)closeFilm();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!modal.hidden){closeFilm();return;}if(!portal.hidden)closePortal();}if(e.key==='Tab'&&!modal.hidden){const controls=[document.getElementById('closeFilm'),film];if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls[1].focus();}else if(!e.shiftKey&&document.activeElement===controls[1]){e.preventDefault();controls[0].focus();}}else if(e.key==='Tab'&&!portal.hidden){const controls=[...portal.querySelectorAll('button:not([hidden]):not(:disabled)')].filter(x=>x.offsetParent!==null);const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 if(location.hash && ['#cassandra','#vaelari','#books','#about','#archives','#updates','#lightkeepers'].includes(location.hash)){portal.hidden=true;document.body.classList.remove('entrance-active');}else document.getElementById('skipPortal').focus();
})();


// Hidden treasures are a client-side, in-session delight, not an account system.
(()=>{const found=new Set();const counter=document.getElementById('treasuresFound');const toast=document.getElementById('discoveryToast');let timer;
document.querySelectorAll('.relic').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.relic;if(!found.has(key)){found.add(key);button.classList.add('found');counter.textContent=found.size;toast.textContent=found.size===5?'Five quiet companions found. The library has been watching.':'A tiny moose! Marina left a small treasure here. ('+found.size+' of 5)';}else{toast.textContent='You have already discovered this little guardian.';}toast.hidden=false;clearTimeout(timer);timer=setTimeout(()=>toast.hidden=true,4000);}));
const details={tools:'A pair of old shears, a garden implement, and worn gloves. Nothing more is said.',window:'A few bees drift through the afternoon light. A crimson lotus rests near the window.'};document.querySelectorAll('.inspect').forEach(button=>button.addEventListener('click',()=>{document.getElementById('cassandraDetail').textContent=details[button.dataset.detail]||'';}));
// Route world-portal choices straight into their dedicated rooms.
document.querySelectorAll('[data-world]').forEach(button=>button.dataset.world=button.dataset.world==='cassandra'?'cassandra-room':'vaelari-room');
})();
