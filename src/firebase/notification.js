import { getFirebaseMessaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

export async function requestNotificationPermission() {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return null;

  const permission = await Notification.requestPermission();

  if (permission !== "granted") return null;

  const token = await getToken(messaging, {
    vapidKey: "BLfk-hY3Bc_SFL9v1fmfxLU1rM_pW-zypgP45WFp-KVIz4eX0yQ-bFqoi4VIiS9YXkeGTjn9M68XHyu7QZh0lBg",
  });

  return token;
}

export async function listenForegroundNotification() {
  const messaging = await getFirebaseMessaging();

  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground:", payload);

    new Notification(payload.notification.title, {
      body: payload.notification.body,
    });
  });
}