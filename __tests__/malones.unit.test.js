const malones = require('../src/malones');

describe("Malone's conversational app...", function() {

    it("...Malone expects to start with 'Should you come into Malones?'", function() {
        const game = malones();
        expect(game.start()).toBe('Should you come into Malones?');
    });

    it("...Malone expects for each question, the answer 'yes' ends with the same reply -  'Well then come in so!'", function() {
        const game = malones();
        expect(game.yes()).toBe('Well then come in so!');
    });

    it("...For the last question the answer no ends with another reply - 'Maybe a pint will cheer you up ya miserable git! Come in!'", function() {
        const game = malones();
        game.questionNumber = game.questions.length - 1;
        expect(game.no()).toBe('Maybe a pint will cheer you up ya miserable git! Come in!');
    });

    it("...Malone expects for each question other than the last, the answer 'no' asks the next question in the sequence", function() {
        const game = malones();
        for(let i = 0; i < game.questions.length; i++) {
            if(i !== game.questions.length - 1) {
                const { questionNumber } = game;
                expect(game.no()).toBe(game.questions[questionNumber + 1]);
            }
            else {
                expect(game.no()).toBe('Maybe a pint will cheer you up ya miserable git! Come in!');
            }
        }
    });

});