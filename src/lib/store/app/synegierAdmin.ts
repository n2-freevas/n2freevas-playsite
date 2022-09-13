import type { SynegierCard, SynegierCardAndPosition } from '$lib/model/app/SynegierAdmin'
import { writable } from 'svelte/store'

export const synegierAdminAccessToken = writable<string>('')

export const cardDetailLeft = writable<SynegierCard>(undefined)
export const cardDetailRight = writable<SynegierCard>(undefined)

export const deckStore = writable<SynegierCard[]>([])

export const cardInDuelStore = writable<SynegierCardAndPosition[]>([])

export const cardDatus = writable<SynegierCard[]>([])
