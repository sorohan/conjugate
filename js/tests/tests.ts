
/// <reference path="../vendor/jasmine/jasmine.d.ts" />

describe("Testing Netherlands Language Helper", function() {
    it("checks vowel length", function() {
        expect(NlHelper['isLongVowel']('werk')).toBe(false);
        expect(NlHelper['isLongVowel']('wer')).toBe(false);
        expect(NlHelper['isLongVowel']('mak')).toBe(false);
    });

    it("splits the word into syllables", function() {
        // @see http://www.dutchgrammar.com/en/?n=SpellingAndPronunciation.05

        // Rule I.
        expect(utils.isEqual(NlHelper['syllableExplode']('moeten'), ['moe','ten'])).toBe(true);
        expect(utils.isEqual(NlHelper['syllableExplode']('maken'), ['ma','ken'])).toBe(true);
        expect(utils.isEqual(NlHelper['syllableExplode']('zeuren'), ['zeu','ren'])).toBe(true);

        // Rule II.
        expect(utils.isEqual(NlHelper['syllableExplode']('paarden'), ['paar','den'])).toBe(true);
        expect(utils.isEqual(NlHelper['syllableExplode']('dingen'), ['din','gen'])).toBe(true);
        expect(utils.isEqual(NlHelper['syllableExplode']('wennen'), ['wen','nen'])).toBe(true);
        expect(utils.isEqual(NlHelper['syllableExplode']('venster'), ['ven','ster'])).toBe(true);
        expect(utils.isEqual(NlHelper['syllableExplode']('enclave'), ['en','cla', 've'])).toBe(true);
        expect(utils.isEqual(NlHelper['syllableExplode']('obstinaat'), ['ob','sti', 'naat'])).toBe(true);

        // TODO: Rule III.
        // TODO: Rule IV.
    });

    it("gets the crude stem", function() {
        // infinitive, crude stem, stem.
        var examples = [
            [ 'maken', 'mak', 'maak' ],
            [ 'nemen', 'nem', 'neem' ],
            [ 'lopen', 'lop', 'loop' ],
            [ 'leren', 'ler', 'leer' ],
            [ 'koken', 'kok', 'kook' ],
            [ 'breken', 'brek', 'breek' ],
            [ 'vuren', 'vur', 'vuur' ],
            [ 'horen', 'hor', 'hoor' ],
            [ 'weten', 'wet', 'weet' ]
        ];

        examples.forEach(function(item) {
            expect(NlHelper['getCrudeStem'](item[0])).toBe(item[1]);
        });
    });

    it("gets the regular verb stem", function() {
        // infinitive, crude stem, stem.
        var examples = [
            [ 'werken', 'werk' ]
        ];

        examples.forEach(function(item) {
            expect(NlHelper['getStem'](item[0])).toBe(item[1]);
        });
    });

    it("lengthens a vowel stem", function() {
        // infinitive, crude stem, stem.
        var examples = [
            [ 'maken', 'mak', 'maak' ],
            [ 'lopen', 'lop', 'loop' ],
            [ 'leren', 'ler', 'leer' ],
            [ 'koken', 'kok', 'kook' ],
            [ 'breken', 'brek', 'breek' ],
            [ 'vuren', 'vur', 'vuur' ],
            [ 'horen', 'hor', 'hoor' ],
            [ 'weten', 'wet', 'weet' ]
        ];

        examples.forEach(function(item) {
            expect(NlHelper['longVowelStem'](item[0], item[1])).toBe(item[2]);
        });
    });

    it("gets the verb stem for a long vowel", function() {
        // infinitive, crude stem, stem.
        var examples = [
            [ 'maken', 'mak', 'maak' ],
            [ 'lopen', 'lop', 'loop' ],
            [ 'leren', 'ler', 'leer' ],
            [ 'koken', 'kok', 'kook' ],
            [ 'breken', 'brek', 'breek' ],
            [ 'vuren', 'vur', 'vuur' ],
            [ 'horen', 'hor', 'hoor' ],
            [ 'weten', 'wet', 'weet' ]
        ];

        examples.forEach(function(item) {
            expect(NlHelper['getStem'](item[0])).toBe(item[2]);
        });
    });

    it("gets the verb stem, removing identical constant endings", function() {
        // infinitive, crude stem, stem.
        var examples = [
            [ 'pakken', 'pakk', 'pak' ],
            [ 'missen', 'miss', 'mis' ],
            [ 'wennen', 'wenn', 'wen' ],
            [ 'lukken', 'lukk', 'luk' ],
            [ 'stoppen', 'stopp', 'stop' ],
            [ 'vallen', 'vall', 'val' ]
        ];

        examples.forEach(function(item) {
            expect(NlHelper['getStem'](item[0])).toBe(item[2]);
        });
    });

    it("gets the verb stem, removing v or z ending", function() {
        // infinitive, crude stem, stem.
        var examples = [
            [ 'leven', 'lev', 'leef' ],
            [ 'lozen', 'loz', 'loos' ],
            [ 'werven', 'werv', 'werf' ],
            [ 'wuiven', 'wuiv', 'wuif' ],
            [ 'beven', ' bev', 'beef' ],
            [ 'durven', 'durv', 'durf' ],
            [ 'bonzen', 'bonz', 'bons' ]
        ];

        examples.forEach(function(item) {
            expect(NlHelper['getStem'](item[0])).toBe(item[2]);
        });
    });

    it("gets the verb stem for a verb ending in ien", function() {
        var examples = [
            [ 'ruziën', 'ruzie' ],
            [ 'skiën', 'skie' ],
            [ 'oliën', 'olie' ]
        ];

        examples.forEach(function(item) {
            expect(NlHelper['getStem'](item[0])).toBe(item[1]);
        });
    });
});

describe("Testing Netherlands Conjugator", function() {

    it("conjugates werken present tense", function() {
        var dutchConjugator = new NetherlandsConjugator();
        var conjugation = dutchConjugator.conjugate('werken');

        // Check present tense.
        expect(utils.isEqual(
            conjugation.conjugations['Present'].conjugations,
            {
                'ik': 'werk',
                'je/u': 'werkt',
                'hij/ze/het': 'werkt',
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
                'hij/ze/het': 'werkte',
                'we': 'werkten',
                'jullie': 'werkten',
                'ze': 'werkten'
            }
        )).toBe(true);
    });
});
