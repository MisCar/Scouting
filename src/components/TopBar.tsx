import React from "react"
import ProfilePicture from "./ProfilePicture"

interface Props {
    photoURL?: string | null
}

const TopBar: React.FC<Props> = ({ photoURL }: Props) => {
    return (
        <div className="h-16 flex-none bg-primary flex items-center">
            <img
                className="ml-2"
                src="/icon.png"
                height={40}
                width={40}
                alt="icon"
            />
            <h1 className="ml-3 font-bold text-white text-xl">Scouting</h1>
            <div className="flex-grow" />
            <ProfilePicture photoURL={photoURL} className="mr-3" />
        </div>
    )
}

export default TopBar
