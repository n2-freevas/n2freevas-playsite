import Api from './api'
import type { NotionPage, NotionTag } from '$lib/store/NotionModels'

const api_key = 'secret_noefNNFVWANKd58NxfkoNV717LhK5D1ueYuQImgWFK0'
const notionBaseUrl = 'https://api.notion.com/v1/'
const notionDatabaseUrl = notionBaseUrl + 'databases/'
const notionPageUrl = notionBaseUrl + 'blocks/'

const api_header = {
    Authorization: 'Bearer ' + api_key,
    'Notion-Version': '2021-07-27'
}

function thinOutNotionPagesColumn(pagesRes) {
    let result = []
    pagesRes.results.forEach((page) => {
        let _tags = []
        page.properties.Tags.multi_select.forEach((tag) => {
            let tagInfo: NotionTag = {
                tag_name: tag.name,
                tag_color: tag.color
            }
            _tags.push(tagInfo)
        })
        let _page: NotionPage = {
            page_id: page.id,
            page_title: page.properties.Contents.title[0].plain_text.replace('\n', '<br>'),
            tags: _tags,
            thumbnail: page.properties.Thumbnail.url
        }
        result.push(_page)
    })
    return result
}

export const getPage = async (page_id?: string) => {
    try {
        let res = await Api.get(
            notionPageUrl + page_id + '/children?page_size=100',
            undefined,
            api_header
        )
        return res
    } catch (error) {
        throw error
    }
}

export const getPages = async (database_id, request?) => {
    let default_request
    if (request) {
        default_request = request
    } else {
        default_request = {
            filter: {
                property: 'Open_flg',
                checkbox: { equals: true }
            },
            sorts: [
                {
                    timestamp: 'last_edited_time',
                    direction: 'ascending'
                }
            ]
        }
    }
    try {
        let res = await Api.post(
            notionDatabaseUrl + database_id + '/query',
            default_request,
            api_header
        )
        return thinOutNotionPagesColumn(res)
    } catch (error) {
        throw error
    }
}
