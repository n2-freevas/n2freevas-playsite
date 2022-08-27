import Api from '../api'

import cardData from '$lib/database/synegierAdmin/cardData.json'
import type { SynegierCard } from '$lib/model/app/SynegierAdmin'

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
