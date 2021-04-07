import React from "react"
import { Parameter } from "./Form"
import Boolean from "./inputs/Boolean"
import Counter from "./inputs/Counter"
import Timer from "./inputs/Timer"
import KeyText from "./inputs/KeyText"

interface Props {
    prefix: string
    widgets: Parameter[]
}

const CardWidgets: React.FC<Props> = ({ widgets, prefix }: Props) => {
    return (
        <div>
            {widgets.map((element) => {
                const key = prefix + " " + element.key

                return (
                    <div
                        className="w-100 flex flex-row items-center my-2"
                        key={key}
                        dir="auto"
                    >
                        <p className="inline mx-2">{element.label}</p>
                        <div className="flex-grow" />
                        <div className="w-40 flex justify-center">
                            {element.widget === "Boolean" && (
                                <Boolean store={key} />
                            )}
                            {element.widget === "Counter" && (
                                <Counter
                                    store={key}
                                    min={element.min ?? 0}
                                    max={element.max}
                                />
                            )}
                            {element.widget === "Timer" && (
                                <Timer store={key} />
                            )}
                            {element.widget === "String" && (
                                <KeyText store={key} />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CardWidgets
