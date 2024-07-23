import "./styles.css";

import React, {useState, useEffect, useRef} from "react";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const moleTypes = [
	{type: "mole10", points: 10, img: "/mole10.png", sound: "/mole10.mp3"},
	{type: "mole20", points: 20, img: "/mole20.png", sound: "/mole20.mp3"},
	{type: "bomb", points: -30, img: "/bomb.png", sound: "/bomb.mp3"},
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
	const [difficulty, setDifficulty] = useState("easy");
	const [message, setMessage] = useState("");

	const mole10SoundRef = useRef(null);
	const mole20SoundRef = useRef(null);
	const bombSoundRef = useRef(null);
	const gameOverSoundRef = useRef(null);

	const moleTimerIntervals = {
		easy: 1000,
		medium: 800,
		hard: 500,
		insane: 300,
	};

	useEffect(() => {
		if (gameOver || !gameStarted) return;
		const timer = setInterval(() => {
			if (timeLeft > 0) {
				setTimeLeft(timeLeft - 1);
			} else {
				setGameOver(true);
				gameOverSoundRef.current.play();
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
		}, moleTimerIntervals[difficulty]);

		return () => clearInterval(moleTimer);
	}, [holes, gameOver, gameStarted, difficulty]);

	const handleMoleClick = (index) => {
		if (holes[index] && !gameOver) {
			setScore(score + holes[index].points);
			const newHoles = [...holes];
			newHoles[index] = null;
			setHoles(newHoles);

			if (holes[index].type === "mole10") {
				mole10SoundRef.current.play();
			} else if (holes[index].type === "mole20") {
				mole20SoundRef.current.play();
			} else if (holes[index].type === "bomb") {
				bombSoundRef.current.play();
			}
		}
	};

	const handleStart = () => {
		setScore(0);
		setHoles(Array(9).fill(null));
		setTimeLeft(90);
		setGameOver(false);
		setGameStarted(true);
	};

	const handleDifficultyChange = (event) => {
		setDifficulty(event.target.value);
	};

	const handleShare = () => {
		navigator.clipboard.writeText(message);
		setMessage(
			`I scored ${score} points on ${difficulty} mode in Whack-a-Mole! Play Whack-a-Mole and see if you can score higher than me! Play here - https://whackamole.auvik.me/`
		);
		setTimeout(() => setMessage(""), 8000);
	};

	return (
		<div className="App">
			{message && <div className="message">{message}</div>}
			<h1>Whack-a-Mole</h1>
			<div className="stats">
				<div className="scorecard">
					<p>Score</p>
					<h2>{score}</h2>
				</div>
				<div className="countdown">
					<p>Time Left</p>
					<h2>{timeLeft} seconds</h2>
				</div>
			</div>
			<div className="selectlevels">
				<label htmlFor="difficulty">Select Difficulty: </label>
				<select
					id="difficulty"
					value={difficulty}
					onChange={handleDifficultyChange}
					disabled={gameStarted && !gameOver}
				>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
					<option value="insane">Insane</option>
				</select>
			</div>
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
					<div className="buttons">
						<button onClick={handleStart}>Restart Game</button>
						<button onClick={handleShare}>Share Score</button>
					</div>
				</div>
			) : null}

			<audio ref={mole10SoundRef} src="/mole20.mp3" />
			<audio ref={mole20SoundRef} src="/mole20.mp3" />
			<audio ref={bombSoundRef} src="/bomb.mp3" />
			<audio ref={gameOverSoundRef} src="/game-over.mp3" />

			<p className="footer">
				© {currentYear} | Developed By{" "}
				<a target="blank" href="https://www.auvik.me/">
					Auvik Mir
				</a>
				, North Carolina
			</p>
		</div>
	);
};

export default App;
