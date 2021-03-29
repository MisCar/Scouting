import React, { useState } from "react"

const Boolean: React.FC = () => {
    const [value, setValue] = useState<boolean | null>(null)

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
