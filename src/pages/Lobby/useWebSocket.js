import { useCallback, useEffect, useRef, useState } from "react";

export function useWebSocket(url, onMessage) {
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const ws = useRef(null);

  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onopen = () => setReadyState(WebSocket.OPEN);
    socket.onclose = () => setReadyState(WebSocket.CLOSED);
    socket.onmessage = (event) => {
      if (onMessageRef.current) {
        onMessageRef.current(event);
      }
    };
    socket.onerror = (err) => console.error("WebSocket error:", err);

    ws.current = socket;

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

  return { send, readyState };
}
