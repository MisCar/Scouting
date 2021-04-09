import React, { useContext, useEffect, useState } from "react"
import Card from "./Card"
import { Schema } from "./Form"
import firebase from "../utilities/firebase"
import LanguageContext, { getExpression, Language } from "../utilities/language"

interface Props {
    schema: Schema
}

const getMissing = (schema: Schema, language: Language): string => {
    for (const card of Object.values(schema)) {
        for (const widget of card.widgets) {
            const item = localStorage.getItem(card.prefix + " " + widget.key)
            if (item === null || item === "null")
                return (
                    widget.key +
                    " " +
                    getExpression("in", language) +
                    card.title
                )
        }
    }

    return ""
}

const SubmissionCard: React.FC<Props> = ({ schema }: Props) => {
    const language = useContext(LanguageContext)

    const [missing, setMissing] = useState(getMissing(schema, language))

    useEffect(() => {
        window.addEventListener("storage", () =>
            setMissing(getMissing(schema, language))
        )
        window.addEventListener("local-storage", () =>
            setMissing(getMissing(schema, language))
        )
    }, [schema, language])

    const createSubmission = () => {
        const submission: any = {
            General: {
                Game: JSON.parse(localStorage.getItem("Game Number")!),
                Level: localStorage
                    .getItem("Competition Level")!
                    .replaceAll('"', ""),
                Team: JSON.parse(localStorage.getItem("Team Number")!),
                Scouter: firebase.auth().currentUser?.displayName,
            },
            Event: localStorage.getItem("Event Code")!.replaceAll('"', ""),
        }

        for (const card of Object.values(schema)) {
            submission[card.prefix] = {}
            for (const widget of card.widgets) {
                const item = localStorage.getItem(
                    card.prefix + " " + widget.key
                )
                submission[card.prefix][widget.key] = item
            }
        }

        return submission
    }

    const send = () => {
        const submission = createSubmission()

        firebase
            .firestore()
            .collection("data")
            .add(submission)
            .then(() => window.alert("Submission Received"))
            .catch((e) => window.alert(e))
    }

    const reset = () => {
        Object.values(schema).forEach((card) => {
            card.widgets.forEach((widget) => {
                localStorage.removeItem(card.prefix + " " + widget.key)
            })
        })

        window.dispatchEvent(new Event("local-storage"))
    }

    const copy = () => {
        navigator.clipboard.writeText(
            JSON.stringify(createSubmission(), null, 4)
        )
    }

    return (
        <Card title={getExpression("submission", language)}>
            <div className="flex flex-col mx-auto items-center">
                {missing !== "" && (
                    <p className="text-center">
                        {getExpression("missing", language)} {missing}
                    </p>
                )}
                {missing === "" && (
                    <button
                        className="button primary p-2 m-1 w-28 rounded-xl"
                        onClick={send}
                    >
                        {getExpression("submit", language)}
                    </button>
                )}
                <button
                    className="button primary p-2 m-1 w-28 rounded-xl"
                    onClick={reset}
                >
                    {getExpression("reset", language)}
                </button>
                <button
                    className="button primary p-2 m-1 w-28 rounded-xl"
                    onClick={copy}
                >
                    {getExpression("copy", language)}
                </button>
            </div>
        </Card>
    )
}

export default SubmissionCard
