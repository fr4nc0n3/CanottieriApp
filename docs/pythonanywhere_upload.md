# Upload su pythonanywhere

NOTA: ricorda di aggiornare la versione in app.json dopo le modifiche

- Fare backup compresso della cartella /home/canottieriapp/prod_run sul server di produzione
  di pythonanywhere.com. Questo fara' in modo di salvare il database, la cartella con le
  immagini, quella con i file, le flask config, il backend ed il frontend.
  Tale backup va salvato nella root del progetto nella cartella "backups", inoltre
  va nominato con la data odierna (es. backup_canottieriapp_19-10-2025.zip)

- Fare build del sito statico cambiando valori in src/.env.
  Per buildare il sito, andare nella cartella src ed eseguire lo script "build:web" situato nel file
  src/package.json, quindi "npm run build:web", questo generera' la cartella src/dist contenente
  tutti i file del sito (html, css, js) ed il service worker necessario per invalidare la cache
  sui client utenti (altrimenti non si aggiornano dopo la pubblicazione della nuova versione)

    NOTA: si puo' provare il sito compilato con "npx serve ./dist" eseguito nella cartella src

- Aggiornare struttura database produzione, con le sole query strutturali che servono per passare alla nuova versione (le query di migrazione dalla versione attuale del database fino all' ultima
  disponibile).

- Fare una copia del backup fatto all' inizio e sostituire in essa il nuovo frontend, backend e tutto il resto, successivamente rinominare sul server la cartella /home/canottieriapp/prod_run in /home/canottieriapp/prod_run.[la data] e quindi caricare la cartella locale sul server nella posizione /home/canottieriapp/prod_run (per fare cio' sara' necessario zippare e unzippare le cartelle siccome il
  server permette il solo caricamento e scaricamento di files)

## Solo se bisogna ripartire da 0 sul server

- Quando si carica la cartella flask_app in /home/canottieriapp, in seguito e' necessario creare
  al medesimo percorso il file flask_app_config.env (guardare quello di sviluppo backend/flask_app_config.env e mettere i dati di produzione)

- Caricare il file src/backend/pythonanywhere_com_wsgi.py (o copiare il contenuto in quello di  
  default che da' la piattaforma). Questo file serve a far capire al server dove si trova l'
  applicazione python per il backend, in modo che la utilizzi.
