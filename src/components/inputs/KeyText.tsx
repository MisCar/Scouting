import React from "react"
import { useLocalStorage } from "../../utilities/hooks"
import Text from "./Text"

interface Props {
    type?: string
    placeholder?: string
    store: string
}

const KeyText: React.FC<Props> = ({ store, type, placeholder }: Props) => {
    const [value, setValue] = useLocalStorage(store, "")

    return (
        <Text
            type={type}
            placeholder={placeholder}
            value={value}
            setValue={setValue}
        />
    )
}

export default KeyText
