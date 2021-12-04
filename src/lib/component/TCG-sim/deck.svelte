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
        return newlist
    }
</script>

<script lang="ts">
    import Card from "./card.svelte"
    import { createEventDispatcher } from 'svelte';
    import { deckListStore, modeStore } from "$lib/store/app/TCGsimStore";
    const dispatch = createEventDispatcher();

    let continueDeckTopAction = 0
    let continueDeckBottomAction = 0

    function cardHandInFromDeck(event){
        const id = event.detail.id
        dispatch('handInFromDeck', {
            id: id
        })
    }
    function cardBoardInFromDeck(event){
        dispatch('boardInFromDeck', event.detail)
    }
    function deckBottomAction(){
        
        let target = $deckListStore[continueDeckTopAction]
        target = {
            ...target,
            x: target.x + 150 + (continueDeckTopAction * 20),
            y: target.y + 50
        }
        $deckListStore[continueDeckTopAction] = target
        continueDeckTopAction += 1
    }
    function deckTopAction(){
        let target = $deckListStore[$deckListStore.length - continueDeckBottomAction - 1]
        target = {
            ...target,
            x: target.x + 150 + (continueDeckBottomAction * 20),
            y: target.y + 50
        }
        $deckListStore[$deckListStore.length - continueDeckBottomAction - 1] = target
        continueDeckBottomAction += 1
    }
    function deckResetAction(){
        continueDeckTopAction = 0
        continueDeckBottomAction = 0
        for(let i=0; i<$deckListStore.length; i++){
            $deckListStore[i] = {
                ...$deckListStore[i],
                x: 0,
                y: 0,
                flip: true
            }
        }
    }
    
</script>

<section id='deckArea' class={$modeStore}>
    <section id='deckPiling'>
        <div class='deckbottom'>
            <div class='round' >
                <div class='round-top' on:click={deckTopAction}></div>
                <div class='round-center' on:click={deckResetAction}></div>
                <div class='round-bottom' on:click={deckBottomAction}></div>
            </div>
        </div>
        {#each $deckListStore as d, i}
            <Card
                id = {d.id} pos_x={d.x + i * -0.5 + 25} pos_y={d.y + i * -0.8 +10} flippin={d.flip}
                onArea={'deck'} img_url={d.url} sleeve_url={d.burl}
                noGuide = {true}
                on:handIn={cardHandInFromDeck}
                on:boardIn={cardBoardInFromDeck}
            />
        {/each}
    </section>
</section>

<style lang="scss">
#deckArea{
    position: relative;
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
}
#deckPiling{
    position: relative;
    width:var(--ch);
    height:var(--cw);
    .deckbottom{
        position: absolute;
        --round-len: 300px;
        width:calc(var(--round-len) / 2);
        height:var(--round-len);
        top:-90px;
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
</style>
