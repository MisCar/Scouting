import React, { useContext } from "react"
import { useLocalStorage } from "../../utilities/hooks"
import LanguageContext, { getExpression } from "../../utilities/language"

interface Props {
    store: string
}

const Boolean: React.FC<Props> = ({ store }: Props) => {
    const [value, setValue] = useLocalStorage<boolean | null>(store, null)

    const language = useContext(LanguageContext)

    return (
        <button
            className="button primary p-1 w-28 dark:bg-gray-700 rounded-xl"
            onClick={() => setValue(value === null ? false : !value)}
        >
            {value === null ? getExpression("maybe", language) : value ? getExpression("yes", language) : getExpression("no", language)}
        </button>
    )
}

export default Boolean
