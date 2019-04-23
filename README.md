# Le basi di webpack, npm, nvm, scss, babel

### Compilazione e bundling delle risorse Javascript con Webpack sfruttando NodeJS, spiegato semplicemente.

# Bundler (webpack)

Perchè usare un bundler, fra le altre cose:

- Compilazione dei linguaggi più evoluti ed immensamente più comodi per lo sviluppo
  - Da SCSS a CSS
  - Da JS ES6 a ES5
- Gestione della compatibilità
  - Transpiling del codice con Babel
- Sicurezza del codice pubblicato

## Compilazione e minificazione

Il bundler si occupa di compilare e minificare il codice che sarà poi incluso nella pagina HTML. [Webpack](https://webpack.js.org/) è il bundler più utilizzato al mondo.

### Javascript

La compilazione del bundler consente l'utilizzo di linguaggio Javascript più evoluto (come [ES6](http://es6-features.org/)) durante lo sviluppo, che saranno poi compilati in linguaggi che i browser possono comprendere.

Per esempio, l'utilizzo delle arrow function in Javascript:

```js
() => {};
```

Verrà compilata come funzione Javascript normale e gestita di conseguenza:

```js
function() {}
```

### CSS

Il bundler comprende un compilatore per [SCSS](https://sass-lang.com/), un linguaggio che, oltre a comprendere perfettamente la normale sintassi CSS, consente fra altre cose: l'utilizzo di variabili, selettori gerarchici, facilitazioni per l'utilizzo della sintassi BEM, predisposizioni per l'auto aggiunta di prefissi destinati alla retrocompatibilità dei broweser.

Per esempio una sintassi SCSS del tipo:

```scss
$my-color: #875634;
body {
  background-color: $my-color;
}
.my-div {
  color: $my-color;
  p {
    display: flex;
  }
}
```

Verrà compilata come CSS:

```css
body {
  background-color: #875634;
}
.my-div {
  color: #875634;
}
.my-div p {
  display: flex;
  display: -webkit-flex;
  display: -ms-flex;
}
```

#### Il caso Bootstrap

Inoltre, l'utilizzo di SCSS consente la profonda integrazione con framework come [Bootstrap](https://getbootstrap.com/), che utilizzano lo stesso linguaggio sorgente, per poterne modificare le variabili di base, ottenendo così una versione personalizzata del framework stesso.

Per esempio, Bootstrap prevede variabili dei colori:
`$primary, $secondary, $info, $warning, $danger, $success`

E modificando queste variabili tutte le classi Bootstrap che le utilizzano cambieranno colore.

Bootstrap prevede anche delle variabili che definiscono delle impostazioni del framework stesso, per esempio:
`$enable-responsive-font-sizes, $enable-transitions, $enable-shadows, $enable-rounded, $enable-caret, $breadcrumb-divider`

In questo modo il framework può essere personalizzato molto velocemente senza dover ogni volta riscrivere classi che ne sovrascrivono il comportamento.

## Transpiling con Babel

La più nuova sintassi Javascript è spesso non compatibile con alcuni browser. [Babel](https://babeljs.io/) è un framework adibito a risolvere questo problema, integrandolo con un bundler, si occuperà di tradurre il linguaggio e renderlo comprensibile a tutti i browser. Le configurazioni di Babel possono essere modificate per prevedere una compatibilità più o meno estesa.

Babel è compatibile con `webpack` e necessita solo di una leggera configurazione.

## Sicurezza e performace

Siccome il bundler si occuperà di impacchettare tutto il nostro codice in un solo file compresso, facilita la performance del browser grazie al peso inferiore e ovviamente non avendo molteplici referenze a vari plugin. Ma oltre questo, cosa non da poco, il codice minificato e compilato è difficilmente interpretabile e non copiabile dai visitatori della pagina HTML.

# Configurazione di Webpack

Esiste un unico file di configurazione che deve esistere in radice del progetto, chiamato `webpack.config.js`

Ecco un esempio di partenza che prevede l'utilizzo di tutto quanto descritto sopra, includendo anche jQuery che è una dipendenza richiesta dal framework Bootstrap.

```js
const path = require('path');
const webpack = require('webpack');
// Plugin per l'estrazione separata del file .css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Plugin per la minificazione e ottimizzazione del file .js
const TerserJSPlugin = require('terser-webpack-plugin');
// Plugin per la minificazione e ottimizzazione del file .css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // File Javascript di entrata pre-compilato
  entry: './src/index.js',
  // Cartella di output per i file compilati e nome del file Javascript
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      // Loaders per i file di tipo CSS e SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
      // Loader per i file risorse, come immagini e font, inclusi all'interno del CSS, SCSS o Javascript. Quando il file pesa meno del limite indicato viene automaticamente generato un data base64, altrimenti la risorsa viene impacchettata e spostata nella cartella di output
      {
        test: /\.(jpg|jpeg|gif|png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      },
      // Loader e configurazione di Babel per il transpiling
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  // Assegnazione dei plugin di minificazione e ottimizzazione
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    // Nome del file di output .css
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    // Globalizzazione del plugin jQuery
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
};
```

Oltre alla normale sintassi Javascript vediamo in questo file vari riferimenti a dipendenze, e in particolare vari `loaders`. Tutte queste risorse devono essere installate insieme a `webpack` per poter essere incluse e poi utilizzate dal bundler.

Quando si tratta di installare librerie, entra in campo `npm`.

# Node Package Manager (NPM)

Perchè usare npm:

- Facile controllo di tutte le librerie necessarie per il progetto e delle relative versioni
- Facile mantenimento degli aggiornamenti per tutte le librerie
- Niente riferimenti a CDN ma tutto in copia locale, organizzato ordinatamente in un'unica cartella adibita e divisa in sottocartelle per ogni libreria installata
- Uso di scripts per l'esecuzione di processi da command line necessari ad avviare la compilazione dei bundler

## NodeJS, npm e nvm

[NPM](https://www.npmjs.com/) si occupa della gestione delle librerie grazie a [NodeJS](https://nodejs.org/it/). Senza andare troppo nel dettaglio, per funzionare necessita che NodeJS sia installato. NodeJS può essere scaricato e installato dal sito ufficiale ma la cosa migliore in fase di sviluppo è utilizzare un software adibito alla gestione delle versioni di NodeJS. Questo perchè NodeJS è in continuo aggiornamento e volendo giustamente restare in linea con l'ultima release si rischia di scontrarsi con problemi di retrocompatibilità. Per ovviare il problema si utilizza quindi [NVM](https://github.com/coreybutler/nvm-windows/releases) (NodeJS Version Manager), un software che deve essere installato e funziona da command line.

**Notare che nell'ambiente NodeJS si lavora quasi esclusivamente da command line, per questo è molto consigliabile usare un editor o un IDE che consenta la visualizzazione del terminale integrata, cito in particolare [Visual Studio Code](https://code.visualstudio.com/) che offre chiarezza, performance e compatibilità con moltissimi linguaggi.**

Una volta installato possiamo utilizzare il comando `nvm` per interagire con le sue funzionalità.

`nvm list available`

Ci elencherà tutte le versioni di NodeJS disponibili all'installazione. E' buona norma scegliere sempre l'ultima versione LTS (Long Term Support) e non l'ultimissima release. Dopo aver individuato l'ultima LTS dalla lista fornita, possiamo installarla.
Per esempio, se l'ultima versione fosse la 10.15.3:

`nvm install 10.15.3`

NVM si occuperà di scaricarla e installarla nella cartella indicata precedentemente (quando abbiamo installato NVM). NVM crea una sottocartella per ogni versione di NodeJS installata, e richiede un ultimo comando per attivare la tale versione:

`nvm use 10.15.3`

Ovviamente, possiamo in qualsiasi momento cambiare versione con lo stesso comando. Questo ci consente di passare a una versione più recente ed eventualmente fare un passo indietro se riscontriamo problemi di compatibilità sui nostri progetti, con una sola riga da command line. Un ulteriore comando utile è `nvm list` che ci elencherà tutte le versioni di NodeJS installate sulla nostra macchina.

Una volta installato NodeJS possiamo verificarne il corretto funzionamento sempre da command line e controllarne la versione:

`node -v`

E' da notare che NodeJS installa automaticamente **anche** `npm` quindi abbiamo già tutto quello che ci serve per installare e gestire le librerie per i nostri progetti.

## File di configurazione npm (package.json)

Per lavorare con npm su un progetto è necessario creare il file di configurazione `package.json` nella radice dello stesso progetto. Questo può essere creato manualmente, oppure più comodamente da linea di comando.
Posizionandoci nel terminale sulla cartella radice del progetto, possiamo eseguire:

`npm init`

Ci verranno richieste alcune informazioni riguardanti il progetto (possiamo anche dare sempre invio fino alla fine) e npm creerà per noi un file `package.json` da cui iniziare.

```js
{
  "name": "...",
  "version": "1.0.0",
  "description": "...",
  "main": "...",
  "scripts": {
    //...
  },
  "author": "...",
  "license": "..."
}
```

All'interno di questo file verranno elencate tutte le librerie da cui il progetto sarà dipendente, con relative versioni, e fra le altre cose, anche gli script che utilizzeremo per eseguire la compilazione del bundler `webpack`.

## Installazione e gestione delle librerie del progetto

A questo punto siamo pronti per installare le librerie necessarie al nostro progetto. Praticamente tutte le librerie di nota sono presenti su npm e possono essere trovate su npmjs.com. La maggior parte prevedono anche nel loro tutorial il comando npm per l'installazione, che è comunque sempre lo stesso, dato il nome della libreria. Prendiamo come esempio `jquery`, ([che troviamo ovviamente su npmjs.com](https://www.npmjs.com/package/jquery)) il comando per l'installazione sarà (attenzione a essere sempre posizionati nella cartella della radice del progetto sul terminale):

`npm install jquery`

Oppure, utilizzando la sintassi ridotta:

`npm i jquery`

Il comando `install` seguito dal nome della libreria, creerà in radice la cartella `node_modules` (se non già presente) e una sottocartella per ogni libreria installata.

Al comando `install` possono seguire **una o più** librerie, per installarne più di una alla volta.

Alcune librerie sono inoltre dipendenti da altre, che verranno automaticamente scaricate nelle rispettive cartelle. Oltre a scaricare le librerie, il comando `install` aggiornerà il nostro file `package.json` aggiungendo la nuova dipendenza da noi appena installata. Notare che nel file non verranno indicate eventuali dipendenze della libreria. Tutte le dipendenze non esplicitamente installate vengono racchiuse invece all'interno del file `package-lock.json` che npm crea e gestisce in background in modo completamente automatico - possiamo ignorare questo file che serve solo a npm per gestire correttamente la compatibilità delle dipendenze a seconda delle loro versioni.

Il nostro `package.json` avrà adesso un contenuto simile a questo:

```js
{
  "name": "...",
  "version": "1.0.0",
  "description": "...",
  "main": "...",
  "scripts": {
    //...
  },
  "author": "...",
  "license": "...",
  "dependencies": {
    "jquery": "^3.3.1"
  }
}
```

NPM ha creato un nuovo attributo `dependencies` che contiene il nostro elenco di librerie del progetto.

Abbiamo un'alternativa di installazione dipendenze, previste per quelle dipendenze relative alle nostre scelte di sviluppo piuttosto che al progetto stesso. Proprio come il bundler (e le sue relative dipendenze), siccome `webpack` è un'opzione fra altri bundler, possiamo dire che è una dipendenza di sviluppo e non del progetto stesso. Questo tipo di dipendenze vengono raggruppate da npm sotto un diverso attributo nel `package.json`. Il comando di installazione è simile ma con un parametro in più. Prendiamo come esempio `webpack`.

`npm i webpack -D`

Il `-D` indica a npm che questa è una dipendenza di sviluppo, e npm aggiornerà il file `package.json` in questo modo:

```js
{
  "name": "...",
  "version": "1.0.0",
  "description": "...",
  "main": "...",
  "scripts": {
    //...
  },
  "author": "...",
  "license": "...",
  "devDependencies": {
    "webpack": "^4.29.6"
  },
  "dependencies": {
    "jquery": "^3.3.1"
  }
}
```

Ulteriori comandi utili per la gestione delle librerie:

`npm outdated`

Ci darà una lista di tutte le librerie installate ma non aggiornate rispetto alla loro ultima versione rilasciata su `npm`.

`npm update`

Aggiornerà tutte le librerie che lo necessitano.

`npm update jquery`

Aggiorna una libreria specificata.

`npm uninstall jquery`

Disinstalla una libreria specificata, cancellandola dalla cartella `node_modules` e rimuovendola dal file `package.json`

Un altro comando fondamentale npm è quello che ci consente di installare **tutte** le dipendenze (di sviluppo e non) di un progetto, dato il file `package.json` quando pre-esistente. Per esempio, quando prendiamo in mano un progetto creato da qualcun altro questo non conterrà la cartella `node_modules` (in quando è molto pesante e piena di file) ma solo il file `package.json` con l'elenco delle librerie necessarie.

_Infatti, la cartella `node_modules` è esclusa da tutti i repository git e non sarà mai presente scaricando un nuovo progetto_

`npm install` oppure `npm i`

Scaricherà tutte le librerie necessarie al progetto per funzionare.

## Struttura delle cartelle

Siccome utilizzermo un bundler che, dato un file Javascript in entrata, ci restituirà file compilati .js e .css è necessario predisporre una struttura del progetto ordinata e chiara.

E' abitudine comune prevedere due cartelle (una di _input_ e una di _output_) che chiameremo rispettivamente `src` e `dist`, entrambe nella cartella radice del progetto.

Mentre non toccheremo più la cartella `dist`, in quanto il contenuto verrà automaticamente generato dal bundler in fase di compilazione, andremo a creare nella cartella `src` tutti i nostri file sorgente necessari. L'unico file veramente obbligatorio che dovremo creare sarà il file Javascript principale, cha possiamo chiamare `index.js`. Il nome è di libera scelta. All'interno di questo file vivrà tutta la logica del nostro progetto, compresa l'inclusione delle librerie necessarie al suo funzionamento.

Nella stessa cartella possiamo creare una sottocartella `scss` che conterrà i nostri file .scss che verranno poi compilati in .css. Per iniziare possiamo creare al suo interno un file `index.scss`.

Avremo quindi una struttura di questo tipo:

```
- dist/
- src/
  - scss/
    - index.scss
  - index.js
- package.json
- webpack.config.js
```

## File Javascript principale

Il nostro file `index.js` è il punto di entrata di tutti i file sorgente del progetto. E' buona norma, anche se non generalmente necessario, indicarlo come tale all'interno del file di configurazione npm `package.json`.

```js
{
  //...
  "main": "src/index.js",
  //...
}
```

Possiamo quindi iniziare a scrivere all'interno del nostro file. Notare che di fatto non è altro che un file Javascript e può contenere lo stesso codice che normalmente scriveremo in un file .js senza che non necessita compilazione.

Una grande particolarità è che dovremo includere tutte le nostre dipendenze all'interno dello stesso file, invece che separatamente nel documento HTML. Siccome abbiamo installato `jquery` con `npm` possiamo includerla nel nostro file `index.js`

```js
import jquery from 'jquery';
```

Nel caso di jquery, la libreria contiene l'esportazione dell'istanza jquery. Alcune librerie non hanno nessuna esportazione, ed è sufficiente un `import` diretto della libreria, come per `bootstrap`, per esempio:

```js
import 'bootstrap';
```

_Notare che non avendo installato `bootstrap` con npm, questo comando non funzionerà_

Quasi tutte le librerie contengono un'indicazione se devono essere importate con o senza instanza.

**Notare che non dobbiamo specificare nessun percorso nell'import della libreria, poichè questa è stata installata con `npm`, il bundler andrà automaticamente a cercarla, dato il suo nome, all'interno della cartella `node_modules`**

Una volta importata la libreria, possiamo scrivere normalmente codice Javascript nel nostro file `index.js`:

```js
import jquery from 'jquery';

$(function() {
  console.log('Hello Webpack!');
});
```

Questo codice stamparà in console una stringa all'apertura della pagina.

### Inclusione del file SCSS

Siccome il nostro file SCSS dovrà essere anch'esso compilato dal bundler, e il bundler prende in entrata il file Javascript principale, dovremo includere il file SCSS nel nostro `index.js`.

```js
// Importazione del nostro file SCSS principale
import './scss/index.scss';

// Importazione delle librerie
import jquery from 'jquery';

// Logica Javascript
$(function() {
  console.log('Hello Webpack!');
});
```

**Notare che nel caso del nostro file .scss è necessario specificarne il percorso relativo**

All'interno del nostro `index.scss` possiamo scrivere uno snippet css di esempio.

```scss
body {
  background-color: red;
}
```

## Installazione delle dipendenze di webpack

Prima di poter lanciare l'esecuzione del bundler, dovremo installare da `npm` tutte le librerie necessarie allo stesso per funzionare. Riprendendo i comandi introdotti sopra, andremo quindi ad installare le seguenti librerie previste per l'esempio di webpack con il file di configurazione `webpack.config.js` indicato precedentemente.

Per comodità, possiamo inserirle all'interno del nostro `package.json` con un copia incolla:

```js
{
  //...
  "devDependencies": {
    "@babel/core": "^7.4.0",
    "@babel/preset-env": "^7.4.2",
    "autoprefixer": "^9.5.0",
    "babel-loader": "^8.0.5",
    "css-loader": "^2.1.1",
    "file-loader": "^3.0.1",
    "mini-css-extract-plugin": "^0.5.0",
    "node-sass": "^4.11.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "url-loader": "^1.1.2",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0"
  },
  "dependencies": {
    "jquery": "^3.3.1"
  }
}
```

E quindi lanciare `npm i` da command line (sempre facendo attenzione di essere nella cartella di radice del progetto nel terminale).

Dopo l'installazione, dovremmo controllare che le versioni siano aggiornate e nel caso lanciare `npm update` come detto precedentemente.

**E' importante sfruttare il sistema npm per creare progetti sempre con le librerie aggiornate.**

Se l'installazione e aggiornamento sono andati a buon fine, a questo punto siamo pronti a lanciare l'esecuzione del bundler.

## Esecuzione di webpack

Torniamo innanzitutto a controllare che i percorsi indicati nel nostro file di configurazione di webpack `webpack.config.js` siano corretti rispetto alla nostra struttura di cartelle e nomi di file.

In particolare, è fondamentale che il percorso del file di entrata indichi correttamente il nostro `index.js`, e che il percorso della cartella per il codice compilato sia la nostra cartella `dist`:

```js
//...
entry: './src/index.js',
output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'app.js'
},
//...
```

Fatto questo, rimane solo da scrivere gli script che eseguiranno il nostro bundler.

Gli script di esecuzione risiedono nel file `package.json` e possono essere nominati secondo le nostre preferenze. Per chiarezza, ne creeremo due, il primo che eseguiremo in fase di sviluppo, chiamato script `dev` e il secondo che eseguiremo in fase di fine sviluppo, chiamato script `prod`.
Aggiungeremo quindi, nel nostro `package.json`:

```js
//...
"scripts": {
	"dev": "webpack --mode=development --display=minimal --progress --watch",
	"prod": "webpack --mode=production --display=minimal --progress"
},
//...
```

Vediamo che entrambi i comandi sono simili e chiamano `webpack` per l'esecuzione. Le principali differenze sono che `dev` una volta eseguito rimarrà in _ascolto_ di ogni nostra modifica sui file sorgente e ricompilerà l'output ogni volta, senza richiedere da parte nostra l'esecuzione di un altro script. Inoltre, l'output di `dev` non sarà compresso o minificato, siccome in fase di sviluppo è più importante la velocità di compilazione rispetto alla performance del progetto. Viceversa, il comando `prod` preparerà i file compilati per l'ambiente finale di produzione, e non rimarrà in ascolto di modifiche una volta completato il processo.

**Notare che per fermare lo script `dev` da command line è sufficiente la combo di tasti Ctrl+C**

Una volta inseriti gli script nel `package.json` possiamo eseguirli da command line grazie a `npm` con il semplice comando `npm run`. Nello specifico:

`npm run dev`

Eseguirà `webpack` per lo sviluppo.

`npm run prod`

Eseguirà `webpack` per la produzione.

In entrambi i casi, dopo l'esecuzione del comando, webpack avrà creato due file dentro la nostra cartella `dist`.

```
- dist/
  - app.js
  - app.css
```

Questi sono i file che andremo a includere nel nostro documento HTML come normali file .js e .css.

Per esempio, prevendendo una classica `index.html`:

```html
<html>
  <head>
    <!-- ... -->
    <link rel="stylesheet" href="./dist/app.css" />
  </head>
  <body>
    <!-- ... -->
    <script src="./dist/app.js"></script>
  </body>
</html>
```

Seguendo il nostro esempio, aprendo la pagina HTML vedremo in console la stringa prevista nel nostro Javascript.

# Integrazione completa di Bootstrap

Dato tutto ciò che abbiamo visto precedentemente, vediamo come poter integrare completamente Bootstrap nel nostro bundle e quindi personalizzarlo.

Innanzitutto, installeremo le librerie necessarie da `npm`: `bootstrap` e `popper.js` (quest'ultima è una dipendenza di Bootstrap, facoltativa, ma è buona norma aggiungerla).

`npm i bootstrap popper.js`

Questo comando, come visto sopra, aggiungerà le libreria alla nostra cartella `node_modules` e le elencherà come `dependencies` nel nostro `package.json`.

Le andremo quindi ad includere nel nostro file Javascript principale, `index.js`:

```js
// Importazione del nostro file SCSS principale
import './scss/index.scss';

// Importazione delle librerie
import jquery from 'jquery';
import 'popper.js';
import 'bootstrap';

// Logica Javascript
$(function() {
  console.log('Hello Webpack!');
});
```

E questo è sufficiente per la parte Javascript del framework. Essendo però Bootstrap un framework CSS per la maggior parte, dovremo integrarlo nel nostro SCSS. Questo procedimento è indicato nella documentazione ufficiale di Bootstrap.

Per prima cosa creeremo un file SCSS _parziale_ nella nostra cartella `scss`. Questo file conterrà le variabili `bootstrap` che andremo a sovrascrivere, come i colori, e altre impostazioni.

I file _parziali_ sono identificati dal carattere `_` come prima lettera del nome del file. Possiamo chiamarlo `_variables.scss`. All'interno del file possiamo andare a dichiarare e sovrascrivere tutte le variabili `bootstrap`.
Per esempio:

```scss
$enable-responsive-font-sizes: true;
$enable-transitions: true;
$enable-shadows: false;
$enable-rounded: false;
$enable-caret: false;
$breadcrumb-divider: quote('>');

$text-color: #0068c1;
$body-bg: #ffffff;
$font-family-sans-serif: 'Nunito', Helvetica, Arial, sans-serif;
$font-family-serif: 'Nunito', serif;
$light: #f7f8f7;
$primary: #0081c8;
$secondary: #f9dd00;
$danger: #ed2024;
$link-color: #0068c1;
$info: #122e60;
```

Ovviamente possiamo fare riferimento alla [documentazione ufficiale](https://getbootstrap.com/docs/4.1/getting-started/theming/) per tutte le variabili disponibili.

Dovremo quindi includere il nostro file parziale `_variables.scss` nel nostro file SCSS principale `index.scss`

```scss
// Importazione del file parziale _variables.scss
@import 'variables';

// Altri stili
body {
  background-color: red;
}
```

**Notare come nell'importazione non è necessario il carattere `_`**

E infine ovviamente, importeremo i file SCSS di `bootstrap` stesso.

```scss
// Importazione del file parziale _variables.scss
@import 'variables';
// Importazione del file SCSS di Bootstrap
@import '~bootstrap/scss/bootstrap';

// Altri stili
body {
  background-color: red;
}
```

La `tilde` (`~`) è un carattere che viene interpretato dal nostro bundler `webpack` come indicazione del percorso della cartella `node_modules`. In questo modo, stiamo importanto il file `bootstrap.scss` che vive sotto a `node_modules/bootstrap/scss/`.

A questo punto possiamo eseguire `webpack` come visto precendemente eseguendo i comandi `dev` o `prod` e avremo bootstrap personalizzato e incluso nel nostro file .css compilato. Possiamo ovviamente anche utilizzare le variabili all'interno del nostro SCSS principale, per esempio:

```scss
// Importazione del file parziale _variables.scss
@import 'variables';
// Importazione del file SCSS di Bootstrap
@import '~bootstrap/scss/bootstrap';

// Altri stili
body {
  // Utilizzo la variabile Bootstrap per il colore di sfondo del body
  background-color: $secondary;
}
```

Lo stesso concetto può essere riapplicato per qualsiasi libreria o framework che prevede la personalizzazione tramite SCSS.

_Happy coding!_
