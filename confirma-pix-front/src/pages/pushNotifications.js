const API_URL = import.meta.env.VITE_API_URL;
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (
    base64String +
    padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) =>
      char.charCodeAt(0)
    )
  );
}

export async function ativarNotificacoes() {
  try {
    if (!("serviceWorker" in navigator)) {
      throw new Error(
        "Este navegador não suporta Service Worker."
      );
    }

    if (!("PushManager" in window)) {
      throw new Error(
        "Este navegador não suporta notificações Push."
      );
    }

    if (!("Notification" in window)) {
      throw new Error(
        "Este navegador não suporta notificações."
      );
    }

    if (!VAPID_PUBLIC_KEY) {
      throw new Error(
        "VAPID_PUBLIC_KEY não configurada."
      );
    }

    const permissao =
      await Notification.requestPermission();

    if (permissao !== "granted") {
      throw new Error(
        "Permissão para notificações não foi concedida."
      );
    }

    const registration =
      await navigator.serviceWorker.ready;

    let subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      const applicationServerKey =
        urlBase64ToUint8Array(
          VAPID_PUBLIC_KEY
        );

      subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Usuário não está logado."
      );
    }

    const response = await fetch(
      `${API_URL}/push/subscribe`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify(
          subscription.toJSON()
        )
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.erro ||
        "Erro ao registrar notificações."
      );
    }

    console.log(
      "🔔 Notificações ativadas:",
      data
    );

    return {
      sucesso: true,
      subscription
    };

  } catch (error) {
    console.error(
      "❌ ERRO AO ATIVAR NOTIFICAÇÕES:",
      error
    );

    return {
      sucesso: false,
      erro: error.message
    };
  }
}


export async function desativarNotificacoes() {
  try {
    const token =
      localStorage.getItem("token");

    const registration =
      await navigator.serviceWorker.ready;

    const subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      return {
        sucesso: true
      };
    }

    const endpoint =
      subscription.endpoint;

    const response = await fetch(
      `${API_URL}/push/unsubscribe`,
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          endpoint
        })
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.erro ||
        "Erro ao desativar notificações."
      );
    }

    await subscription.unsubscribe();

    console.log(
      "🔕 Notificações desativadas."
    );

    return {
      sucesso: true
    };

  } catch (error) {
    console.error(
      "❌ ERRO AO DESATIVAR NOTIFICAÇÕES:",
      error
    );

    return {
      sucesso: false,
      erro: error.message
    };
  }
}