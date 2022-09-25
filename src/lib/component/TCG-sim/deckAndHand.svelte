<script context="module" lang="ts">
    import type { deckCardModel } from '$lib/model/app/TCGsimModel'
    import FukidashiConponent from '$lib/component/PokecaEffector/FukidashiConponent.svelte'

    export function deckAlineX(i: number) {
        return i * -0.25 + 15
    }
    export function deckAlineY(i: number) {
        return i * -0.5 - 45
    }
    export function deckShuffle(array: deckCardModel[]): Promise<deckCardModel[]> {
        return new Promise(function (resolve, reject) {
            let list = Object.assign([], array)
            let newlist: deckCardModel[] = []
            while (list.length > 0) {
                const n = list.length
                let k = Math.floor(Math.random() * n)
                newlist.push(list[k])
                list.splice(k, 1)
            }
            // デッキの位置を整形
            let i = 0
            newlist.forEach((item) => {
                ;(item.x = deckAlineX(i)), (item.y = deckAlineY(i)), (item.flip = true)
                i += 1
            })
            resolve(newlist)
        })
    }
    export function asyncDeckShuffle(array: deckCardModel[]): deckCardModel[] {
        let list = Object.assign([], array)
        let newlist: deckCardModel[] = []
        while (list.length > 0) {
            const n = list.length
            let k = Math.floor(Math.random() * n)
            newlist.push(list[k])
            list.splice(k, 1)
        }
        // デッキの位置を整形
        let i = 0
        newlist.forEach((item) => {
            ;(item.x = deckAlineX(i)), (item.y = deckAlineY(i)), (item.flip = true)
            i += 1
        })
        return newlist
    }
</script>

<script lang="ts">
    import Card from './card.svelte'
    import { onMount } from 'svelte'
    import { deckListStore, modeStore, handListStore, cardWidth, handAreaInfoStore, boardListStore, unshuffleDeckListStore } from '$lib/store/app/TCGsimStore'
    import type { handCardModel } from '$lib/model/app/TCGsimModel'
    import { cardInAnywhere, cardOutAnywhere } from '$lib/component/TCG-sim/util.svelte'

    let deckOpen = false
    let continueDeckCenterAction = 0
    let continueDeckTopAction = 0
    let deckFukidashiRollIn = false
    let shufflingMessage = ''
    let isUntouchDeck = false
    let z_index_controller = 0

    const handLineupGuideRadius = 250

    //手札を整列させる関数
    function handLineUp() {
        let hand = $handListStore.filter((card) => card)
        const handLen = hand.length
        const x_offset = ($handAreaInfoStore.left + $handAreaInfoStore.right) / 2 - $cardWidth
        let xSpacing = (handLineupGuideRadius * 2 - 150) / handLen
        let degSpaning = 100 / handLen
        if (xSpacing > 50) {
            xSpacing = 50
        }
        if (degSpaning > 20) {
            degSpaning = 20
        }
        let temp: handCardModel[] = []
        for (let i = 0; i < handLen; i++) {
            // handがundefinedではないなら以下の整理を行う。
            if (hand[i]) {
                const x = xSpacing * (i - handLen / 2 + 0.5)
                const y = -1 * Math.sqrt(Math.pow(handLineupGuideRadius, 2) - Math.pow(x, 2))
                const deg = (i - Math.floor(handLen / 2)) * degSpaning
                temp.push({
                    id: hand[i].id,
                    url: hand[i].url,
                    burl: hand[i].burl,
                    x: x - $cardWidth / 2 + x_offset,
                    y: y + 220,
                    z: 0,
                    rotate: deg,
                    flip: false
                })
            } else {
                temp.push(undefined)
            }
        }
        $handListStore = temp
    }

    function cardBoardInFromHand(event) {
        const id = event.detail.id
        const position = event.detail.position
        const flippin = event.detail.flip

        // 手札から指定カードを抜き出す。
        const target = $handListStore.filter((card) => card.id == id).pop()
        $handListStore = cardOutAnywhere(target.id, $handListStore)
        // $handListStore = $handListStore.filter(card => card.id != id)

        // 盤面上にカードを配置
        $boardListStore = [
            ...$boardListStore,
            {
                ...target,
                x: position.top - $cardWidth,
                y: position.left,
                z: 0,
                flip: flippin,
                rotate: 0
            }
        ]
        handLineUp()
    }
    //デッキの一覧を表示する。
    function deckTopAction() {
        if (deckOpen) {
            deckResetAction()
            deckOpen = false
        } else {
            let i = 0
            continueDeckCenterAction = 0
            deckOpen = true
            // 山札のカードを、画面上にバーっと並べる。
            const game_width = document.getElementById('base').getBoundingClientRect().width
            const deck_top_position = document
                .getElementsByClassName(`card-id-${$deckListStore[$deckListStore.length - 1].id}`)
                .item(0)
                .getBoundingClientRect()
            const basis_mod = Math.floor(game_width / deck_top_position.width)
            $deckListStore.forEach((item) => {
                const basic_x_pos = (i % basis_mod) * deck_top_position.width
                const basic_y_pos = -1 * deck_top_position.top + deck_top_position.height * Math.floor(i / basis_mod)
                item.x = basic_x_pos
                item.y = basic_y_pos
                item.flip = false
                i += 1
            })
            $deckListStore = $deckListStore
        }
    }

    function cardHandInFromDeck(event) {
        const id = event.detail.id
        const target = $deckListStore.filter((card) => card.id == id).pop()
        $deckListStore = $deckListStore.filter((card) => card.id != id)
        $handListStore = [...$handListStore, target]
        handLineUp()
    }

    function cardBoardInFromDeck(event) {
        const id = event.detail.id
        const position = event.detail.position
        const target = $deckListStore
            .filter((card) => {
                if (card) {
                    return card.id == id
                } else {
                    return false
                }
            })
            .pop()

        $deckListStore = cardOutAnywhere(id, $deckListStore)
        $boardListStore = cardInAnywhere({ ...target, x: position.top - $cardWidth, y: position.left, z: 0, rotate: 0 }, $boardListStore)
    }

    // ドロー
    function draw() {
        let top = null
        let count = 0
        while (true) {
            if (count > 100) {
                break
            } //安全策
            if ($deckListStore.length == 0) {
                break
            }
            top = $deckListStore.pop()
            if (top) {
                break
            }
            count += 1
        }
        if (top) {
            $deckListStore = $deckListStore
            $handListStore.push(top)
            $handListStore = $handListStore
            handLineUp()
        }
    }

    function deckAline(decklist: deckCardModel[]) {
        let i = 0
        decklist.forEach((item) => {
            ;(item.x = deckAlineX(i)), (item.y = deckAlineY(i)), (item.flip = true)
            item.rotate = 0
            i += 1
        })
        return decklist
    }

    function deckResetAction() {
        let decklist = $deckListStore.filter((item) => item)
        if (continueDeckCenterAction == 0) {
            deckOpen = false
            continueDeckCenterAction += 1
            $deckListStore = deckAline(decklist)
        } else {
            deckFukidashiRollIn = false
            console.log('shuffle')
            isUntouchDeck = true

            //　配列入れ替え
            $deckListStore = asyncDeckShuffle(decklist)
            window.setTimeout(() => {
                isUntouchDeck = false
                shufflingMessage = 'Done!'
                deckFukidashiRollIn = true
            }, 1000)
        }
    }

    function allHandsGoToDeck() {
        const deckLen = $unshuffleDeckListStore.length
        let i = $deckListStore.length
        let handlist = $handListStore.filter((card) => card)

        handlist.forEach((card) => {
            card.x = deckAlineX(deckLen - i)
            card.y = deckAlineY(deckLen - i)
            card.flip = true
            card.rotate = 0
            i += 1
        })
        $deckListStore = handlist.concat($deckListStore)
        $handListStore = []
        $deckListStore = $deckListStore
    }

    function deckInfromHand(event) {
        const id = event.detail.id
        const target: deckCardModel = {
            ...$handListStore.filter((card) => card.id == id).pop(),
            x: 0,
            y: 0,
            flip: true,
            rotate: 0
        }
        $handListStore = $handListStore.filter((card) => card.id != id)
        if (event.detail.post == 'top') {
            $deckListStore = [...$deckListStore, target]
        } else if (event.detail.post == 'bottom') {
            $deckListStore = [target, ...$deckListStore]
        }
    }

    onMount(() => {
        //以下はセットで実行
        deckResetAction()
    })
</script>

<div id="handArea">
    <div id="handArea-radius">
        <div
            id="handArea-radius-left"
            on:click={() => {
                allHandsGoToDeck()
            }} />
        <div
            id="handArea-radius-right"
            on:click={() => {
                handLineUp()
            }} />
    </div>
</div>

{#each $handListStore as h}
    {#if h}
        <Card
            id={h.id}
            pos_x={h.x}
            pos_y={h.y}
            rotate={h.rotate}
            onArea={'hand'}
            img_url={h.url}
            sleeve_url={h.burl}
            flippin={h.flip}
            on:boardIn={cardBoardInFromHand}
            on:deckIn={deckInfromHand} />
    {/if}
{/each}

{#if deckOpen}
    <div id="deck-open-filter" />
{/if}

<section id="deckArea" class={$modeStore}>
    <div class="deckbottom">
        <div class="round">
            <div class="round-top" on:click={deckTopAction} />
            <div class="round-center" on:click={deckResetAction} />
            <div class="round-bottom" on:click={draw} />
        </div>
    </div>
    <div class="fukidashi">
        <FukidashiConponent width={180} left_roll_in={deckFukidashiRollIn}>
            <p>{shufflingMessage}</p>
        </FukidashiConponent>
    </div>
</section>
{#each $deckListStore as d, i}
    {#if d}
        <Card
            id={d.id}
            pos_x={d.x + i * -0.25 + 15}
            pos_y={d.y}
            flippin={d.flip}
            onArea={'deck'}
            img_url={d.url}
            sleeve_url={d.burl}
            rotate={d.rotate}
            noGuide={true}
            on:move={() => {
                continueDeckCenterAction = 0
            }}
            on:handIn={cardHandInFromDeck}
            on:boardIn={cardBoardInFromDeck} />
    {/if}
{/each}

<style lang="scss">
    #handArea {
        position: absolute;
        margin: 0 auto;
        --width: 700px;
        width: var(--width);
        height: 100%;
        left: calc(60% - (var(--width) / 2));
        bottom: 0;
        overflow: hidden;
        #handArea-radius {
            position: absolute;
            user-select: none;
            top: 70px;
            margin: 0 auto;
            width: inherit;
            height: var(--width);
            border-radius: calc(var(--width) / 2);
            overflow: hidden;
            #handArea-radius-left {
                position: absolute;
                width: 50%;
                height: 100%;
                background: #1d28c0;
            }
            #handArea-radius-right {
                position: absolute;
                right: 0;
                width: 50%;
                height: 100%;
                background: #081081;
            }
        }
    }
    #deck-open-filter {
        position: fixed;
        top: -300px;
        left: 0;
        background: radial-gradient(ellipse, rgba(#ffffff, 1) 0%, rgba(#ffffff, 0) 80%);
        width: 100%;
        height: 900px;
    }
    #deckArea {
        position: absolute;
        --round-len: 300px;
        width: calc(var(--round-len) / 2);
        height: var(--round-len);
        bottom: 0;
        --deck-bg-color-top: #0a2ea5;
        --deck-bg-color-center: #83a0ff;
        --deck-bg-color-bottom: #130069;

        .deckbottom {
            position: absolute;
            width: inherit;
            height: inherit;
            bottom: 0;
            left: 0;
            overflow: hidden;
            .round {
                position: absolute;
                right: 0;
                width: var(--round-len);
                height: var(--round-len);
                border-radius: 200px;
                overflow: hidden;
                .round-top,
                .round-center,
                .round-bottom {
                    position: absolute;
                    width: var(--round-len);
                    height: calc(var(--round-len) / 3);
                    &:hover {
                        background: #ffde37;
                    }
                }
                .round-top {
                    top: 0;
                    background: var(--deck-bg-color-top);
                }
                .round-center {
                    top: 50%;
                    transform: translate(0, -50%);
                    background: var(--deck-bg-color-center);
                }
                .round-bottom {
                    bottom: 0;
                    background: var(--deck-bg-color-bottom);
                }
            }
        }
        .fukidashi {
            font-family: 'Press Start 2P', cursive;
            user-select: none;
            position: absolute;
            top: -50px;
            left: 100px;
        }
    }

    // #deckUntouchMask {
    //     position: absolute;
    //     background: white;
    //     z-index: 100;
    //     width: 200px;
    //     height: 350px;
    //     top: -100px;
    // }
</style>
