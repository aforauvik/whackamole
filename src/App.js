import "./styles.css";

import React, {useState, useEffect} from "react";

const moleTypes = [
	{type: "mole10", points: 10, img: "/mole10.png"},
	{type: "mole20", points: 20, img: "/mole20.png"},
	{type: "bomb", points: -30, img: "/bomb.png"},
];

const randomMoleType = () => {
	return moleTypes[Math.floor(Math.random() * moleTypes.length)];
};

const App = () => {
	const [score, setScore] = useState(0);
	const [holes, setHoles] = useState(Array(9).fill(null));
	const [timeLeft, setTimeLeft] = useState(90);
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (gameOver || !gameStarted) return;
		const timer = setInterval(() => {
			if (timeLeft > 0) {
				setTimeLeft(timeLeft - 1);
			} else {
				setGameOver(true);
				clearInterval(timer);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft, gameOver, gameStarted]);

	useEffect(() => {
		if (gameOver || !gameStarted) return;
		const moleTimer = setInterval(() => {
			setHoles(
				holes.map(() => (Math.random() > 0.5 ? randomMoleType() : null))
			);
		}, 500);

		return () => clearInterval(moleTimer);
	}, [holes, gameOver, gameStarted]);

	const handleMoleClick = (index) => {
		if (holes[index] && !gameOver) {
			setScore(score + holes[index].points);
			const newHoles = [...holes];
			newHoles[index] = null;
			setHoles(newHoles);
		}
	};

	const handleStart = () => {
		setScore(0);
		setHoles(Array(9).fill(null));
		setTimeLeft(90);
		setGameOver(false);
		setGameStarted(true);
	};

	return (
		<div className="App">
			<h1>Whack-a-Mole</h1>
			<h2>Score: {score}</h2>
			<h2>Time Left: {timeLeft} seconds</h2>
			<div className="holes">
				{holes.map((hole, index) => (
					<div
						key={index}
						className={`hole ${gameOver ? "disabled" : ""}`}
						onClick={() => handleMoleClick(index)}
					>
						{hole && <img src={hole.img} alt={hole.type} className="mole" />}
					</div>
				))}
			</div>
			{!gameStarted ? (
				<button onClick={handleStart}>Start Game</button>
			) : gameOver ? (
				<div>
					<h2>Game Over! Final Score: {score}</h2>
					<button onClick={handleStart}>Restart Game</button>
				</div>
			) : null}
		</div>
	);
};

export default App;
