import { useEffect, useState } from 'react'

declare global {
  interface Window {
    FB?: {
      init: (params: { appId: string; version: string; cookie?: boolean; xfbml?: boolean }) => void
      login: (
        callback: (response: { authResponse?: { accessToken: string } | null }) => void,
        options?: { scope?: string },
      ) => void
    }
    fbAsyncInit?: () => void
  }
}

const SDK_SRC = 'https://connect.facebook.net/en_US/sdk.js'

/**
 * Loads the Facebook JS SDK once and initializes it with the given App ID.
 * Requires VITE_FACEBOOK_APP_ID to be set; returns false (not an error) if it isn't,
 * so callers can just hide the Facebook button rather than crash.
 */
export const useFacebookSdk = () => {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!appId) return

    if (window.FB) {
      setIsReady(true)
      return
    }

    window.fbAsyncInit = () => {
      window.FB?.init({ appId, version: 'v21.0', cookie: true, xfbml: false })
      setIsReady(true)
    }

    if (!document.querySelector(`script[src="${SDK_SRC}"]`)) {
      const script = document.createElement('script')
      script.src = SDK_SRC
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [appId])

  const login = (): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK is not loaded yet.'))
        return
      }
      window.FB.login(
        (response) => {
          if (response.authResponse?.accessToken) {
            resolve(response.authResponse.accessToken)
          } else {
            reject(new Error('Facebook login was cancelled.'))
          }
        },
        { scope: 'email' },
      )
    })

  return { isReady: isReady && !!appId, login }
}
