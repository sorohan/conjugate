//
// Create a dutch conjugator.
//
// @requires: lodash
// @see http://www.dutchgrammar.com/en/?n=Verbs.re01
//

/// <reference path="../vendor/lodash/lodash.d.ts" />

// TODO: Common JS.

var utils = _.noConflict();
var TENSE = {
    PRESENT : 'Present',
    PAST : 'Simple Past'
    // perfect
    // pluperfect
    // future
    // conditional
    // future perfect
    // conditional perfect
};

var SUBJECT = {
    FIRST_PERSON_SINGULAR  : 'ik',
    SECOND_PERSON_SINGULAR : 'je/u',
    THIRD_PERSON_SINGULAR  : 'he/she/it',
    FIRST_PERSON_PLURAL    : 'we',
    SECOND_PERSON_PLURAL   : 'jullie',
    THIRD_PERSON_PLURAL    : 'ze'
};

var NlHelper : { [id: string] : any; } = {};

NlHelper['getCrudeStem'] = function (verb: string) : string {
    return verb.replace(/(.+)en$/, '\$1');
};

NlHelper['isLongVowel'] = function(syllable: string) : boolean {
    // @see http://www.dutchgrammar.com/en/?n=SpellingAndPronunciation.09
    // Long vowels can be formed in three ways:
    //  - double vowel: two identical vowels in a row.
    if (syllable.match(/(aa|ee|ie|oo|uu)/)) {
        return true;
    }

    //  - single open vowel: a single vowel at the end of a syllable.
    if (syllable.match(/(^|[^aeiou])[aeiou]$/)) {
        return true;
    }

    //  - vowel combination: two different vowels in a row that merge into (more or less) one vowel.
    return !!syllable.match(/[aeiou][aeiou]/); // todo: check specific vowel sets.
};

NlHelper['isShortVowel'] = function(syllable: string) : boolean {
    // @see: http://www.dutchgrammar.com/en/?n=SpellingAndPronunciation.13

    // alternate consonant match: [b-df-hj-np-tv-z]

    // When a word ends in a consonant, it is easy to see that the single vowel preceding this 
    // consonant is a short vowel: the word fregat (frigate) ends in a consonant (t) and is 
    // preceded by a single vowel (a), which is thus a short vowel.
    if (syllable.match(/[^aeiou][aeiou][aeiou]$/)) {
        return true;
    }

    return !NlHelper['isLongVowel'](syllable);
};

NlHelper['lengthenVowel'] = function(syllable: string) : string {
    // With the exception of y, each vowel has a short and a long form:
    // short   a [ɑ]   e [ɛ]   i [ɪ]   o [ɔ]   u [ʏ]
    // long    aa [a]  ee [e]  ie [i]  oo [o]  uu [y]
    return syllable.replace(/([aeiou])/, '$1$1'); // todo: ie
};

NlHelper['syllableExplode'] = function(word: string) : string[] {
    // @see: http://www.dutchgrammar.com/en/?n=SpellingAndPronunciation.05
    var matches;

    // Rule I
    // If two vowels are separated by only one consonant, the consonant forms the beginning of the second syllable.
    if ((matches = word.match(/^([^aeiou]*[aeiou]+)([^aeiou][aeiou].*)/))) { // consonant?, vowel, consonant, vowel.
        return [matches[1]].concat(NlHelper['syllableExplode'](matches[2]));
    }

    // Rule II
    // If vowels are separated by more than one consonant, the first syllable gets one consonant, the second the rest.
    if ((matches = word.match(/^([^aeiou]*[aeiou]+[^aeiou])([^aeiou]+[[aeiou].*)/))) { // consonant?, vowel, consonant, vowel.
        return [matches[1]].concat(NlHelper['syllableExplode'](matches[2]));
    }

    // Rule III
    // A compound word consists of two or more separate words. We split the compound word at the 
    // boundaries between the original words, thus leaving the original completely intact. We do 
    // the same with words that are derived from nouns or verbs: vergeetachtig = vergeet + achtig (forgetful = forget+ful).
    // TODO?

    // Rule IV
    // "Ease of pronunciation"
    // This is what we do in general but if the next syllable starts with a sequence of consonants 
    // that is hard to pronounce, we place one (or more, if necessary) of the consonants at the 
    // end of the preceding syllable. What a Dutch speaker may find impossible to pronounce, may 
    // not be a challenge for someone with a different mother tongue.
    // TODO?

    // single syllable word.
    return [word];
};

NlHelper['longVowelStem'] = function(verb: string, stem: string) : string {
    var verbSyllables = NlHelper['syllableExplode'](verb);
    var stemSyllables = NlHelper['syllableExplode'](stem);

    var isInfinitiveLong = NlHelper['isLongVowel'](utils.first(utils.last(verbSyllables, 2))); // 2nd last syllable.
    var isStemLong = NlHelper['isLongVowel'](utils.last(stemSyllables));

    if (isInfinitiveLong && !isStemLong) {
        // Long vowel infinitives require long vowel stems.
        stemSyllables[stemSyllables.length-1] = NlHelper['lengthenVowel'](utils.last(stemSyllables));
    }

    return stemSyllables.join('');
};

NlHelper['getStem'] = function(verb: string) : string {
    var crudeStem = NlHelper['getCrudeStem'].call(this, verb);

    // A few rules regarding the stem:
    //  - Long vowel infinitives require long vowel stems.
    //  - A stem never ends in two identical consonants.
    //  - A stem never ends in v or z.
    //  - The stem of an '-iën verb' ends in ie.
    return utils.compose(
        NlHelper['longVowelStem']
    ).call(this, verb, crudeStem);
};

//
// Create a dutch conjugator.
//
class NetherlandsConjugator extends Conjugator {
    //
    // Initialise the conjugation rules.
    //
    constructor() {
        super("Netherlands");
        this.addTenseRuleset(new NetherlandsConjugatorPresentTense(TENSE.PRESENT));
        this.addTenseRuleset(new NetherlandsConjugatorPastTense(TENSE.PAST));
    }
}

class NetherlandsConjugatorPresentTense extends TenseRuleset {
    constructor(public tense: string) {
        super(tense);

        var self = this;
        var getStem = NlHelper['getStem'];
        var getStemPlusT = function(verb) {
            return utils.compose(
                function(stem) {
                    return stem + 't';
                },
                getStem
            ).call(this, verb);
        };

        // 1st person singular "I", use the stem.
        this.addTenseRule(new TenseRule(
            this.tense,
            SUBJECT.FIRST_PERSON_SINGULAR,
            getStem
        ));

        // 2nd person singular "you", same as first, plus a 't'.
        // Same for 3rd person singular "he/she/it".
        [SUBJECT.SECOND_PERSON_SINGULAR, SUBJECT.THIRD_PERSON_SINGULAR].forEach(function(subject) {
            self.addTenseRule(new TenseRule(
                self.tense,
                subject,
                getStemPlusT
            ));
        });

        // All plural forms "we/y'all/they", same as infinitive.
        [SUBJECT.FIRST_PERSON_PLURAL, SUBJECT.SECOND_PERSON_PLURAL, SUBJECT.THIRD_PERSON_PLURAL].forEach(function(subject) {
            self.addTenseRule(new TenseRule(
                self.tense,
                subject,
                function(verb) { return verb; }
            ));
        });
    }
}

class NetherlandsConjugatorPastTense extends TenseRuleset {
    constructor(public tense: string) {
        super(tense);

        var self = this;
        var getStem = NlHelper['getStem'];
        var firstPerson = function(verb) {
            return utils.compose(
                function(stem) {
                    return stem + 'te';
                },
                getStem
            ).call(this, verb);
        };
        var firstPersonPlusN = function(verb) {
            return utils.compose(
                function(fp) {
                    return fp + 'n';
                },
                firstPerson
            ).call(this, verb);
        };

        // 1st person singular "I", stem + 'te'.
        // Same for 2nd person singular "you", and 3rd person singular "he/she/it".
        [SUBJECT.FIRST_PERSON_SINGULAR, SUBJECT.SECOND_PERSON_SINGULAR, SUBJECT.THIRD_PERSON_SINGULAR].forEach(function(subject) {
            self.addTenseRule(new TenseRule(
                self.tense,
                subject,
                firstPerson
            ));
        });

        // All plural forms "we/y'all/they", first person + n.
        [SUBJECT.FIRST_PERSON_PLURAL, SUBJECT.SECOND_PERSON_PLURAL, SUBJECT.THIRD_PERSON_PLURAL].forEach(function(subject) {
            self.addTenseRule(new TenseRule(
                self.tense,
                subject,
                firstPersonPlusN
            ));
        });
    }
}
