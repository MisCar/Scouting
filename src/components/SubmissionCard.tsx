import React, { useContext, useEffect, useState } from "react"
import Card from "./Card"
import { Schema } from "./Form"
import firebase from "../utilities/firebase"
import LanguageContext, { getExpression } from "../utilities/language"

interface Props {
    schema: Schema
}

const getMissing = (schema: Schema): string => {
    for (const card of Object.values(schema)) {
        for (const widget of card.widgets) {
            const key = card.prefix + " " + widget.key
            const item = localStorage.getItem(key)
            if (item === null || item === "null") return key
        }
    }

    return ""
}

const SubmissionCard: React.FC<Props> = ({ schema }: Props) => {
    const [missing, setMissing] = useState(getMissing(schema))

    const language = useContext(LanguageContext)

    useEffect(() => {
        window.addEventListener("storage", () => setMissing(getMissing(schema)))
        window.addEventListener("local-storage", () =>
            setMissing(getMissing(schema))
        )
    }, [schema])

    const createSubmission = () => {
        const submission: any = {
            General: {
                Game: JSON.parse(localStorage.getItem("Game Number")!),
                Level: localStorage.getItem("Competition Level"),
                Team: JSON.parse(localStorage.getItem("Team Number")!),
                Scouter: firebase.auth().currentUser?.displayName,
            },
            Extra: {},
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
            {missing !== "" && <p className="text-center">{getExpression("missing", language)} {missing}</p>}
            {missing === "" && (
                <button
                    className="flex mx-auto button primary p-2 m-1 rounded-xl"
                    onClick={send}
                >
                    {getExpression("submit", language)}
                </button>
            )}
            <button
                className="flex mx-auto button primary p-2 m-1 rounded-xl"
                onClick={reset}
            >
                {getExpression("reset", language)}
            </button>
            <button
                className="flex mx-auto button primary p-2 m-1 rounded-xl"
                onClick={copy}
            >
                {getExpression("copy", language)}
            </button>
        </Card>
    )
}

export default SubmissionCard
