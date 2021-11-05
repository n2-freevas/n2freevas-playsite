import Api from '../api'
import type {kotodaman} from '$lib/model/app/Bs2ndModel'

const bs2ndUrl = "/bakuzetsu-searcher-2nd"
const bs2ndGetUnitUrl = bs2ndUrl + "/getunit"
const bs2ndGetUnitsUrl = bs2ndUrl + "/getunits"

export const getUnits = async (offset?: number, limit?: number):Promise<kotodaman[]> => {
    try{
      // @ts-ignore
      let data: object[] = await Api.get(`${bs2ndGetUnitsUrl}?offset=${offset}&limit=${limit}`)
      // @ts-ignore
      return data.map(unit =>{
        return {
          ...unit, disable:false, indeck: false
        }
      })
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
      // @ts-ignore
      let data: object[] = await Api.post(
            `${bs2ndGetUnitsUrl}?offset=${offset}&limit=${limit}`,
            {word, elem, tribe, gimmick}
        )
      // @ts-ignore
      return data.map(unit =>{return {...unit,disable:false,indeck: false}})
    }
    catch (error) {
      throw error
    }
}
