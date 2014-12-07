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
NlHelper['getStem'] = function (verb: string) {
	return verb.replace(/(.+)en$/, '\$1');
};
NlHelper['getCrudeStem'] = function (verb: string) {
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
