import React, { useContext, useEffect, useState } from "react"
import Card from "./Card"
import { Schema } from "./Form"
import firebase from "../utilities/firebase"
import LanguageContext, { getExpression, Language } from "../utilities/language"

interface Props {
    schema: Schema
}

const getMissing = (schema: Schema, language: Language): string => {
    if (schema.sections === undefined) return ""
    for (const card of schema.sections) {
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

        setMissing(getMissing(schema, language))
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

        if (schema.sections !== undefined)
            for (const card of schema.sections) {
                submission[card.prefix] = {}
                for (const widget of card.widgets) {
                    const item = localStorage.getItem(
                        card.prefix + " " + widget.key
                    )
                    submission[card.prefix][widget.key] = JSON.parse(item!)
                }
            }

        return submission
    }

    const send = () => {
        const submission = createSubmission()

        firebase
            .firestore()
            .collection("data")
            .where("General.Game", "==", submission.General.Game)
            .where("General.Level", "==", submission.General.Level)
            .where("General.Team", "==", submission.General.Team)
            .where("Event", "==", submission.Event)
            .get()
            .then((result) => {
                if (result.empty)
                    firebase
                        .firestore()
                        .collection("data")
                        .add(submission)
                        .then(() => window.alert("Submission Received"))
                        .catch((e) => window.alert(e))
                else
                    result.docs[0].ref
                        .set(submission)
                        .then(() => window.alert("Submission Updated"))
                        .catch((e) => window.alert(e))
            })
    }

    const reset = () => {
        if (schema.sections !== undefined)
            schema.sections.forEach((card) => {
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
