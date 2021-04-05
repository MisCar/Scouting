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
            className="container m-3 bg-gray-100 dark:bg-gray-700 rounded-2xl"
            dir="auto"
        >
            <div className="w-full bg-gray-200 dark:bg-gray-900 p-3 rounded-t-2xl shadow-xl">
                <h2 className="font-black text-2xl">{title}</h2>
            </div>
            <div className="p-3">{children}</div>
        </div>
    )
}

export default Card
