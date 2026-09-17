import { useEffect, useRef } from 'react'

/** Runs `callback` every `delay` ms; pass `null` to pause. Always calls the latest callback. */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = window.setInterval(() => savedCallback.current(), delay)
    return () => window.clearInterval(id)
  }, [delay])
}
