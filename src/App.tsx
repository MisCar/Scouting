import React, { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Form, { Schema } from "./components/Form"
import Leaderboards from "./components/games/Leaderboards"
import Snake from "./components/games/Snake"
import TopBar from "./components/TopBar"
import firebase from "./utilities/firebase"
import { useLocalStorage } from "./utilities/hooks"

const App: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null)
    const [schema, setSchema] = useLocalStorage<Schema>("Schema", {
        autonomous: [],
        teleop: [],
        endgame: [],
    })

    firebase.auth().onAuthStateChanged((user) => setUser(user))

    const signIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
    }

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
                    {user !== null && (
                        <Switch>
                            <Route exact path="/games/snake">
                                <Snake />
                            </Route>
                            <Route exact path="/games/leaderboards">
                                <Leaderboards />
                            </Route>
                            <Route path="*">
                                <Form schema={schema} setSchema={setSchema} />
                            </Route>
                        </Switch>
                    )}
                </div>
            </div>
        </Router>
    )
}

export default App
