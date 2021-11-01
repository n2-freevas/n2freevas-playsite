<script lang="ts">
    import {getUnits, getUnitsUsingFilter, DEFAULT_LIMIT} from '$lib/api/app/bs2ndApi'
    import MediaQuery from 'svelte-media-query'
    import { onMount } from 'svelte';
    import type {kotodaman} from '$lib/model/app/Bs2ndModel'
    import Kotodaman from '$lib/component/bs2nd/kotodaman.svelte';
    import { deckStore, unitListStore } from '$lib/store/app/bs2ndStore'

    let unitsfil: Array<kotodaman> = []
    onMount(async() =>{
        // const units = await getUnits(10,10)
        // console.log(units)

        $unitListStore = await getUnitsUsingFilter(
                            0,DEFAULT_LIMIT,
                            ["う","よ","さ","く","ん"],["水","光"],["魔","霊"],["コピーガード","ヒールブレイカー"]
                        )
        for(let i=0; i<12; i++){
            if ($deckStore[i] != undefined){
                for(let j=0; j<$unitListStore.length; j++){
                    if($deckStore[i].id == $unitListStore[j].id){
                        $unitListStore[j].indeck = true
                    }
                }
            }
        }
    })

    function handleDeckInKotodaman(event){
        console.log('deckin',event.detail.kotodaman)
        for(let i=0; i<12;i++){
            if($deckStore[i] == undefined){
                $deckStore[i] = event.detail.kotodaman
                break;
            }
        }
    }
    function handleDeckOutKotodaman(event){
        console.log('deckout',event.detail.kotodaman)
    }

</script>
<MediaQuery query="(max-width: 700px)" let:matches>{#if matches}
<article id='bs2nd-screen'>
    <section id='bs2nd-edit-panels'>
        <h1>Edit</h1>
        <section id='bs2nd-deck-edit-panel'>
            {#each $deckStore as unit}
                {#if unit == undefined}
                    <div class='unit-in-deck-blank-slot'></div>
                {:else}
                    <Kotodaman kotodaman={unit} on:click={handleDeckOutKotodaman}/>
                {/if}
            {/each}
        </section>
        <section id='bs2nd-show-units-panel'>
            {#each $unitListStore as unit}
                <Kotodaman kotodaman={unit} full={true} on:click={handleDeckInKotodaman}/>
            {/each}
        </section>
        
    </section>
    <section id='bs2nd-handle-slider'>
        <section id='bs2nd-deck-select-slider'>

        </section>
        <section id='bs2nd-units-filter-slider'>

        </section>
    </section>
</article>
{/if}</MediaQuery>

<style lang="scss">
    #bs2nd-screen{
        width:90vw;
        margin:0 auto;
        height:100%;
        overflow: hidden;
        #bs2nd-edit-panels{
            #bs2nd-deck-edit-panel{
                height:225px;
                width:300px;
                background: white;
                border-radius: 20px;
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
                flex-wrap: wrap;
                .unit-in-deck-blank-slot{
                    width:50px; height:50px;
                    border-radius: 25px;
                    margin:10px;
                    background-color: gray;
                }
            }
            #bs2nd-show-units-panel{

            }
        }
        #bs2nd-handle-slider{

        }
        
    }


</style>
