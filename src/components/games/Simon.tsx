import React, { useEffect, useState } from "react"

enum Colors {
    Yellow = "yellow",
    Blue = "blue",
    Red = "red",
    Green = "green",
}

const Simon: React.FC = () => {
    // null if between selections
    const [selected, setSelected] = useState<Colors | undefined | null>()
    const [sequence, setSequence] = useState<Colors[]>([])
    const [index, setIndex] = useState(0) // TODO: this is not needed as state
    const [score, setScore] = useState(0)

    const showSequence = async () => {
        for (const color of sequence) {
            setSelected(color)
            await new Promise((resolve) => setTimeout(resolve, 600))
            setSelected(null)
            await new Promise((resolve) => setTimeout(resolve, 200))
        }

        setSelected(undefined)
    }

    useEffect(() => {
        showSequence()
    }, [sequence])

    const expandSequence = () => {
        const colorIndex = Math.floor(Math.random() * 4)
        const newColor =
            colorIndex === 0
                ? Colors.Blue
                : colorIndex === 1
                ? Colors.Green
                : colorIndex === 2
                ? Colors.Red
                : Colors.Yellow
        setSequence((s) => [...s, newColor])
    }

    useEffect(() => {
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
            expandSequence()
        )
    }, [])

    const onButtonClick = async (color: Colors) => {
        if (color === sequence[index])
            if (index + 1 < sequence.length) setIndex((i) => i + 1)
            else {
                setScore((s) => s + 1)
                setSelected(null)
                await new Promise((resolve) => setTimeout(resolve, 1000))
                expandSequence()
            }
        else {
            setScore(0)
            setSequence([])
        }
    }

    const getButton = (color: Colors) => {
        const classes =
            color === selected
                ? `bg-${color}-500`
                : selected === undefined
                ? `bg-${color}-300 hover:bg-${color}-500 dark:bg-${color}-700`
                : `bg-${color}-300 dark:bg-${color}-700`

        return (
            <button
                className={
                    "button p-1 h-8 w-20 inline-block mr-4 rounded-xl text-transparent " +
                    classes
                }
                onClick={() => onButtonClick(color)}
            />
        )
    }

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Simon</h1>
            <h3 className="text-xl">Score: {score}</h3>
            <div className="w-full flex justify-center items-center my-2">
                {getButton(Colors.Yellow)}
                {getButton(Colors.Blue)}
            </div>
            <div className="w-full flex justify-center items-center my-2">
                {getButton(Colors.Red)}
                {getButton(Colors.Green)}
            </div>
        </div>
    )
}

export default Simon
