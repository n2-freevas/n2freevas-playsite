import Api from '../api'
import type {kotodaman, advent, banmen, targetKana, answerListModel} from '$lib/model/app/Bs2ndModel'

const bs2ndUrl = "/bakuzetsu-searcher-2nd"
const bs2ndGetUnitUrl = bs2ndUrl + "/getunit"
const bs2ndGetUnitsUrl = bs2ndUrl + "/getunits"
const bs2ndGetAdventsUrl = bs2ndUrl + "/getadvents"
const bs2ndGetAdventBanmenUrl = bs2ndUrl + "/getbanmen"
const bs2ndGetSearchAnswerUrl = bs2ndUrl + "/search"

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


export const getAdvents = async (
  offset?: number, limit?: number
  ):Promise<advent[]>=> {
  try{
    // @ts-ignore
    let data: object[] = await Api.get(`${bs2ndGetAdventsUrl}?offset=${offset}&limit=${limit}`)
    // @ts-ignore
    return data.map(advent =>{return {...advent,disable:false}})
  }
  catch (error) {
    throw error
  }
}

export const getAdventsUsingFilter = async (
  offset?: number, limit?: number,elem?: string[],
  ):Promise<advent[]>=> {
  try{
    // @ts-ignore
    let data: object[] = await Api.post(
          `${bs2ndGetAdventsUrl}?offset=${offset}&limit=${limit}`,
          {elem}
      )
    // @ts-ignore
    return data.map(advent =>{return {...advent,disable:false}})
  }
  catch (error) {
    throw error
  }
}

export const getAdventBanmen = async (
  advent_id: number,
  ):Promise<banmen[]>=> {
  try{
    // @ts-ignore
    let data: object[] = await Api.get(
          `${bs2ndGetAdventBanmenUrl}?advent_id=${advent_id}`)
    // @ts-ignore
    return data
  }
  catch (error) {
    throw error
  }
}

export const getSearchAnswer = async(
  banmen: string,
  target_kana: targetKana[],
  target_length: number[]
):Promise<answerListModel> =>{
  try{
    // @ts-ignore
    console.log(banmen, target_kana, target_length)
    let data = await Api.post(
      `${bs2ndGetSearchAnswerUrl}`,
      {banmen, target_kana, target_word_length: target_length}
    )
    // @ts-ignore
    return data
  }
  catch (error) {
    throw error
  }
}
