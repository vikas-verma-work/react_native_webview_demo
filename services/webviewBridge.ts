export type WebMessage =
  | { type: "TOKEN_EXPIRED" }
  | { type: "TRACK_EVENT"; payload: { name: string } };

export function parseWebMessage(data: string): WebMessage | null {
  try {
    const msg = JSON.parse(data);
    if (!msg?.type) return null;

    if (msg.type === "TOKEN_EXPIRED") return msg;
    if (msg.type === "TRACK_EVENT" && msg.payload?.name) return msg;

    return null;
  } catch {
    return null;
  }
}
