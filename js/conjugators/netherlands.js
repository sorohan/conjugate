//
// Create a dutch conjugator.
//
// @requires: lodash
// @see http://www.dutchgrammar.com/en/?n=Verbs.re01
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../vendor/lodash/lodash.d.ts" />
// TODO: Common JS.
var utils = _.noConflict();
var TENSE = {
    PRESENT: 'Present',
    PAST: 'Simple Past'
};
var SUBJECT = {
    FIRST_PERSON_SINGULAR: 'ik',
    SECOND_PERSON_SINGULAR: 'je/u',
    THIRD_PERSON_SINGULAR: 'he/she/it',
    FIRST_PERSON_PLURAL: 'we',
    SECOND_PERSON_PLURAL: 'jullie',
    THIRD_PERSON_PLURAL: 'ze'
};
var NlHelper = {};
NlHelper['getStem'] = function (verb) {
    return verb.replace(/(.+)en$/, '\$1');
};
NlHelper['getCrudeStem'] = function (verb) {
    // A few rules regarding the stem:
    //  - Long vowel infinitives require long vowel stems.
    //  - A stem never ends in two identical consonants.
    //  - A stem never ends in v or z.
    //  - The stem of an '-iën verb' ends in ie.
    return utils.compose(NlHelper['getStem']); // todo: additional work for stem.
};
//
// Create a dutch conjugator.
//
var NetherlandsConjugator = (function (_super) {
    __extends(NetherlandsConjugator, _super);
    //
    // Initialise the conjugation rules.
    //
    function NetherlandsConjugator() {
        _super.call(this, "Netherlands");
        this.addTenseRuleset(new NetherlandsConjugatorPresentTense(TENSE.PRESENT));
        this.addTenseRuleset(new NetherlandsConjugatorPastTense(TENSE.PAST));
    }
    return NetherlandsConjugator;
})(Conjugator);
var NetherlandsConjugatorPresentTense = (function (_super) {
    __extends(NetherlandsConjugatorPresentTense, _super);
    function NetherlandsConjugatorPresentTense(tense) {
        _super.call(this, tense);
        this.tense = tense;
        var self = this;
        var getStem = NlHelper['getStem'];
        var getStemPlusT = function (verb) {
            return utils.compose(function (stem) {
                return stem + 't';
            }, getStem).call(this, verb);
        };
        // 1st person singular "I", use the stem.
        this.addTenseRule(new TenseRule(this.tense, SUBJECT.FIRST_PERSON_SINGULAR, getStem));
        // 2nd person singular "you", same as first, plus a 't'.
        // Same for 3rd person singular "he/she/it".
        [SUBJECT.SECOND_PERSON_SINGULAR, SUBJECT.THIRD_PERSON_SINGULAR].forEach(function (subject) {
            self.addTenseRule(new TenseRule(self.tense, subject, getStemPlusT));
        });
        // All plural forms "we/y'all/they", same as infinitive.
        [SUBJECT.FIRST_PERSON_PLURAL, SUBJECT.SECOND_PERSON_PLURAL, SUBJECT.THIRD_PERSON_PLURAL].forEach(function (subject) {
            self.addTenseRule(new TenseRule(self.tense, subject, function (verb) {
                return verb;
            }));
        });
    }
    return NetherlandsConjugatorPresentTense;
})(TenseRuleset);
var NetherlandsConjugatorPastTense = (function (_super) {
    __extends(NetherlandsConjugatorPastTense, _super);
    function NetherlandsConjugatorPastTense(tense) {
        _super.call(this, tense);
        this.tense = tense;
        var self = this;
        var getStem = NlHelper['getStem'];
        var firstPerson = function (verb) {
            return utils.compose(function (stem) {
                return stem + 'te';
            }, getStem).call(this, verb);
        };
        var firstPersonPlusN = function (verb) {
            return utils.compose(function (fp) {
                return fp + 'n';
            }, firstPerson).call(this, verb);
        };
        // 1st person singular "I", stem + 'te'.
        // Same for 2nd person singular "you", and 3rd person singular "he/she/it".
        [SUBJECT.FIRST_PERSON_SINGULAR, SUBJECT.SECOND_PERSON_SINGULAR, SUBJECT.THIRD_PERSON_SINGULAR].forEach(function (subject) {
            self.addTenseRule(new TenseRule(self.tense, subject, firstPerson));
        });
        // All plural forms "we/y'all/they", first person + n.
        [SUBJECT.FIRST_PERSON_PLURAL, SUBJECT.SECOND_PERSON_PLURAL, SUBJECT.THIRD_PERSON_PLURAL].forEach(function (subject) {
            self.addTenseRule(new TenseRule(self.tense, subject, firstPersonPlusN));
        });
    }
    return NetherlandsConjugatorPastTense;
})(TenseRuleset);
