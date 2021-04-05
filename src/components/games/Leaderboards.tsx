import React, { useEffect, useState } from "react"
import Card from "../Card"
import firebase from "../../utilities/firebase"

const Leaderboards: React.FC = () => {
    const [snake, setSnake] = useState<any[]>([])

    useEffect(() => {
        firebase
            .firestore()
            .collection("/games")
            .orderBy("snake", "desc")
            .get()
            .then((result) => {
                const newSnake: any[] = []
                result.docs.forEach((userScores) => {
                    newSnake.push([userScores.id, userScores.data().snake])
                })
                setSnake(newSnake)
            })
    }, [])

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-center text-2xl font-bold">Leaderboards</h1>
            <Card title="Snake">
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {snake.map((result) => {
                            return (
                                <tr key={result[0]}>
                                    <td>{result[0]}</td>
                                    <td>{result[1]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}

export default Leaderboards
