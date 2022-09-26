import type { BattleField, Coordinate, Movement, SoldierCardInPlay, SynegierCard, SynegierCardInPlay } from '$lib/model/app/SynegierAdmin'
import { writable } from 'svelte/store'

export const synegierAdminAccessToken = writable<string>('')

export const cardDetailLeft = writable<SynegierCard>(undefined)
export const cardDetailRight = writable<SynegierCard>(undefined)

export const deckStore = writable<SynegierCard[]>([])

export const cardDatus = writable<SynegierCard[]>([])

// 戦場データ
export const battleField = writable<BattleField>()

export const soldiersInPlay = writable<{ [soldierId: number]: SoldierCardInPlay }>({})

export const processingMovement = writable<Movement[]>(undefined)

export const processingEffect = writable<object>({})
