import Api from '../api'

const dm_takaratomy_url = 'https://dm.takaratomy.co.jp/card/'

export const getCards = async (keyword: string, pagenum: number) => {
    const params = new URLSearchParams()
    params.append('keyword', keyword) // 渡したいデータ分だけappendする
    params.append('pagenum', pagenum.toString())
    try {
        let data = await Api.n_post(dm_takaratomy_url, params)
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}
