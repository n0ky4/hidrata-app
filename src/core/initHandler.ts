import { LSKEY_CONFIG } from '../stores/config.store'
import { LSKEY_CONTAINERS, useContainers } from '../stores/containers.store'
import { LSKEY_DATA, useData } from '../stores/data.store'

export function useInitHandler(setFirstUse: (value: boolean) => void) {
    const initContainers = useContainers((state) => state.init)
    const initData = useData((state) => state.init)

    function check() {
        if (!localStorage.getItem(LSKEY_CONFIG)) setFirstUse(true)
        if (!localStorage.get(LSKEY_CONTAINERS)) initContainers()
        if (!localStorage.get(LSKEY_DATA)) initData()
    }

    return {
        check,
    }
}
