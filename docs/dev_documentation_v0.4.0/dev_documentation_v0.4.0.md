# Documentazione di sviluppo per canottieri app v0.4.0

## Descrizione di progetto

Il progetto canottieri app, utilizza:

- Un database sqlite per la gestione dei dati.
- Una python flask app per la gestione del backend
- React Native Expo per il frontend, esso e' una Progressive Web App (PWA)

## Come si avvia in modalita' di sviluppo

Per avviare in modalita' di sviluppo serve eseguire in vscodium/vscode
prima "Python debugger: Flask" (launch.json) e poi usare un terminale per eseguire il comando
"npm run web".
Per collegare il debugger per il frontend usare "Attach Expo Web" (launch.json) in modo che esso si colleghi
al processo avviato con "npm run web"
