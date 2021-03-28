import React, {useState} from "react"
import TopBar from "./components/TopBar"
import firebase from "./utilities/firebase"


const App: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null)

    firebase.auth().onAuthStateChanged((user) => setUser(user))

    const signIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
    }

    return (
        <div className="h-screen flex flex-col">
            <TopBar photoURL={user?.photoURL}/>
            <div className="flex-grow flex justify-center items-center bg-gray-200 dark:bg-gray-800 dark:text-white">
                {user === null && (
                    <button className="button" onClick={signIn}>
                        Sign in with Google
                    </button>
                )}
                {user !== null && (
                    <h1>TODO</h1>
                )}
            </div>
        </div>
    )
}

export default App
