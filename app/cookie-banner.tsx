'use client'

import { useEffect } from 'react'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

export default function CookieBanner() {
  useEffect(() => {
    async function init() {
      const cookieConsent = await import('vanilla-cookieconsent')

      await cookieConsent.run({
        categories: {
          analytics: {
            autoClear: {
              cookies: [{ name: /^_ga/ }, { name: '_gid' }]
            }
          },
          necessary: {
            enabled: true,
            readOnly: true
          }
        },
        guiOptions: {
          consentModal: {
            layout: 'box inline',
            position: 'bottom right'
          }
        },
        language: {
          default: 'en',
          translations: {
            en: {
              consentModal: {
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject all',
                description:
                  'We use cookies to ensure the site works properly and to understand how you interact with it.',
                title: 'We use cookies'
              },
              preferencesModal: {
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject all',
                savePreferencesBtn: 'Save preferences',
                sections: [
                  {
                    description:
                      'We use cookies for basic site functionality and analytics.',
                    title: 'Cookie usage'
                  },
                  {
                    linkedCategory: 'necessary',
                    title: 'Necessary cookies'
                  },
                  {
                    linkedCategory: 'analytics',
                    title: 'Analytics cookies'
                  }
                ],
                title: 'Cookie preferences'
              }
            }
          }
        }
      })
    }

    init()
  }, [])

  return null
}
