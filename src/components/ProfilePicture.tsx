import React from "react"
import firebase from "../utilities/firebase"

interface Props {
    photoURL?: string | null
    className?: string
}

const ProfilePicture: React.FC<Props> = ({ photoURL, className }: Props) => {
    if (photoURL === undefined || photoURL === null) return <div />

    const signOut = () => {
        if (window.confirm("Are you sure you want to sign out?"))
            firebase.auth().signOut()
    }

    return (
        <button onClick={signOut} className="focus:outline-none">
            <img
                src={photoURL}
                alt="profile"
                height={40}
                width={40}
                className={
                    "rounded-full" +
                    (className === undefined ? "" : " " + className)
                }
            />
        </button>
    )
}

export default ProfilePicture
