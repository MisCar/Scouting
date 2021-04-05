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

export interface Schema {
    autonomous: Parameter[]
    teleop: Parameter[]
    endgame: Parameter[]
}

interface Props {
    schema: Schema
    setSchema: (value: Schema) => void
}

const Form: React.FC<Props> = ({ schema, setSchema }: Props) => {
    if (schema.autonomous === undefined) return <></>

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <InfoCard setSchema={setSchema} />
            <Card title="אוטונומי">
                <CardWidgets prefix="Autonomous" widgets={schema.autonomous} />
            </Card>
            <Card title="טלאופ">
                <CardWidgets prefix="TeleOperated" widgets={schema.teleop} />
            </Card>
            <Card title="סיום משחק">
                <CardWidgets prefix="Endgame" widgets={schema.endgame} />
            </Card>
            <SubmissionCard schema={schema} />
            <GameCard />
        </div>
    )
}

export default Form
