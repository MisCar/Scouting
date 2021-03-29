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

    const send = () => {
        const submission: any = {
            general: {
                game: JSON.parse(localStorage.getItem("Game Number")!),
                level: localStorage.getItem("Competition Level"),
                team: JSON.parse(localStorage.getItem("Team Number")!),
                name: firebase.auth().currentUser?.displayName,
            },
            autonomous: {},
            teleop: {},
            endgame: {},
            extra: {},
            event: localStorage.getItem("Event Code")!.replaceAll('"', ""),
        }
        for (let i = 0; i < schema.autonomous.length; i++) {
            const item = localStorage.getItem(
                "Autonomous " + schema.autonomous[i].key
            )
            submission.autonomous[schema.autonomous[i].key] = JSON.parse(item!)
        }
        for (let i = 0; i < schema.teleop.length; i++) {
            const item = localStorage.getItem(
                "TeleOperated " + schema.teleop[i].key
            )
            submission.teleop[schema.teleop[i].key] = JSON.parse(item!)
        }
        for (let i = 0; i < schema.endgame.length; i++) {
            const item = localStorage.getItem(
                "Endgame " + schema.endgame[i].key
            )
            submission.endgame[schema.endgame[i].key] = JSON.parse(item!)
        }

        firebase
            .firestore()
            .collection("data")
            .add(submission)
            .then(() => window.alert("Submission Received"))
            .catch((e) => window.alert(e))
    }

    return (
        <Card title="הגשה">
            {missing !== "" && <p>חסר: {missing}</p>}
            {missing === "" && (
                <button
                    className="flex mx-auto button primary p-2 m-1"
                    onClick={send}
                >
                    שליחה
                </button>
            )}
        </Card>
    )
}

export default SubmissionCard
