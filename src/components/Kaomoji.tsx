export const KAOMOJIS = {
    thumbsUp: 'ദ്ദി ( ᵔ ᗜ ᵔ )',
    happy: '(˵ •̀ ᴗ - ˵ ) ✧',
} as const
type KaomojiKey = keyof typeof KAOMOJIS

export function Kaomoji({ k }: { k: KaomojiKey }) {
    const kaomoji = KAOMOJIS[k]
    return <b className='text-neutral-100 font-normal'>{kaomoji}</b>
}
