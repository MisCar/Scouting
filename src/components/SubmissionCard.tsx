import React, { useEffect, useState } from "react"
import Card from "./Card"
import { Schema } from "./Form"
import firebase from "../utilities/firebase"

interface Props {
    schema: Schema
}

const getMissing = (schema: Schema): string => {
    for (let i = 0; i < schema.autonomous.length; i++) {
        const item = localStorage.getItem(
            "Autonomous " + schema.autonomous[i].key
        )
        if (item === null || item === "null") {
            return schema.autonomous[i].label + " באוטונומי"
        }
    }

    for (let i = 0; i < schema.teleop.length; i++) {
        const item = localStorage.getItem(
            "TeleOperated " + schema.teleop[i].key
        )
        if (item === null || item === "null") {
            return schema.teleop[i].label + " בטלאופ"
        }
    }

    for (let i = 0; i < schema.endgame.length; i++) {
        const item = localStorage.getItem("Endgame " + schema.endgame[i].key)
        if (item === null || item === "null") {
            return schema.endgame[i].label + " בסיום המשחק"
        }
    }

    return ""
}

const SubmissionCard: React.FC<Props> = ({ schema }: Props) => {
    const [missing, setMissing] = useState(getMissing(schema))

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
            Autonomous: {},
            TeleOperated: {},
            Endgame: {},
            Extra: {},
            Event: localStorage.getItem("Event Code")!.replaceAll('"', ""),
        }
        for (let i = 0; i < schema.autonomous.length; i++) {
            const item = localStorage.getItem(
                "Autonomous " + schema.autonomous[i].key
            )
            submission.Autonomous[schema.autonomous[i].key] = JSON.parse(item!)
        }
        for (let i = 0; i < schema.teleop.length; i++) {
            const item = localStorage.getItem(
                "TeleOperated " + schema.teleop[i].key
            )
            submission.TeleOperated[schema.teleop[i].key] = JSON.parse(item!)
        }
        for (let i = 0; i < schema.endgame.length; i++) {
            const item = localStorage.getItem(
                "Endgame " + schema.endgame[i].key
            )
            submission.Endgame[schema.endgame[i].key] = JSON.parse(item!)
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
        for (let i = 0; i < schema.autonomous.length; i++)
            localStorage.removeItem("Autonomous " + schema.autonomous[i].key)

        for (let i = 0; i < schema.teleop.length; i++)
            localStorage.removeItem("TeleOperated " + schema.teleop[i].key)

        for (let i = 0; i < schema.endgame.length; i++)
            localStorage.removeItem("Endgame " + schema.endgame[i].key)

        window.dispatchEvent(new Event("local-storage"))
    }

    const copy = () => {
        navigator.clipboard.writeText(
            JSON.stringify(createSubmission(), null, 4)
        )
    }

    return (
        <Card title="הגשה">
            {missing !== "" && <p className="text-center">חסר: {missing}</p>}
            {missing === "" && (
                <button
                    className="flex mx-auto button primary p-2 m-1"
                    onClick={send}
                >
                    שליחה
                </button>
            )}
            <button
                className="flex mx-auto button primary p-2 m-1 rounded-xl"
                onClick={reset}
            >
                איפוס
            </button>
            <button
                className="flex mx-auto button primary p-2 m-1 rounded-xl"
                onClick={copy}
            >
                העתקה
            </button>
        </Card>
    )
}

export default SubmissionCard
