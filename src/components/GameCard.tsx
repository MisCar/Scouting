import React from "react"
import { useHistory } from "react-router-dom"
import Card from "./Card"

const GameCard: React.FC = () => {
    const history = useHistory()

    return (
        <Card title="משחקים">
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
