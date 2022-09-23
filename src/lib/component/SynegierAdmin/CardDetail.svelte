<script lang="ts">
    import type { SynegierCard, keywordDescription } from '$lib/model/app/SynegierAdmin'
    import keywordText from '$lib/database/synegierAdmin/keywordText.json'
    import Movement from './_Movement.svelte'
    import SynegierText from './_SynegierText.svelte'
    import { cardDetailLeft, cardDetailRight } from '$lib/store/app/synegierAdmin'

    export let isShowDetail: boolean = false
    export let sideOfShowDetail: 'left' | 'right' = 'left'
    export let model: SynegierCard
    let textIncludeDescription = ''
    let keywordDescription: keywordDescription = undefined
    let isShowKeywordDescription: boolean = false

    $: {
        if (isShowDetail) {
            textIncludeDescription = inserKeywordTextDescription(model.text)
        }
    }
    function inserKeywordTextDescription(text: string) {
        const _keywordText = Object.entries(keywordText)
        for (let i = 0; i < _keywordText.length; i++) {
            const _item = _keywordText[i][1] as keywordDescription
            // かっこ()を、エスケープスラッシュ付きかっこ\(\)に置換しつつ正規表現文字列を構成
            const re = new RegExp(_item.regExp.replace('(', '\\(').replace(')', '\\)'), 'g')
            const exec = re.exec(text)
            if (exec) {
                if (exec[0].length != 0) {
                    text = text.replace(
                        exec[0],
                        `<span class=${_keywordText[i][0]} style="text-decoration:underline;color:#e4b700;cursor:pointer;">${exec[0]}</span>`
                    )
                }
            }
        }
        return text
    }

    function showKeywordDescription(event) {
        if (event?.path[0]?.tagName == 'SPAN') {
            const _keywordName = event?.path[0]?.classList[0]
            keywordDescription = keywordText[_keywordName]
            isShowKeywordDescription = true
        }
    }

    function mouseLeaveHandler() {
        window.setTimeout(() => {
            $cardDetailLeft = undefined
            $cardDetailRight = undefined
            isShowKeywordDescription = false
        }, 200)
    }
</script>

<div
    class="cardDetail {isShowDetail ? 'show' : ''} {sideOfShowDetail}"
    on:mouseleave={mouseLeaveHandler}>
    <div class="cardDetailMain">
        <div class="cardDetailLeft">
            <img src={model?.img} alt="" />
        </div>
        <div class="cardDetailRight">
            <div class="cardDetailName">
                <div class="name">{model?.name}</div>
                <div class="cost"><span>{model?.cost}</span>cost</div>
            </div>
            <SynegierText synegierText={model?.synegierText} showText={true} savingShow={true} />
            <div class="cardBottomInfo">
                <div class="textInfo" on:click={showKeywordDescription}>
                    {@html textIncludeDescription}
                </div>
                <Movement
                    movement={model?.movement}
                    redTiles={model?.redTiles}
                    scale={1}
                    showBlankTile={true} />
            </div>
        </div>
    </div>
    <div class="keywordDescription {isShowKeywordDescription ? 'show' : ''}">
        <div class="keywordName">{keywordDescription?.keyword}</div>
        <div class="description">{@html keywordDescription?.description}</div>
        <div class="image">
            {#if keywordDescription?.image}
                <img src={keywordDescription.image} alt="" />
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .cardDetail {
        z-index: 20000;
        --cardDetailWidth: 500px;
        --cardDetailLeftWidth: 150px;
        --cardDetailRightWidth: calc(var(--cardDetailWidth) - var(--cardDetailLeftWidth));
        --cardDetailHeight: 300px;
        font-size: 10px;
        padding: 0 20px 0 0;
        position: fixed;
        user-select: none;
        width: var(--cardDetailWidth);
        background: rgba(#333333, 0.95);
        top: 20%;
        opacity: 0;
        transition: 0.2s;
        &.left {
            left: -100%;
        }
        &.right {
            right: -100%;
        }
        &.show {
            opacity: 1;
            &.left {
                left: 50px;
            }
            &.right {
                right: 50px;
            }
        }
        .cardDetailMain {
            display: flex;
            align-items: flex-start;
            .cardDetailLeft {
                width: 150px;
                padding: 20px 10px;
                img {
                    width: 100%;
                    margin: 0 auto;
                    image-rendering: pixelated;
                    -webkit-user-drag: none;
                }
            }
            .cardDetailRight {
                width: calc(var(--cardDetailWidth) - 150px);
                padding: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                .cardDetailName {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding: 15px 0;
                    .cost {
                        span {
                            margin: 0 3px;
                            font-size: 15px;
                        }
                    }
                    .name {
                        font-size: 14px;
                    }
                }
                .cardBottomInfo {
                    width: 100%;
                    height: 100%;
                    padding: 15px 0;
                    margin: 0;
                    background: none;
                    justify-content: center;
                    display: flex;
                    .textInfo {
                        width: 200px;
                        padding: 10px 10px 10px 0;
                    }
                }
            }
        }
        .keywordDescription {
            // --keywordDescriptionHeight: 300px;
            // height:var(--keywordDescriptionHeight);
            padding: 20px;
            opacity: 0;
            bottom: calc(-1 * var(--keywordDescriptionHeight) - 20px);
            position: absolute;
            transition: 0.2s;
            background: rgba(#111111, 0.95);
            &.show {
                bottom: calc(-1 * var(--keywordDescriptionHeight));
                opacity: 1;
            }
            .keywordName {
                font-size: 15px;
                padding: 5px 0;
            }
            .description {
                padding: 0 10px;
                height: 50px;
                overflow-y: scroll;
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .description::-webkit-scrollbar {
                display: none;
            }
            .image {
                width: 150px;
                img {
                    margin: 10px;
                    width: 100%;
                }
            }
        }
    }
</style>
