# Getting Started With TDD

## The ticket

"Create a Euromillions lottery ball generator..."

## The User Story

If this is what's given to you as a developer, STOP! This is not enough to start developing from and it's really important you recognise that. 
As a developer you need to know who is this functionality for? And how does it work?

Let's create a user story from the ticket.

Who, what and why...

Joe Bloggs needs a Euromillons lottery ball generator to pick his numbers when he buys a ticket.

## The Spec

Now we need a spec or list of requirements. Your BA or PM will likely do this for you but if not it's up to you, so take your time to research and list them all out...

1. Joe needs to be given 7 random balls
2. Joe needs the first 5 to be between 1 and 50
3. Joe needs the last 2 to be between 1 and 12
4. Joe cannot receive doubles in a set, but it's ok for doubles across the two sets
5. Joe need the balls in a set to be returned in numerical order

Ok great, we now have a user story with a spec! Now we know what's expected we can start to plan how we'll approach it.

## The Approach

Let's separate the spec into three areas -

1. The interface
2. The data
3. The logic

The interface is whatever we need to expose publically. Think about how this thing will be consumed and what it needs to return.
The data is the values the functionality comes preloaded with. The logic is the calculations needed to achieve the goal.

The interface is simply - generate euro millions. That's the only thing the consumer is interested in. And it should return an array of balls. The data is - 5 balls, the boundaries 1 and 50, 2 balls, the boundaries 1 and 12. The logic is - generate random numbers between x and y, no doubles in a set, balls in a set returned in numerical order

## Getting Started

So now we start by writing the failing test right? That's how TDD works? Well, no it doesn't have to.
At this point in time, we know the least about how this thing will work.
So we're perfectly entitled to start prototyping it in code.
Often, the less experienced developers will find this much less daunting than starting with a test.
You can think of it as sending a scouting party out to do a bit of recon about what's in store ahead.

## Sketching Out

Remember the first question when testing - 

Is this easy to test?

To make it easy to test, you can start by exposing everything.
You do this through an object.
You'll rewrite as you go along to further refactor and hide away implementation details.

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

Ok so this is a rough approximation of what it needs to do.
All the key pieces of data are accessible on the object.
We'll refactor all the non-essential stuff away as we go but for now that's fine.

Is this easy to test?
Looks like it!

Ok so let's write a test. 
And let's simply take the first requirement as the test.

Joe needs to be given 7 random balls.

We can test that the `drawEuroMillions` method gives us an array of 7 items using Jest's `toHaveLength`.

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
Test has passed!
What we're getting back is just the `i` value as each loop goes round.
But we have the foundation for the 5 standard and 2 bonus balls functionality.

Next requirement - Joe needs the first 5 to be between 1 and 50.

So here's when we need to start looking at how to generate a random number.

[link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)

And we write a test to get the first five balls and ensure they're between 1 and 50.
We're going to have to slice the array to get the first five numbers.

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

So let's do the same for the bonus balls.

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
Ok so we are three tests deep and everything's passing.

Now a golden rule of testing is to ensure your tests can be ran in any order, with any initialising values.
In other words make sure there are no dependencies or coupling between tests.

If we re-order our tests, moving the first length check test, the test suite goes red.
Expected 7 got 21.

Whoops!
What we've done now is identify a problem with our functionality.
Every time Joe draws the lottery, the array of balls is getting bigger.
We're adding to an array that never gets emptied.

Let's fix that by refactoring to an array that gets initialised on every call.

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

The balls array is generated from scratch every time the `drawEuroMillions` method is called.
Now we've removed the coupling between tests.

We're learning more and more about how the low level details of our functionality.
And now we can make a pretty good guess that we're safe to do the same now for the other global values. 
We can embed the values directly into our code.

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
Ok now it's looking neater.
And all tests are still green.

Hopefully what this has demonstrated is that testing is an organic journey.
Your code evolves as you learn more about the inner workings or your functionality.
Your tests are there to prod and poke at the functionality to make sure it stands up to scrutiny.

As long as we follow some general principles we will end up with the right result.

__Is this easy to test?__
__What's the minimum I need to test to give me confidence?__
__If I return in three months' time, will this test suite make sense?__
__Decouple your tests, like you decouple your code__

Ok, so back to the detail of the `drawEuroMillions` method.

Do our tests tell us enough?

How do we know our method __could__ return a 50? 
And __could__ return a 1?

We're testing the results are between boundaries, but it doesn't tell us whether the result could be a boundary.
We really don't know exactly what this thing is giving Joe back yet.
This is important.

__"What's the minumum I need to test to give me confidence?"__

We need to know more about what's being returned to us to feel confident.

As the main work horse function, the `getRandomNumberUpTo` method needs some deeper checks.
The problem here is that `getRandomNumberUpTo` is an implementation detail.
What we're more concerned with is whether the `drawEuroMillions` can draw Joe a 50.
And that it can't draw a 51 or a 0.

Another rule of testing is 
__Prefer to test the interface, not the implementation detail__

Things can change over time. We might refactor the implementation.
As long as the output via our interface is giving us what's expected we should be happy.
But if we have tests around the implementation, we're going to break the tests every time we refactor.
It introduces brittleness.

So ideally we should just test our interface as that's all that ultimately matters.

But `drawEuroMillions` returns random numbers, how we can test something that's random?
The answer is... through volume of tesing.

If we call the method five times, the odds of receiving a 50 aren't great.
What if we called it 50 times, or 500 times? Better odds.
What if we called it 5000 times? Probably would get it at least once.
And if 0 could be called, it would surely make an appearance after 500 draws.

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

We look at the output and see that all our numbers are floats.
Whoops!
This is why it's vital you know exactly what you're functionality is doing.

This a requirement that we missed in our initial analysis.
Let's fix that and return just whole numbers.

```javascript
getRandomNumberUpTo(max) {
    return Math.floor(Math.random() * max) + 1;
}
```
Ok, all green again!

__"What's the minumum I need to test to give me confidence?"__

We're checking two sets of balls together (5 x 1-50, 2 x 1-12) to see if there's a 50 or 1.
I'd feel more confident if we tested each set individually.

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
Ok now I'm more confident.
And we are green.

Next requirement!

Joe cannot receive doubles in a set, but it's ok for doubles across the two sets.

__TDD makes you think about your code__

How can we test that there are no duplicates in our results?
We're thinking about our code and our tests which is great.
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

We're still working with the principle of testing at volume to give confidence with random numbers.
And the tests go red.

We have duplicates!

Time to put some checks in that what we're adding into the array isn't already there.

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

"...Joe cannot receive doubles in a set, but it's ok for doubles across the two sets"

to

"...Joe cannot receive doubles in a set."

as we don't need to do anything to ensure the latter half of the sentence.

Ok, we should be feeling more confident now.
Seeing as though we started using the principle of testing at volume, let's refactor the other tests to follow suit.

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
Now for the final requirement.

Joe need the balls in a set to be returned in numerical order.

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

Great the tests are passing and all our requirements are well tested.
Looking at our lottery object we can see there's need for a tidy up, so let's clean it up.

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

We've moved all methods other than `drawEuroMillions` from the object.
There's no reason why they need to be public.

And hopefully the benefit of just testing the interface, not the implementation becomes clear now.
We're able to refactor confidently without breaking anything because we've focused all our testing on just the interface.

__What's the minimum I need to test to give me confidence, when refactoring?__

There's some repeated code in our `` method. Let's fix that.

```javascript
function getRandomNumberUpTo(max) {
	return Math.floor(Math.random() * max) + 1;
}

function orderNumerically(numbers) {
	return numbers.sort((a, b) => a - b);
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

Again, easy to change confidently, because we have no tests around the implementation details.
Now our code is neat and more readable.

__Is it easy to test?__

Yes. We test one method.

__What's the minimum I need to test to give me confidence, when refactoring?__

* We get 7 balls
* First five are between 1 and 50 (* 500 tests)
* Last two are between 1 and 12 (* 500 tests)
* We can draw a 50 and 1 from the first set (* 500 tests)
* We can draw a 12 and 1 from the second set (* 500 tests)
* No duplicates (* 500 tests)
* Sets are in numerical order (* 500 tests)

Do we need to test that the balls are returned set 1 first, set 2 second?
Not really, are other tests confirm this by taking the first five numbers and last two numbers to test individually.
Feels like we've covered everything.

__Decouple your tests, like you decouple your code__

If we rejig the order of our tests does it matter?
No.

__If I return in three months' time, will this test suite make sense?__

Let's change the test suite description from 

"Euro millions generator..."

to 

"Joe's Euro millions lottery ball generator..."

The test suite reads like a user story, clearly mapping out each requirement and the live code examples to show how it works.
Job done.

TDD should not be thought of as separate to development, testing your code is simply part of what good developer's do.
Now have a go at adding functionality to draw the UK lottery...

Good luck!
