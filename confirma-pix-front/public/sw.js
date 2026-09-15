self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error("Erro ao ler notificação Push:", error);
  }

  const title = data.title || "💰 PIX RECEBIDO";

  const options = {
    body: data.body || "Você recebeu um novo pagamento.",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: data.tag || "confirma-pix",
    renotify: true,
    data: {
      url: data.url || "/dashboard"
    },
    silent: data.silent === true
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});


self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const url =
      event.notification.data?.url ||
      "/dashboard";

    event.waitUntil(
      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      }).then((clientList) => {

        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }

      })
    );
  }
);