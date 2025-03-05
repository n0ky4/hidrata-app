import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FirstUseScreen } from '../components/FirstUseScreen'
import { useInitHandler } from '../core/initHandler'

export default function SetupPage() {
    const { setupData } = useInitHandler()
    const [mounted, setMounted] = useState(false)

    const navigate = useNavigate()
    const onSetupFinish = () => navigate('/')

    useEffect(() => {
        const isFirstUse = setupData()
        if (!isFirstUse) {
            navigate('/')
            return
        }

        setMounted(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!mounted) return null
    return <FirstUseScreen show={true} onClose={onSetupFinish} />
}
