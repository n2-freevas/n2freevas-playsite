<script lang='ts'>
    import { onMount } from "svelte";
    // import Viewport from 'svelte-viewport-info'
    import Card from '$lib/component/TCG-sim/card.svelte'
    import Hand from '$lib/component/TCG-sim/hand.svelte'
    import Deck from '$lib/component/TCG-sim/deck.svelte'
    import type { boardCardModel, deckCardModel, handCardModel } from '$lib/model/app/TCGsimModel'
    import { modeStore, boardAreaInfoStore, handAreaInfoStore, deckAreaInfoStore, cardWidth,
            deckListStore, handListStore, boardListStore}
    from '$lib/store/app/TCGsimStore'
    
    let files
    let isPC = true
    let window_width = 0
    let window_height = 0 
    let window_width_require = 1200
    let window_height_require = 800
    
    function getBoardInfo(){
        const boardInfo = document.getElementById('board').getBoundingClientRect()
        $boardAreaInfoStore = {
            top: boardInfo.top,
            left: boardInfo.left,
            right: boardInfo.right,
            bottom: boardInfo.bottom
        }
    }
    function getHandInfo(){
        const handInfo= document.getElementById('handArea-main').getBoundingClientRect()
        $handAreaInfoStore = {
            top: handInfo.top,
            left: handInfo.left,
            right: handInfo.right,
            bottom: handInfo.bottom
        }
    }

    function getDeckInfo(){
        const deckInfo= document.getElementById('deckArea-main').getBoundingClientRect()
        $deckAreaInfoStore = {
            top: deckInfo.top,
            left: deckInfo.left,
            right: deckInfo.right,
            bottom: deckInfo.bottom
        }
    }

    deckAreaInfoStore
    function windowChangeHandler(){
        window_width = window.innerWidth
        window_height = window.innerHeight
        if (window_width < window_width_require || window_height_require > window_height){isPC = false}
        getBoardInfo()
        getHandInfo()
        getDeckInfo()
    }
    
    function cardBoardInFromHand(event){
        const id = event.detail.id
        const position = event.detail.position
        const flippin = event.detail.flip
        const target = $handListStore.filter(card => card.id == id).pop()
        $handListStore = $handListStore.map(card => {
            return card.id != id ? card: null
        })
        $boardListStore = [...$boardListStore, {...target,x:position.top-($cardWidth), y:position.left, flip: flippin, rotate:0}]
        window.setTimeout(
            function(){
                $handListStore = $handListStore.filter(card => card != undefined)
            }
            ,300
        )
    }
    function cardBoardInFromDeck(event){
        const id = event.detail.id
        const position = event.detail.position
        const target = $deckListStore.filter(card => card.id == id).pop()
        $deckListStore = $deckListStore.filter(card=>card.id != id)
        $boardListStore = [...$boardListStore, {...target,x:position.top-($cardWidth), y:position.left, rotate:0}]
    }

    function cardBounceFromBoardToHand(event){
        const id = event.detail
        const bounced = $boardListStore.filter(card => card.id == id).pop()
        $boardListStore = $boardListStore.filter(card => card.id != id)
        $handListStore = [...$handListStore, bounced]
        
    }
    function cardMoveOnBoard(event){
        for (let i=0;i<$boardListStore.length;i++){
            if($boardListStore[i].id == event.detail.id){
                $boardListStore[i] = {
                    ...$boardListStore[i],
                    x: event.detail.x,
                    y: event.detail.y,
                    rotate: event.detail.rotate,
                    flip: event.detail.flip
                }
            }
        }
        // board = board
    }
    function cardHandInFromBoard(event){
        const id = event.detail.id
        const target = $boardListStore.filter(card=> card.id==id).pop()
        $boardListStore = $boardListStore.filter(card => card.id != id)
        $handListStore = [...$handListStore, target]
    }
    function cardHandInFromDeck(event){
        const id = event.detail.id
        const target = $deckListStore.filter(card=> card.id==id).pop()
        $deckListStore = $deckListStore.filter(card => card.id != id)
        $handListStore = [...$handListStore, target]
    }
    // DecK In Functions
    function cardDeckInFromBoard(event){
        const id = event.detail.id
        const target:deckCardModel = {...$boardListStore.filter(card=> card.id==id).pop(),
                        x:0,
                        y:0,
                        flip:true}
        $boardListStore = $boardListStore.filter(card => card.id != id)
        if(event.detail.post == 'top'){
            $deckListStore = [...$deckListStore, target]
        }
        else if(event.detail.post =='bottom'){
            $deckListStore = [target, ...$deckListStore]
        }
        
    }
    onMount(()=>{
        windowChangeHandler()
        getBoardInfo()
    })
</script>

<svelte:window bind:innerWidth={window_width} bind:innerHeight={window_height}
/>
{#if isPC}
<article id='board' class={$modeStore}>
    {#each $boardListStore as bs}
    <Card
        id = {bs.id} pos_x={bs.x} pos_y={bs.y} flippin={bs.flip}
        onArea={'board'} img_url={bs.url} sleeve_url={bs.burl}
        on:bounceHand={cardBounceFromBoardToHand}
        on:boardCardMove={cardMoveOnBoard}
        on:handIn={cardHandInFromBoard}
        on:deckIn={cardDeckInFromBoard}
    />
    {/each}
</article>
<article id='myHand'>
    <div id='handArea-main'></div>
    <Hand on:boardInFromHand={cardBoardInFromHand}></Hand>
</article>
<article id='myDeck'>
    <div id = 'deckArea-main'></div>
    <Deck
    on:handInFromDeck = {cardHandInFromDeck}
    on:boardInFromDeck = {cardBoardInFromDeck}
    />
</article>
{:else}
    <section id='is-not-PC-alert'>
    <div class='panel'>
        <h1>SORRY!</h1>
        <p>もっと大きい画面でご利用ください。</p>
        {#if window_width >= window_width_require && window_height_require <= window_height}
            <p class='clear'>条件をクリアしました！リロードしてください。</p>
        {/if}
        <!-- svelte-ignore missing-declaration -->
        <div class='device-exp'>
            <div class='device-figure'>
                <div class='width'>{`${window_width_require}px`}<span>{` ( ${window_width}px )`}</span></div>
                <div class='height'>{`${window_height_require}px`}<span>{` ( ${window_height}px )`}</span></div>
                <img src='/img/tcg-sim/require_device.svg' alt='縦:横 = 400px:700px の端末でご利用ください'>
            </div>
            
        </div>
    </div>
    </section>
{/if}

<style lang="scss">
    #board{
        width:825px;
        height:550px;
        z-index:1;
        margin:0 auto 0 200px;
        transform: rotateX(10deg);
        border-radius: 30px;
        position: relative;
        &.light{
            background:radial-gradient(ellipse, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%,rgba(0,0,0,0.2) 100%);
        }
        &.dark{
            background:radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 70%,rgba(255,255,255,0.1) 100%);
        }
    }
    #myHand{
        position:fixed;
        z-index:0;
        width:100%;
        height:75px;
        bottom:0;
        #handArea-main{
            position: absolute;
            width:500px;
            height:180px;
            left:50%;
            transform: translate(-50%, 0);
            bottom: 0;
            pointer-events: none;
        }
    }
    #myDeck{
        position: fixed;
        z-index:0;
        bottom:130px;
        left:0px;
        #deckArea-main{
            position: absolute;
            width:200px;
            height:300px;
            top:50%;
            left:-50%;
            transform: translate(0, -50%);
            bottom: 0;
            pointer-events: none;
        }
    }
    
    #is-not-PC-alert{
        margin:100px 20px;
        background: black;
        border:solid 1px white;
        border-radius: 20px;
        width: 70%;
        max-width: 600px;
        
        .clear{
            color:yellow
        }
        
        .panel{
            padding:20px;
            .device-exp{
            color: white;
            position: relative;
            max-width: 310px;
            margin: 50px auto;
            .device-figure{
                width:80%;
                margin:0 auto;
                font-size: 18px;
                span{
                    font-size: 15px;
                    line-height: 18px;
                    
                }
                .width{
                    position: absolute;
                    left:50%;
                    top:-30px;
                    transform: translate(-50%, 0);
                }
                .height{
                    position: absolute;
                    top:50%;
                    right:-55px;
                    transform: rotate(90deg);
                }       
            }   
        }
    }
}
</style>
