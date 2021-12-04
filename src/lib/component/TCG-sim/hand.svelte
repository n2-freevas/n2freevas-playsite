<script lang="ts">
    import type { handCardModel } from '$lib/model/app/TCGsimModel';
    import { handListStore,modeStore, cardWidth} from '$lib/store/app/TCGsimStore'
    import Card from './card.svelte';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    const handLineupGuideRadius = 250

    function handLineupGuideFunction(x: number){
        return -1 * (Math.sqrt(Math.pow(handLineupGuideRadius,2) - Math.pow(x,2)))
    }
    $:{
        let hand = $handListStore
        const handLen = hand.length;
        
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
                    x: x + handLineupGuideRadius - ($cardWidth / 2),
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
    function cardBoardInFromHand(event){
        dispatch('boardInFromHand', event.detail)
    }
</script>
<section id='handArea' class={$modeStore}>
    <div id='handArea-bg'>
        <div id='handArea-bg-radius' class='{$modeStore}' on:click={()=> {$handListStore = $handListStore}}></div>
    </div>
    {#each $handListStore as h}
        {#if h}
        <Card id={h.id}
            pos_x={h.x} pos_y={h.y} rotate={h.rotate} onArea={'hand'}
            img_url={h.url} sleeve_url={h.burl} flippin={h.flip}
            on:boardIn={cardBoardInFromHand}/>
        {/if}
    {/each}
</section>
<style lang="scss">
#handArea{
    position: absolute;
    margin:0 auto;
    width:500px;
    height:75px;
    left:calc(50% - 250px);
    bottom:0;
    &.light{--hand-bg-color: #0a2ea5;}
    &.dark{--hand-bg-color: #081081;}
    #handArea-bg{
        overflow: hidden;
        width:inherit;
        height:inherit;
        #handArea-bg-radius{
            position: relative;
            margin:0 auto;
            width:inherit;
            height:500px;
            border-radius: 250px;
            
            &.light{
                background:yellow;
            }
            &.dark{
                background:var(--hand-bg-color);
            }
        }
    }    
}
    
</style>
