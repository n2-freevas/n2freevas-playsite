import Api from '../api'
import type {kotodaman} from '$lib/model/app/Bs2ndModel'

const bs2ndUrl = "/bakuzetsu-searcher-2nd"
const bs2ndGetUnitUrl = bs2ndUrl + "/getunit"
const bs2ndGetUnitsUrl = bs2ndUrl + "/getunits"


export const DEFAULT_LIMIT = 48

export const getUnits = async (offset?: number, limit?: number) => {
    try{
      let res = await Api.get(`${bs2ndGetUnitsUrl}?offset=${offset}&limit=${limit}`)
      return res.data
    }
    catch (error) {
      throw error
    }
}

export const getUnitsUsingFilter = async (
    offset?: number, limit?: number,
    word?: string[], elem?: string[],
    tribe?: string[], gimmick?: string[]):Promise<kotodaman[]>=> {
    try{
      let data = await Api.post(
            `${bs2ndGetUnitsUrl}?offset=${offset}&limit=${limit}`,
            {word, elem, tribe, gimmick}
        )
      console.log(typeof data)
      return data
    }
    catch (error) {
      throw error
    }
}
