import { writable } from 'svelte/store'
import type { MainMenu } from '$lib/model/Menu'


/* Initialize */
export const mainmenus = writable<MainMenu[]>([
    {
        name: 'profile',
        path: '/introduce',
        img: '/img/profile_icon.svg',
        active: true,
        explain: 'Taro Nonoyamaの<br>プロフィールを表示します。',
        submenu:[]
    },
    {
        name: 'blog',
        path: '/blog/list',
        img: '/img/blog_icon.svg',
        active: false,
        explain: 'ブログを表示します<br> (Powered by Notion API)',
        submenu:[]
    },
    {
        name: 'portfolio',
        path: '/portfolio',
        img: '/img/portfolio_icon.svg',
        active: false,
        explain: 'ポートフォリオを表示し、<br>クリエイティブのヒントを提示します。',
        submenu:[]
    },
    {
        name: 'app',
        path: '/app',
        img: '/img/app_icon.svg',
        active: true,
        explain: '制作したWebアプリの<br>一覧を表示します。',
        submenu:[
            {
                name:'ばくぜつさあち', path:'/app/bakuzetsu-searcher-2nd/home',
                img:'', explain:'',
                root:'app > ばくぜつさあち > ', submenu:[]
            }
        ]
    },
    {
        name: 'contact',
        path: '/contact',
        img: '/img/contacts_icon.svg',
        active: false,
        explain: '連絡先・SNSアカウントを<br>表示します。',
        submenu:[]
    },
    {
        name: 'bonus',
        path: '/show',
        img: '/img/app_icon.svg',
        active: true,
        explain: 'オマケ',
        submenu:[]
    },

])
