import Api from '../api'

import cardData from '$lib/database/synegierAdmin/cardData.json'
import soldierData from '$lib/database/synegierAdmin/soldierData.json'
import battleFieldData from '$lib/database/synegierAdmin/battleFieldData.json'
import type { SoldierCard, SynegierCard, BattleField } from '$lib/model/app/SynegierAdmin'

const synegierAdminUrl = '/synegier-admin'
const synegierAdminUrlAuth = synegierAdminUrl + '/auth'
const synegierAdminCardDatusUrl = synegierAdminUrl + '/carddatus'

export const healthCheck = async (): Promise<any> => {
    return true
    //await Api.get(synegierAdminUrl)
}

export const tryPassingAuth = async (password: string): Promise<any> => {
    return true
    // await Api.get(synegierAdminUrlAuth, null, password)
}

export const getCardDatus = async (password: string): Promise<SynegierCard[]> => {
    //@ts-ignore
    return cardData
    //await Api.get(synegierAdminCardDatusUrl, null, password)
}

export const getSoldierDatus = async (password: string): Promise<SoldierCard[]> => {
    //@ts-ignore
    return soldierData
}

export const getBattleFieldDatus = async (password: string): Promise<BattleField[]> => {
    //@ts-ignore
    return battleFieldData
}
