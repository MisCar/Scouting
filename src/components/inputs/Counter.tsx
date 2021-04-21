import React from "react"
import { useLocalStorage } from "../../utilities/hooks"

interface Props {
    store: string
    min?: number
    max?: number
}

const Counter: React.FC<Props> = ({ store, min, max }: Props) => {
    const [value, setValue] = useLocalStorage(store, min ?? 0)

    const increment = () => {
        if (value === max) return
        setValue(value + 1)
    }

    const decrement = () => {
        if (value === min) return
        setValue(value - 1)
    }

    return (
        <div className="flex justify-center w-28" dir="ltr">
            <button
                className="bg-lighter text-white rounded-l-xl focus:outline-none font-bold text-xl px-2"
                onClick={decrement}
            >
                &minus;
            </button>
            <button
                className="button primary p-1 flex-grow dark:bg-gray-700"
                onDoubleClick={() => setValue(min ?? 0)}
            >
                {value}
            </button>
            <button
                className="bg-lighter text-white rounded-r-xl focus:outline-none font-bold text-xl px-2"
                onClick={increment}
            >
                +
            </button>
        </div>
    )
}

export default Counter
