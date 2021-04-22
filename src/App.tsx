import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Form, { Schema } from "./components/Form"
import Leaderboards from "./components/games/Leaderboards"
import Simon from "./components/games/Simon"
import Snake from "./components/games/Snake"
import TopBar from "./components/TopBar"
import { VERSION } from "./utilities/constants"
import firebase from "./utilities/firebase"
import { useLocalStorage } from "./utilities/hooks"
import LanguageContext, {
    defaultLanguage,
    Language,
} from "./utilities/language"

const App: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null)
    const [language, setLanguage] = useLocalStorage<Language>(
        "Language",
        defaultLanguage
    )
    const [schema, setSchema] = useLocalStorage<Schema>("Schema", {})

    firebase.auth().onAuthStateChanged((user) => setUser(user))

    const signIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
    }

    useEffect(() => {
        const checkVersion = () => {
            firebase
                .firestore()
                .doc("/admin/version")
                .get()
                .then((result) => {
                    localStorage.setItem(
                        "Last Version Check",
                        new Date().toISOString()
                    )
                    const latest = result.data()?.version
                    if (latest !== null && latest > VERSION)
                        window.alert(
                            `You're using version ${VERSION} but version ${latest} is available. Please update!`
                        )
                })
                .catch((_) => {})
        }

        const last = localStorage.getItem("Last Version Check")
        if (last === null) checkVersion()
        // More than a day
        else if (new Date().getSeconds() - new Date(last).getSeconds() > 86400)
            checkVersion()
    }, [])

    return (
        <Router>
            <LanguageContext.Provider value={language}>
                <div className="h-screen flex flex-col overflow-hidden fixed w-full">
                    <TopBar
                        photoURL={user?.photoURL}
                        setLanguage={setLanguage}
                    />
                    <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 dark:text-white p-3 overflow-y-auto">
                        {user === null && (
                            <div className="h-full w-full flex justify-center items-center">
                                <button
                                    className="button primary p-2 m-2 rounded-xl"
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
                                <Route exact path="/games/simon">
                                    <Simon />
                                </Route>
                                <Route exact path="/games/leaderboards">
                                    <Leaderboards />
                                </Route>
                                <Route path="*">
                                    <Form
                                        schema={schema}
                                        setSchema={setSchema}
                                    />
                                </Route>
                            </Switch>
                        )}
                    </div>
                </div>
            </LanguageContext.Provider>
        </Router>
    )
}

export default App
