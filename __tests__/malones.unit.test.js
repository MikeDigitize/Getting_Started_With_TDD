const malones = require('../src/malones');

describe("Malone's conversational app...", function() {

    it("...Start with 'Should you come into Malones?'", function() {
        expect(malones.start()).toBe('Should you come into Malones?');
    });

    it("...For each question, the answer 'yes' ends with the same reply -  'Well then come in so!'", function() {
        expect(malones.yes()).toBe('Well then come in so!');
    });

    // it("...For the last question the answer no ends with another reply - 'Maybe a pint will cheer you up ya miserable git! Come in!'", function() {
    //     malones.questionNumber = malones.questions.length - 1;
    //     expect(malones.no()).toBe('Maybe a pint will cheer you up ya miserable git! Come in!');
    // });

    it("For each question except the last the answer 'no' asks the next question in the sequence", function() {
        for(let i = 0; i < malones.questions.length; i++) {
            if(i !== malones.questions.length - 1) {
                expect(malones.no()).toBe(malones.questions[malones.questionNumber]);
            }
            else {
                expect(malones.no()).toBe('Maybe a pint will cheer you up ya miserable git! Come in!');
            }
        }
    });

});