import React from "react"
import firebase from "firebase/app"

firebase.initializeApp({
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
})

const App: React.FC = () => {
    return (
        <div>
            <h1 className="text-center">Scouting</h1>
        </div>
    )
}

export default App
