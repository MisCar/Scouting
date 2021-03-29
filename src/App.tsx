import React, { useEffect, useState } from "react"
import TopBar from "./components/TopBar"
import firebase from "./utilities/firebase"
import Form, { Schema } from "./components/Form"

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
        <div className="h-screen flex flex-col">
            <TopBar photoURL={user?.photoURL} />
            <div className="flex-grow flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-800 dark:text-white p-3 overflow-y-auto">
                {user === null && (
                    <button className="button p-2 m-2" onClick={signIn}>
                        Sign in with Google
                    </button>
                )}
                {user !== null && schema.autonomous.length !== 0 && (
                    <Form schema={schema} />
                )}
            </div>
        </div>
    )
}

export default App
