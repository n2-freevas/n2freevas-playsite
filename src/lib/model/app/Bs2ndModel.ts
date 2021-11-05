export type elem = "火" | "水" |  "木" |  "光" |  "闇" |  "冥" |  "天"
export type tribe = "神" |  "英" |  "魔" |  "物" |  "霊" |  "龍" |  "獣"
export type gimmick =   "シールドブレイカー" | "トゲガード" | "チェンジガード" |
                        "弱体ガード" | "ウォールブレイカー" | "ビリビリガード" | 
                        "ヒールブレイカー" | "コピーガード"


export const ElemEngDict = {
    "火": "fire","水": "water","木": "wood","光": "light","闇": "dark",
    "冥": "hell","天": "heaven"
}
export const TribeEngDict = {
    "神": "god","魔":"evil","英":"hero","龍":"dragon",
    "獣":"beast", "霊":"ghost", "物":"object"
}
export const GimmickEngDict = {
    "シールドブレイカー":"shield","トゲガード":"needle","チェンジガード":"change","弱体ガード":"week",
    "ウォールブレイカー":"wall","ビリビリガード":"biribiri","ヒールブレイカー":"heal","コピーガード":"copy"
}
export interface kotodaman {
    id: number
    name: string
    figure: string
    word: string[]
    elem: elem[]
    tribe: tribe[]
    gimmick: gimmick[]
    disable: boolean
    indeck: boolean
}

export interface kotodamanUnitFilterConditionModel {
    offset: number
    limit: number
    word: string[]
    elem: elem[]
    tribe: tribe[]
    gimmick: gimmick[]
}

export interface KotodamanKanaModel {
    id: number,
    kanas: string[],
    active: boolean
}

export interface KotodamanElemModel {
    id: number
    elem: elem
    active: boolean
}

export interface KotodamanTribeModel {
    id: number
    tribe: tribe
    active: boolean
}

export interface KotodamanGimmickModel {
    id: number
    gimmick: gimmick 
    active: boolean
}

export interface KotodamanDeckModel {
    deckid: number,
    deckname: string,
    list: kotodaman[]
}
