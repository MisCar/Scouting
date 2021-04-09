import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import LanguageContext, {
    flags,
    Language,
    languages,
} from "../utilities/language"
import ProfilePicture from "./ProfilePicture"

interface Props {
    photoURL?: string | null
    setLanguage: (language: Language) => void
}

const TopBar: React.FC<Props> = ({ photoURL, setLanguage }: Props) => {
    const [rotation, setRotation] = useState(0)
    const language = useContext(LanguageContext)

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
            <Link to="/">
                <h1 className="ml-3 font-bold text-white text-xl">Scouting</h1>
            </Link>
            <div className="flex-grow" />
            <button
                className="mr-2 text-3xl focus:outline-none"
                onClick={() =>
                    setLanguage(
                        languages[
                            (languages.indexOf(language) + 1) % languages.length
                        ]
                    )
                }
            >
                {flags[language]}
            </button>
            <ProfilePicture photoURL={photoURL} className="mr-3" />
        </div>
    )
}

export default TopBar
