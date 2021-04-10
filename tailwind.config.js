const colors = require("tailwindcss/colors")

module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
    darkMode: "media",
    theme: {
        colors: {
            primary: "#7e0c2b",
            lighter: "#9d1036",
            gray: colors.trueGray,
            white: colors.white,
            blue: colors.blue,
            red: colors.red,
            green: colors.green,
            yellow: colors.yellow,
            transparent: colors.transparent,
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
