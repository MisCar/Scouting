import React from "react"
import { Parameter } from "./Form"
import Boolean from "./inputs/Boolean"
import Counter from "./inputs/Counter"
import Timer from "./inputs/Timer"

interface Props {
    widgets: Parameter[]
}

const CardWidgets: React.FC<Props> = ({ widgets }: Props) => {
    return (
        <div>
            {widgets.map((element) => {
                return (
                    <div className="w-100 flex flex-row items-center my-2">
                        <p className="inline">{element.label}</p>
                        <div className="flex-grow" />
                        <div className="w-40 flex justify-center">
                            {element.widget === "Boolean" && <Boolean />}
                            {element.widget === "Counter" && (
                                <Counter
                                    min={element.min ?? 0}
                                    max={element.max}
                                />
                            )}
                            {element.widget === "Timer" && <Timer />}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CardWidgets
