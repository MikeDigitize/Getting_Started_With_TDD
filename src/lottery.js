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
