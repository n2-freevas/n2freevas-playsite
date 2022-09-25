<script lang="ts" context="module">
    export function judgeCursorInTheRect(x: number, y: number, rect: DOMRect) {
        const inX = rect.x < x && x < rect.x + rect.width
        const inY = rect.y < y && y < rect.y + rect.height
        return inX && inY ? true : false
    }

    export function DOMRectAdjustFromParent(target: DOMRect, parent: DOMRect) {
        target.x = target.x - parent.x
        target.y = target.y - parent.y
        return target
    }

    export function numberArrayShuffle(array: number[]): number[] {
        return array.sort(() => Math.random() - 0.5)
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
    import Card from '$lib/component/SynegierAdmin/Card/Card.svelte'
    import Handler from '$lib/component/SynegierAdmin/CardAnimationComponent/Handler.svelte'
    import Button from '$lib/component/SynegierAdmin/UI/Button.svelte'
    import BattleLog from '$lib/component/SynegierAdmin/UI/DuelLog.svelte'
    import BattleFieldComponent from '$lib/component/SynegierAdmin/UI/BattleField.svelte'
    import easytoast from '$lib/component/toast/summon'
    import { slotPadding } from '../__layout-synegierAdmin.svelte'
    import { deckStore, cardDetailRight } from '$lib/store/app/synegierAdmin'
    import { getBattleFieldDatus } from '$lib/api/app/synegierAdmin'
    import type { SynegierCardAndPosition, cardMoveEvent, BattleField } from '$lib/model/app/SynegierAdmin'
    import { synegierAdminAccessToken } from '$lib/store/app/synegierAdmin'
    import { sleep } from '$lib/util/time'
    import { onMount } from 'svelte'

    export let battleFieldModel: BattleField

    // const
    const boardWidth = 1400
    const boardHeight = 800

    const defaultCardScale = 0.2
    const estimateCardHeight = 140
    const handAreaCardScale = 0.5
    const estimateHandCardHeight = 300
    const handAreaWidth = 1100
    const handAreaHeight = 310
    const closeHandAreaWidth = 300
    const closeHandAreaHeight = 140
    const playAreaCardScale = 0.1
    const playAreaWidth = 800
    const playAreaHeight = 500
    const trashAreaWidth = 200
    const trashAreaHeight = 400

    // Variant
    let objectIdManager = 1
    let z_index_handler = 0

    let boardRect: DOMRect
    let handAreaRect: DOMRect
    let handAreaRectOrigin: DOMRect
    let closeHandAreaRect: DOMRect
    let playAreaRect: DOMRect
    let playAreaRectOrigin: DOMRect

    let cardsInDuel: { [objectId: string]: SynegierCardAndPosition } = {}

    let deckOrder: number[] = []
    let deckDict: { [objectId: string]: SynegierCardAndPosition } = {}

    let handOrder: number[] = []
    let handDict: { [objectId: string]: SynegierCardAndPosition } = {}
    let isHandAreaOpen: boolean = false

    let trashOrder: number[] = []
    let trashDict: { [objectId: string]: SynegierCardAndPosition } = {}
    let isTrashAreaOpen: boolean = false

    let playOrder: number[] = []
    let playDict: { [objectId: string]: SynegierCardAndPosition } = {}

    let turnManager: 'play' | 'battle' | 'turnend' = 'play'

    onMount(async () => {
        // 主要なDOMRectの数値を集計
        boardRect = document.getElementById('board').getBoundingClientRect()
        //handArea関連だけ、デフォルトでElementが畳まれて高さに補正が必要なので修正する
        let _handAreaRectOrigin = document.getElementById('handArea').getBoundingClientRect()
        handAreaRectOrigin = new DOMRect(_handAreaRectOrigin.x, _handAreaRectOrigin.y - handAreaHeight, _handAreaRectOrigin.width, handAreaHeight)
        let _handAreaRect = DOMRectAdjustFromParent(document.getElementById('handArea').getBoundingClientRect(), boardRect)
        handAreaRect = new DOMRect(_handAreaRect.x, _handAreaRect.y - handAreaHeight, _handAreaRect.width, handAreaHeight)
        playAreaRectOrigin = document.getElementById('playArea').getBoundingClientRect()
        playAreaRect = DOMRectAdjustFromParent(document.getElementById('playArea').getBoundingClientRect(), boardRect)
        closeHandAreaRect = DOMRectAdjustFromParent(document.getElementById('closeHandArea').getBoundingClientRect(), boardRect)

        console.log('boardRect', boardRect)
        console.log('handAreaRect', handAreaRect)
        console.log('playAreaRect', playAreaRect)
        console.log('handAreaRectOrigin', handAreaRectOrigin)
        console.log('playAreaRectOrigin', playAreaRectOrigin)
        console.log('closeHandAreaRect', closeHandAreaRect)

        resetDeck()
    })

    /* In Area Action */
    function inHandArea(card: SynegierCardAndPosition) {
        card.inArea = 'hand'
        handOrder.push(card.objectId)
        handDict[card.objectId] = card
        alignHand()
    }
    function inPlayArea(card: SynegierCardAndPosition) {
        card.inArea = 'play'
        playOrder.push(card.objectId)
        playDict[card.objectId] = card
        $cardDetailRight = Object.assign({}, card)
        alignPlayList()
    }
    function inTrashArea(card: SynegierCardAndPosition) {
        card.inArea = 'trash'
        trashOrder.push(card.objectId)
        trashDict[card.objectId] = card
    }
    function insertDeckBottom(card: SynegierCardAndPosition) {
        card.inArea = 'deck'
        deckOrder.unshift(card.objectId)
        deckDict[card.objectId] = card
    }

    /* Usually Action */
    function draw() {
        if (Object.keys(deckDict).length > 0) {
            const order = deckOrder.pop()
            let card = deckDict[order]
            inHandArea(card)
            delete deckDict[order]
        }
    }
    function alignHand() {
        const handLen = Object.keys(handDict).length

        let index = 0
        if (isHandAreaOpen) {
            const _handAreaMargin = handAreaWidth / handLen
            const handAreaMargin = _handAreaMargin > 300 ? 300 : _handAreaMargin
            handOrder.forEach((num) => {
                let c = handDict[num]
                c.x = handAreaRect.x + index * handAreaMargin
                c.y = handAreaRect.y
                c.rotate = 0
                c.flip = false
                c.z = index
                index += 1
                c.scale = handAreaCardScale
                c.inArea = 'hand'
            })
        } else {
            const _handAreaMargin = closeHandAreaWidth / handLen
            const handAreaMargin = _handAreaMargin > 50 ? 50 : _handAreaMargin
            handOrder.forEach((num) => {
                let c = handDict[num]
                c.x = closeHandAreaRect.x - 60 + index * handAreaMargin
                c.y = closeHandAreaRect.y + 10
                c.rotate = 0
                c.flip = false
                c.z = index
                index += 1
                c.scale = defaultCardScale
                c.inArea = 'hand'
            })
        }
        cardsInDuel = cardsInDuel
    }
    function alignPlayList() {
        const playLen = Object.keys(playDict).length
        const _playAreaMarginList = []
        for (let i = 0; i < playLen; i++) {
            _playAreaMarginList.push((250 / (playLen + 1)) * (i + 1) + (playAreaRect.x + 2 + playAreaRect.width) / 2)
        }
        let index = 0
        playOrder.forEach((num) => {
            let c = playDict[num]
            c.x = _playAreaMarginList[index]
            c.y = 30
            c.rotate = 0
            c.flip = false
            c.z = index
            c.scale = playAreaCardScale
            index += 1
            c.inArea = 'play'
        })
        cardsInDuel = cardsInDuel
    }
    function alignDeck() {
        let index = 0
        deckOrder.forEach((num) => {
            let card = deckDict[num]
            card.x = boardRect.width - 30
            card.y = boardRect.height - estimateCardHeight * 1.25 - 300 - index * 15
            card.z = z_index_handler
            card.rotate = 135
            card.flip = true
            card.scale = defaultCardScale
            card.inArea = 'deck'
            z_index_handler += 1
            index += 1
        })
    }
    function handAreaScaleUp() {
        $cardDetailRight = undefined
        isHandAreaOpen = true
        alignHand()
    }
    function handAreaScaleDown() {
        $cardDetailRight = undefined
        isHandAreaOpen = false
        alignHand()
    }
    function resetDeck() {
        cardsInDuel = {}
        deckOrder = numberArrayShuffle([...Array($deckStore.length)].map((_, i) => i + 1))
        deckOrder.forEach((num) => {
            let card = $deckStore[num - 1]
            cardsInDuel[num] = {
                ...card,
                objectId: num,
                x: 0,
                y: 0,
                z: z_index_handler,
                rotate: 0,
                flip: true,
                scale: defaultCardScale,
                inArea: 'deck'
            }
            z_index_handler += 1
            objectIdManager += 1
        })
        deckDict = Object.assign({}, cardsInDuel)
        alignDeck()
        cardsInDuel = cardsInDuel
    }
    function trashReflesh() {
        let shuffledTrashObjectIds = numberArrayShuffle(trashOrder)
        shuffledTrashObjectIds.forEach((num) => {
            insertDeckBottom(trashDict[num])
        })
        trashOrder = []
        trashDict = {}
        alignDeck()
        cardsInDuel = cardsInDuel
    }

    /* Handler */
    function cardMovedEventHandler(event: CustomEvent) {
        const moveEvent: cardMoveEvent = event.detail
        if (judgeCursorInTheRect(moveEvent.mouseEvent.clientX, moveEvent.mouseEvent.clientY, playAreaRectOrigin)) {
            // playAreaに入ろうとする場合
            switch (moveEvent.inArea) {
                case 'hand':
                    inPlayArea(handDict[moveEvent.objectId])
                    handOrder = handOrder.filter((e) => e != moveEvent.objectId)
                    delete handDict[moveEvent.objectId]
                    break
            }
        } else if (judgeCursorInTheRect(moveEvent.mouseEvent.clientX, moveEvent.mouseEvent.clientY, handAreaRectOrigin)) {
            //　手札に入ろうとする場合
            switch (moveEvent.inArea) {
                case 'hand': {
                    let c = handDict[moveEvent.objectId]
                    c.y = handAreaRect.y
                    c.z = z_index_handler
                    z_index_handler += 1
                    cardsInDuel = cardsInDuel
                    break
                }
            }
        } else {
            //どこにも入ろうとしていないなら元の場所に戻る(基本的に手札を操作すれば良い)
            alignHand()
        }
    }
    function battle() {
        turnManager = 'battle'
    }
    async function turnEnd() {
        // playAreaのカードを全てトラッシュへ
        playOrder.forEach((num) => {
            let card = playDict[num]
            card.x = -200
            card.y = 100
            inTrashArea(card)
        })
        // trash移動を描画する
        cardsInDuel = cardsInDuel
        playOrder = []
        playDict = {}
        // CardDetailを消す
        $cardDetailRight = undefined
        // ターンエンド処理:手札が5枚になるまでドローする
        await sleep(300)
        turnManager = 'turnend'
        let requireHands = 5 - handOrder.length
        if (requireHands <= deckOrder.length) {
            for (let i = 0; i < requireHands; i++) {
                window.setTimeout(draw, (i + 1) * 200)
            }
        } else {
            // デッキの枚数が足りないならトラッシュリフレッシュの後にドローする。
            trashReflesh()
            await sleep(300)
            for (let i = 0; i < requireHands; i++) {
                window.setTimeout(draw, (i + 1) * 200)
            }
        }
    }
    function turnStart() {
        turnManager = 'play'
    }
    function boardClickHandler(event) {
        let id: string
        try {
            id = event.path[0].id
        } catch {
            id = 'default'
        }
        if (id == '') {
            return null
        }
        console.log(id)
        switch (id) {
            case 'closeHandArea':
                if (isHandAreaOpen) {
                    handAreaScaleDown()
                } else {
                    handAreaScaleUp()
                }
                break
            case 'handArea':
                if (isHandAreaOpen) {
                    handAreaScaleDown()
                } else {
                    handAreaScaleUp()
                }
                break
            case 'playArea':
                handAreaScaleDown()
                break
            default:
                handAreaScaleDown()
                break
        }
    }
</script>

<section id="board" style="width:{boardWidth}px; height:{boardHeight}px;" on:dblclick|stopPropagation={boardClickHandler}>
    <div id="playArea" style="width:{playAreaWidth}px; height:{playAreaHeight}px;" />
    <div id="battleField">
        <BattleFieldComponent model={battleFieldModel} on:dblclick={boardClickHandler} />
    </div>
    <div id="handArea" class={isHandAreaOpen ? 'open' : ''} style="--width:{handAreaWidth}px; --height:{handAreaHeight}px;" />
    <div id="closeHandArea" style="width:{closeHandAreaWidth}px; height:{closeHandAreaHeight}px;" />

    <div
        id="trashArea"
        class={isTrashAreaOpen ? 'open' : ''}
        style="--width:{trashAreaWidth}px; --height:{trashAreaHeight}px; width:var(--width); height:var(--height)">
        <div
            id="trashAreaButton"
            on:click={() => {
                isTrashAreaOpen = !isTrashAreaOpen
            }}>
            <img src="/img/synegierAdmin/trashIcon.svg" alt="trash" />
        </div>
        {#each Object.entries(trashDict) as [_, card]}
            <div style="margin:2px;">
                <Card model={card} scale={0.1} />
            </div>
        {/each}
        <div id="trashRefleshButton" on:click={trashReflesh}>refresh</div>
    </div>
    <div id="logMenu">
        <BattleLog />
    </div>

    {#each Object.entries(cardsInDuel) as [_, card]}
        <Handler
            objectId={card.objectId}
            inArea={card.inArea}
            lock={card.inArea != 'hand'}
            bind:x={card.x}
            bind:y={card.y}
            bind:z={card.z}
            bind:rotate={card.rotate}
            on:moved={cardMovedEventHandler}>
            <Card model={card} scale={card.scale} isFlip={card.flip} fixedSideOfShowDetail="right" />
        </Handler>
    {/each}
    <div id="handUI">
        <div id="drawButton">
            <Button size={100} text="draw" on:click={draw} />
        </div>
    </div>
    <div id="turnManagerUI">
        <div class="phaseButton {turnManager == 'play' ? 'show' : ''}">
            <Button
                size={180}
                fontsize={20}
                text="Battle!"
                on:click={() => {
                    battle()
                }} />
        </div>
        <div class="phaseButton {turnManager == 'battle' ? 'show' : ''}">
            <Button
                size={180}
                fontsize={20}
                text="Turn<br>End"
                on:click={() => {
                    turnEnd()
                }} />
        </div>
        <div class="phaseButton {turnManager == 'turnend' ? 'show' : ''}">
            <Button
                size={180}
                fontsize={20}
                text="Turn<br>Start"
                on:click={() => {
                    turnStart()
                }} />
        </div>
    </div>
</section>

<style lang="scss">
    #board {
        position: relative;
        height: calc(100vh - 100px);
        overflow: hidden;
        margin: 0 auto;
    }
    #handArea,
    #closeHandArea {
        position: absolute;
        bottom: 20px;
        right: 300px;
        // transform: translate(-50%, 0);
    }
    #handArea {
        transition: 0.1s;
        border-top: solid white 2px;
        border-bottom: solid white 2px;
        width: var(--width);
        height: 20px;
        background: rgba(#222222, 0.8);
        &.open {
            height: var(--height);
        }
    }
    #playArea {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
    }
    #battleField {
        position: relative;
        width: 90%;
        height: inherit;
        overflow: hidden;
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
        z-index: 101;
        position: absolute;
        bottom: 430px;
        right: 250px;
        #drawButton {
            position: absolute;
            left: 55px;
            top: 70px;
        }
    }
    #turnManagerUI {
        position: absolute;
        z-index: 102;
        bottom: 30px;
        right: 30px;
        .phaseButton {
            display: none;
            &.show {
                display: unset;
            }
        }
    }
</style>
