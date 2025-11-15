# Manuale utente per Canottieri App V0.4.0

Canottieri App e' un app pensata per aiutare l' attivita' svolta in canottieri.

Una volta effettuato il login compare una pagina di menu con le seguenti voci:

-   Profilo
-   Notifiche
-   Registro allenamenti
-   Calendario allenamenti

Inoltre se si e' degli amministratori compariranno anche:

-   Allenamento atleti
-   Programma allenamento

In alto, nella barra in cui compare il logo ed il nome canottieri, sono presenti 2 bottoni:

-   burger menu a sinistra: cliccando si torna sempre alla pagina di menu principale, ossia
    quello discusso precedentemente.

-   bottone per accedere alla pagina di info ed impostazioni a destra

NOTA: In questa pagina di menu, viene mostrato un avvertimento se l' utente loggato ha delle notifiche
ricevute non lette.

## Profilo

Questa pagina mostra il nome utente con cui si e' effettuato il login,
ed il tipo di account relativo.

Inoltre e' possibile effettuare un logout tramite il pulsante

## Notifiche

Questa pagina mostra tutte le notifiche (5 alla volta) ricevute dall' utente.
con i tasti "Precedente" e "Successiva" e' possibile navigare tra le notifiche.

Ogni notifica e' una registrazione con i seguenti dati:

-   Titolo della notifica
-   Nome utente che ha inviato la notifica (quelle con scritto Admin.App indicano notifiche
    inviate dal sistema)
-   Data in cui e' stata pubblicata la notifica
-   Una spunta indicante se la notifica e' letta o meno

Cliccando su tale registrazione, viene mostrata la notifica per intero. Presentando quindi il corpo del messaggio per esteso. Qui e' anche possibile segnare la notifica come letta/non letta cliccando
sulla relativa spunta.

Infine nella pagina e' presente un pulsante "Segna tutte come lette", premendolo e confermando,
verranno segnate tutte le notifiche ricevute come lette.

## Registro allenamenti

Questa pagina mostra un calendario, nel quale si possono segnare gli allenamenti svolti in varie date.
Con le frecce a sinistra e destra e' possibile cambiare mese.

Cliccando su un giorno, sara' possibile creare/modificare un allenamento per tale data.

### Creazione allenamento

Durante la creazione di un allenamento e' possibile immettere una descrizione e delle immagini relative.

### Modifica allenamento

Durante la modifica di un allenamento e' possibile:

-   Modificare la descrizione
-   Aggiungere/eliminare immagini allegate
-   Visualizzare un eventuale commento aggiunto da un amministratore. Quindi se il commento e' presente, appare un icona simile a questo emoji 💬

## Calendario allenamenti

In questa pagina e' presente un calendario simile a "Registro allenamenti".
Ogni giorno colorato indica che in tale data e' stato segnato uno specifico allenamento per tale giorno.

Cliccando su uno di quei giorni si apre la pagina "Allenamento giornaliero" con le specifiche.

## Allenamento atleti (solo per amministratore)

Selezionando uno specifico utente tramite il bottone "Cambia atleta",
e' possibile visualizzare tutti gli allenamenti che tale utente ha segnato.
Cliccando su uno di questi allenamenti e' possibile, oltre a visualizzarne il contenuto,
aggiungere/modificare un commento cliccando sull' icona simile all' emoji 💬

## Programma allenamento (solo per amministratore)

Mostra un calendario in cui e' possibile aggiungere/modificare la programmazione di un allenamento
per tale data, in modo analogo per le altre pagine in cui si mostra un calendario.

## Pagina di info ed impostazioni

A questa pagina ci si puo' accedere con il bottone a forma di ingranaggio presente nella barra
superiore dell' applicazione.
Essa mostra i seguenti dati:

-   Nome App
-   Versione App: utile per verificare eventuali aggiornamenti
-   Build: al momento non utile
-   Autore: io modestamente
-   Privacy policy: non necessaria al momento
-   API endpoint: dettaglio tecnico che indica a quale percorso URL l' app effettua le richieste per ottenere i dati centralizzati sul server.
