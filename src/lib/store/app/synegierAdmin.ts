import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
import { writable } from 'svelte/store'

export const synegierAdminAccessToken = writable<string>("")

export const cardDetail = writable<SynegierCard>(undefined)

