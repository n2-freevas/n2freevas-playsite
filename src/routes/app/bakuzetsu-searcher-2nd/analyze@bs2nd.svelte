<script lang="ts">
    import { onMount } from 'svelte'
    import { getAdvents, getAdventsUsingFilter, getAdventBanmen, getSearchAnswer } from '$lib/api/app/bs2ndApi'
    import {
        adventStore,
        adventFilterConditionStore,
        adventElemStore,
        adventTargetStore,
        adventBanmenStore,
        deckStore,
        mojiLengthConfigStore
    } from '$lib/store/app/bs2ndStore'
    import { ElemEngDict, AdventNumDict, advent, banmenAnswer, targetKana, answer } from '$lib/model/app/Bs2ndModel'
    import Advent from '$lib/component/bs2nd/advent.svelte'
    import InfiniteScroll from '$lib/component/InfiniteScroll.svelte'
    import Bs2ndLoader from '$lib/component/Loader/bs2ndLoader.svelte'
    import easytoast from '$lib/component/toast/summon'

    let isInfiniteScrollLoading = false
    let isfilterLoading = false
    let ispickUpAdventLoading = false
    let isBanmenSearching = false
    let isActiveAnswerBox = false
    let target_kana: targetKana[] = []
    let answerCount: number = 0
    let answerList: answer[] = []

    onMount(async () => {
        $adventStore = await getAdvents(0, $adventFilterConditionStore.limit)
        $deckStore.forEach((unit) => {
            unit.word.forEach((w) => {
                let insertFlg = true
                target_kana.forEach((tk) => {
                    if (tk.kana == w) {
                        tk.count += 1
                        insertFlg = false
                    }
                })
                if (insertFlg) {
                    target_kana.push({
                        kana: w,
                        count: 1
                    })
                }
            })
        })
        console.log(target_kana)
    })

    function elemClickHandler(id) {
        for (let i = 0; i < $adventElemStore.length; i++) {
            if ($adventElemStore[i].id == id) {
                $adventElemStore[i].active = $adventElemStore[i].active ? false : true
                break
            }
        }
    }

    async function scrollAdventsListHandler() {
        if (!isInfiniteScrollLoading) {
            console.log($adventFilterConditionStore)
            isInfiniteScrollLoading = true
            $adventFilterConditionStore.offset += $adventFilterConditionStore.limit
            let list = undefined
            if ($adventFilterConditionStore.elem.length == 0) {
                list = await getAdvents($adventFilterConditionStore.offset, $adventFilterConditionStore.limit)
            } else {
                list = await getAdventsUsingFilter($adventFilterConditionStore.offset, $adventFilterConditionStore.limit, $adventFilterConditionStore.elem)
            }
            $adventStore = $adventStore.concat(list)
            isInfiniteScrollLoading = false
        }
    }

    async function filterAdventButtonHandler() {
        if (!isfilterLoading) {
            isfilterLoading = true
            $adventFilterConditionStore.offset = 0
            let elem = []
            $adventElemStore.forEach((e) => {
                if (e.active) {
                    elem.push(e.elem)
                }
            })
            $adventFilterConditionStore.elem = elem
            $adventStore = await getAdventsUsingFilter($adventFilterConditionStore.offset, $adventFilterConditionStore.limit, $adventFilterConditionStore.elem)
            isfilterLoading = false
        }
    }

    async function pickUpAdventHandler(event) {
        if (!ispickUpAdventLoading) {
            ispickUpAdventLoading = true
            let advent: advent = event.detail.advent
            const banmens = await getAdventBanmen(advent.id)
            let bAnswer: banmenAnswer[] = []
            banmens.forEach((b) => {
                bAnswer.push({
                    banmen: b,
                    answer: undefined,
                    lengths: [],
                    active: false
                })
            })
            $adventBanmenStore = bAnswer
            $adventTargetStore = event.detail.advent
            for (let i = 0; i < $adventStore.length; i++) {
                $adventStore[i].disable = false
                if ($adventStore[i].id == advent.id) {
                    $adventStore[i].disable = true
                }
            }
            ispickUpAdventLoading = false
        }
    }

    function pickDownAdventHandler(event) {
        let advent: advent = event.detail.advent
        for (let i = 0; i < $adventStore.length; i++) {
            if ($adventStore[i].id == advent.id) {
                $adventStore[i].disable = false
            }
        }
        $adventTargetStore = undefined
        $adventBanmenStore = []
    }

    function mojiLengthButtonHandler(length) {
        for (let i = 0; i < $mojiLengthConfigStore.length; i++) {
            if ($mojiLengthConfigStore[i].length == length) {
                $mojiLengthConfigStore[i].active ? ($mojiLengthConfigStore[i].active = false) : ($mojiLengthConfigStore[i].active = true)
                break
            }
        }
    }

    async function banmenClickHandler(banmenAns: banmenAnswer) {
        // デッキ未編成なら、トーストを出して終了
        if (!isBanmenSearching) {
            isBanmenSearching = true
            answerCount = 0
            if (target_kana.length == 0) {
                easytoast.toastPush('「EDIT」でデッキ編成すると、<br>素晴らしい機能にアクセスできます')
                return null
            }
            isActiveAnswerBox = true

            //文字長フィルタの条件が変更されていないことをチェック
            let target_length = []
            for (let i = 0; i < $mojiLengthConfigStore.length; i++) {
                if ($mojiLengthConfigStore[i].active) {
                    target_length.push($mojiLengthConfigStore[i].length)
                }
            }
            let conditionSameFlg = true
            conditionSameFlg = target_length.length == banmenAns.lengths.length

            target_length.forEach((tl) => {
                conditionSameFlg = conditionSameFlg && banmenAns.lengths.includes(tl)
            })

            if (banmenAns.answer && conditionSameFlg) {
                for (let i = 0; i < $adventBanmenStore.length; i++) {
                    $adventBanmenStore[i].active = false
                }
                banmenAns.active = true
                answerCount = banmenAns.answer.count
                answerList = banmenAns.answer.results
            } else {
                let result = undefined
                result = await getSearchAnswer(banmenAns.banmen.banmen, target_kana, target_length)
                for (let i = 0; i < $adventBanmenStore.length; i++) {
                    $adventBanmenStore[i].active = false
                    if (banmenAns.banmen.banmen == $adventBanmenStore[i].banmen.banmen) {
                        $adventBanmenStore[i].answer = result
                        $adventBanmenStore[i].lengths = target_length
                        answerCount = $adventBanmenStore[i].answer.count
                        answerList = $adventBanmenStore[i].answer.results
                    }
                }

                banmenAns.active = true
            }
            isBanmenSearching = false
        }
    }
</script>

<article class="com_scroll-y">
    <section id="advent-list-box">
        <p>攻略する降臨を選択</p>
        <div id="advent-list" class="com_scroll-x">
            {#if isfilterLoading}
                <Bs2ndLoader />
            {:else}
                {#each $adventStore as as}
                    <Advent advent={as} full={true} on:pickup={pickUpAdventHandler} on:pickdown={pickDownAdventHandler} />
                    <InfiniteScroll
                        threshold={100}
                        on:loadMore={() => {
                            scrollAdventsListHandler()
                        }} />
                {/each}
            {/if}
        </div>
    </section>
    <section id="elem-filter-box">
        {#each $adventElemStore as es, i}
            <div class="elem {ElemEngDict[es.elem]} {es.active ? 'active' : ''}" on:click={() => elemClickHandler(es.id)}>
                {es.elem}
            </div>
        {/each}
        <button on:click={filterAdventButtonHandler}>絞込</button>
    </section>
    <section id="advent-detail-box">
        {#if ispickUpAdventLoading}
            <Bs2ndLoader />
        {:else}
            <div id="advent-overview">
                {#if $adventTargetStore}
                    <Advent advent={$adventTargetStore} />
                    <div id="advent-overview-text">
                        <h3>{$adventTargetStore.name}</h3>
                        <h5>{AdventNumDict[$adventTargetStore.level]}</h5>
                        <h5>収録盤面数 : {$adventBanmenStore.length}</h5>
                    </div>
                {/if}
            </div>
            <div id="banmen-list">
                {#if $adventBanmenStore.length != 0}
                    <div id="banmen-moj-length-config-box">
                        {#each $mojiLengthConfigStore as mlcs}
                            <button class={mlcs.active ? 'active' : ''} on:click={() => mojiLengthButtonHandler(mlcs.length)}>
                                {mlcs.length}文字
                            </button>
                        {/each}
                    </div>
                {/if}
                {#each $adventBanmenStore as abs}
                    <div
                        class="banmen {abs.active ? 'active' : ''}"
                        on:click={() => {
                            banmenClickHandler(abs)
                        }}>
                        {abs.banmen.banmen.replace(/\./g, '◯')}
                        <img src="/img/arrow_simple_right.svg" alt=">" />
                    </div>
                {/each}
            </div>
            <div id="answers-box" class={isActiveAnswerBox ? 'active' : ''}>
                <div id="answer-box-close-button" />
                <div
                    id="answer-box-close-button-tap-area"
                    on:click={() => {
                        isActiveAnswerBox = false
                    }}>
                    <img src="/img/arrow_simple_bottom.svg" alt="⬇︎" />
                </div>
                <div class="answer-count">ヒット数 : {answerCount}</div>
                <div id="answers-list" class="com_scroll-y">
                    {#if isBanmenSearching}
                        <div style="height:120px; margin-top:100px">
                            <Bs2ndLoader />
                        </div>
                    {:else}
                        {#each answerList as al}
                            <div class="ans-box">
                                <div class="answer-word">{al.word}</div>
                                <div class="answer-nessesary">{al.necessary}</div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        {/if}
    </section>
</article>

<style lang="scss">
    button {
        font-size: 14px;
        width: 70px;
        color: white;
        border: solid 2px white;
        border-radius: 5px;
    }
    article {
        height: calc(100vh - 150px);
        overflow-y: scroll;

        section {
            margin: 0 auto;
            width: 90vw;
            max-width: 700px;
        }
        #elem-filter-box {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: right;
            .elem {
                width: 25px;
                font-size: 12px;
                font-weight: 900;
                text-align: center;
                margin: 5px;
                border-radius: 5px;
                border: solid 2px rgb(146, 146, 146);
                padding: 3px;
                div {
                    width: 25px;
                    height: 25px;
                    margin: 0 auto;
                    border-radius: 12px;
                }
                &.active {
                    &.fire {
                        border-color: rgb(255, 0, 0);
                        color: rgb(255, 0, 0);
                        text-shadow: 2px 1px 0px rgb(255, 115, 0);
                    }
                    &.water {
                        border-color: rgb(44, 128, 255);
                        color: rgb(44, 128, 255);
                        text-shadow: 2px 1px 0px rgb(162, 191, 255);
                    }
                    &.wood {
                        border-color: rgb(53, 175, 0);
                        color: rgb(53, 175, 0);
                        text-shadow: 2px 1px 0px rgb(46, 115, 0);
                    }
                    &.light {
                        border-color: rgb(255, 244, 195);
                        color: rgb(255, 232, 131);
                        text-shadow: 2px 1px 0px rgb(255, 196, 0);
                    }
                    &.dark {
                        border-color: rgb(200, 62, 255);
                        color: rgb(200, 62, 255);
                        text-shadow: 2px 1px 0px rgb(219, 129, 255);
                    }
                    &.hell {
                        border-color: rgb(255, 196, 0);
                        color: rgb(61, 45, 0);
                        text-shadow: 2px 1px 0px rgb(255, 196, 0);
                    }
                    &.heaven {
                        border-color: rgb(255, 180, 245);
                        color: rgb(241, 218, 222);
                        text-shadow: 2px 1px 0px rgb(255, 95, 234);
                    }
                }
            }
            button {
                --green: #6fffcf;
                color: var(--green);
                border: solid 2px var(--green);
                margin: 0 0 0 15px;
            }
        }
        #advent-list-box {
            width: 90vw;
            p {
                font-size: 11px;
            }
            #advent-list {
                max-width: 700px;
                margin: 0 auto 10px auto;
                height: 170px;
                display: flex;
                flex-direction: column;
                justify-content: start;
                flex-wrap: wrap;
                overflow-x: scroll;
            }
        }
        #advent-detail-box {
            margin: 30px auto;
            width: 90vw;
            #advent-overview {
                display: flex;
                #advent-overview-text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    h5 {
                        margin: 5px 0;
                    }
                }
            }
            #banmen-list {
                margin: 10px 0 400px 0;
                #banmen-moj-length-config-box {
                    margin: 10px 0 20px 0;
                    max-width: 350px;
                    display: flex;
                    justify-content: space-between;
                    button {
                        &.active {
                            color: var(--active-yellow);
                            border-color: var(--active-yellow);
                        }
                    }
                }
                .banmen {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    letter-spacing: 3px;
                    border-bottom: solid 1px white;
                    padding: 0 0 5px 0;
                    margin: 0 0 15px 0;
                    img {
                        width: 8px;
                        height: 15px;
                        margin: 0 20px 0 0;
                        transition: 0.5s;
                    }
                    &.active {
                        color: var(--active-yellow);
                        img {
                            transform: rotate(90deg);
                        }
                    }
                }
            }
            #answers-box {
                position: fixed;
                padding: 15px 15px 60px 15px;
                z-index: 100;
                bottom: -520px;
                left: 0;
                width: 100vw;
                height: 480px;
                background: linear-gradient(225deg, rgba(black, 1), rgba(black, 0.8));
                border-top: solid 2px white;
                transition: 0.3s;
                &.active {
                    bottom: 0;
                }
                .answer-count {
                    max-width: 650px;
                    margin: 0 auto 20px auto;
                }
                #answer-box-close-button {
                    position: absolute;
                    top: -30px;
                    right: 50px;
                    width: 80px;
                    height: 30px;
                    border: solid 1px white;
                    border-bottom: solid 2px black;
                    border-radius: 7px 7px 0 0;
                    background: black;
                }
                #answer-box-close-button-tap-area {
                    position: absolute;
                    top: -30px;
                    right: 50px;
                    width: 80px;
                    height: 100px;
                    padding: 15px 30px;
                }
                #answers-list {
                    width: 90vw;
                    max-width: 650px;
                    margin: 0 auto;
                    color: white;
                    height: 100%;
                    overflow-y: scroll;
                    display: flex;
                    justify-content: left;
                    flex-wrap: wrap;

                    .ans-box {
                        width: 160px;
                        padding: 0 0 0 15px;
                        border-left: solid 3px white;
                        margin: 10px 0;
                        .answer-word {
                            font-size: 18px;
                        }
                        .answer-nessesary {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
</style>
