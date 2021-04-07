import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import LanguageContext, { getExpression } from "../utilities/language"
import Card from "./Card"

const GameCard: React.FC = () => {
    const history = useHistory()

    const language = useContext(LanguageContext)

    return (
        <Card title={getExpression("games", language)}>
            <button
                className="button primary p-2 my-1 flex mx-auto rounded-xl"
                onClick={() => history.push("/games/leaderboards")}
            >
                Leaderboards
            </button>
            <button
                className="button primary p-2 my-1 flex mx-auto rounded-xl"
                onClick={() => history.push("/games/snake")}
            >
                Snake
            </button>
        </Card>
    )
}

export default GameCard
