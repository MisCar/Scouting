import React, { useState } from "react"

interface Props {
    min?: number
    max?: number
}

const Counter: React.FC<Props> = ({ min, max }: Props) => {
    const [value, setValue] = useState<number>(min ?? 0)

    const increment = () => {
        if (value === max) return
        setValue((value) => value + 1)
    }

    const decrement = () => {
        if (value === min) return
        setValue((value) => value - 1)
    }

    return (
        <div>
            <button
                className="focus:outline-none ml-2 font-bold text-2xl w-5"
                onClick={increment}
            >
                +
            </button>
            <button
                className="button p-1 w-20 dark:bg-gray-700"
                onDoubleClick={() => setValue(min ?? 0)}
            >
                {value}
            </button>
            <button
                className="focus:outline-none mr-2 font-bold text-2xl w-5"
                onClick={decrement}
            >
                -
            </button>
        </div>
    )
}

export default Counter
