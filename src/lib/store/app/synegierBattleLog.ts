import type { BaseLog } from '$lib/model/app/SynegierLogModel'
import { writable } from 'svelte/store'

export const battleLogStore = writable<BaseLog[]>([])
