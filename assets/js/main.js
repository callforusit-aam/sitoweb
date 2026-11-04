/* Callforus — interazioni: header, menu mobile, carosello servizi, modulo analisi */
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

  /* modulo analisi: invio tramite FormSubmit alla casella callforusit@gmail.com */
  var FORM_ENDPOINT='https://formsubmit.co/ajax/callforusit@gmail.com';
  var form=document.getElementById('analisi-form'),err=document.getElementById('form-err'),
      submit=document.getElementById('f-submit'),label=submit.querySelector('.btn-label');
  function val(id){return document.getElementById(id).value.trim()}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=['f-nome','f-azienda','f-email','f-store'].filter(function(id){
      var el=document.getElementById(id),ok=el.value.trim()!==''&&el.checkValidity();
      el.setAttribute('aria-invalid',ok?'false':'true');return !ok;
    });
    var privacy=document.getElementById('f-privacy');
    if(!privacy.checked)bad.push('f-privacy');
    privacy.closest('.check').classList.toggle('is-invalid',!privacy.checked);
    err.textContent="Controlla i campi evidenziati: servono nome, azienda, un'email valida, il link al tuo store e la conferma dell'informativa privacy.";
    err.hidden=bad.length===0;
    if(bad.length){document.getElementById(bad[0]).focus();return}
    if(val('f-hp')!=='')return; /* compilato da un bot */

    var data={
      _subject:'Nuova richiesta di analisi gratuita: '+val('f-azienda'),
      _template:'table',
      _captcha:'false',
      _autoresponse:'Ciao '+val('f-nome')+', abbiamo ricevuto la tua richiesta di analisi gratuita del tuo account Amazon. Ti ricontatteremo a breve a questo indirizzo email. Per qualsiasi domanda scrivi a info@callforus.it. Callforus, Amazon Sales & Acceleration Agency.',
      'Nome e cognome':val('f-nome'),
      'Azienda':val('f-azienda'),
      email:val('f-email'),
      'Telefono':val('f-tel')||'non indicato',
      'Store Amazon':val('f-store'),
      'Tipo di account':val('f-tipo'),
      'Fatturato mensile su Amazon':val('f-fatt'),
      'Cosa vorrebbe migliorare':val('f-msg')||'non indicato',
      'Consenso privacy':'Accettata il '+new Date().toLocaleString('it-IT')
    };
    submit.disabled=true;label.textContent='Invio in corso…';
    fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(b){if(!r.ok||String(b.success)==='false')throw new Error(b.message||'invio non riuscito');})})
      .then(function(){
        document.getElementById('done-name').textContent=val('f-nome').split(' ')[0];
        document.getElementById('done-email').textContent=val('f-email');
        document.getElementById('form-body').hidden=true;
        document.getElementById('form-done').hidden=false;
      })
      .catch(function(){
        err.textContent="Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto oppure scrivici a info@callforus.it.";
        err.hidden=false;
      })
      .then(function(){submit.disabled=false;label.textContent="Richiedi l'analisi gratuita";});
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
  ['.strip-in','.head','.probs > .prob','.track','.tools > .tool','.agents-intro','.agents-panel','.method-side','.mstep','.quiz','.nofit','.about > *','.cases > .case','.faq > details','.cta','.foot-grid > div','.legal']
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
  document.querySelectorAll('.mstep,.nofit,.slots,.demo,.agent-list').forEach(function(el){el.classList.add('armed');playIO.observe(el)});

  /* contatori */
  function countUp(el,delay){
    var to=parseInt(el.getAttribute('data-count'),10),pre=el.getAttribute('data-prefix')||'',suf=el.getAttribute('data-suffix')||'',dur=to>100?1500:900,t0=null;
    el.textContent=pre+'0'+suf;
    setTimeout(function(){
      requestAnimationFrame(function step(ts){
        if(t0===null)t0=ts;
        var k=Math.min(1,(ts-t0)/dur),eased=1-Math.pow(1-k,3);
        el.textContent=pre+Math.round(to*eased).toLocaleString('it-IT')+suf;
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

/* ------------------------------------------------------------
   Metodo: linea di avanzamento e fase attiva
   Per chi: test "Callforus fa per te?"
   ------------------------------------------------------------ */
(function(){
  /* Metodo */
  var list=document.getElementById('method-steps');
  if(list){
    var steps=[].slice.call(list.querySelectorAll('.mstep'));
    var idx=[].slice.call(document.querySelectorAll('.method-index li'));
    function method(){
      var r=list.getBoundingClientRect(),mid=window.innerHeight*0.55;
      var f=(mid-r.top-28)/(r.height-56);
      list.style.setProperty('--fill',Math.max(0,Math.min(1,f)).toFixed(3));
      var active=-1;
      steps.forEach(function(s,i){var b=s.getBoundingClientRect();if(b.top<mid)active=i});
      steps.forEach(function(s,i){s.classList.toggle('is-on',i===active);s.classList.toggle('is-done',i<active)});
      idx.forEach(function(l,i){l.classList.toggle('is-on',i===active)});
    }
    window.addEventListener('scroll',method,{passive:true});
    window.addEventListener('resize',method);
    method();
  }

  /* Test di qualificazione */
  var quiz=document.getElementById('quiz');
  if(!quiz)return;
  var qs=[].slice.call(quiz.querySelectorAll('.q')),out=document.getElementById('quiz-out'),
      count=document.getElementById('quiz-count'),bar=document.getElementById('quiz-bar'),answers={};
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
  function render(){
    var n=Object.keys(answers).length;
    count.textContent=n+' di '+qs.length+' risposte';
    bar.style.transform='scaleX('+(n/qs.length)+')';
    out.classList.remove('ok','ko');
    if(n<qs.length){
      out.innerHTML='<p class="quiz-wait">'+(n===0?'Rispondi alle quattro domande per vedere il risultato.':'Ancora '+(qs.length-n)+(qs.length-n===1?' domanda':' domande')+' e vedi il risultato.')+'</p>';
      return;
    }
    var no=qs.filter(function(q,i){return answers[i]===0});
    if(!no.length){
      out.classList.add('ok');
      out.innerHTML='<strong>Il tuo account è nel nostro profilo ideale.</strong><p>Hai tutto quello che serve per crescere su Amazon con Callforus. Il primo passo è l\'analisi gratuita.</p><a class="btn btn--ink" href="#analisi">Richiedi l\'analisi gratuita <svg aria-hidden="true"><use href="#i-arrow"/></svg></a>';
    }else{
      out.classList.add('ko');
      out.innerHTML='<strong>Forse non è ancora il momento giusto.</strong><ul>'+no.map(function(q){return '<li>'+esc(q.getAttribute('data-no'))+'</li>'}).join('')+'</ul><a class="lnk" href="#analisi">Vuoi parlarne comunque? Scrivici</a>';
    }
  }
  qs.forEach(function(q,i){
    q.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){
        var v=parseInt(b.getAttribute('data-v'),10);
        answers[i]=v;
        q.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
        q.classList.toggle('is-yes',v===1);q.classList.toggle('is-no',v===0);
        render();
      });
    });
  });
  render();
})();
