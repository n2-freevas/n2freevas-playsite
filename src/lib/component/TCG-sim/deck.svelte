<script lang="ts">
    import type { deckCardModel } from "$lib/model/app/TCGsimModel"
    import Card from "./card.svelte"
    import { createEventDispatcher } from 'svelte';
    import { deckListStore } from "$lib/store/app/TCGsimStore";
    const dispatch = createEventDispatcher();

    
    function deckPositionsReset(){
        $deckListStore=$deckListStore.map(card =>{
            return {
                ...card,
                
            }
        })
    }

    function cardHandInFromDeck(event){
        const id = event.detail.id
        dispatch('handInFromDeck', {
            id: id
        })
    }
    function cardBoardInFromDeck(event){
        dispatch('boardInFromDeck', event.detail)
    }
</script>

<section id='deckArea'>
    <section id='deckUI'>
        <div class='deckUI-button' style='--deg:{0}deg'>
            <img src='/img/tcg-sim/ellipse.svg' alt=''>
        </div>            
    </section>
    <section id='deckPiling'>
        <div class='deckbottom' on:click={deckPositionsReset}>
            <div class='round'></div>
        </div>
        {#each $deckListStore as d, i}
            <Card
                id = {d.id} pos_x={d.x + i * -0.5} pos_y={d.y + i * -0.8} flippin={d.flip}
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
}
#deckUI{
    z-index: 20;
    position: absolute;
    top:-200px;
    .deckUI-button{
        top:0;
        left:0;
        position: absolute;
        transform: rotate(vaar(--deg));
        img{
            width:500px;
            height:500px;
        }
        
    }
}
#deckPiling{
    position: relative;
    width:var(--ch);
    height:var(--cw);
    .deckbottom{
        position: absolute;
        width:100px;
        height:200px;
        top:-40px;
        left:0;
        overflow: hidden;
        .round{
            position: absolute;
            right:0;
            width:200px;
            height:200px;
            border-radius: 100px;
            background: red;
        }
    }
}
</style>
