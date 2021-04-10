import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import LanguageContext, { getExpression } from "../utilities/language"
import Card from "./Card"

const GameCard: React.FC = () => {
    const history = useHistory()

    const language = useContext(LanguageContext)

    return (
        <Card title={getExpression("games", language)}>
            <div className="flex flex-col mx-auto items-center">
                <button
                    className="button primary p-2 my-1 w-28 rounded-xl"
                    onClick={() => history.push("/games/snake")}
                >
                    Snake
                </button>
                <button
                    className="button primary p-2 my-1 w-28 rounded-xl"
                    onClick={() => history.push("/games/simon")}
                >
                    Simon
                </button>
                <button
                    className="button primary p-2 my-1 w-28 rounded-xl"
                    onClick={() => history.push("/games/leaderboards")}
                >
                    {getExpression("leaderboards", language)}
                </button>
            </div>
        </Card>
    )
}

export default GameCard
