<script lang="ts">
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { onMount } from 'svelte';
    import In2pickAmination from '../CardAnimationComponent.svelte/In2pickAmination.svelte';
    

    export let cardDatus: SynegierCard[]
    export let soldierDatus = []
    type phaseOf2pickList = "prepare" | "processing" | "end"
    let nowPhaseOf2pick: phaseOf2pickList = "prepare"


    // === prepare === 

    let datusDivRarity = { "C": [], "R": [], "SR": [], "LE": [] }

    function pickPrepare(){
        datusDivRarity.C = cardDatus.filter(card=>card.rarity == "C")
        datusDivRarity.R = cardDatus.filter(card=>card.rarity == "R")
        datusDivRarity.SR = cardDatus.filter(card=>card.rarity == "SR")
        datusDivRarity.LE = cardDatus.filter(card=>card.rarity == "LE")
        nowPhaseOf2pick = 'processing'
        pickupCards()
    }


    // === processing === 

    let leftCard: SynegierCard = undefined
    let isAppearLeftCard = false
    let isChoiseLeftCard = false
    let isUnChoiseLeftCard = false
    let isAppearRightCard = false
    let isChoiseRightCard = false
    let isUnChoiseRightCard = false
    let rightCard: SynegierCard = undefined
    let pickedCard: SynegierCard[] = []
    const numberOfPickedCard = 16
    let countCardPerRarity = { "C": 0, "R": 0, "SR": 0, "LE": 0 }

    function pickupCards(){
        leftCard = datusDivRarity.C[0]
        rightCard = datusDivRarity.C[1]
        isAppearLeftCard = true
        isAppearRightCard = true
    }

    function pickedProcess(choise: SynegierCard){
        // 　1. 01-08回目 C:   70%, R:  30%
        //　2. 09-13回目 C:   50%, R:  40%, SR: 10%
        //　3. 14-15回目 SR:  90%, LE:  5%
        //　4.    16回目 LE: 100% 
        pickedCard.push()
        // アニメーション終了タイミングで全て引っ込める
        window.setTimeout(()=>{
            isUnChoiseLeftCard = true
            isUnChoiseRightCard = true
            isAppearLeftCard = false
            isAppearRightCard = false
            
            window.setTimeout(()=>{    
                isChoiseLeftCard = false
                isUnChoiseLeftCard = false
                isChoiseRightCard = false
                isUnChoiseRightCard = false
                pickupCards()
            },1000)
        }, 700)
        
    }


    // === end === 

    function pickEnd(){
        // カードの一覧を見せる
    }

    onMount(()=>{pickPrepare()})
</script>

<section>
{#if nowPhaseOf2pick == "prepare"}
    <div>prepare</div>
{:else if nowPhaseOf2pick == "processing"}
    <div>processing</div>
    <div id="pickProcessingField">
        <div class="leftCard" on:click={()=>{
                isChoiseLeftCard=true;
                isUnChoiseRightCard=true;
                pickedProcess(leftCard);
            }}>
            <In2pickAmination
                bind:onAppear={isAppearLeftCard}
                bind:onChoised={isChoiseLeftCard}
                bind:onUnChoised={isUnChoiseLeftCard}
            >
                <Card model={leftCard} scale={0.4}></Card>
            </In2pickAmination>
        </div>
        <div class="rightCard" on:click={()=>{
                isChoiseRightCard=true;
                isUnChoiseLeftCard=true;
                pickedProcess(rightCard)
            }}>
            <In2pickAmination
                bind:onAppear={isAppearRightCard}
                bind:onChoised={isChoiseRightCard}
                bind:onUnChoised={isUnChoiseRightCard}
            >
                <Card model={rightCard} scale={0.4}></Card>
            </In2pickAmination>
        </div>
    </div>
{:else if nowPhaseOf2pick == "end"}
    <div></div>
{:else}
    <div>?</div>
{/if}
</section>


<style lang="scss">

    #pickProcessingField{
        position: absolute;
        width:600px;
        height:400px;
        background: radial-gradient(closest-side, rgba(#555555, 0.8), rgba(#000000, 0));
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        .leftCard, .rightCard{
            position: absolute;
            cursor: pointer;
        }
        .leftCard{
            top:50px;
            left:100px
        }
        .rightCard{
            top:50px;
            right:100px
        }
    }

</style>
