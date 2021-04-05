import React, { useState } from "react"
import { useLocalStorage } from "../../utilities/hooks"

interface Props {
    store: string
}

const Timer: React.FC<Props> = ({ store }: Props) => {
    const [value, setValue] = useLocalStorage(store, 0)
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
            className="button primary p-1 w-28 dark:bg-gray-700 rounded-xl"
            onClick={startStopTimer}
            onDoubleClick={() => setValue(0)}
        >
            {format(value)}
        </button>
    )
}

export default Timer
