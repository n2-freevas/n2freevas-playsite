<script lang="ts" context="module">
    export function judgeCursorInTheRect(x: number, y: number, rect: DOMRect) {
        const inX = rect.x < x && x < rect.x + rect.width
        const inY = rect.y < y && y < rect.y + rect.height
        return inX && inY ? true : false
    }
</script>

<script lang="ts">
    import { deckStore, cardInDuelStore } from '$lib/store/app/synegierAdmin'
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import Handler from '$lib/component/SynegierAdmin/CardAnimationComponent/Handler.svelte'
    import { onMount } from 'svelte'
    import type { SynegierCardAndPosition, cardMoveEvent } from '$lib/model/app/SynegierAdmin'
    import Button from '$lib/component/SynegierAdmin/UI/Button.svelte'
    import TryAreaComponent from './_DuelComponent.svelte/TryAreaComponent.svelte'

    // Variant
    let objectIdManager = 1
    let z_index_handler = 0

    let boardRect: DOMRect
    let tryAreaRect: DOMRect
    let playAreaRect: DOMRect

    let deckList: SynegierCardAndPosition[] = []
    let handList: SynegierCardAndPosition[] = []
    let trashList: SynegierCardAndPosition[] = []
    let tryList: SynegierCardAndPosition[] = []
    let tryListLength: number = tryList.length

    // const
    const defalutScale = 0.2
    const estimateCardHeight = 120

    const handsAreaWidth = 350
    const tryAreaWidth = 700
    const tryAreaHeight = 200

    onMount(() => {
        boardRect = document.getElementById('board').getBoundingClientRect()
        tryAreaRect = document.getElementById('tryArea').getBoundingClientRect()
        playAreaRect = document.getElementById('playArea').getBoundingClientRect()
        console.log('boardRect', boardRect)
        console.log('tryAreaRect', tryAreaRect)
        console.log('playAreaRect', playAreaRect)
        resetDeck()
    })

    function resetDeck() {
        $deckStore.forEach((card) => {
            $cardInDuelStore.push({
                ...card,
                objectId: objectIdManager,
                x: boardRect.width - 50,
                y: boardRect.height - estimateCardHeight * 2,
                z: z_index_handler,
                rotate: 60,
                flip: true,
                scale: defalutScale
            })
            objectIdManager += 1
            z_index_handler += 1
        })
        $cardInDuelStore = $cardInDuelStore
        deckList = Object.assign([], $cardInDuelStore)
    }

    function draw() {
        let card = deckList.pop()
        $cardInDuelStore.forEach((c) => {
            if (c.objectId == card.objectId) {
                handList.push(c)
            }
        })
        alignHand()
    }

    function alignHand(concatTryArea: boolean = false) {
        if (concatTryArea) {
            handList = handList.concat(tryList)
            tryList = []
            tryListLength = tryList.length
        }
        console.log(handList)
        console.log(tryList)
        const handListObjectIds = handList.map((hand) => hand.objectId)
        const _handAreaMargin = handsAreaWidth / handListObjectIds.length
        const handAreaMargin = _handAreaMargin > 100 ? 100 : _handAreaMargin

        let index = 0
        handList.forEach((c) => {
            if (handListObjectIds.includes(c.objectId)) {
                c.x = boardRect.width / 2 + index * handAreaMargin
                c.y = boardRect.height - estimateCardHeight
                c.rotate = 0
                c.flip = false
                c.z = index
                index += 1
                c.scale = defalutScale
            }
        })
        $cardInDuelStore = $cardInDuelStore
    }

    function cardMovedEventHandler(event: CustomEvent) {
        const moveEvent: cardMoveEvent = event.detail
        // tryAreaに入ったか判定
        if (
            judgeCursorInTheRect(
                moveEvent.mouseEvent.clientX,
                moveEvent.mouseEvent.clientY,
                tryAreaRect
            )
        ) {
            const _top = (tryAreaHeight - estimateCardHeight * 1.5) / 2
            $cardInDuelStore.forEach((c) => {
                if (c.objectId == moveEvent.objectId) {
                    if (tryList.filter((c) => c.objectId == moveEvent.objectId).length == 0) {
                        tryList.push(c)
                        tryListLength += 1
                        handList = handList.filter((c) => c.objectId != moveEvent.objectId)
                    }
                    c.y = tryAreaRect.x + _top
                    c.scale = 0.3
                }
            })
            $cardInDuelStore = $cardInDuelStore
        } else {
        }
    }
</script>

<section id="board">
    <div id="tryArea" style="width:{tryAreaWidth}px; height:{tryAreaHeight}px;">
        <TryAreaComponent bind:countItems={tryListLength} />
    </div>
    <div id="playArea" />

    {#each $cardInDuelStore as card}
        <Handler
            objectId={card.objectId}
            bind:x={card.x}
            bind:y={card.y}
            bind:z={card.z}
            bind:rotate={card.rotate}
            on:moved={cardMovedEventHandler}>
            <Card model={card} scale={card.scale} isFlip={card.flip} />
        </Handler>
    {/each}
    <Button text="draw" on:click={draw} />
    <Button
        text="alignHand"
        on:click={() => {
            alignHand(true)
        }} />
</section>

<style lang="scss">
    #board {
        position: relative;
        width: 100%;
        height: calc(100vh - 100px);
        overflow: hidden;
    }
    #tryArea {
        position: absolute;
        bottom: 200px;
        left: 50%;
        transform: translate(-50%, 0);
        background: green;
    }
</style>
