import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kakaron-user'

export function useLocalUser() {
  const [userName, setUserNameState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? ''
    } catch {
      return ''
    }
  })

  const setUserName = useCallback((name: string) => {
    setUserNameState(name)
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {
      // localStorage 접근 불가 시 무시
    }
  }, [])

  return { userName, setUserName }
}
