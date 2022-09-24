<script lang="ts" context="module">
    export function judgeCursorInTheRect(x: number, y: number, rect: DOMRect) {
        const inX = rect.x < x && x < rect.x + rect.width
        const inY = rect.y < y && y < rect.y + rect.height
        return inX && inY ? true : false
    }

    export function objectArrayShuffle(array: object[]): any[] {
        let result = []
        let seqs = [...Array(array.length)].map((_, i) => i)
        seqs.sort(() => Math.random() - 0.5)
        seqs.forEach((num) => {
            result.push(array[num])
        })
        return result
    }
</script>

<script lang="ts">
    import { slotPadding } from '../__layout-synegierAdmin.svelte'
    import { deckStore, cardDetailLeft } from '$lib/store/app/synegierAdmin'
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import Handler from '$lib/component/SynegierAdmin/CardAnimationComponent/Handler.svelte'
    import { onMount } from 'svelte'
    import type { SynegierCardAndPosition, cardMoveEvent } from '$lib/model/app/SynegierAdmin'
    import Button from '$lib/component/SynegierAdmin/UI/Button.svelte'

    // Variant
    let objectIdManager = 1
    let z_index_handler = 0

    let boardRect: DOMRect
    let handAreaRect: DOMRect
    let playAreaRect: DOMRect

    let cardsInDuel: SynegierCardAndPosition[] = []

    let deckList: SynegierCardAndPosition[] = []
    let handList: SynegierCardAndPosition[] = []
    let trashList: SynegierCardAndPosition[] = []
    let isTrashAreaOpen: boolean = false
    let playList: SynegierCardAndPosition[] = []

    // const
    const defaultCardScale = 0.2
    const estimateCardHeight = 120
    const handAreaCardScale = 0.5
    const estimateHandCardHeight = 300
    const handAreaWidth = 1100
    const handAreaHeight = 310
    const playAreaCardScale = 0.1
    const playAreaWidth = 700
    const playAreaHeight = 400
    const trashAreaWidth = 200
    const trashAreaHeight = 400

    onMount(() => {
        boardRect = document.getElementById('board').getBoundingClientRect()
        handAreaRect = document.getElementById('handArea').getBoundingClientRect()
        playAreaRect = document.getElementById('playArea').getBoundingClientRect()
        console.log('boardRect', boardRect)
        console.log('handAreaRect', handAreaRect)
        console.log('playAreaRect', playAreaRect)
        resetDeck()
    })

    function resetDeck() {
        // shuffle
        cardsInDuel = []
        $deckStore = objectArrayShuffle($deckStore)
        $deckStore.forEach((card) => {
            cardsInDuel.push({
                ...card,
                objectId: objectIdManager,
                x: boardRect.width - 50,
                y: boardRect.height - estimateCardHeight * 1.25 - 300,
                z: z_index_handler,
                rotate: 135,
                flip: true,
                scale: defaultCardScale
            })
            z_index_handler += 1
            objectIdManager += 1
        })
        cardsInDuel = cardsInDuel
        deckList = Object.assign([], cardsInDuel)
    }

    function trashReflesh() {
        trashList = objectArrayShuffle(trashList)
        trashList.forEach((cInT) => {
            cardsInDuel.forEach((cInD) => {
                if (cInD.objectId == cInT.objectId) {
                    ;(cInD.x = boardRect.width - 50),
                        (cInD.y = boardRect.height - estimateCardHeight * 1.25),
                        (cInD.z = z_index_handler),
                        (cInD.rotate = 135),
                        (cInD.flip = true),
                        (cInD.scale = defaultCardScale)
                    z_index_handler += 1
                }
            })
            deckList.unshift(cInT)
        })
        cardsInDuel = cardsInDuel
        trashList = []
    }

    function draw() {
        if (deckList.length > 0) {
            let card = deckList.pop()
            cardsInDuel.forEach((c) => {
                if (c.objectId == card.objectId) {
                    handList.push(c)
                }
            })
            alignHand()
        }
    }

    function alignHand() {
        const handListObjectIds = handList.map((hand) => hand.objectId)
        const _handAreaMargin = handAreaWidth / handListObjectIds.length
        const handAreaMargin = _handAreaMargin > 200 ? 200 : _handAreaMargin

        let index = 0
        
        handList.forEach((c) => {
            if (handListObjectIds.includes(c.objectId)) {
                c.x = handAreaRect.left + index * handAreaMargin
                c.y = boardRect.height - estimateHandCardHeight - 30
                c.rotate = 0
                c.flip = false
                c.z = index
                index += 1
                c.scale = handAreaCardScale
            }
        })
        cardsInDuel = cardsInDuel
    }

    function alignPlayList() {
        const playListObjectIds = playList.map((card) => card.objectId)
        const _playAreaMarginList = []
        for (let i = 0; i < playListObjectIds.length; i++) {
            _playAreaMarginList.push(
                (200 / (playListObjectIds.length + 1)) * (i + 1) +
                    (playAreaRect.left + playAreaRect.right) / 2 -
                    120
            )
        }
        let index = 0
        playList.forEach((c) => {
            if (playListObjectIds.includes(c.objectId)) {
                c.x = _playAreaMarginList[index]
                c.y = 0
                c.rotate = 0
                c.flip = false
                c.z = index
                c.scale = playAreaCardScale
                index += 1
            }
        })
        cardsInDuel = cardsInDuel
    }

    function cardMovedEventHandler(event: CustomEvent) {
        const moveEvent: cardMoveEvent = event.detail
        
        // playAreaに入ったか判定
        if (
            judgeCursorInTheRect(
                moveEvent.mouseEvent.clientX,
                moveEvent.mouseEvent.clientY,
                playAreaRect
            )
        ) {
            cardsInDuel.forEach((c) => {
                if (c.objectId == moveEvent.objectId) {
                    if (playList.filter((c) => c.objectId == moveEvent.objectId).length == 0) {
                        playList.push(c)
                        handList = handList.filter((c) => c.objectId != moveEvent.objectId)
                        // Detailモーダルを出す
                        $cardDetailLeft = Object.assign({}, c)
                    }
                }
            })
            alignPlayList()
        } else {
            cardsInDuel.forEach((c) => {
                if (c.objectId == moveEvent.objectId) {
                    if (handList.filter((c) => c.objectId == moveEvent.objectId).length == 0) {
                        handList.push(c)
                        playList = playList.filter((c) => c.objectId != moveEvent.objectId)
                    }
                }
            })
            
            cardsInDuel.forEach((c) => {
                if (c.objectId == moveEvent.objectId) {
                    if (handList.filter((c) => c.objectId == moveEvent.objectId).length == 0) {
                        handList.push(c)
                        playList = playList.filter((c) => c.objectId != moveEvent.objectId)
                    }
                    c.y = boardRect.height - estimateHandCardHeight - 30
                    c.scale = handAreaCardScale
                }
            })
            cardsInDuel = cardsInDuel
            // alignHand()
        }
    }

    function turnEnd() {
        playList.forEach((card) => {
            card.x = -200
            card.y = 100
            trashList.push(card)
        })
        trashList = trashList
        cardsInDuel = cardsInDuel
        playList = []
        $cardDetailLeft = undefined
    }
</script>

<section id="board">
    <div id="handArea" style="width:{handAreaWidth}px; height:{handAreaHeight}px;" />
    <div id="playArea" style="width:{playAreaWidth}px; height:{playAreaHeight}px;" />
    <div
        id="trashArea"
        class={isTrashAreaOpen ? 'open' : ''}
        style="--width:{trashAreaWidth}px; --height:{trashAreaHeight}px; width:var(--width); height:var(--height)">
        <div />
        <div
            id="trashAreaButton"
            on:click={() => {
                isTrashAreaOpen = !isTrashAreaOpen
            }}>
            <img src="/img/synegierAdmin/trashIcon.svg" alt="trash" />
        </div>
        {#each trashList as card}
            <div style="margin:2px;">
                <Card model={card} scale={0.1} />
            </div>
        {/each}
        <div id="trashRefleshButton" on:click={trashReflesh}>refresh</div>
    </div>

    {#each cardsInDuel as card}
        <Handler
            objectId={card.objectId}
            bind:x={card.x}
            bind:y={card.y}
            bind:z={card.z}
            bind:rotate={card.rotate}
            on:moved={cardMovedEventHandler}>
            <Card model={card} scale={card.scale} isFlip={card.flip} fixedSideOfShowDetail="left" />
        </Handler>
    {/each}
    <div id="handUI">
        <div id="drawButton">
            <Button size={100} text="draw" on:click={draw} />
        </div>
        <div id="resetButton">
            <Button
                size={80}
                text="align"
                on:click={() => {
                    alignHand()
                }} />
        </div>
    </div>
    <div id="deckUI" />
    <div id="turnManagerUI">
        <div id="battleButton">
            <Button
                size={100}
                text="Battle!"
                on:click={() => {
                    turnEnd()
                }} />
        </div>
        <div id="shopButton">
            <Button
                size={100}
                text="Shop"
                on:click={() => {
                    turnEnd()
                }} />
        </div>
        <div id="turnendButton">
            <Button
                size={150}
                text="turnend"
                on:click={() => {
                    turnEnd()
                }} />
        </div>
    </div>
</section>

<style lang="scss">
    #board {
        position: relative;
        width: 100%;
        height: calc(100vh - 100px);
        overflow: hidden;
    }
    #handArea {
        position: absolute;
        bottom: 20px;
        left: 50px;
        // transform: translate(-50%, 0);
        border-top: solid white 2px;
        border-bottom: solid white 2px;
        border-radius: 7px;
    }
    #playArea {
        position: absolute;
        bottom: 370px;
        left: 50%;
        transform: translate(-50%, 0);
        border-radius: 10px;
    }

    #trashArea {
        position: absolute;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        top: 0px;
        left: calc(-1 * var(--width));
        background: rgba(#222222, 0.85);
        transition: 0.1s;
        &.open {
            left: 20px;
        }
        #trashAreaButton {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 70px;
            top: 30px;
            right: -60px;
            background: rgba(#222222, 0.85);
            img {
                width: 30px;
            }
        }
        #trashRefleshButton {
            position: absolute;
            bottom: 10px;
            right: 10px;
            cursor: pointer;
            &:hover {
                color: #eebe00;
            }
        }
    }
    #handUI {
        z-index: 10001;
        position: absolute;
        bottom: 500px;
        right: 250px;
        #drawButton {
            position: absolute;
            left: 55px;
            top: 70px;
        }
        #resetButton {
            position: absolute;
        }
    }
    #deckUI {
        z-index: 10000;
        position: absolute;
        bottom: 300px;
        right: 0;
        width: 200px;
        height: 300px;
    }
    #turnManagerUI {
        z-index: 10002;
        position: absolute;
        bottom: 460px;
        right: 20px;
        #battleButton {
            position: absolute;
            right: 105px;
            bottom: 140px;
        }
        #shopButton {
            position: absolute;
            right: 25px;
            bottom: 220px;
        }
    }
</style>
