<script lang="ts">
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { deckStore } from '$lib/store/app/synegierAdmin'
    import { onMount } from 'svelte'
    import In2pickAmination from '../CardAnimationComponent.svelte/In2pickAmination.svelte'
    import DeckSummary from './deckSummary.svelte'

    export let cardDatus: SynegierCard[]
    // export let soldierDatus = []
    type phaseOf2pickList = 'prepare' | 'processing' | 'end'
    let nowPhaseOf2pick: phaseOf2pickList = 'prepare'

    // === prepare ===

    let datusDivRarity = { C: [], R: [], SR: [], LE: [] }
    let datusDivRarityLen = { C: 0, R: 0, SR: 0, LE: 0 }

    function pickPrepare() {
        datusDivRarity.C = cardDatus.filter((card) => card.rarity == 'C')
        datusDivRarityLen.C = datusDivRarity.C.length
        datusDivRarity.R = cardDatus.filter((card) => card.rarity == 'R')
        datusDivRarityLen.R = datusDivRarity.R.length
        datusDivRarity.SR = cardDatus.filter((card) => card.rarity == 'SR')
        datusDivRarityLen.SR = datusDivRarity.SR.length
        datusDivRarity.LE = cardDatus.filter((card) => card.rarity == 'LE')
        datusDivRarityLen.LE = datusDivRarity.LE.length
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
    let pickedCards: SynegierCard[] = []
    let countOfPicked = 0
    const numberOfPickedCard = 16

    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    function pickupCardHelperFindUnduplicatedIndex(
        len1,
        len2 = undefined,
        len3 = undefined
    ): number[] {
        let result = []
        let leftChoise1 = getRandomInt(len1)
        let rightChoise1 = leftChoise1
        while (rightChoise1 == leftChoise1) {
            rightChoise1 = getRandomInt(len1)
        }
        result.push(leftChoise1)
        result.push(rightChoise1)
        if (len2) {
            let leftChoise2 = getRandomInt(len2)
            let rightChoise2 = leftChoise2
            while (rightChoise2 == leftChoise2) {
                rightChoise2 = getRandomInt(len2)
            }
            result.push(leftChoise2)
            result.push(rightChoise2)
        }
        if (len3) {
            let leftChoise3 = getRandomInt(len3)
            let rightChoise3 = leftChoise3
            while (rightChoise3 == leftChoise3) {
                rightChoise3 = getRandomInt(len3)
            }
            result.push(leftChoise3)
            result.push(rightChoise3)
        }
        return result
    }
    function pickupCards() {
        if (countOfPicked < 7) {
            console.log('C R pick')
            // 01-07回目 C:   90%, R:  10%
            let nums = pickupCardHelperFindUnduplicatedIndex(
                datusDivRarityLen.C,
                datusDivRarityLen.R
            )
            let ZeroToNine = getRandomInt(10)
            if (ZeroToNine < 9) {
                leftCard = datusDivRarity.C[nums[0]]
            } else {
                leftCard = datusDivRarity.R[nums[2]]
            }
            ZeroToNine = getRandomInt(10)
            if (ZeroToNine < 9) {
                rightCard = datusDivRarity.C[nums[1]]
            } else {
                rightCard = datusDivRarity.R[nums[3]]
            }
        } else if (countOfPicked < 12) {
            console.log('C R SR pick')
            //　08-12回目 C:   30%, R:  60%, SR: 10%
            let nums = pickupCardHelperFindUnduplicatedIndex(
                datusDivRarityLen.C,
                datusDivRarityLen.R,
                datusDivRarityLen.SR
            )
            let ZeroToNine = getRandomInt(10)
            if (ZeroToNine < 3) {
                leftCard = datusDivRarity.C[nums[0]]
            } else if (ZeroToNine < 9) {
                leftCard = datusDivRarity.R[nums[2]]
            } else {
                leftCard = datusDivRarity.SR[nums[4]]
            }
            ZeroToNine = getRandomInt(10)
            if (ZeroToNine < 3) {
                rightCard = datusDivRarity.C[nums[1]]
            } else if (ZeroToNine < 9) {
                rightCard = datusDivRarity.R[nums[3]]
            } else {
                rightCard = datusDivRarity.SR[nums[5]]
            }
        } else if (countOfPicked < 15) {
            console.log('SR LE pick')
            //　13-15回目 SR:  90%, LE:  10%
            let nums = pickupCardHelperFindUnduplicatedIndex(
                datusDivRarityLen.SR,
                datusDivRarityLen.LE
            )
            let ZeroToNine = getRandomInt(10)
            if (ZeroToNine < 9) {
                leftCard = datusDivRarity.SR[nums[0]]
            } else {
                leftCard = datusDivRarity.LE[nums[2]]
            }
            ZeroToNine = getRandomInt(10)
            if (ZeroToNine < 9) {
                rightCard = datusDivRarity.SR[nums[1]]
            } else {
                rightCard = datusDivRarity.LE[nums[3]]
            }
        } else {
            console.log('LE pick')
            //　16回目 LE: 100%
            let nums = pickupCardHelperFindUnduplicatedIndex(datusDivRarityLen.LE)
            leftCard = datusDivRarity.LE[nums[0]]
            rightCard = datusDivRarity.LE[nums[1]]
        }
        countOfPicked += 1
        isAppearLeftCard = true
        isAppearRightCard = true
    }

    function pickedProcess(choise: SynegierCard) {
        pickedCards.push(choise)
        pickedCards = pickedCards
        // アニメーション終了タイミングで全て引っ込める
        window.setTimeout(() => {
            isUnChoiseLeftCard = true
            isUnChoiseRightCard = true

            window.setTimeout(() => {
                isChoiseLeftCard = false
                isUnChoiseLeftCard = false
                isChoiseRightCard = false
                isUnChoiseRightCard = false
                isAppearLeftCard = false
                isAppearRightCard = false
                if (countOfPicked == numberOfPickedCard) {
                    nowPhaseOf2pick = 'end'
                    pickEnd()
                } else {
                    pickupCards()
                }
            }, 1000)
        }, 700)
    }

    // === end ===
    let isCardsHide = false
    function pickEnd() {
        // カードの一覧をストアに格納する。
        $deckStore = pickedCards
        isCardsHide = true
    }

    onMount(() => {
        // pickedCards = cardDatus.slice(0,16)
        // nowPhaseOf2pick = "end"
        pickPrepare()
    })
</script>

{#if nowPhaseOf2pick == 'processing'}
    <div id="pickProcessingField">
        <div
            class="leftCard"
            on:click={() => {
                isChoiseLeftCard = true
                isUnChoiseRightCard = true
                pickedProcess(leftCard)
            }}>
            <In2pickAmination
                bind:onAppear={isAppearLeftCard}
                bind:onChoised={isChoiseLeftCard}
                bind:onUnChoised={isUnChoiseLeftCard}>
                <Card model={leftCard} scale={0.4} />
            </In2pickAmination>
        </div>
        <div
            class="rightCard"
            on:click={() => {
                isChoiseRightCard = true
                isUnChoiseLeftCard = true
                pickedProcess(rightCard)
            }}>
            <In2pickAmination
                bind:onAppear={isAppearRightCard}
                bind:onChoised={isChoiseRightCard}
                bind:onUnChoised={isUnChoiseRightCard}>
                <Card model={rightCard} scale={0.4} />
            </In2pickAmination>
        </div>
    </div>
{:else if nowPhaseOf2pick == 'end'}
    <div id="pickEndField">
        <div class="list">
            {#each pickedCards as c, i}
                <In2pickAmination onAppear={true} delay={i * 0.1}>
                    <Card model={c} scale={0.3} />
                </In2pickAmination>
            {/each}
        </div>
    </div>
{:else}
    <div>?</div>
{/if}
<div id="pickingInfo">
    <DeckSummary bind:deckCards={pickedCards} bind:isCardsHide />
</div>

<style lang="scss">
    .list {
        width: inherit;
        height: 400px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    #pickProcessingField,
    #pickEndField {
        position: absolute;
        overflow: hidden;
        background: radial-gradient(closest-side, rgba(#555555, 0.8), rgba(#000000, 0));
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #pickProcessingField {
        width: 600px;
        height: 400px;
        .leftCard,
        .rightCard {
            position: absolute;
            cursor: pointer;
        }
        .leftCard {
            top: 50px;
            left: 50px;
        }
        .rightCard {
            top: 50px;
            right: 50px;
        }
    }

    #pickEndField {
        width: 1000px;
        height: 600px;
    }
    #pickingInfo {
        position: fixed;
        width: 1000px;
        height: 250px;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
    }
</style>
