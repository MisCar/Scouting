this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("Scouting").then((cache) => {
            cache.addAll(["offline.html"])
        })
    )
})

this.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request).catch(() =>
                caches.match("offline.html")
            )
        })
            })
        })
    )
})
