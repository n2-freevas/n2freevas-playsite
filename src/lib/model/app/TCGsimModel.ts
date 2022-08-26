export type Mode = 'pokemon' | 'other'

export type OnAreaModel = 'board' | 'hand' | 'deck' | 'trash'
export interface PositionModel {
    top: number
    left: number
    right: number
    bottom: number
}

export interface boardAreaInfoModel extends PositionModel {}

export interface handAreaInfoModel extends PositionModel {}

export interface deckAreaInfoModel extends PositionModel {}

// カードの共通インタフェース
export interface cardModel {
    id: number //固有id
    url: string //表面画像
    burl: string //裏面画像
}

// board上のカードを表すモデル
export interface boardCardModel extends cardModel {
    x: number
    y: number
    z: number
    rotate: number
    flip: boolean
}

// board上のカードをグルーピングするのに使うモデル
export interface boardGroupCardsModel {
    x: number
    y: number
    cards: boardCardModel[]
}

// 手札上のカードを表すモデル
export interface handCardModel extends cardModel {
    x: number
    y: number
    z: number
    rotate: number
    flip: boolean
}

// デッキ上のカードを表すモデル
export interface deckCardModel extends cardModel {
    x: number
    y: number
    z: number
    rotate: number
    flip: boolean
}

// 墓地上のカードを表すモデル
export interface tgraveyardCardModel extends cardModel {}
