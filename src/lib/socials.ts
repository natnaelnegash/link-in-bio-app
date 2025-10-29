export const supportedSocials = {
    youtube: { name: 'YouTube', domain: 'youtube.com' },
    spotify: { name: 'Spotify', domain: 'spotify.com' },
    tiktok: { name: 'TikTok', domain: 'tiktok.com' },
    instagram: { name: 'Instagram', domain: 'instagram.com' },
    github: { name: 'GitHub', domain: 'github.com' },
    twitter: { name: 'Twitter / X', domain: 'twitter.com' },
    telegram: { name: 'Telegram', domain: 't.me' },
    whatsapp: { name: 'Whatsapp', domain: 'whatsapp.com' },
} as const

export type SocialPlatform = keyof typeof supportedSocials

export function detectSocialPlatform(url: string): SocialPlatform | null {
    try {
        const hostname = new URL(url).hostname
        for(const key in supportedSocials) {
            const platform = key as SocialPlatform

            if (hostname.includes(supportedSocials[platform].domain)) {
                return platform
            }
        }
    } catch (error) {
        return null
    }
    return null
}

