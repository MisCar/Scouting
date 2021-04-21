import React, { useEffect, useState } from "react"
import SnakeGame, { Direction, getInitialBoard, Piece } from "./SnakeGame"

let game = new SnakeGame()

const Snake: React.FC = () => {
    const [board, setBoard] = useState<Piece[][]>(getInitialBoard)
    const [score, setScore] = useState(0)
    const [direction, setDirection] = useState(Direction.Right)

    useEffect(() => {
        game.setCallbacks(setBoard, setScore)
    }, [])

    useEffect(() => {
        game.setDirection(direction)
    }, [direction])

    const start = () => {
        setDirection(Direction.Right)
        game = new SnakeGame()
        game.setCallbacks(setBoard, setScore)
    }

    const rotation =
        direction === Direction.Up
            ? 0
            : direction === Direction.Right
                ? 90
                : direction === Direction.Left
                    ? 270
                    : 180

    const attemptToSetDirection = (d: Direction) => {
        if (d !== -direction) setDirection(d)
    }

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Snake</h1>
            <h3 className="text-xl">Score: {score}</h3>
            {board.length === 0 && (
                <>
                    <button
                        className="text-center button primary p-1 my-2 w-20 rounded-xl"
                        onClick={start}
                    >
                        Start
                    </button>
                    <h3>
                        High Score:{" "}
                        {Math.max(
                            Number(
                                window.localStorage.getItem(
                                    "Snake High Score"
                                ) ?? "0"
                            ),
                            score
                        )}
                    </h3>
                </>
            )}
            {board.map((row, r) => {
                return (
                    <div
                        className="w-full flex items-center justify-center"
                        key={`Snake Row ${r}`}
                    >
                        {row.map((piece, c) => {
                            if (piece === Piece.Background) {
                                return (
                                    <div
                                        className="inline-block w-10 h-10 bg-gray-200 dark:bg-gray-900"
                                        key={`Snake Row ${r} Column ${c}`}
                                    />
                                )
                            }
                            if (piece === Piece.Food) {
                                return (
                                    <div
                                        className="w-10 h-10 flex items-center justify-center bg-red-600"
                                        key={`Snake Row ${r} Column ${c}`}
                                    >
                                        <img
                                            src="/food.png"
                                            alt="head"
                                            className="w-full h-full"
                                        />
                                    </div>
                                )
                            }
                            if (piece === Piece.Head) {
                                return (
                                    <div
                                        className="w-10 h-10 flex items-center justify-center bg-primary"
                                        key={`Snake Row ${r} Column ${c}`}
                                    >
                                        <img
                                            src="/icon.png"
                                            height={30}
                                            width={30}
                                            alt="head"
                                            className="transition duration-100"
                                            style={{
                                                transform: `rotate(${rotation}deg)`,
                                            }}
                                        />
                                    </div>
                                )
                            }
                            return (
                                <div
                                    className="inline-block w-10 h-10 bg-primary"
                                    key={`Snake Row ${r} Column ${c}`}
                                />
                            )
                        })}
                    </div>
                )
            })}
            <div className="w-full flex flex-col justify-center items-center mt-5">
                <button
                    className="button primary p-1 w-20 rounded-xl"
                    onClick={() => setDirection(Direction.Up)}
                >
                    &uarr;
                </button>
                <div className="w-full flex justify-center items-center my-2">
                    <button
                        className="button primary p-1 w-20 inline-block mr-4 rounded-xl"
                        onClick={() => attemptToSetDirection(Direction.Left)}
                    >
                        &larr;
                    </button>
                    <button
                        className="button primary p-1 w-20 inline-block rounded-xl"
                        onClick={() => attemptToSetDirection(Direction.Right)}
                    >
                        &rarr;
                    </button>
                </div>
                <button
                    className="button primary p-1 w-20 rounded-xl"
                    onClick={() => attemptToSetDirection(Direction.Down)}
                >
                    &darr;
                </button>
            </div>
        </div>
    )
}

export default Snake
