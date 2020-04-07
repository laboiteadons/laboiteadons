import { useEffect, useRef } from 'react'

export const useInterval
  : (callback: () => void, delay: number|null) => void
  = (callback, delay) => {
  const savedCallback = useRef<(...args: any[]) => void>(() => {})
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const handler = (...args: any[]) => savedCallback.current(...args)
    if (delay !== null) {
      handler()
      const id = setInterval(handler, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}