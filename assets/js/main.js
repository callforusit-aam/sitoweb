/* Callforus — interazioni: header, menu mobile, carosello servizi, modulo audit */
(function(){
  /* header border on scroll */
  var bar=document.getElementById('top-bar');
  function onScroll(){bar.classList.toggle('is-scrolled',window.scrollY>8)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* mobile menu */
  var btn=document.getElementById('menu-btn'),menu=document.getElementById('mobile-nav');
  function setMenu(open){btn.setAttribute('aria-expanded',open?'true':'false');menu.hidden=!open}
  btn.addEventListener('click',function(){setMenu(menu.hidden)});
  menu.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  /* services carousel: the card nearest the center is the black one */
  var track=document.getElementById('svc-track'),cards=[].slice.call(track.querySelectorAll('.svc')),dotsEl=document.getElementById('svc-dots'),cur=-1;
  cards.forEach(function(){dotsEl.appendChild(document.createElement('span'))});
  var dots=[].slice.call(dotsEl.children);
  function centerOf(i){var c=cards[i];return c.offsetLeft-(track.clientWidth-c.offsetWidth)/2}
  function go(i,smooth){i=Math.max(0,Math.min(cards.length-1,i));track.scrollTo({left:centerOf(i),behavior:smooth?'smooth':'auto'})}
  function update(){
    var mid=track.scrollLeft+track.clientWidth/2,best=0,bd=Infinity;
    cards.forEach(function(c,i){var d=Math.abs(c.offsetLeft+c.offsetWidth/2-mid);if(d<bd){bd=d;best=i}});
    if(best===cur)return;cur=best;
    cards.forEach(function(c,i){c.classList.toggle('is-active',i===best)});
    dots.forEach(function(d,i){d.classList.toggle('on',i===best)});
  }
  var raf=0;track.addEventListener('scroll',function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(update)},{passive:true});
  document.getElementById('svc-prev').addEventListener('click',function(){go(cur-1,true)});
  document.getElementById('svc-next').addEventListener('click',function(){go(cur+1,true)});
  track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(cur+1,true)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1,true)}});
  window.addEventListener('resize',function(){go(cur,false)});
  go(1,false);update();

  /* audit form: validation only; it is connected to a real inbox at launch */
  var form=document.getElementById('audit-form'),err=document.getElementById('form-err');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=['f-nome','f-azienda','f-email','f-store'].filter(function(id){
      var el=document.getElementById(id),ok=el.value.trim()!==''&&el.checkValidity();
      el.setAttribute('aria-invalid',ok?'false':'true');return !ok;
    });
    err.hidden=bad.length===0;
    if(bad.length){document.getElementById(bad[0]).focus();return}
    document.getElementById('form-body').hidden=true;
    document.getElementById('form-done').hidden=false;
  });
})();

/* ------------------------------------------------------------
   Movimento: barra di avanzamento, comparse allo scroll,
   contatori, parallasse leggera nell'hero.
   Con "riduci movimento" attivo resta tutto fermo e visibile.
   ------------------------------------------------------------ */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* barra gialla di avanzamento sotto l'header */
  var pb=document.getElementById('progress-bar');
  function progress(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    pb.style.transform='scaleX('+(h>0?Math.min(1,window.scrollY/h):0)+')';
  }
  window.addEventListener('scroll',progress,{passive:true});
  window.addEventListener('resize',progress);
  progress();

  if(reduce||!('IntersectionObserver' in window))return;

  function sameTagIndex(el){var i=0,s=el;while((s=s.previousElementSibling))if(s.tagName===el.tagName)i++;return i}
  function belowFold(el){return el.getBoundingClientRect().top>window.innerHeight*0.9}

  /* comparsa allo scroll: solo per gli elementi ancora sotto la piega */
  var revealIO=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target;revealIO.unobserve(el);el.classList.add('in');
      var d=parseFloat(el.style.getPropertyValue('--d'))||0;
      setTimeout(function(){el.classList.remove('rv','in');el.style.removeProperty('--d')},(d+1)*1000+150);
    });
  },{rootMargin:'0px 0px -40px 0px'});
  /* in fondo alla pagina mostra tutto ciò che è rimasto */
  window.addEventListener('scroll',function(){
    if(window.innerHeight+window.scrollY<document.documentElement.scrollHeight-4)return;
    document.querySelectorAll('.rv:not(.in)').forEach(function(el){revealIO.unobserve(el);el.classList.add('in')});
  },{passive:true});
  ['.strip-in','.head','.probs > .prob','.track','.tools > .tool','.fit > .fit-col','.about > *','.faq > details','.cta','.foot-grid > div','.legal']
    .forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        if(!belowFold(el))return;
        el.classList.add('rv');
        el.style.setProperty('--d',(sameTagIndex(el)%4)*0.09+'s');
        revealIO.observe(el);
      });
    });

  /* animazioni che partono quando la sezione entra in vista */
  document.querySelectorAll('.slots span').forEach(function(s,i){s.style.setProperty('--i',i%7)});
  document.querySelectorAll('.demo').forEach(function(d){d.querySelectorAll('.bar').forEach(function(b,i){b.style.setProperty('--i',i)})});
  var playIO=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('play');playIO.unobserve(e.target)}});
  },{threshold:.35});
  document.querySelectorAll('.steps,.slots,.demo').forEach(function(el){el.classList.add('armed');playIO.observe(el)});

  /* contatori */
  function countUp(el,delay){
    var to=parseInt(el.getAttribute('data-count'),10),pre=el.getAttribute('data-prefix')||'',dur=to>100?1500:900,t0=null;
    el.textContent=pre+'0';
    setTimeout(function(){
      requestAnimationFrame(function step(ts){
        if(t0===null)t0=ts;
        var k=Math.min(1,(ts-t0)/dur),eased=1-Math.pow(1-k,3);
        el.textContent=pre+Math.round(to*eased).toLocaleString('it-IT');
        if(k<1)requestAnimationFrame(step);
      });
    },delay||0);
  }
  var countIO=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){countIO.unobserve(e.target);countUp(e.target,e.target.closest('.hero')?900:150)}});
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){countIO.observe(el)});

  /* parallasse leggera dell'illustrazione, solo con mouse */
  var hero=document.querySelector('.hero'),art=document.querySelector('.hero-art');
  if(hero&&art&&window.matchMedia('(pointer: fine)').matches){
    var raf=0;
    hero.addEventListener('pointermove',function(e){
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        var r=hero.getBoundingClientRect();
        art.style.setProperty('--px',(((e.clientX-r.left)/r.width)-.5)*2);
        art.style.setProperty('--py',(((e.clientY-r.top)/r.height)-.5)*2);
      });
    });
    hero.addEventListener('pointerleave',function(){art.style.setProperty('--px',0);art.style.setProperty('--py',0)});
  }
})();
