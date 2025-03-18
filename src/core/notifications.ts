import { useEffect, useRef } from 'react'
import { useLocale } from '../i18n/context/contextHook'
import { useConfig } from '../stores/config.store'
import { log } from '../util/logger'
import Worker from './Worker?worker'

const sounds = {
    default: '/sounds/default.mp3',
} as const

const useNotifications = () => {
    const { t } = useLocale()
    const workerRef = useRef<Worker | null>(null)
    const notificationsEnabled = useConfig(
        (state) => state.config?.notifications.enabled
    ) as boolean

    const elapsed = useRef(0)
    const intervalMinutes = useConfig((state) => state.config?.notifications.interval)
    const intervalSeconds = intervalMinutes ? intervalMinutes * 60 : -1

    const intervalSecondsRef = useRef(intervalSeconds)

    const getWorker = () => {
        if (workerRef.current) return workerRef.current

        const worker = new Worker()
        workerRef.current = worker

        return worker
    }

    const updateTitle = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60

        const gapHours = String(hours).padStart(2, '0')
        const gapMinutes = String(minutes).padStart(2, '0')
        const gapSeconds = String(remainingSeconds).padStart(2, '0')

        const time =
            hours > 0 ? `${gapHours}:${gapMinutes}:${gapSeconds}` : `${gapMinutes}:${gapSeconds}`

        document.title = `(${time}) ${t('appName')}`
    }

    const hasNotificationPermission = () => {
        if (Notification.permission === 'granted') return true

        if (Notification.permission === 'denied') {
            log.error('notifications denied')
            return false
        }

        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                log.info('notifications granted')
            } else {
                log.error('notifications denied')
            }
        })

        return false
    }

    const onWorkerMessage = (e: MessageEvent) => {
        const type = e.data?.type
        if (!type) return

        if (type === 'tick') {
            const intSec = intervalSecondsRef.current
            if (intSec === -1) return

            elapsed.current += 1

            const remaiding = intSec - elapsed.current

            updateTitle(remaiding)

            if (elapsed.current >= intSec) {
                elapsed.current = 0

                const title = t('notification.title') as string
                const message = t('notification.message') as string

                if (!hasNotificationPermission()) return

                const notif = new Notification(title, {
                    body: message,
                })

                notif.onclick = () => {
                    window.focus()
                    notif.close()
                }
            }
        }
    }

    useEffect(() => {
        intervalSecondsRef.current = intervalSeconds
    }, [intervalSeconds])

    useEffect(() => {
        const worker = getWorker()

        if (!notificationsEnabled) {
            worker.postMessage({ type: 'stop' })
            elapsed.current = 0
            document.title = t('appName') as string
            return
        }

        worker.postMessage({ type: 'start' })
        worker.onmessage = onWorkerMessage

        return () => {
            worker.terminate()
            workerRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationsEnabled])
}

export const notifications = {
    useNotifications,
    sounds,
}
