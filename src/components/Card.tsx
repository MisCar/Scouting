import React from "react"

interface Props {
    title: string
}

const Card: React.FC<React.PropsWithChildren<Props>> = ({
    title,
    children,
}: React.PropsWithChildren<Props>) => {
    return (
        <div
            className="container m-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl shadow-2xl"
            dir="rtl"
        >
            <h2 className="font-bold text-2xl">{title}</h2>
            {children}
        </div>
    )
}

export default Card
