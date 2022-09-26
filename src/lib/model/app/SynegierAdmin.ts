// Common

export type SynegierTextType = 's' | 'v' // subject or verbus

export type SynegierTextColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple'

export interface SynegierText {
    color: SynegierTextColor
    type: SynegierTextType
    text: string
}

export interface Coordinate {
    x: number
    y: number
}

export type PhaseBorder = 'turnstart' | 'previousbattle' | 'afterbattle' | 'turnend'

// Card
export type CardRarity = 'C' | 'R' | 'SR' | 'LE'

export type CardCost = 0 | 1 | 2 | 3

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

export type InArea = 'deck' | 'hand' | 'play' | 'trash'

export interface SynegierCardInPlay extends SynegierCard {
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
    preX: number
    preY: number
    nowX: number
    nowY: number
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

export interface SoldierCardInPlay extends SoldierCard {
    size: number
    coordinate: Coordinate
}

// BattleField

export type TileType = 'normal' | 'safe' | 'red'

export interface Tile extends Coordinate {
    type?: TileType
    active?: boolean
    emphasis?: boolean
}

export interface BattleField {
    name: string
    width: number
    height: number
    tiles: { [tileId: string]: Tile }
    initGateKeeperPosition: Coordinate
    respawnTile: Coordinate[]
}
