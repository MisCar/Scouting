import React, { useEffect, useState } from "react"
import TopBar from "./components/TopBar"
import firebase from "./utilities/firebase"
import Form, { Schema } from "./components/Form"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Snake from "./components/games/Snake"
import Leaderboards from "./components/games/Leaderboards"
import GameCard from "./components/GameCard"

const App: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null)
    const [schema, setSchema] = useState<Schema>({
        autonomous: [],
        teleop: [],
        endgame: [],
    })

    firebase.auth().onAuthStateChanged((user) => setUser(user))

    const signIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
    }

    useEffect(() => {
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
    }, [user])

    return (
        <Router>
            <div className="h-screen flex flex-col overflow-hidden fixed w-full">
                <TopBar photoURL={user?.photoURL} />
                <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 dark:text-white p-3 overflow-y-auto">
                    {user === null && (
                        <div className="h-full w-full flex justify-center items-center">
                            <button
                                className="button primary p-2 m-2"
                                onClick={signIn}
                            >
                                Sign in with Google
                            </button>
                        </div>
                    )}
                    {user !== null && schema.autonomous.length !== 0 && (
                        <Switch>
                            <Route exact path="/games/snake">
                                <Snake />
                            </Route>
                            <Route exact path="/games/leaderboards">
                                <Leaderboards />
                            </Route>
                            <Route path="*">
                                <Form schema={schema} />
                            </Route>
                        </Switch>
                    )}
                    {user !== null && schema.autonomous.length === 0 && (
                        <Switch>
                            <Route exact path="/games/snake">
                                <Snake />
                            </Route>
                            <Route exact path="/games/leaderboards">
                                <Leaderboards />
                            </Route>
                            <Route path="*">
                                <div className="flex justify-center items-center">
                                    <GameCard />
                                </div>
                            </Route>
                    </Switch>
                    )}
                </div>
            </div>
        </Router>
    )
}

export default App
