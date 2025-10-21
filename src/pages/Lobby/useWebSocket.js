import { useCallback, useEffect, useRef, useState } from "react";

export function useWebSocket(url) {
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setReadyState(WebSocket.OPEN);
    ws.current.onclose = () => setReadyState(WebSocket.CLOSED);
    ws.current.onmessage = (event) => setLastMessage(event);
    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const send = useCallback(
    (data) => {
      if (ws && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(data);
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [ws.current],
  );
  return { send, readyState, lastMessage };
}
