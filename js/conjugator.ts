
class Conjugation {
	conjugations: { [tense: string]: TenseConjugation } = { };
	constructor(public verb: string) { }
}

class TenseConjugation {
	conjugations: { [subject: string]: SubjectTenseConjugation } = { };
	constructor ( public verb: string, public tense: string) { }
}

class SubjectTenseConjugation {
	constructor (
		public verb: string,
		public tense: string,
		public subject: string,
		public conjugatedVerb: string
	) { }
}

interface ConjugatorInterface {
	language: string;
	rulesets: { [tense: string]: TenseRulesetInterface };
	addTenseRuleset: (ruleset: TenseRulesetInterface) => void;
	conjugate: (verb: string) => Conjugation;
}

interface TenseRulesetInterface {
	tense: string;
	rules: { [subject: string]: TenseRuleInterface };
	conjugate: (verb: string) => TenseConjugation;
}

interface TenseRuleInterface {
	tense: string;
	subject: string;
	fn: ConjugateFunc;
	conjugate: (verb: string) => SubjectTenseConjugation;
}

// conjugation function, takes an infinitive verb string and returns a conjugated verb string.
interface ConjugateFunc {
	(verb: string): string;
}

class Conjugator implements ConjugatorInterface {
	rulesets : { [tense: string]: TenseRuleset } = {};

	constructor(public language: string) {
	}

	addTenseRuleset(ruleset: TenseRuleset) {
		this.rulesets[ruleset.tense] = ruleset;
	}

	conjugate(verb: string) {
		var conjugation = new Conjugation(verb);
		var self = this;

		Object.keys(self.rulesets).forEach(function(tense: string) {
			conjugation.conjugations[tense] = self.rulesets[tense].conjugate(verb);
		});

		return conjugation;
	}
};

class TenseRuleset implements TenseRulesetInterface {
	rules: { [subject: string]: TenseRuleInterface } = {};

	constructor(public tense: string) {
	}

	addTenseRule(rule: TenseRule) {
		this.rules[rule.subject] = rule;
	}

	conjugate(verb: string) {
		var tenseConjugation = new TenseConjugation(verb, this.tense);
		var self = this;

		Object.keys(self.rules).forEach(function(subject: string) {
			tenseConjugation.conjugations[subject] = self.rules[subject].conjugate(verb);
		});

		return tenseConjugation;
	}
}

class TenseRule implements TenseRuleInterface {
	constructor(public tense: string, public subject: string, public fn: ConjugateFunc) { }

	conjugate(verb: string) {
		return this.fn.call(this, verb, this.tense, this.subject);
	}
}
