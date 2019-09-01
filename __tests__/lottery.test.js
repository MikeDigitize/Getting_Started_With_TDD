import lottery from '../src/lottery';

describe("Euro millions generator...", function() {

    test("...Joe needs to be given 7 balls", function() {
        expect(lottery.drawEuroMillions()).toHaveLength(7);
    });

    test("...Joe needs the first 5 to be between 1 and 50", function() {

        for(let i = 0; i < 500; i++) {

            let result = lottery.drawEuroMillions();
            let firstFive = result.slice(0, 5);
            
            expect(firstFive).toHaveLength(5);

            for(let i = 0; i < firstFive.length; i++) {
                expect(firstFive[i]).toBeGreaterThan(0);
                expect(firstFive[i]).toBeLessThan(51);
            }
            
        }

    });

    test("...Joe needs the last 2 to be between 1 and 12", function() {

        for(let i = 0; i < 500; i++) {

            let result = lottery.drawEuroMillions();
            let lastTwo = result.slice(5, 7);
            
            expect(lastTwo).toHaveLength(2);

            for(let i = 0; i < lastTwo.length; i++) {
                expect(lastTwo[i]).toBeGreaterThan(0);
                expect(lastTwo[i]).toBeLessThan(13);
            }

        }

    });

    test("...Joe expects top get whole numbers", function() {

        for(let i = 0; i < 500; i++) {
            let result = lottery.drawEuroMillions();
            result.forEach(function(ball) {
                expect(ball % 1).toBe(0);
            });
        }

    });

    test("...Joe expects to get a 50 or a 1 from the first set if he draws 500 times", function() {

        let results = [];

        for(let i = 0; i < 500; i++) {
            let result = lottery.drawEuroMillions();
            results = results.concat(result.slice(0, 5));
        }
        
        expect(results).toContain(50);
        expect(results).toContain(1);

    });

    test("...Joe expects to get a 12 or a 1 from the second set if he draws 500 times", function() {

        let results = [];

        for(let i = 0; i < 500; i++) {
            let result = lottery.drawEuroMillions();
            results = results.concat(result.slice(5, 7));
        }
        
        expect(results).toContain(12);
        expect(results).toContain(1);

    });

    test("...Joe cannot receive doubles in a set", function() {

        for(let i = 0; i < 500; i++) {
            
            let result = lottery.drawEuroMillions();
            let firstFive = result.slice(0, 5);
            let lastTwo = result.slice(5, 7);
            
            firstFive.forEach(function(number) {
                let appearances = firstFive.filter(num => num === number);
                expect(appearances).toHaveLength(1)
            });

            lastTwo.forEach(function(number) {
                let appearances = lastTwo.filter(num => num === number);
                expect(appearances).toHaveLength(1)
            });

        }

    });

    test("...Joe need the balls in each set to be returned in numerical order", function() {
        
        for(let i = 0; i < 500; i++) {
            
            let result = lottery.drawEuroMillions();
            let firstFive = result.slice(0, 5);
            let lastTwo = result.slice(5, 7);
            
            firstFive.forEach(function(number, i) {
                if(firstFive[i + 1]) {
                    expect(firstFive[i + 1]).toBeGreaterThanOrEqual(i);
                }
            });

            lastTwo.forEach(function(number, i) {
                if(lastTwo[i + 1]) {
                    expect(lastTwo[i + 1]).toBeGreaterThanOrEqual(i);
                }
            });

        }

    });

});