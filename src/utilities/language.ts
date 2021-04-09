import React from "react"

interface Expression {
    en: string
    he: string
}

export type Language = keyof Expression

const expressions: { [key: string]: Expression } = {
    info: {
        en: "Info",
        he: "מידע",
    },
    update: {
        en: "Update",
        he: "עדכון",
    },
    eventCode: {
        en: "Event Code",
        he: "קוד אירוע",
    },
    gameNumber: {
        en: "Game Number",
        he: "מספר משחק",
    },
    teamNumber: {
        en: "Team Number",
        he: "מספר קבוצה",
    },
    fetchTeamsFromTBA: {
        en: "Fetch Teams from TBA",
        he: "איסוף קבוצות מ-TBA",
    },
    submission: {
        en: "Submission",
        he: "הגשה",
    },
    submit: {
        en: "Submit",
        he: "שליחה",
    },
    reset: {
        en: "Reset",
        he: "איפוס",
    },
    copy: {
        en: "Copy",
        he: "העתקה",
    },
    games: {
        en: "Games",
        he: "משחקים",
    },
    yes: {
        en: "Yes",
        he: "כן",
    },
    no: {
        en: "No",
        he: "לא",
    },
    maybe: {
        en: "Maybe",
        he: "אולי",
    },
    missing: {
        en: "Missing",
        he: "חסר",
    },
    leaderboards: {
        en: "Leaderboards",
        he: "שיאים",
    },
    in: {
        en: "in ",
        he: "ב",
    },
}

export const flags = {
    en: "🇺🇸",
    he: "🇮🇱",
}

export const languages: Language[] = ["en", "he"]

export const getExpression = (
    key: keyof typeof expressions,
    language: Language
): string => {
    return expressions[key][language]
}

// @ts-ignore
export const defaultLanguage: Language =
    process.env["REACT_APP_DEFAULT_LANGUAGE"] || "en"

const LanguageContext = React.createContext<Language>(defaultLanguage)

export default LanguageContext
