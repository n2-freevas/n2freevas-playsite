export type elem = "火" | "水" |  "木" |  "光" |  "闇" |  "冥" |  "天"
export type tribe = "神" |  "英" |  "魔" |  "物" |  "霊" |  "龍" |  "獣"
export type gimmick =   "シールドブレイカー" | "トゲガード" | "チェンジガード" |
                        "弱体ガード" | "ウォールブレイカー" | "ビリビリガード" | 
                        "ヒールブレイカー" | "コピーガード"
export interface kotodaman {
    id: number
    name: string
    figure: string
    word: string[]
    elem: elem[]
    tribe: tribe[]
    gimmick: gimmick[]
}
