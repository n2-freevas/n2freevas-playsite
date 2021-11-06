import { writable } from 'svelte/store'
import type {
    kotodaman, kotodamanUnitFilterConditionModel,
    KotodamanKanaModel, KotodamanElemModel, KotodamanTribeModel, KotodamanGimmickModel,
    KotodamanDeckModel
} from '$lib/model/app/Bs2ndModel'

export const DEFAULT_LIMIT = 48
/* Initialize */
export const mainmenus = writable<boolean>(false)

export const deckStore = writable<Array<kotodaman>>(new Array(12))

export const filterConditionStore = writable<kotodamanUnitFilterConditionModel>({
    offset: 0,
    limit: DEFAULT_LIMIT,
    word:[],
    elem:[],
    tribe:[],
    gimmick:[]
})

export const kanaStore = writable<KotodamanKanaModel[]>([
    {id:1,kanas:["あ","ぁ"], active:false},{id:2,kanas:["い","ぃ"], active:false},{id:3,kanas:["う","ぅ"], active:false},{id:4,kanas:["え","ぇ"], active:false},{id:5,kanas:["お","ぉ"], active:false},
    {id:6,kanas:["か","が"], active:false},{id:7,kanas:["き","ぎ"], active:false},{id:8,kanas:["く","ぐ"], active:false},{id:9,kanas:["け","げ"], active:false},{id:10,kanas:["こ","ご"], active:false},
    {id:11,kanas:["さ","ざ"], active:false},{id:12,kanas:["し","じ"], active:false},{id:13,kanas:["す","ず"], active:false},{id:14,kanas:["せ","ぜ"], active:false},{id:15,kanas:["そ","ぞ"], active:false},
    {id:16,kanas:["た","だ"], active:false},{id:17,kanas:["ち","ぢ"], active:false},{id:18,kanas:["す","ず"], active:false},{id:19,kanas:["て","で"], active:false},{id:20,kanas:["と","ど"], active:false},
    {id:21,kanas:["な"], active:false},{id:22,kanas:["に"], active:false},{id:23,kanas:["ぬ"], active:false},{id:24,kanas:["ね"], active:false},{id:25,kanas:["の"], active:false},
    {id:26,kanas:["は","ば","ぱ"], active:false},{id:27,kanas:["ひ","び","ぴ"], active:false},{id:28,kanas:["ふ","ぶ","ぷ"], active:false},{id:29,kanas:["へ","べ","ぺ"], active:false},{id:30,kanas:["ほ","ぼ","ぽ"], active:false},
    {id:31,kanas:["ま"], active:false},{id:32,kanas:["み"], active:false},{id:33,kanas:["む"], active:false},{id:34,kanas:["め"], active:false},{id:35,kanas:["も"], active:false},
    {id:36,kanas:["や","ゃ"], active:false},{id:37,kanas:[""], active:false},{id:38,kanas:["ゆ","ゅ"], active:false},{id:39,kanas:[""], active:false},{id:40,kanas:["よ","ょ"], active:false},
    {id:41,kanas:["ら"], active:false},{id:42,kanas:["り"], active:false},{id:43,kanas:["る"], active:false},{id:44,kanas:["れ"], active:false},{id:45,kanas:["ろ"], active:false},
    {id:46,kanas:["わ"], active:false},{id:47,kanas:[""], active:false},{id:48,kanas:["を"], active:false},{id:49,kanas:[""], active:false},{id:50,kanas:["ん"], active:false},
])

export const elemStore = writable<KotodamanElemModel[]>([
    {id:1,elem:"火",active:false},{id:2,elem:"水",active:false},{id:3,elem:"木",active:false},{id:4,elem:"光",active:false},
    {id:5,elem:"闇",active:false},{id:6,elem:"冥",active:false},{id:7,elem:"天",active:false}
])

export const tribeStore = writable<KotodamanTribeModel[]>([
    {id:1,tribe:"神",active:false},{id:2,tribe:"魔",active:false},{id:3,tribe:"英",active:false},{id:4,tribe:"龍",active:false},
    {id:5,tribe:"獣",active:false},{id:6,tribe:"霊",active:false},{id:7,tribe:"物",active:false}
])

export const gimmickStore = writable<KotodamanGimmickModel[]>([
    {id:1,gimmick:"シールドブレイカー",active:false},{id:2,gimmick:"トゲガード",active:false},{id:3,gimmick:"チェンジガード",active:false},{id:4,gimmick:"弱体ガード",active:false},
    {id:5,gimmick:"ウォールブレイカー",active:false},{id:6,gimmick:"ビリビリガード",active:false},{id:7,gimmick:"ヒールブレイカー",active:false},{id:8,gimmick:"コピーガード",active:false},
])

export const isDeckFullStore = writable<boolean>(false)

export const unitListStore = writable<kotodaman[]>([])

export const isSettingFilterCondition = writable<boolean>(false)

export const isBottomOfScroll = writable<boolean>(false)

export const isListLoading = writable<boolean>(false)

export const DECK_LIMIT = 5
//localStorage.removeItem('n2freevas-bs2nd-localstorage-decks')
/* デッキはローカルストレージに永続化するため、永続化ストレージからつど呼び出す。 */

let storedDecks = [
    {deckid:1,deckname:"",list:new Array(12)},{deckid:2,deckname:"",list:new Array(12)},
    {deckid:3,deckname:"",list:new Array(12)},{deckid:4,deckname:"",list:new Array(12)},
    {deckid:5,deckname:"",list:new Array(12)}
];

export function getDeck(){
    if (typeof localStorage !== 'undefined'){
        console.log('localStorage find')
        let st = localStorage.getItem('n2freevas-bs2nd-localstorage-decks')
        if(st){
            storedDecks = JSON.parse(st);
            
        }
        else{
            console.log('localStorage not fount')
        }
    }
    else{
        console.log('localstorage undef')
    }
}
getDeck()

export const decks = writable<Array<KotodamanDeckModel>>(storedDecks);

export function setDecks(list: Array<KotodamanDeckModel>){
    decks.subscribe(decks => {
        const json = JSON.stringify(list)
        localStorage.setItem('n2freevas-bs2nd-localstorage-decks', json)
    })
}
