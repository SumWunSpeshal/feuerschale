import { useEffect } from "react";

/**
 * @typedef {'Escape'} KnownKeys
 * @param {KeyboardEvent['key'] & KnownKeys} key
 * @param {(event: KeyboardEvent) => void} eventHandler
 */

type KnownKeys = "Escape";

export default function useKeyup(
  key: KeyboardEvent["key"] & KnownKeys,
  eventHandler: (event: KeyboardEvent) => void
) {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key === key) {
        eventHandler(event);
      }
    }

    document.addEventListener("keyup", handler);

    return () => {
      document.removeEventListener("keyup", handler);
    };
  });
}
