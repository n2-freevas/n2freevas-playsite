import { writable } from 'svelte/store'
import type { kotodaman } from '$lib/model/app/Bs2ndModel'

/* Initialize */
export const mainmenus = writable<boolean>(false)

export const deckStore = writable<kotodaman[]>([
    undefined,undefined,undefined,undefined,
    undefined,undefined,undefined,undefined,
    undefined,undefined,undefined,undefined]
)

export const unitListStore = writable<kotodaman[]>([])
