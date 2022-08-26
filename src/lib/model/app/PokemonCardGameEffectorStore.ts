export interface BaseEffector {
    id: number
    x: number
    y: number
}

export interface DamageKan extends BaseEffector {
    counter: number
}

export interface PoisonKan extends BaseEffector {
    damage: number
    active: boolean
}

export interface BurnKan extends BaseEffector {
    damage: number
    active: boolean
}

export interface UserKan extends BaseEffector {}
