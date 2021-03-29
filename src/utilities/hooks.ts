/*
 The following code is available from https://usehooks-typescript.com

 The MIT License (MIT)

 Copyright (c) 2020 Julien CARON

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { useEffect, useState } from "react"

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T) => void] {
    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = () => {
        // Prevent build error "window is undefined" but keep keep working
        if (typeof window === "undefined") {
            return initialValue
        }

        try {
            const item = window.localStorage.getItem(key)
            if (item === null) {
                window.localStorage.setItem(key, JSON.stringify(initialValue))
            }
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error)
            return initialValue
        }
    }

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(readValue)

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T) => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window == "undefined") {
            console.warn(
                `Tried setting localStorage key “${key}” even though environment is not a client`
            )
        }

        try {
            // Allow value to be a function so we have the same API as useState
            const newValue =
                value instanceof Function ? value(storedValue) : value

            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(newValue))

            // Save state
            setStoredValue(newValue)

            // We dispatch a custom event so every useLocalStorage hook are notified
            window.dispatchEvent(new Event("local-storage"))
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error)
        }
    }

    useEffect(() => {
        setStoredValue(readValue())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue())
        }

        // this only works for other documents, not the current one
        window.addEventListener("storage", handleStorageChange)

        // this is a custom event, triggered in writeValueToLocalStorage
        window.addEventListener("local-storage", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
            window.removeEventListener("local-storage", handleStorageChange)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (window.localStorage.getItem(key) === null)
        window.localStorage.setItem(key, JSON.stringify(initialValue))

    return [storedValue, setValue]
}
