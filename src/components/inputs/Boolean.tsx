import React from "react"
import { useLocalStorage } from "../../utilities/hooks"

interface Props {
    store: string
}

const Boolean: React.FC<Props> = ({ store }: Props) => {
    const [value, setValue] = useLocalStorage<boolean | null>(store, null)

    return (
        <button
            className="button p-1 w-20 dark:bg-gray-700"
            onClick={() => setValue(value === null ? false : !value)}
        >
            {value === null ? "-" : value ? "כן" : "לא"}
        </button>
    )
}

export default Boolean
