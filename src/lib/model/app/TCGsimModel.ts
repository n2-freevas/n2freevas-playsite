export type Mode = 'light' | 'dark'

export type OnAreaModel = 'board' | 'hand' | 'deck' | 'trash'
export interface PositionModel {
    top:number
    left:number
    right: number
    bottom: number
}

export interface boardAreaInfoModel extends PositionModel{
}

export interface handAreaInfoModel extends PositionModel{
}

export interface deckAreaInfoModel extends PositionModel{
}

export interface cardModel {
    id:number
    url: string
    burl: string
}

export interface boardCardModel extends cardModel{
    x: number
    y: number
    rotate: number
    flip: boolean
}

export interface handCardModel extends cardModel {
    x: number
    y: number
    rotate: number
    flip: boolean
}
export interface deckCardModel extends cardModel{
    x: number
    y: number
    rotate: number
    flip: boolean
}
export interface trashCardModel extends cardModel {
    
}
