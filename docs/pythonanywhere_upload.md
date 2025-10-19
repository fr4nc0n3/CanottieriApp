# Upload su pythonanywhere

-   Fare backup compresso della cartella /home/canottieriapp sul server di produzione
    di pythonanywhere.com. Questo fara' in modo di salvare il database, la cartella con le
    immagini, il backend ed il frontend.
    Tale backup va salvato nella root del progetto nella cartella "backups", inoltre
    va nominato con la data odierna (es. backup_canottieriapp_19-10-2025.zip)

-   Fare build del sito statico cambiando valori in src/.env.
    Per buildare il sito, andare nella cartella src ed eseguire lo script "build:web" situato nel file
    src/package.json, quindi "npm run build:web", questo generera' la cartella src/dist contenente
    tutti i file del sito (html, css, js) ed il service worker necessario per invalidare la cache
    sui client utenti (altrimenti non si aggiornano dopo la pubblicazione della nuova versione)

-   Zippare e caricare le cartelle src/dist e src/backend/flask_app in modo da caricarle sul server
    di produzione, rispettivamente, in /home/canottieriapp/dist e /home/canottieriapp/flask_app.

    Dopo aver fatto cio' ricordarsi di modificare il file /home/canottieriapp/flask_app/.env
    in modo da rimettere i valori di produzione (es. i percorsi al db e img e la chiave per JWT)

-   Aggiornare struttura database produzione, con le sole query strutturali che servono per passare alla
    nuova versione.

## Solo se bisogna ripartire da 0 sul server

-   Caricare il file src/backend/pythonanywhere_com_wsgi.py (o copiare il contenuto in quello di  
    default che da' la piattaforma). Questo file serve a far capire al server dove si trova l'
    applicazione python per il backend, in modo che la utilizzi.
