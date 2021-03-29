import React, { useState } from "react"

const Timer: React.FC = () => {
    const [value, setValue] = useState(0)
    const [interval, setInterval] = useState(-1)

    const format = (x: number): string => {
        let result = value.toFixed(2)
        if (value < 10) {
            result = "0" + result
        }
        return result
    }

    const startStopTimer = () => {
        const start = Date.now()

        if (interval === -1) {
            const initial = value
            setInterval(
                window.setInterval(() => {
                    const now = Date.now()
                    setValue((now - start) / 1000 + initial)
                }, 10)
            )
        } else {
            window.clearInterval(interval)
            setInterval(-1)
        }
    }

    return (
        <button
            className="button p-1 w-20 dark:bg-gray-700"
            onClick={startStopTimer}
            onDoubleClick={() => setValue(0)}
        >
            {format(value)}
        </button>
    )
}

export default Timer
