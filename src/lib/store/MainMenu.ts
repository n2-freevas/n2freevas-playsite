import { writable } from 'svelte/store'

/* Models */

export type MainMenu = {
  name: string, //親メニュー名称
  path: string,
  img: string,
  explain: string
}


/* Initialize */
export const mainmenus = writable<MainMenu[]>([
    {
        name: 'profile',
        path: '/introduce',
        img: '/img/profile_icon.svg',
        explain: 'Taro Nonoyamaの<br>プロフィールを表示します。'
    },
    {
        name: 'blog',
        path: '/blog/list',
        img: '/img/blog_icon.svg',
        explain: 'ブログを表示します<br> (Powered by Notion API)'
    },
    {
        name: 'portfolio',
        path: '/portfolio',
        img: '/img/portfolio_icon.svg',
        explain: 'ポートフォリオを表示し、<br>クリエイティブのヒントを提示します。'
    },
    {
        name: 'app',
        path: '/app',
        img: '/img/app_icon.svg',
        explain: '制作したWebアプリの<br>一覧を表示します。'
    },
    {
        name: 'contact',
        path: '/contact',
        img: '/static/img/contact_icon.svg',
        explain: '連絡先・SNSアカウントを<br>表示します。'
    },
    {
        name: 'bonus',
        path: '/show',
        img: '/img/app_icon.svg',
        explain: 'オマケ'
    },

])
