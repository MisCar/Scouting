import React from "react"

interface Props {
    type?: string
    placeholder?: string
    value: string
    setValue: (s: string) => void
}

const Text: React.FC<Props> = ({
    value,
    setValue,
    type,
    placeholder,
}: Props) => {
    return (
        <input
            className="w-full dark:bg-gray-600 dark:text-white focus:outline-none p-2 my-2 rounded-xl"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue!(e.target.value)}
        />
    )
}

export default Text
