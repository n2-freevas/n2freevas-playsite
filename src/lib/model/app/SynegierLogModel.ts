export interface BaseLog {
    createdAt: Date
}

export interface CardPlayEvent extends BaseLog {
    playerId: number
    cardObjectId: number
}

export interface DrawEvent extends BaseLog {
    playerId: number
    cardObjectId: number[]
}

export interface CardGotoTrashEvent extends BaseLog {
    playerId: number
    cardObjectId: number[]
}

export interface TrashRefreshEvent extends BaseLog {
    playerId: number
    cardObjectId: number[]
}
