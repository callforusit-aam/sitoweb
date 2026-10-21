# Sito web Callforus

Sito di **Callforus — Amazon Sales & Acceleration Agency** ([callforus.it](https://callforus.it)).

Questa repository contiene l'**anteprima** del nuovo sito. Lo perfezioniamo qui e poi lo pubblichiamo sull'hosting.

## Struttura

```
index.html              Homepage
assets/css/style.css    Stili (colori, tipografia, layout)
assets/js/main.js       Header, menu mobile, carosello servizi, modulo audit
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

- [ ] Rimuovere `<meta name="robots" content="noindex, nofollow">` in `index.html` (serve solo a non far indicizzare l'anteprima)
- [ ] Inserire email, telefono e P.IVA nel footer
- [ ] Collegare il modulo dell'audit a una casella email o a un CRM
- [ ] Creare le pagine Privacy policy e Cookie policy e collegarle nel footer
- [ ] Inserire i link ai profili LinkedIn e Instagram
- [ ] Sostituire il logo con un SVG vettoriale, se disponibile
- [ ] Verificare il dominio su Google Search Console e inviare `sitemap.xml`
