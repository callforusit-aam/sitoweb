# Sito web Callforus

Sito di **Callforus — Amazon Sales & Acceleration Agency** ([callforus.it](https://callforus.it)).

Questa repository contiene l'**anteprima** del nuovo sito. Lo perfezioniamo qui e poi lo pubblichiamo sull'hosting.

## Struttura

```
index.html              Homepage
privacy-policy.html     Informativa privacy
cookie-policy.html      Cookie policy
assets/css/style.css    Stili (colori, tipografia, layout)
assets/js/main.js       Header, menu mobile, carosello servizi, modulo analisi
assets/fonts/           Montserrat ospitato in locale (niente Google Fonts, quindi nessun problema GDPR)
assets/img/             Logo in versione chiara e scura, simbolo, favicon, immagine per i social
robots.txt              Regole per i motori di ricerca (versione di produzione)
sitemap.xml             Mappa del sito per Google
site.webmanifest        Icone e nome per smartphone
```

È un sito statico in HTML, CSS e JavaScript, senza dipendenze né build: si carica così com'è su qualsiasi hosting.

## Identità di marca

| Elemento | Valore |
|---|---|
| Colore principale | `#FCCD10` (giallo Callforus) |
| Nero | `#0B0B0C` |
| Grigio sezioni | `#F3F3F1` |
| Font | Montserrat (400–800) |
| Tagline | Amazon Sales & Acceleration Agency |

I colori sono definiti come variabili all'inizio di `assets/css/style.css`.

## Vedere l'anteprima

- **Sul computer:** scarica la repository e apri `index.html` nel browser.
- **Online:** attiva GitHub Pages da *Settings → Pages → Branch: main / root*. Il sito sarà visibile su `https://callforusit-aam.github.io/sitoweb/`.

## Checklist prima della pubblicazione

- [x] Rimuovere il blocco `noindex` (il sito ora è indicizzabile)
- [x] Inserire email e telefono nel footer
- [x] Inserire ragione sociale, indirizzo e P.IVA nel footer
- [x] Collegare il modulo dell'analisi gratuita alla casella callforusit@gmail.com (via Web3Forms)
- [x] Creare le pagine Privacy policy e Cookie policy e collegarle nel footer
- [ ] Far verificare privacy e cookie policy da un professionista
- [x] Inserire i link ai profili LinkedIn e Instagram
- [ ] Sostituire il logo con un SVG vettoriale, se disponibile
- [ ] Verificare il dominio su Google Search Console e inviare `sitemap.xml`

## Modulo "Analisi gratuita"

Il modulo invia le richieste a **callforusit@gmail.com** tramite [Web3Forms](https://web3forms.com), senza bisogno di un server.

- Ogni richiesta arriva come email con tutti i campi. Rispondendo alla mail si scrive direttamente al cliente (il suo indirizzo è impostato come destinatario della risposta).
- La chiave del modulo (`WEB3FORMS_KEY` in `assets/js/main.js`) si trova nella dashboard su app.web3forms.com. È una chiave pubblica: può stare nel codice del sito.
- Il piano gratuito consente 250 richieste al mese. La mail di conferma automatica al cliente richiede il piano a pagamento.
