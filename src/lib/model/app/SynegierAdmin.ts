export type SynegierTextType = 's' | 'v' // subject or verbus

export type SynegierTextColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple'

export type CardCost = 0 | 1 | 2 | 3

export type CardRarity = 'C' | 'R' | 'SR' | 'LE'

export interface SynegierText {
    color: SynegierTextColor
    type: SynegierTextType
    text: string
}

export interface Movement {
    v: number
    h: number
}

export const MovementMap: Movement[] = [
    { v: -3, h: 3 },
    { v: -2, h: 3 },
    { v: -1, h: 3 },
    { v: 0, h: 3 },
    { v: 1, h: 3 },
    { v: 2, h: 3 },
    { v: 3, h: 3 },
    { v: -3, h: 2 },
    { v: -2, h: 2 },
    { v: -1, h: 2 },
    { v: 0, h: 2 },
    { v: 1, h: 2 },
    { v: 2, h: 2 },
    { v: 3, h: 2 },
    { v: -3, h: 1 },
    { v: -2, h: 1 },
    { v: -1, h: 1 },
    { v: 0, h: 1 },
    { v: 1, h: 1 },
    { v: 2, h: 1 },
    { v: 3, h: 1 },
    { v: -3, h: 0 },
    { v: -2, h: 0 },
    { v: -1, h: 0 },
    { v: 0, h: 0 },
    { v: 1, h: 0 },
    { v: 2, h: 0 },
    { v: 3, h: 0 },
    { v: -3, h: -1 },
    { v: -2, h: -1 },
    { v: -1, h: -1 },
    { v: 0, h: -1 },
    { v: 1, h: -1 },
    { v: 2, h: -1 },
    { v: 3, h: -1 },
    { v: -3, h: -2 },
    { v: -2, h: -2 },
    { v: -1, h: -2 },
    { v: 0, h: -2 },
    { v: 1, h: -2 },
    { v: 2, h: -2 },
    { v: 3, h: -2 },
    { v: -3, h: -3 },
    { v: -2, h: -3 },
    { v: -1, h: -3 },
    { v: 0, h: -3 },
    { v: 1, h: -3 },
    { v: 2, h: -3 },
    { v: 3, h: -3 }
]

export interface SynegierCard {
    name: string
    img: string
    cost: CardCost
    synegierText: SynegierText[]
    text: string
    movement: Movement[]
    redTiles: Movement[]
    rarity: CardRarity
}

export interface keywordDescription {
    keyword: string
    regExp: string
    description: string
    image?: string
}
