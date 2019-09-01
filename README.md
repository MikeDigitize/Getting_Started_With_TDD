# Getting Started With TDD

Let's start with a hypothetical situation. A ticket has been assigned to us at a stand up.

## The Ticket

"Create a Euromillions lottery ball generator..."

## The User Story

If this is all that's given to you as a developer, **STOP!** It's not enough to start developing from, and it's important to recognise that. 
As a developer you need to know who or what is using this functionality? And how should it work?

So let's look at it through the lens of a user. Let's create a user story from the ticket.

*A good user story should tell us who, what and why...*

It turns out this ticket has come from Joe. Joe wants a Euromillons lottery ball generator to pick his numbers when he plays the lottery.

## The Spec

Ok we have a user. Now we need to understand how this thing works. We need a spec or list of requirements. You should get these as part of the ticket but if not, it's up to you, so take your time to research and list them all out.

What do we need to do to give Joe his Euromillions generator?

1. Joe needs to be given 7 random balls
2. Joe needs the first 5 to be between 1 and 50
3. Joe needs the last 2 to be between 1 and 12
4. Joe cannot receive doubles in a set, but it's ok for doubles across the two sets
5. Joe needs the balls in a set to be returned in numerical order

Ok great, we now have a user story with a spec! Now we know what's expected we can start to plan how to approach it.

## The Approach

There's lots of ways to approach development. A broad approach that's often useful is to separate the spec into three areas -

1. The interface
2. The data
3. The logic

The interface is whatever we need to expose publically. Think about how this thing will be consumed and what it needs to return.
The data is what values the functionality comes preloaded with. And the logic is what calculations / process the data needs to go through to achieve the goal.

The interface is simply - draw the Euromillions. That's the only thing the consumer is interested in. And it should return an array of balls. 

The data it comes loaded with is - 
* 5 balls
* the boundaries 1 and 50 
* 2 balls
* the boundaries 1 and 12
  
The logic is - 
* generate x amount of random numbers between y and z
* no doubles in a set of numbers
* balls in a set returned in numerical order

## Getting Started

So now we start by writing the failing test right? That's how TDD works? Well, not always, it doesn't have to.

*At this point in time, we know the least about how this thing will work.*

So we're perfectly entitled to start prototyping it in code.
Often, lesser experienced developers find this easier than starting cold, with a test.
Think of it as sending a scouting party out to do a bit of recon about what's in store ahead. When we get the intel back we're in a much better place to start writing tests.

## Prototyping

Remember the first question to ask as you're writing code? 

*Is this easy to test?*

To make it easy to test, we can start by exposing **everything**. 

If everything is exposed we have access to check everything is behaving in the way we expect as we build.
We can do this in JavaScript through the use of an object.
Ultimately we want to expose only the draw Euromillions functionality, as we identified when assessing the interface earlier, but for now this is fine. We'll refactor as we go along to improve the code and hide away implementation details.

```javascript
var lottery = {
    maxBall: 50,
    maxBonusBall: 12,
    minBall: 1,
    numOfBalls: 5,
    numOfBonusBalls: 2,
    balls: [],
    drawEuroMillions() {

    },
    getRandomNumberBetween(min, max) {

    },
    orderNumerically() {

    },
    removeDuplicateNumbers() {

    }
}
```

This is a rough approximation of what the functionality should contain.
All the key pieces of data are accessible on the object.

*Is this easy to test?*

Looks like it!

## Begin The Testing!

Ok so let's write a test. 
Let's take the first requirement as the test. If the requirements are well considered they should translate directly into tests.

*Joe needs to be given 7 random balls.*

We can test that the `drawEuroMillions` method gives us an array of 7 items using Jest's `toHaveLength` check. 

The test fails so let's fix it.

```javascript
test("...Joe needs to be given 7 balls", function() {
    expect(lottery.drawEuroMillions()).toHaveLength(7);
});

drawEuroMillions() {
    for(let i = 0; i < this.numOfBalls; i++) {
        this.balls.push(i);
    }
    for(let i = 0; i < this.numOfBonusBalls; i++) {
        this.balls.push(i);
    }
    return this.balls;
}
```
First test passed!

What we're putting into the balls array is the `i` value as each loop goes round. This obviously isn't what we ultimately what to return, but for now it's enough to get the test passing. Within the code we now have the foundation for the 5 standard and 2 bonus balls functionality.

Next requirement.

*Joe needs the first 5 to be between 1 and 50.*

So here's when we need to start looking at how to generate a random number.

[MDN - JavaScript Math.random().](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)

And we write a test to get the first 5 balls and ensure they're between 1 and 50. Fortunately Jest comes equipped with matchers for these type of checks.

Write the test, then do enough to make the test pass.

```javascript
test("...Joe needs the first 5 to be between 1 and 50", function() {

    let result = lottery.drawEuroMillions();
    let firstFive = result.slice(0, 5);
    
    expect(firstFive).toHaveLength(5);

    for(let i = 0; i < firstFive.length; i++) {
        expect(firstFive[i]).toBeGreaterThan(0);
        expect(firstFive[i]).toBeLessThan(51);
    }

});

drawEuroMillions() {
    for(let i = 0; i < this.numOfBalls; i++) {
        this.balls.push(this.getRandomNumberUpTo(this.maxBall));
    }
    for(let i = 0; i < this.numOfBonusBalls; i++) {
        this.balls.push(i);
    }
    return this.balls;
},
getRandomNumberUpTo(max) {
    return (Math.random() * max) + this.minBall;
}
```

And let's do the same for the bonus balls.

```javascript
test("...Joe needs the last 2 to be between 1 and 12", function() {

    let result = lottery.drawEuroMillions();
    let lastTwo = result.slice(5, 7);
    
    expect(lastTwo).toHaveLength(2);

    for(let i = 0; i < lastTwo.length; i++) {
        expect(lastTwo[i]).toBeGreaterThan(0);
        expect(lastTwo[i]).toBeLessThan(13);
    }

});

drawEuroMillions() {
    for(let i = 0; i < this.numOfBalls; i++) {
        this.balls.push(this.getRandomNumberUpTo(this.maxBall));
    }
    for(let i = 0; i < this.numOfBonusBalls; i++) {
        this.balls.push(this.getRandomNumberUpTo(this.maxBonusBall));
    }
    return this.balls;
}
```
Ok so now we are three tests deep and everything's passing.

## Keep Tests Decoupled

At this stage it's worth reminding ourselves of a golden rule of testing, which is to ensure our tests can run in any order, with any initialising values, and still pass.
In other words *make sure there are no dependencies or coupling between tests.*

If we re-order our tests, moving the length check test to the last test, the suite goes red.

*Expected 7 got 21.*

Whoops!
We've identified a problem.
Every time Joe draws the lottery, the array of balls gets bigger. 
We're adding to an array that never gets emptied.

Let's fix that by refactoring to an array that gets initialised on every call. We don't need access to a balls array directly on the object, we can just check the array when it's returned when `drawEuroMillions` gets called instead.

```javascript
drawEuroMillions() {
    let balls = [];
    for(let i = 0; i < this.numOfBalls; i++) {
        balls.push(this.getRandomNumberUpTo(this.maxBall));
    }
    for(let i = 0; i < this.numOfBonusBalls; i++) {
        balls.push(this.getRandomNumberUpTo(this.maxBonusBall));
    }
    return balls;
}
```

Now the array is generated from scratch every time the `drawEuroMillions` method is called.
And we've removed the coupling between tests.

We're learning more and more about how this functionality should work.
And now we can make an assumption that we're probably safe to do the same refactoring to the other global values we're exposing. 
We can embed the values directly in our code. They're not going to change.

```javascript
const lottery = {
    drawEuroMillions() {
        let balls = [];
        for(let i = 0; i < 5; i++) {
            balls.push(this.getRandomNumberUpTo(50));
        }
        for(let i = 0; i < 2; i++) {
            balls.push(this.getRandomNumberUpTo(12));
        }
        return balls;
    },
    getRandomNumberUpTo(max) {
        return (Math.random() * max) + 1;
    },
    orderNumerically() {

    },
    removeDuplicateNumbers() {

    }
};
```
Ok now it's looking a little neater.
And all tests are still green.

Hopefully this is helping to demonstrate that testing is an organic journey.
Our code evolves as we learn more about the inner workings of our functionality.
Our tests are there to prod and poke at the functionality to make sure it stands up to scrutiny.

As long as we follow some general principles we will end up with the right result.

*Is this easy to test?*  
*What's the minimum I need to test to give me confidence?*  
*If I return in three months' time, will this test suite make sense?*  

## Testing Enough To Give Us Confidence

Ok, so back to the detail of the `drawEuroMillions` method.

Do our tests tell us enough?

How do we know our method *could* return a 50? 
And *could* return a 1?

We're testing the results are between boundaries, but not whether the result could be a boundary.

Infact, we really don't know exactly what this thing is giving us back yet. Let's fix that.

*"What's the minumum I need to test to give me confidence?"*

We need to know more about what's being returned for us to feel confident.

## Implementation vs. Interface

The `getRandomNumberUpTo` method is the thing that's generating our numbers, so we need to test it, right?

Maybe, maybe not. The problem here is that `getRandomNumberUpTo` is an implementation detail.
What we should be concerned with is the interface and whether the `drawEuroMillions` can draw Joe a 50.
And that it can't draw a 51 or a 0. Same for the bonus balls.

Another golden rule of testing.

*Prefer to test the interface, not the implementation detail.*

Things can change over time. We might refactor the implementation.
As long as the output via our interface is giving us what's expected we should be happy. 
And it means we only need to import one thing to test into our test suite, making it easier to read and manage.
And if we have tests around the implementation, we're going to break the tests every time we refactor.

So ideally we should just test our interface as that's all that ultimately matters.

But `drawEuroMillions` returns random numbers, how we can test for an expected outcome from something nondeterministic?

The answer is... we can't *really.* But we can mitigate against random somewhat through sheer volume of tesing.

If we call the method five times, the odds of receiving a 50 aren't great.
What if we called it 50 times, or 500 times? Better odds. We'd probably get a 50 at least once.

So let's add a new test.

```javascript

test("...Joe expects to get a 50 or a 1 if he does 500 draws", function() {

    let results = [];

    for(let i = 0; i < 500; i++) {
        let result = lottery.drawEuroMillions();
        results = results.concat(result);
    }
    
    expect(results).toContain(50);
    expect(results).toContain(1);

});

```

Should work fine, right?

Nope.
Test suite goes red.

## Know Your Dependencies

We look at the output and see that all our numbers are floating point numbers and need rounding.
Whoops!
This is why it's vital we know exactly what our functionality is doing.

Returning whole numbers is a requirement we missed in our initial analysis. It's almost too obvious. What this demonstrates is a need to understand any prebuilt functionality we're leveraging.

[*The Math.random() function returns a floating-point, pseudo-random number.*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)

Ok so let's fix that and return just whole numbers.

```javascript
test("...Joe expects to get whole numbers", function() {

    for(let i = 0; i < 500; i++) {
        let result = lottery.drawEuroMillions();
        result.forEach(function(ball) {
            expect(ball % 1).toBe(0);
        });
    }

});

getRandomNumberUpTo(max) {
    return Math.floor(Math.random() * max) + 1;
}
```
Ok, all green again. And another test in the suite.

*"What's the minumum I need to test to give me confidence?"*

We're checking 2 sets of balls combined (5 x 1-50, 2 x 1-12) to see if there's a 50 or 1.
I'd feel more confident if we tested each set individually for the requisite boundaries.

```javascript
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
```
Now we can be more confident as our tests are more specific.
And we are green.

## Testing Makes You Think

Next requirement!

*Joe cannot receive doubles in a set, but it's ok for doubles across the two sets.*

How can we test that there are no duplicates in our results?

*TDD makes you think about your code.*

Through the power of test driven development we are forced to think about how we write our code and our tests, which is great! Let's continue to work with the principle of testing at volume to give higher confidence when testing random numbers.
Let's write a test.

```javascript
test("...Joe cannot receive doubles in a set, but it's ok for doubles across the two sets", function() {

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

```

And the tests go red.

We have duplicates!

Time to put a check in place to make sure the numbers we're adding into the array aren't already there.

```javascript
drawEuroMillions() {
    let firstFiveBalls = [];
    while(firstFiveBalls.length < 5) {

        let ball = this.getRandomNumberUpTo(50);
        if(!firstFiveBalls.includes(ball)) {
            firstFiveBalls.push(ball);
        }

    };

    let lastTwoBalls = [];

    while(lastTwoBalls.length < 2) {
        let ball = this.getRandomNumberUpTo(12);
        if(!lastTwoBalls.includes(ball)) {
            lastTwoBalls.push(ball);
        }
    }
    
    return firstFiveBalls.concat(lastTwoBalls);
}
```

And the tests go green.

We can probably turn the requirement from 

*"...Joe cannot receive doubles in a set, but it's ok for doubles across the two sets"*

to

*"...Joe cannot receive doubles in a set"*

as we don't need to do anything to ensure the latter half of the sentence.

## Refactoring Our Tests As We Learn More

Ok, we should be feeling even more confident now.
Seeing as though we've started using the principle of testing at volume, let's refactor the other tests to follow suit. We've learnt that only through volume of testing can we really be confident in our suite. Let's apply this learning across our suite.

```javascript
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
```
All key tests are now being put through their paces 500 times. More confidence!

Now for the final requirement.

*Joe need the balls in a set to be returned in numerical order.*

Write the test, then the code.

```javascript
test("...Joe need the balls in a set to be returned in numerical order", function() {
        
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

const lottery = {
    drawEuroMillions() {
        let firstFiveBalls = [];
        while(firstFiveBalls.length < 5) {

            let ball = this.getRandomNumberUpTo(50);
            if(!firstFiveBalls.includes(ball)) {
                firstFiveBalls.push(ball);
            }

        };

        let lastTwoBalls = [];

        while(lastTwoBalls.length < 2) {
            let ball = this.getRandomNumberUpTo(12);
            if(!lastTwoBalls.includes(ball)) {
                lastTwoBalls.push(ball);
            }
        }
        
        return this.orderNumerically(firstFiveBalls).concat(this.orderNumerically(lastTwoBalls));
    },
    getRandomNumberUpTo(max) {
        return Math.floor(Math.random() * max) + 1;
    },
    orderNumerically(numbers) {
        return numbers.sort((a, b) => a - b);
    },
    removeDuplicateNumbers() {

    }
};
```

The tests are passing and all our requirements are well tested. 

Feels good!

## Clean Up Time

Our lottery object looks a bit messy though. Let's clean it up.

```javascript
function getRandomNumberUpTo(max) {
    return Math.floor(Math.random() * max) + 1;
}

function orderNumerically(numbers) {
    return numbers.sort((a, b) => a - b);
}

const lottery = {
    drawEuroMillions() {
        let firstFiveBalls = [];
        while(firstFiveBalls.length < 5) {

            let ball = getRandomNumberUpTo(50);
            if(!firstFiveBalls.includes(ball)) {
                firstFiveBalls.push(ball);
            }

        };

        let lastTwoBalls = [];

        while(lastTwoBalls.length < 2) {
            let ball = getRandomNumberUpTo(12);
            if(!lastTwoBalls.includes(ball)) {
                lastTwoBalls.push(ball);
            }
        }
        
        return orderNumerically(firstFiveBalls).concat(orderNumerically(lastTwoBalls));
    }
};
```

We've removed all methods other than `drawEuroMillions` from the object.
There's no reason why they need to be public. Now our interface is exactly what we planned at the start.

And hopefully the benefit of just testing the interface, not the implementation becomes clear now.
We're able to refactor confidently without breaking anything because we've focused all our testing on just the interface.

*What's the minimum I need to test to give me confidence, **when refactoring**?*

There's some repeated code in our `drawEuroMillions` method. And some naming inconsistencies. Let's fix that.

```javascript
function getRandomNumberUpTo(max) {
	return Math.floor(Math.random() * max) + 1;
}

function orderNumerically(balls) {
	return balls.sort((a, b) => a - b);
}

function getUniqueBalls(amount, max) {
	let balls = [];
	while (balls.length < amount) {
		let ball = getRandomNumberUpTo(max);
		if (!balls.includes(ball)) {
			balls.push(ball);
		}
	}
	return balls;
}

const lottery = {
	drawEuroMillions() {
		return [
			...orderNumerically(getUniqueBalls(5, 50)),
			...orderNumerically(getUniqueBalls(2, 12))
		];
	}
};

export default lottery;

```

Again, it's really easy to separate out functionality with confidence because we have no tests around the implementation details.
Now our code is neat and more readable.

## Final Checks

*Is it easy to test?*

Yes. We've tested all our requirements extensively. And we only import one thing to test into the test suite.

*What's the minimum I need to test to give me confidence, when refactoring?*

* We get 7 balls
* First five are between 1 and 50 (* 500 tests)
* Last two are between 1 and 12 (* 500 tests)
* The numbers are whole (* 500 tests)
* We can draw a 50 and 1 from the first set (* 500 tests)
* We can draw a 12 and 1 from the second set (* 500 tests)
* No duplicates (* 500 tests)
* Sets are in numerical order (* 500 tests)

Do we need to test that the balls are returned set 1 first, set 2 second?
Not really. The other tests confirm it's working when we take the first five numbers and last two numbers to test individually.
Feels like we've covered everything.

*Decouple your tests, like you decouple your code*

If we rejig the order of our tests does it matter?
No! Still green. And we know through refactoring that we've removed opportunities for our tests to couple.

*If I return in three months' time, will this test suite make sense?*

Let's change the test suite description from 

"Euro millions generator..."

to 

"Joe's Euro millions lottery ball generator..."

And let's do a sweep to make sure we have consistency in conventions used within the code. Now the test suite reads like a story; clearly mapping out each requirement and the corresponding live code example to show how it works.

*Job done.*

Writing code in this way is highly rewarding. We've written the functionality thoughtfully. We have high confidence it works. It should be easy to maintain because of the thoughtful and methodical way we've wrote it. We've earnt our wages! 

_TDD should not be thought of as separate to development, testing code is simply part of what good developer's do._

## New Requirement Time!

A new requirement has just come in. We now need to add functionality to draw the UK lottery too... See if you can repeat the process and build it successfully, good luck!
