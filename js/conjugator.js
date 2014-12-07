var Conjugation = (function () {
    function Conjugation(verb) {
        this.verb = verb;
        this.conjugations = {};
    }
    return Conjugation;
})();
var TenseConjugation = (function () {
    function TenseConjugation(verb, tense) {
        this.verb = verb;
        this.tense = tense;
        this.conjugations = {};
    }
    return TenseConjugation;
})();
var SubjectTenseConjugation = (function () {
    function SubjectTenseConjugation(verb, tense, subject, conjugatedVerb) {
        this.verb = verb;
        this.tense = tense;
        this.subject = subject;
        this.conjugatedVerb = conjugatedVerb;
    }
    return SubjectTenseConjugation;
})();
var Conjugator = (function () {
    function Conjugator(language) {
        this.language = language;
        this.rulesets = {};
    }
    Conjugator.prototype.addTenseRuleset = function (ruleset) {
        this.rulesets[ruleset.tense] = ruleset;
    };
    Conjugator.prototype.conjugate = function (verb) {
        var conjugation = new Conjugation(verb);
        var self = this;
        Object.keys(self.rulesets).forEach(function (tense) {
            conjugation.conjugations[tense] = self.rulesets[tense].conjugate(verb);
        });
        return conjugation;
    };
    return Conjugator;
})();
;
var TenseRuleset = (function () {
    function TenseRuleset(tense) {
        this.tense = tense;
        this.rules = {};
    }
    TenseRuleset.prototype.addTenseRule = function (rule) {
        this.rules[rule.subject] = rule;
    };
    TenseRuleset.prototype.conjugate = function (verb) {
        var tenseConjugation = new TenseConjugation(verb, this.tense);
        var self = this;
        Object.keys(self.rules).forEach(function (subject) {
            tenseConjugation.conjugations[subject] = self.rules[subject].conjugate(verb);
        });
        return tenseConjugation;
    };
    return TenseRuleset;
})();
var TenseRule = (function () {
    function TenseRule(tense, subject, fn) {
        this.tense = tense;
        this.subject = subject;
        this.fn = fn;
    }
    TenseRule.prototype.conjugate = function (verb) {
        return this.fn.call(this, verb, this.tense, this.subject);
    };
    return TenseRule;
})();
