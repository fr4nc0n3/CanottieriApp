import {
    birthdayToFICClassification,
    birthdayToFICSFClassification,
} from "./ts_compiled/Utils.js";

/**
 *
 * @param {string} name
 * @param {string} birthdayStr
 */
const showAthlete = (name, birthdayStr) => {
    const birthday = new Date(birthdayStr);
    const FIC = birthdayToFICClassification(birthday);
    const FICSF = birthdayToFICSFClassification(birthday);

    console.log(`${name}. Data di nascita: ${birthdayStr} (yyyy-mm-dd)`);
    console.log(FICClassificationString(FIC));
    console.log(FICSFClassificationString(FICSF));
};

/**
 *
 * @param {import("../global/Utils").AthleteFICClassification} classification
 */
const FICClassificationString = (classification) => {
    return `FIC -> primaria: ${classification.first ?? "N/A"}, secondaria: ${
        classification.secondary ?? "N/A"
    }, assoluta: ${classification.absolute ?? "N/A"}`;
};

/**
 *
 * @param {import("../global/Utils").AthleteFICSFClassification} classification
 */
const FICSFClassificationString = (classification) => {
    return `FICSF -> primaria: ${classification.first ?? "N/A"}, assoluta: ${
        classification.absolute ?? "N/A"
    }`;
};

//-- INIZIO SCRIPT --
console.log("Formati date: yyyy-mm-dd");

const athletes = [
    () => showAthlete("Azzalin Leonardo", "2011-06-12"),
    () => showAthlete("Crivelli Nicole", "2008-10-16"),
    () => showAthlete("Dejaco Giovanni", "2009-02-11"),
    () => showAthlete("Falciola Federico", "2004-06-14"),
    () => showAthlete("Fanchini Sara", "2009-07-12"),
    () => showAthlete("Mondino Tommaso", "2017-02-03"),
    () => showAthlete("Penna Alice", "2009-10-15"),
    () => showAthlete("Sansone Gianluca", "2007-03-17"),
    () => showAthlete("Rodella Giacomo", "1989-02-04"),
    () => showAthlete("Doneda Livia", "1975-01-21"),
    () => showAthlete("Brusa Matteo", "2011-02-07"),
    () => showAthlete("Sola Alessandro", "1976-04-25"),
    () => showAthlete("Mariotti Francesco", "2001-11-13"),
];

athletes.forEach((func) => {
    func();
    console.log("-----------------------");
    console.log("\n");
});
