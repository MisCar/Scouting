import React from "react"
import Card from "./Card"
import CardWidgets from "./CardWidgets"
import GameCard from "./GameCard"
import InfoCard from "./InfoCard"
import SubmissionCard from "./SubmissionCard"

export interface Parameter {
    key: string
    widget: "Counter" | "Timer" | "Boolean" | "String"
    label: string
    min?: number
    max?: number
}

interface Card {
    title: string
    prefix: string
    widgets: Parameter[]
}

export interface Schema {
    [key: string]: Card
}

interface Props {
    schema: Schema
    setSchema: (value: Schema) => void
}

const Form: React.FC<Props> = ({ schema, setSchema }: Props) => {
    if (schema === {}) return <></>

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <InfoCard setSchema={setSchema} />
            {Object.values(schema).map((card) => {
                return (
                    <Card title={card.title ?? "Untitled"}>
                        <CardWidgets
                            prefix={card.prefix}
                            widgets={card.widgets}
                        />
                    </Card>
                )
            })}
            <SubmissionCard schema={schema} />
            <GameCard />
        </div>
    )
}

export default Form
