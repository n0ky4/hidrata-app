export const KAOMOJIS = {
    thumbsUp: 'ദ്ദി ( ᵔ ᗜ ᵔ )',
    happy: '(˵ •̀ ᴗ - ˵ ) ✧',
} as const
type KaomojiKey = keyof typeof KAOMOJIS

export function Kaomoji({ k }: { k: KaomojiKey }) {
    const kaomoji = KAOMOJIS[k]
    return <b className='text-white font-normal'>{kaomoji}</b>
}
