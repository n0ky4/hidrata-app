import { useEffect, useState } from 'react'
import FirstUsePopup from './components/FirstUsePopup'
import { Storage } from './utils/storage'

function App() {
    const [storage, setStorage] = useState(new Storage())
    const [firstUse, setFirstUse] = useState(false)

    useEffect(() => {
        ;(async () => {
            const data = await storage.getData()
            if (!data) setFirstUse(true)
        })()
    }, [])

    return <div className='App'>{firstUse && <FirstUsePopup />}</div>
}

export default App
