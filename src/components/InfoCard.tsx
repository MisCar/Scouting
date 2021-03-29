import React, { useState } from "react"
import Text from "./inputs/Text"
import Card from "./Card"
import axios from "axios"
import { useLocalStorage } from "../utilities/hooks"
import {
    FINALS_ORDER,
    QUARTERFINALS_ORDER,
    SEMIFINALS_ORDER,
} from "../utilities/constants"

const InfoCard: React.FC = () => {
    const [game, setGame] = useLocalStorage("Game Number", 0)
    const [team, setTeam] = useLocalStorage("Team Number", 0)
    const [event, setEvent] = useLocalStorage("Event Code", "")
    const [teams, setTeams] = useState<number[]>([])

    const fetchTeams = async () => {
        setTeams([])

        const level = window.localStorage.getItem("Competition Level")

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
                code += QUARTERFINALS_ORDER[Number(game)]
                break
            case "sf":
                code += SEMIFINALS_ORDER[Number(game)]
                break
            case "f":
                code += FINALS_ORDER[Number(game)]
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
            console.error(e)
        }
    }

    return (
        <Card title="מידע">
            <Text
                value={event}
                setValue={setEvent}
                store="Event Code"
                placeholder="קוד אירוע"
            />
            <select
                className="w-full dark:bg-gray-600 dark:text-white focus:outline-none p-2 my-2 rounded-xl appearance-none"
                dir="ltr"
                onChange={(e) =>
                    window.localStorage.setItem(
                        "Competition Level",
                        e.target.value
                    )
                }
            >
                <option value="pm">Practice</option>
                <option value="qm">Qualifications</option>
                <option value="qf">Quarterfinals</option>
                <option value="sf">Semifinals</option>
                <option value="f">Finals</option>
            </select>
            <Text
                value={game.toString()}
                setValue={(s: string) => setGame(Number(s))}
                type="number"
                store="Game Number"
                placeholder="מספר משחק"
            />
            {teams.length !== 0 && (
                <>
                    <div
                        className="flex justify-center dark:text-white"
                        dir="ltr"
                    >
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-red-300 dark:bg-red-700"
                            onClick={() => setTeam(teams[0])}
                        >
                            {teams[0]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-red-300 dark:bg-red-700"
                            onClick={() => setTeam(teams[1])}
                        >
                            {teams[1]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-red-300 dark:bg-red-700"
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
                            className="button py-2 px-5 my-1 mx-3 bg-blue-300 dark:bg-blue-700"
                            onClick={() => setTeam(teams[3])}
                        >
                            {teams[3]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-blue-300 dark:bg-blue-700"
                            onClick={() => setTeam(teams[4])}
                        >
                            {teams[4]}
                        </button>
                        <button
                            className="button py-2 px-5 my-1 mx-3 bg-blue-300 dark:bg-blue-700"
                            onClick={() => setTeam(teams[5])}
                        >
                            {teams[5]}
                        </button>
                    </div>
                </>
            )}
            <Text
                value={team.toString()}
                setValue={(s: string) => setTeam(Number(s))}
                store="Team Number"
                placeholder="מספר קבוצה"
            />
            <button
                className="button primary p-2 flex mx-auto"
                onClick={fetchTeams}
            >
                Fetch Teams from TBA
            </button>
        </Card>
    )
}

export default InfoCard
