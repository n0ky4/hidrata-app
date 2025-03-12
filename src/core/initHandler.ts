import { useContainers } from '../stores/containers.store'
import { useData } from '../stores/data.store'
import { LSKEY } from '../util/localStorageKeys'
import { log } from '../util/logger'

export function useInitHandler() {
    const initContainers = useContainers((state) => state.init)
    const initData = useData((state) => state.init)

    function setupData() {
        log.info('checking first use')
        let firstUse = false

        if (!localStorage.getItem(LSKEY.CONFIG)) firstUse = true
        if (!localStorage.getItem(LSKEY.CONTAINERS)) initContainers()
        if (!localStorage.getItem(LSKEY.DATA)) initData()

        return firstUse
    }

    return {
        setupData,
    }
}
