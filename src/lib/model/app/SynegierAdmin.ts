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

// Card

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

export type InArea = 'deck' | 'hand' | 'play' | 'trash'

export interface SynegierCardAndPosition extends SynegierCard {
    objectId: number
    x: number
    y: number
    z: number
    rotate: number
    flip: boolean
    scale: number
    inArea: InArea
}

export interface keywordDescription {
    keyword: string
    regExp: string
    description: string
    image?: string
}

export interface cardMoveEvent {
    objectId: number
    pre_x: number
    pre_y: number
    now_x: number
    now_y: number
    mouseEvent: MouseEvent
    inArea: InArea
}

// Soldier
export interface Status {
    HP: number
    ATK: number
    DEF: number
}

export interface SoldierLevelUpRule extends Status {
    level: number
}

export interface SoldierCard {
    name: string
    aka: string
    img: string
    synegierText: SynegierText[]
    initStatus: Status
    levelUpRule: SoldierLevelUpRule[]
    ability: string
}

export interface Coordinate {
    x: number
    y: number
}

export type TileType = 'normal' | 'safe' | 'red'

export interface Tile extends Coordinate {
    type?: TileType
}

export interface BattleField {
    name: string
    width: number
    height: number
    tiles: Tile[]
    initGateKeeperPosition: Coordinate
    respawnTile: Coordinate[]
}
