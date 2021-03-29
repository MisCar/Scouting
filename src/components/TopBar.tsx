import React, { useState } from "react"
import ProfilePicture from "./ProfilePicture"

interface Props {
    photoURL?: string | null
}

const TopBar: React.FC<Props> = ({ photoURL }: Props) => {
    const [rotation, setRotation] = useState(0)

    return (
        <div className="h-16 flex-none bg-primary flex items-center">
            <img
                className="ml-2 transition duration-300"
                src="/icon.png"
                height={40}
                width={40}
                alt="icon"
                onClick={() => setRotation((r) => r + 72)}
                style={{ transform: `rotate(${rotation}deg)` }}
            />
            <h1 className="ml-3 font-bold text-white text-xl">Scouting</h1>
            <div className="flex-grow" />
            <ProfilePicture photoURL={photoURL} className="mr-3" />
        </div>
    )
}

export default TopBar
