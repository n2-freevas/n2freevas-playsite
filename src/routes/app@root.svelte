<script lang="ts">

interface App {
    name: string
    icon: string
    href: string
    description: string
}
let apps: App[] = [
    {
        name:"ばくぜつさあち",
        icon:"/img/bs2nd/ba_gray.svg",
        href: "/app/bakuzetsu-searcher-2nd/edit",
        description:"コトダマンで楽して勝ちたい人に向けたツール"
    },
    {
        name:"Webダメカン",
        icon:"/img/pokeca/icon_white.svg",
        href: "/app/pokemon-card-game-effector/game",
        description:"ポケカのダメカンをWebでやっちゃう。"
    },
    {
        name:"TCGシミュ",
        icon:"/img/tcg-sim/card_naname.svg",
        href: "/app/tcg-simulator/game",
        description:"トレーディングカードをインポートしてプレイ"
    },
    {
        name:"DMダウンローダ",
        icon:"/img/tcg-sim/card_naname.svg",
        href: "/app/DM-Downloader/collect",
        description:"カード画像を収集"
    }
]


</script>
<article>
    <h1>APP LIST</h1>
    <div id='phone-flame'>
    <section>
        {#each apps as a}
            <div class='app-icon active'>
                <a href={a.href}>
                    <img src={a.icon} alt="">
                    <div class='app-name'>{a.name}</div>
                </a>
            </div>
        {/each}
        <div class='app-icon'>
        </div>
        <div class='app-icon'>
        </div>
        <div class='app-icon'>
        </div>
    </section>
    </div>
</article>

<style lang="scss">
    article{
        width:90vw;
        max-width: 350px;
        margin:0 auto;
        h1{
            margin: 20px 0 10px 0;
        }
    }
    #phone-flame{
        
        padding:10px;
        border: solid 2px white;
        background: white;
        min-height: 555px;
        border-radius: 20px;
        position: relative;
        &::before{
            content: "";
            position: absolute;
            background: white;
            --width: 160px;
            left:calc(50% - (var(--width) / 2));
            right:calc(50% - (var(--width) / 2)); 
            height:25px;
            border-radius: 0 0 20px 20px/0 0 15px 15px;

        }
        &::after{
            content: "";
            position: absolute;
            background: black;
            top:17px;
            --width: 50px;
            left:calc(50% - (var(--width) / 2));
            right:calc(50% - (var(--width) / 2)); 
            height:10px;
            border-radius: 5px;

        }
        section{
            font-family: 'Kosugi Maru', sans-serif;
            border: solid 2px white;
            padding: 50px 20px 20px 20px;
            background: linear-gradient(135deg, rgba(black,1),rgba(black,1), rgba(black,0.85));
            border-radius: 10px;
            min-height:535px;
            display: flex;
            flex-wrap: wrap;
            grid-template-columns: repeat(auto-fill, 80px);
            justify-content: space-between;
            
            .app-icon{
                display: flex;
                flex-direction: column;
                align-items: center;
                margin:0 0 45px 0;
                width:80px;
                height:80px;
                &.active{
                    border: solid 2px white;
                    border-radius: 20px;   
                }
                img{
                    
                    margin:0 auto;
                    padding:10px;
                    height:75px;
                    cursor: pointer;
                }
                .app-name{
                    margin:10px 0 0 0;
                    font-size: 10px;
                    text-align: center;
                }
            }
        }
    }
</style>
