
/// <reference path="../vendor/jasmine/jasmine.d.ts" />

describe("Testing Netherlands Conjugation", function() {
    it("checks vowel length", function() {
        expect(NlHelper['isLongVowel']('mak')).toBe(false);
        expect(NlHelper['isLongVowel']('werk')).toBe(false);
        expect(NlHelper['isLongVowel']('wer')).toBe(false);
    });

    it("splits the word into syllables", function() {
        var syllables;

        syllables = NlHelper['syllableExplode']('werken');
        expect(utils.isEqual(syllables, ['wer','ken'])).toBe(true);

        syllables = NlHelper['syllableExplode']('moeten');
        expect(utils.isEqual(syllables, ['moe','ten'])).toBe(true);

        syllables = NlHelper['syllableExplode']('paarden');
        expect(utils.isEqual(syllables, ['paar','den'])).toBe(true);

        syllables = NlHelper['syllableExplode']('obstinaat');
        expect(utils.isEqual(syllables, ['ob','sti', 'naat'])).toBe(true);
    });

    it("lengthens a vowel stem", function() {
        var stem = NlHelper['longVowelStem']('werken', 'werk');
        expect(stem).toBe('werk');
    });

    it("gets the regular verb stem", function() {
        var stem = NlHelper['getStem']('werken');
        expect(stem).toBe('werk');
    });

    it("gets the verb stem for a long vowel", function() {
        var stem = NlHelper['getStem']('maken');
        expect(stem).toBe('maak');
    });

    it("conjugates werken present tense", function() {
        var dutchConjugator = new NetherlandsConjugator();
        var conjugation = dutchConjugator.conjugate('werken');

        // Check present tense.
        expect(utils.isEqual(
            conjugation.conjugations['Present'].conjugations,
            {
                'ik': 'werk',
                'je/u': 'werkt',
                'he/she/it': 'werkt',
                'we': 'werken',
                'jullie': 'werken',
                'ze': 'werken'
            }
        )).toBe(true);
    });

    it("conjugates werken past tense", function() {
        var dutchConjugator = new NetherlandsConjugator();
        var conjugation = dutchConjugator.conjugate('werken');

        // Check past tense.
        expect(utils.isEqual(
            conjugation.conjugations['Simple Past'].conjugations,
            {
                'ik': 'werkte',
                'je/u': 'werkte',
                'he/she/it': 'werkte',
                'we': 'werkten',
                'jullie': 'werkten',
                'ze': 'werkten'
            }
        )).toBe(true);
    });
});
