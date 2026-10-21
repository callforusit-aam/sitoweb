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
