import Api from '../api'

import type { SynegierCard } from '$lib/model/app/SynegierAdmin'

const synegierAdminUrl = '/synegier-admin'
const synegierAdminCardDatusUrl = synegierAdminUrl + '/carddatus'

export const healthCheck = async (): Promise<any> => {
    return await Api.get(synegierAdminUrl)
}

export const getCardDatus = async (password): Promise<SynegierCard[]> => {
    //@ts-ignore
    return await Api.get(synegierAdminCardDatusUrl, { password: password })
}
