const self = this

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("Scouting").then((cache) => {
            cache.addAll(["index.html", "offline.html"])
        })
    )
})

this.addEventListener("fetch", (event) => {
    if (event.request.url.startsWith(self.location.origin))
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached

                return fetch(event.request).catch(() =>
                    caches.match("offline.html")
                )
            })
        )
})
