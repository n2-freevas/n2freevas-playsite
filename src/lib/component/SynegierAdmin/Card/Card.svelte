<script lang="ts" context="module">
    import { processingMovement, processingEffect } from '$lib/store/app/synegierAdmin'
    import type { cardModel } from '$lib/model/app/TCGsimModel'

    // カードデータからprocessingEffectStoreにデータを代入する処理
    export function movementProcess(card: SynegierCard) {
        processingMovement.set(card.movement)
    }

    export function movementProcessed(x: number, y: number) {}
</script>

<script lang="ts">
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { onMount } from 'svelte'
    import Movement from './_Movement.svelte'
    import SynegierText from './_SynegierText.svelte'
    import { cardDetailLeft, cardDetailRight } from '$lib/store/app/synegierAdmin'

    export let model: SynegierCard
    export let scale: number = 1
    export let isFlip: boolean = false
    export let fixedSideOfShowDetail: 'left' | 'right' | undefined = undefined

    let showText: boolean = true
    let isMouseOver: boolean = false

    let sideOfShowDetail: 'left' | 'right' = 'left'
    let selfElement: HTMLDivElement
    $: {
        if (scale < 0.45) {
            showText = false
        } else {
            showText = true
        }
    }
    onMount(() => {
        sideOfShowDetail = window.innerWidth / 2 < selfElement.getBoundingClientRect().x ? 'left' : 'right'
    })
    function rightClickHandler(event) {
        let _event: PointerEvent = event
        if ($cardDetailLeft) {
            if ($cardDetailLeft.name == model.name) {
                cardDetailHide()
                return null
            }
        } else if ($cardDetailRight) {
            if ($cardDetailRight.name == model.name) {
                cardDetailHide()
                return null
            }
        }
        try {
            sideOfShowDetail = window.innerWidth / 2 < _event.x ? 'left' : 'right'
            cardDetailShow()
        } catch (e) {
            console.log(e)
            return null
        }
    }
    function mouseEnterHandler() {
        isMouseOver = true
    }
    function mouseLeaveHandler() {
        isMouseOver = false
        // window.setTimeout(() => {
        //     if (!isMouseOver) {
        //         cardDetailHide()
        //     }
        // }, 200)
    }
    function cardDetailShow() {
        if (fixedSideOfShowDetail == 'left') {
            $cardDetailRight = undefined
            $cardDetailLeft = model
        } else if (fixedSideOfShowDetail == 'right') {
            $cardDetailLeft = undefined
            $cardDetailRight = model
        } else {
            if (sideOfShowDetail == 'left') {
                $cardDetailRight = undefined
                $cardDetailLeft = model
            } else {
                $cardDetailLeft = undefined
                $cardDetailRight = model
            }
        }
    }
    function cardDetailHide() {
        $cardDetailLeft = undefined
        $cardDetailRight = undefined
    }
</script>

<div class="card" style="--scale:{scale}" on:contextmenu|preventDefault={rightClickHandler} on:mouseenter={mouseEnterHandler} on:mouseleave={mouseLeaveHandler}>
    <div class="cardBody {isMouseOver ? 'hover' : ''}" bind:this={selfElement}>
        <div class="cardFront {isFlip ? 'flip' : ''}">
            <div class="backgroundFrame {model.rarity}" />
            <img class="inCardBody" src={model.img} alt="" />
            <div class="cardInfo">
                <div class="cardTopInfo">
                    <div class="cost {model.rarity}">
                        {#if scale >= 0.2}{model.cost}{/if}
                    </div>
                    <div class="name">
                        <p class="wrap">
                            {#if showText}{model.name}{/if}
                        </p>
                    </div>
                </div>
                <SynegierText synegierText={model.synegierText} showText={showText} scale={scale} />
                <div class="cardBottomInfo">
                    <div class="textInfo">
                        <p>
                            {#if showText}{@html model.text}{/if}
                        </p>
                    </div>
                    <Movement movement={model.movement} redTiles={model.redTiles} scale={scale} />
                </div>
            </div>
        </div>
        <div class="cardBack {isFlip ? 'flip' : ''}">
            <img src="/img/SynegierAdmin/basic_sleeve.png" alt="" />
        </div>
    </div>
</div>

<style lang="scss">
    .card {
        user-select: none;
        --C_colorRule: linear-gradient(0, #b8b8b8, #e2e2e2);
        --R_colorRule: linear-gradient(0, #89c6ff, #bc9cff);
        --SR_colorRule: linear-gradient(0, #ffc700, #ffe600);
        --LR_colorRule_cost: conic-gradient(from 180deg at 50% 50%, #c750ff 0%, #ff6f6f 10%, #ffe976 34%, #fffb72 53%, #4df4ff 71%, #c750ff 100%);
        --LR_colorRule_frame: conic-gradient(from 180deg at 50% 50%, #5b7dff 0%, #b157ff 15%, #ff5b5b 42%, #ffd600 60%, #31ffce 71%, #5b7dff 100%);
        --w: 378px;
        --h: 600px;
        width: calc(var(--w) * var(--scale));
        height: calc(var(--h) * var(--scale));
        --b: 9px;
        --c: 70px;
        --synegierTextWidth: 320px;
        --synegierTextHeight: 45px;
        --synegierTextRibbonWidth: 22px;
        --synegierTextMargin: calc((20px) + var(--synegierTextHeight));
        --fontsize: 10px;
        --costFontSize: 32px;
        --nameBarWidth: calc(var(--w) * 0.67);
        --cardSpacing25: calc(var(--h) / 24);
        --cardSpacing20: calc(var(--h) / 30);
        --cardSpacing15: calc(var(--h) * 0.025);
        --cardSpacing10: calc(var(--h) / 60);
        --cardSpacing05: calc(var(--h) / 120);
        --basicTextWidth: 340px;
        --basicTextHeight: 140px;
        --basicTextPadding: 10px;
        //Movement.svelteコンポーネントと共用なので注意
        --movementBoxWidth: 120px;
    }
    .cardBody {
        transform: scale(var(--scale));
        transform-origin: 0 0;
        font-size: var(--fontsize);
        // transform: scale(var(--scale));

        position: relative;
        margin: unset;
        width: var(--w);
        height: var(--h);
        font-family: 'Press Start 2P', cursive;

        &::before {
            content: '';
            z-index: 0;
            position: absolute;
            top: -3%;
            left: -4%;
            width: 108%;
            height: 106%;
            opacity: 0;
            transition: 0.2s;
            border-radius: 3%;
        }
        &.hover {
            &::before {
                opacity: 1;
                background: radial-gradient(rgba(#bbbbbb, 0.8), rgba(#eeeeee, 0.2));
            }
        }

        -moz-perspective: 500;
        -webkit-perspective: 500;
        -o-perspective: 500;
        -ms-perspective: 500;
        perspective: 500;

        .cardFront,
        .cardBack {
            position: absolute;
            width: inherit;
            height: inherit;
            z-index: 100;
            transition: 0.2s;
            transform: rotateY(0deg);
        }
        .cardFront {
            &.flip {
                transform: rotateY(180deg);
            }
        }
        .cardBack {
            transform: rotateY(-180deg);
            backface-visibility: hidden;
            img {
                width: inherit;
                image-rendering: pixelated;
                -webkit-user-drag: none;
            }
            &.flip {
                transform: rotateY(0deg);
            }
        }
    }

    .backgroundFrame {
        position: absolute;
        width: inherit;
        z-index: 2;
        height: inherit;
        &.C {
            background: var(--C_colorRule);
        }
        &.R {
            background: var(--R_colorRule);
        }
        &.SR {
            background: var(--SR_colorRule);
        }
        &.LE {
            background: var(--LR_colorRule_frame);
        }
    }
    img {
        &.inCardBody {
            position: absolute;
            z-index: 2;
            border-radius: calc(var(--b) * 2);
            width: calc(var(--w) - (var(--b) * 2));
            height: calc(var(--h) - (var(--b) * 2));
            top: var(--b);
            left: var(--b);
        }
        image-rendering: pixelated;
    }
    .cardInfo {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width: inherit;
        height: inherit;
        .cardTopInfo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--cardSpacing20) var(--cardSpacing15);
            text-align: center;
            .cost {
                width: var(--c);
                height: var(--c);
                border-radius: calc(var(--c) / 2);
                line-height: var(--c);
                font-size: var(--costFontSize);
                &.C {
                    color: black;
                    background: var(--C_colorRule);
                }
                &.R {
                    color: white;
                    background: var(--R_colorRule);
                }
                &.SR {
                    color: white;
                    text-shadow: 3px 3px 0px #ff8a00;
                    background: var(--SR_colorRule);
                }
                &.LE {
                    color: white;
                    text-shadow: 3px 3px 3px #393939;
                    background: var(--LR_colorRule_cost);
                }
            }
            .name {
                width: var(--nameBarWidth);
                margin-bottom: var(--nameBarMarginBottom);
                background: rgba($color: #000000, $alpha: 0.7);
                padding: 0 var(--cardSpacing10);
                --nameHeight: calc(var(--fontsize) * 2.5);
                height: var(--nameHeight);
                border-radius: var(--nameHeight);
                line-height: var(--nameHeight);
            }
        }
    }
    .cardBottomInfo {
        display: flex;
        width: var(--basicTextWidth);
        height: var(--basicTextHeight);
        background: rgba($color: #000000, $alpha: 0.4);
        margin: var(--cardSpacing25) auto;
        align-items: center;
        justify-content: right;
        padding: 0 var(--basicTextPadding);
        .textInfo {
            display: flex;
            align-items: center;
            width: calc(var(--basicTextWidth) - var(--movementBoxWidth) - (var(--basicTextPadding) * 2));
            padding: var(--cardSpacing15) var(--cardSpacing05);
        }
    }
    p {
        &.wrap {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        // display: block;
        // transform: scale(var(--scale));
        transform-origin: 0 0;
    }
</style>
