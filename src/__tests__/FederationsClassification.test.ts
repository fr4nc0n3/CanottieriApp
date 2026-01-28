//NOTA: il percorso degli import DEVE essere relativo (oppure cambiare config jest)
import {
    birthdayToFICClassification,
    birthdayToFICSFClassification,
    FICAgeGroup,
    FICSFAgeGroup,
} from "../global/Utils";

test("Categoria primaria FIC", () => {
    expect(birthdayToFICClassification(new Date("2001-11-13")).first).toBe(
        null
    );
});

//ChatGPT
/*describe("birthdayToFICClassification", () => {
    it("should classify a 10-year-old as Allievi A", () => {
        const birthday = new Date(new Date().getFullYear() - 10, 0, 1);
        const classification = birthdayToFICClassification(birthday);
        expect(classification.first).toBe(FICAgeGroup.ALLIEVI_A);
        expect(classification.secondary).toBeNull();
        expect(classification.absolute).toBeNull();
    });

    it("should classify a 16-year-old as Under 17", () => {
        const birthday = new Date(new Date().getFullYear() - 16, 0, 1);
        const classification = birthdayToFICClassification(birthday);
        expect(classification.first).toBe(FICAgeGroup.UNDER_17);
        expect(classification.secondary).toBeNull();
        expect(classification.absolute).toBeNull();
    });

    it("should classify a 30-year-old as Master A with secondary Master under 43", () => {
        const birthday = new Date(new Date().getFullYear() - 30, 0, 1);
        const classification = birthdayToFICClassification(birthday);
        expect(classification.first).toBe(FICAgeGroup.MASTER_A);
        expect(classification.secondary).toBe(FICAgeGroup.MASTER_UNDER_43);
        expect(classification.absolute).toBe(FICAgeGroup.SENIOR);
    });

    it("should classify a 50-year-old as Master D with secondary Master 43-54", () => {
        const birthday = new Date(new Date().getFullYear() - 50, 0, 1);
        const classification = birthdayToFICClassification(birthday);
        expect(classification.first).toBe(FICAgeGroup.MASTER_D);
        expect(classification.secondary).toBe(FICAgeGroup.MASTER_43_54);
        expect(classification.absolute).toBe(FICAgeGroup.SENIOR);
    });

    it("should classify a 20-year-old as Senior", () => {
        const birthday = new Date(new Date().getFullYear() - 20, 0, 1);
        const classification = birthdayToFICClassification(birthday);
        expect(classification.first).toBe(FICAgeGroup.UNDER_23);
        expect(classification.secondary).toBeNull();
        expect(classification.absolute).toBe(FICAgeGroup.SENIOR);
    });
});

describe("birthdayToFICSFClassification", () => {
    it("should classify a 10-year-old as Esordienti M/F", () => {
        const birthday = new Date(new Date().getFullYear() - 10, 0, 1);
        const classification = birthdayToFICSFClassification(birthday);
        expect(classification.first).toBe(FICSFAgeGroup.ESORDIENTI_M_F);
        expect(classification.absolute).toBeNull();
    });

    it("should classify a 14-year-old as Cadetti M/F", () => {
        const birthday = new Date(new Date().getFullYear() - 14, 0, 1);
        const classification = birthdayToFICSFClassification(birthday);
        expect(classification.first).toBe(FICSFAgeGroup.CADETTI_M_F);
        expect(classification.absolute).toBeNull();
    });

    it("should classify a 22-year-old as Seniores M/F absolute", () => {
        const birthday = new Date(new Date().getFullYear() - 22, 0, 1);
        const classification = birthdayToFICSFClassification(birthday);
        expect(classification.first).toBeNull();
        expect(classification.absolute).toBe(FICSFAgeGroup.SENIORES_M_F);
    });

    it("should classify a 45-year-old as Master M/F and Seniores M/F absolute", () => {
        const birthday = new Date(new Date().getFullYear() - 45, 0, 1);
        const classification = birthdayToFICSFClassification(birthday);
        expect(classification.first).toBe(FICSFAgeGroup.MASTER_M_F);
        expect(classification.absolute).toBe(FICSFAgeGroup.SENIORES_M_F);
    });
});*/
