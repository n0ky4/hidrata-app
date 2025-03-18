import { MapPin, Search } from 'lucide-react'
import { LocationState } from '../../core/location'
import { useLocale } from '../../i18n/context/contextHook'
import { Button } from '../Button'
import { Input } from '../Input'
import { Label } from '../Label'

interface LocationFormProps {
    locState: LocationState
    handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    fetchCustomCoords: () => void
}

export function LocationForm({
    locState,
    handleLocationChange,
    fetchCustomCoords,
}: LocationFormProps) {
    const { t } = useLocale()
    return (
        <div>
            <Label>{t('generic.location')}</Label>
            <form
                className='flex items-center gap-2'
                onSubmit={(e) => {
                    e.preventDefault()
                    fetchCustomCoords()
                }}
            >
                <Input
                    placeholder={t('generic.location') as string}
                    value={locState.inputValue}
                    onChange={handleLocationChange}
                    className='w-full'
                />
                <Button
                    theme='ghost'
                    className='p-0 min-w-[42px] min-h-[42px] flex items-center justify-center'
                    type='submit'
                >
                    <Search size={22} strokeWidth={3} />
                </Button>
            </form>
            {locState.coords && locState.placeName && (
                <div className='text-neutral-400 text-xs mt-2 flex items-center gap-1'>
                    <div>
                        <MapPin size={16} />
                    </div>
                    <span className='truncate' title={locState.placeName}>
                        {locState.placeName} ({locState.coords.latitude},{' '}
                        {locState.coords.longitude})
                    </span>
                </div>
            )}
        </div>
    )
}
