import { writable, readable } from 'svelte/store'
import type { Mode, handCardModel, boardCardModel,
boardAreaInfoModel, handAreaInfoModel, deckAreaInfoModel, deckCardModel} from '$lib/model/app/TCGsimModel'

export const cardWidth = readable<number>(90)
export const cardHeight = readable<number>(110)

export const screenWidth = writable<number>(0)
export const screenHeight = writable<number>(0)

export const modeStore = writable<Mode>('dark')

export const movingStore = writable<boolean>(false)

export const exDeckListStore = writable<deckCardModel[]>([])
export const deckListStore = writable<deckCardModel[]>([])
export const handListStore = writable<handCardModel[]>([])
export const boardListStore = writable<boardCardModel[]>([])
export const unshuffleDeckListStore = writable<deckCardModel[]>([])
export const unshuffleExDeckListStore = writable<deckCardModel[]>([])
export const boardAreaInfoStore = writable<boardAreaInfoModel>({top:0,left:0,right:0,bottom:0})
export const handAreaInfoStore = writable<handAreaInfoModel>({top:0,left:0,right:0,bottom:0})
export const deckAreaInfoStore = writable<deckAreaInfoModel>({top:0,left:0,right:0,bottom:0})



