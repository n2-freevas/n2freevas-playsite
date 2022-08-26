export type elem = '火' | '水' | '木' | '光' | '闇' | '冥' | '天'
export type tribe = '神' | '英' | '魔' | '物' | '霊' | '龍' | '獣'
export type gimmick =
    | 'シールドブレイカー'
    | 'トゲガード'
    | 'チェンジガード'
    | '弱体ガード'
    | 'ウォールブレイカー'
    | 'ビリビリガード'
    | 'ヒールブレイカー'
    | 'コピーガード'

export const ElemEngDict = {
    火: 'fire',
    水: 'water',
    木: 'wood',
    光: 'light',
    闇: 'dark',
    冥: 'hell',
    天: 'heaven'
}
export const TribeEngDict = {
    神: 'god',
    魔: 'evil',
    英: 'hero',
    龍: 'dragon',
    獣: 'beast',
    霊: 'ghost',
    物: 'object'
}
export const GimmickEngDict = {
    シールドブレイカー: 'shield',
    トゲガード: 'needle',
    チェンジガード: 'change',
    弱体ガード: 'week',
    ウォールブレイカー: 'wall',
    ビリビリガード: 'biribiri',
    ヒールブレイカー: 'heal',
    コピーガード: 'copy'
}
export const AdventNumDict = {
    0: '-',
    1: '初・中級',
    2: '中・上級',
    3: '超級',
    4: '魔級',
    5: '破滅級'
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

export interface advent {
    id: number
    newer: number
    name: string
    figure: string
    level: number
    elem: string[]
    disable: boolean
}

export interface banmen {
    banmen: string
    gimmick: string
    wave: number
}

export interface answer {
    word: string
    necessary: string[]
}

export interface answerListModel {
    count: number
    results: answer[]
}

export interface banmenAnswer {
    banmen: banmen
    answer: answerListModel
    lengths: number[]
    active: boolean
}

export interface targetKana {
    kana: string
    count: number
}

export interface kotodamanUnitFilterConditionModel {
    offset: number
    limit: number
    word: string[]
    elem: elem[]
    tribe: tribe[]
    gimmick: gimmick[]
}

export interface AdventFilterConditionModel {
    offset: number
    limit: number
    elem: elem[]
}

export interface KotodamanKanaModel {
    id: number
    kanas: string[]
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
    deckid: number
    deckname: string
    list: kotodaman[]
}

export interface MojiLengthConfigModel {
    length: number
    active: boolean
}
