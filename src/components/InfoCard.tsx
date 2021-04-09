import React, { useContext, useState } from "react"
import Text from "./inputs/Text"
import Card from "./Card"
import axios from "axios"
import { useLocalStorage } from "../utilities/hooks"
import {
    FINALS_ORDER,
    QUARTERFINALS_ORDER,
    SEMIFINALS_ORDER,
} from "../utilities/constants"
import firebase from "../utilities/firebase"
import { Schema } from "./Form"
import LanguageContext, { getExpression } from "../utilities/language"

interface Props {
    setSchema: (value: Schema) => void
}

const InfoCard: React.FC<Props> = ({ setSchema }: Props) => {
    const [game, setGame] = useLocalStorage("Game Number", 0)
    const [team, setTeam] = useLocalStorage("Team Number", 0)
    const [event, setEvent] = useLocalStorage("Event Code", "")
    const [level, setLevel] = useLocalStorage("Competition Level", "qm")
    const [teams, setTeams] = useState<number[]>([])

    const language = useContext(LanguageContext)

    const fetchTeams = async () => {
        setTeams([])

        if (
            event === "" ||
            game === 0 ||
            level === "" ||
            event === null ||
            game === null ||
            level === null
        )
            return

        let code = event + "_"

        switch (level) {
            case "pm":
            case "qm":
                code += level + game
                break
            case "qf":
                code += QUARTERFINALS_ORDER[Number(game) - 1]
                break
            case "sf":
                code += SEMIFINALS_ORDER[Number(game) - 1]
                break
            case "f":
                code += FINALS_ORDER[Number(game) - 1]
                break
        }
        code = code.replaceAll('"', "")

        try {
            const response = await axios.get(
                "https://www.thebluealliance.com/api/v3/match/" + code,
                {
                    headers: {
                        "X-TBA-Auth-Key": process.env.REACT_APP_TBA_AUTH_KEY,
                    },
                }
            )

            setTeams([
                ...response.data.alliances.red.team_keys.map((key: string) =>
                    Number(key.substring(3))
                ),
                ...response.data.alliances.blue.team_keys.map((key: string) =>
                    Number(key.substring(3))
                ),
            ])
        } catch (e) {
            window.alert(e)
        }
    }

    const update = () => {
        const user = firebase.auth().currentUser
        if (user !== null) {
            firebase
                .firestore()
                .doc("/admin/schema")
                .get()
                .then((result) => {
                    const data = result.data()
                    if (data !== undefined) {
                        // @ts-ignore
                        setSchema(data)
                    }
                })
        }

        window.caches.open("Scouting").then((cache) => {
            cache.keys().then((keys) => {
                keys.forEach((key) => cache.delete(key))
            })
        })
    }

    return (
        <Card title={getExpression("info", language)}>
            <div className="flex flex-col mx-auto items-center">
                <button
                    className="button rounded-xl primary p-2 my-1 w-60"
                    onClick={update}
                >
                    {getExpression("update", language)}
                </button>
            </div>
            <Text
                value={event}
                setValue={setEvent}
                placeholder={getExpression("eventCode", language)}
            />
            <select
                className="w-full dark:bg-gray-600 dark:text-white focus:outline-none p-2 my-2 rounded-xl appearance-none"
                dir="ltr"
                onChange={(e) => setLevel(e.target.value)}
                value={level}
            >
                <option value="pm">Practice</option>
                <option value="qm">Qualifications</option>
                <option value="qf">Quarterfinals</option>
                <option value="sf">Semifinals</option>
                <option value="f">Finals</option>
            </select>
            <Text
                //@ts-ignore
                value={game === 0 ? "" : game.toString()}
                setValue={(s: string) => setGame(Number(s))}
                type="number"
                placeholder={getExpression("gameNumber", language)}
            />
            {teams.length !== 0 && (
                <>
                    <div
                        className="flex justify-center dark:text-white"
                        dir="ltr"
                    >
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-red-300 dark:bg-red-700 rounded-xl"
                            onClick={() => setTeam(teams[0])}
                        >
                            {teams[0]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-red-300 dark:bg-red-700 rounded-xl"
                            onClick={() => setTeam(teams[1])}
                        >
                            {teams[1]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-red-300 dark:bg-red-700 rounded-xl"
                            onClick={() => setTeam(teams[2])}
                        >
                            {teams[2]}
                        </button>
                    </div>
                    <div
                        className="flex justify-center dark:text-white"
                        dir="ltr"
                    >
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-blue-300 dark:bg-blue-700 rounded-xl"
                            onClick={() => setTeam(teams[3])}
                        >
                            {teams[3]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-blue-300 dark:bg-blue-700 rounded-xl"
                            onClick={() => setTeam(teams[4])}
                        >
                            {teams[4]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-blue-300 dark:bg-blue-700 rounded-xl"
                            onClick={() => setTeam(teams[5])}
                        >
                            {teams[5]}
                        </button>
                    </div>
                </>
            )}
            <Text
                value={team === 0 ? "" : team.toString()}
                setValue={(s: string) => {
                    setTeam(Number(s))
                }}
                placeholder={getExpression("teamNumber", language)}
            />
            <div className="flex flex-col mx-auto items-center">
                <button
                    className="button primary p-2 my-1 w-60 rounded-xl"
                    onClick={fetchTeams}
                >
                    {getExpression("fetchTeamsFromTBA", language)}
                </button>
            </div>
        </Card>
    )
}

export default InfoCard
