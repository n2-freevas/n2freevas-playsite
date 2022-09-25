import { writable } from 'svelte/store'
import type { DamageKan, PoisonKan, BurnKan, BaseEffector } from '$lib/model/app/PokemonCardGameEffectorStore'

export const onFieldDamageKansStore = writable<Array<DamageKan>>([])
