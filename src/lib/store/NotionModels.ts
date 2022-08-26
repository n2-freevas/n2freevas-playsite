import { writable } from 'svelte/store'

export type NotionPage = {
    page_id: string
    page_title: string
    tags: NotionTag[]
    thumbnail: string
}

export type NotionTag = {
    tag_name: string
    tag_color:
        | 'default'
        | 'gray'
        | 'brown'
        | 'orange'
        | 'yellow'
        | 'green'
        | 'blue'
        | 'purple'
        | 'pink'
        | 'red'
}

export type NotionBlockText = {
    block_type: 'heading_1' | 'heading_2' | 'heading_3' | 'paragraph'
    content: string
}

export const notion_pages = writable<NotionPage[]>([])

export const notion_page = writable<NotionPage>()
