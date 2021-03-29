import React from "react"
import Card from "./Card"
import CardWidgets from "./CardWidgets"
import InfoCard from "./InfoCard"

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
}

const Form: React.FC<Props> = ({ schema }: Props) => {
    if (schema.autonomous === undefined) return <></>

    return (
        <div className="w-full flex flex-col justify-center items-center mt-72">
            <InfoCard />
            <Card title="אוטונומי">
                <CardWidgets prefix="Autonomous" widgets={schema.autonomous} />
            </Card>
            <Card title="טלאופ">
                <CardWidgets prefix="TeleOperated" widgets={schema.teleop} />
            </Card>
            <Card title="סיום משחק">
                <CardWidgets prefix="Endgame" widgets={schema.endgame} />
            </Card>
        </div>
    )
}

export default Form
