<script context='module' lang='ts'>
    import type {deckCardModel} from '$lib/model/app/TCGsimModel'
    export function deckShuffle(array: deckCardModel[]): deckCardModel[]{
        let list = Object.assign([],array)
        let newlist:deckCardModel[] = []
        while (list.length > 0){
            const n = list.length
            let k = Math.floor(Math.random() * n)
            newlist.push(list[k])
            list.splice(k,1)
        }
        // デッキの位置を整形
        let i = 0
        newlist.forEach(item=>{
            item.x = (i * -0.25) + 15,
            item.y = (i * -0.5) - 45,
            item.flip = true
            i += 1
        })
        return newlist
    }
</script>

<script lang="ts">
    import Card from "./card.svelte"
    import { createEventDispatcher, onMount } from 'svelte';
    import { deckListStore, modeStore, 
            handListStore, cardWidth,
            handAreaInfoStore, boardListStore, unshuffleDeckListStore } from "$lib/store/app/TCGsimStore";
    import type { handCardModel } from '$lib/model/app/TCGsimModel';
    
    const dispatch = createEventDispatcher();

    
    let continueDeckCenterAction = 0
    let isUntouchDeck = false
    let z_index_controller = 0

    const handLineupGuideRadius = 250

    // 手札を整列させる関数:1
    function handLineupGuideFunction(x: number){
        return -1 * (Math.sqrt(Math.pow(handLineupGuideRadius,2) - Math.pow(x,2)))
    }
    //手札を整列させる関数:2
    function handLineUp(){
        let hand = $handListStore
        const handLen = hand.length;
        const x_offset = ($handAreaInfoStore.left + $handAreaInfoStore.right)/2
        let xSpacing = ((handLineupGuideRadius * 2) - 150)/handLen;
        let degSpaning = 100/handLen
        if(xSpacing > 50){
            xSpacing = 50
        }
        if(degSpaning > 20){
            degSpaning = 20
        }
        let temp:handCardModel[] = []
        for(let i=0; i<handLen; i++){
            if(hand[i]){
                const x = (xSpacing * (i - handLen/2 + 0.5) )
                const y = handLineupGuideFunction(x)
                const deg = (i - Math.floor(handLen / 2)) * degSpaning
                temp.push({
                    id: hand[i].id,
                    url: hand[i].url,
                    burl: hand[i].burl,
                    x: x - ($cardWidth / 2) + x_offset,
                    y: y + 150,
                    rotate: deg,
                    flip: false
                })
            } else {
                temp.push(undefined)
            }
        }
        $handListStore = temp
    }

    $:{
        console.log($handListStore)
        handLineUp()
    }

    function cardBoardInFromHand(event){
        const id = event.detail.id
        const position = event.detail.position
        const flippin = event.detail.flip
        
        // 手札から指定カードを抜き出す。
        const target = $handListStore.filter(card => card.id == id).pop()
        $handListStore = $handListStore.filter(card => card.id != id)
        
        // 盤面上にカードを配置
        $boardListStore = [
            ...$boardListStore,
            {
                ...target,
                x:position.top-($cardWidth), 
                y:position.left,
                z:0,
                flip: flippin, 
                rotate:0
            }
        ]
        handLineUp()
    }
    //デッキの一覧を表示する。
    function deckTopAction(){
        let i = 0
        continueDeckCenterAction = 0
        // 山札のカードを、画面上にバーっと並べる。
        const game_width = document.getElementById('base').getBoundingClientRect().width

        const deck_top_position = document.getElementsByClassName(
            `card-id-${$deckListStore[$deckListStore.length-1].id}`
        ).item(0).getBoundingClientRect()
        // height: 110
        // width: 90
        // left: 16.5
        // right: 106.5
        // top: 663.5
        // bottom: 773.5
        // x: 16.5
        // y: 663.5
        const basis_mod = Math.floor(game_width/deck_top_position.width)
        $deckListStore.forEach(item => {
            
            const basic_x_pos = (i % basis_mod)* deck_top_position.width
            const basic_y_pos =  (-1 * (deck_top_position.top)) 
            + (deck_top_position.height * (Math.floor(i/basis_mod)))
            item.x = basic_x_pos
            item.y = basic_y_pos
            item.flip = false
            i += 1
        })
        $deckListStore = $deckListStore
    }
    function cardHandInFromDeck(event){
        const id = event.detail.id
        const target = $deckListStore.filter(card=> card.id==id).pop()
        $deckListStore = $deckListStore.filter(card => card.id != id)
        $handListStore = [...$handListStore, target]
        handLineUp()
    }
    function cardBoardInFromDeck(event){
        dispatch('boardInFromDeck', event.detail)
    }
    function deckBottomAction(){
        let top = $deckListStore.pop()
        $deckListStore = $deckListStore
        $handListStore.push(top)
        $handListStore = $handListStore
        console.log($handListStore)
        handLineUp()
    }
    
    function deckResetAction(){
        if (continueDeckCenterAction == 0){
            continueDeckCenterAction += 1
            let i = 0
            $deckListStore.forEach(item=>{
                item.x = (i * -0.25) + 15,
                item.y = (i * -0.5) - 45,
                item.flip = true
                item.rotate = 0
                i += 1
            })
            $deckListStore = $deckListStore
        }
        else{
            isUntouchDeck = true
            continueDeckCenterAction = 0
            let newlist = []
            let i = 0
            
            //　配列入れ替え
            newlist = deckShuffle($deckListStore)
            
            //　シャッフルアニメーションの仕込み
            newlist.forEach((item)=>{
                item.rotate = (360 * i) % 1800
                i += 1
            })
                        
            $deckListStore = newlist
            isUntouchDeck = false
        }
        
    }
    
    function allHandsGoToDeck(){
        const deckLen = $unshuffleDeckListStore.length
        let i = $deckListStore.length
        console.log(i)
        $handListStore.forEach(card=>{
            card.x = ((deckLen - i) * -0.25) + 15
            card.y = ((deckLen - i) * -0.5) - 45
            card.flip = true
            card.rotate = 0
            i += 1
        })
        $deckListStore = $handListStore.concat($deckListStore)
        $handListStore = []
        $deckListStore = $deckListStore
    }

    function deckInfromHand(event){
        console.log('check',event)
        const id = event.detail.id
        const target:deckCardModel = {...$handListStore.filter(card=> card.id==id).pop(),
                        x:0,
                        y:0,
                        flip:true}
        $handListStore = $handListStore.filter(card => card.id != id)
        if(event.detail.post == 'top'){
            $deckListStore = [...$deckListStore, target]
        }
        else if(event.detail.post =='bottom'){
            $deckListStore = [target, ...$deckListStore]
        }
    }

    onMount(()=>{
        //以下はセットで実行
        deckResetAction()
        continueDeckCenterAction = 0
    })
</script>

<section id='deckArea' class={$modeStore}>
    <div class='deckbottom'>
        <div class='round' >
            <div class='round-top' on:click={deckTopAction}></div>
            <div class='round-center' on:click={deckResetAction}></div>
            <div class='round-bottom' on:click={deckBottomAction}></div>
        </div>
    </div>
</section>

{#if isUntouchDeck}
    <div id = 'deckUntouchMask'></div>
{/if}


<div id='handArea'>
    <div id='handArea-radius'>
        <div id='handArea-radius-left' on:click={()=> {allHandsGoToDeck()}}></div>
        <div id='handArea-radius-right' on:click={()=> {handLineUp()}}></div>
    </div>
</div>
{#each $deckListStore as d, i}
    <Card
        id = {d.id} pos_x={d.x + i * -0.25 + 15} pos_y={d.y} flippin={d.flip}
        onArea={'deck'} img_url={d.url} sleeve_url={d.burl} rotate={d.rotate}
        noGuide = {true}
        on:handIn={cardHandInFromDeck}
        on:boardIn={cardBoardInFromDeck}
    />
{/each}
{#each $handListStore as h}
    {#if h}
    <Card id={h.id}
        pos_x={h.x} pos_y={h.y} rotate={h.rotate} onArea={'hand'}
        img_url={h.url} sleeve_url={h.burl} flippin={h.flip}
        on:boardIn={cardBoardInFromHand}
        on:deckIn = {deckInfromHand}/>
    {/if}
{/each}



<style lang="scss">
#handArea{
    position: absolute;
    margin:0 auto;
    --width: 700px;
    width:var(--width);
    height:100%;
    left:calc(60% - ( var(--width) / 2 ) );
    bottom:0;
    overflow: hidden;
    #handArea-radius{
        position: absolute;
        user-select: none;
        top:70px;
        margin:0 auto;
        width:inherit;
        height:var(--width);
        border-radius: calc( var(--width) / 2 );
        overflow: hidden;
        #handArea-radius-left{
            position: absolute;
            width:50%;
            height:100%;
            background:#1d28c0;
        }
        #handArea-radius-right{
            position: absolute;
            right:0;
            width:50%;
            height:100%;
            background:#081081;
        }
    }    
}
#deckArea{
    position: absolute;
    --round-len: 300px;
    width:calc( var(--round-len) / 2);
    height:var(--round-len);
    bottom:0;
    &.light{
        --deck-bg-color-top: #0a2ea5;
        --deck-bg-color-center: #324892;
        --deck-bg-color-bottom: #130069;
    }
    &.dark{
        --deck-bg-color-top: #0a2ea5;
        --deck-bg-color-center: #83a0ff;
        --deck-bg-color-bottom: #130069;
    }
    .deckbottom{
        position: absolute;
        width:inherit;
        height:inherit;
        bottom: 0;
        left:0;
        overflow: hidden;
        .round{
            position: absolute;
            right:0;
            width:var(--round-len);
            height:var(--round-len);
            border-radius: 200px;
            overflow: hidden;
            .round-top, .round-center, .round-bottom{
                position: absolute;
                width:var(--round-len);
                height:calc(var(--round-len) / 3);
                &:hover{
                    background: #ffde37;
                }
            }
            .round-top{
                top:0;
                background: var(--deck-bg-color-top);
            }
            .round-center{
                top:50%;
                transform: translate(0,-50%);
                background: var(--deck-bg-color-center);
            }
            .round-bottom{
                bottom:0;
                background: var(--deck-bg-color-bottom);
            }
        }   
    }
}

#deckUntouchMask{
    position: absolute;
    z-index: 100;
    width:200px;
    height:350px;
    top:-100px;
}
</style>
