<script lang="ts">
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import In2pickAmination from '$lib/component/SynegierAdmin/CardAnimationComponent/In2pickAmination.svelte'

    // Require : Size of parent element is width:1000px height:250px.

    export let deckCards: SynegierCard[]
    export let isCardsHide: boolean = false
    let costSummary = [0, 0, 0, 0]
    let stColorSummary = {
        blue: { s: 0, v: 0 },
        green: { s: 0, v: 0 },
        yellow: { s: 0, v: 0 },
        red: { s: 0, v: 0 },
        purple: { s: 0, v: 0 }
    }

    $: {
        //costSummaryの初期化データ
        let _costSummary = [0, 0, 0, 0]

        //colorSumaryの初期化データ
        let _stColorSummary = {
            blue: { s: 0, v: 0 },
            green: { s: 0, v: 0 },
            yellow: { s: 0, v: 0 },
            red: { s: 0, v: 0 },
            purple: { s: 0, v: 0 }
        }

        deckCards.forEach((card) => {
            //コストの集計
            _costSummary[card.cost] += 1
            card.synegierText.forEach((st) => {
                _stColorSummary[st.color][st.type] += 1
            })
        })
        // ディープコピーで転写
        costSummary = [..._costSummary]
        stColorSummary = Object.assign({}, _stColorSummary)
    }
</script>

<div class="deckSummary">
    <div class="deckCostsAndColor">
        <div class="costSummary">
            {#each costSummary as count, i}
                <div class="costSummaryItem">
                    <div class="costNumber">{i}</div>
                    <div class="countBar" style="--width: {count < 11 ? count * 20 : 200}px" />
                    <div class="countNumber">{count}</div>
                </div>
            {/each}
        </div>
        <div class="stColorSummary">
            {#each Object.entries(stColorSummary) as [color, typeAndCount]}
                <div class="stColorItem">
                    <div class="stSubjectCount">{typeAndCount.s}</div>
                    <div
                        class="stSubjectBar {color}"
                        style="--width:{typeAndCount.s < 11 ? typeAndCount.s * 20 : 200}px" />
                    <div class="stColorRect">{color}</div>
                    <div
                        class="stVerbusBar {color}"
                        style="--width:{typeAndCount.v < 11 ? typeAndCount.v * 20 : 200}px" />
                    <div class="stVerbusCount">{typeAndCount.v}</div>
                </div>
            {/each}
        </div>
    </div>
    <div class="deckList {isCardsHide ? 'hide' : ''}">
        {#each deckCards as c}
            <div class="card">
                <In2pickAmination onAppear={true}>
                    <Card model={c} scale={0.15} />
                </In2pickAmination>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .deckSummary {
        width: 1000px;
        height: 250px;
        bottom: 0;
        left: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .deckCostsAndColor {
            display: flex;
            justify-content: space-around;
            width: inherit;
            height: 110px;
            .costSummary {
                width: 300px;
                height: inherit;
                .costSummaryItem {
                    width: inherit;
                    height: 25%;
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    .costNumber {
                        text-align: center;
                        width: 40px;
                    }
                    .countBar {
                        position: relative;
                        width: 204px;
                        height: 100%;
                        border-left: solid 2px white;
                        border-right: solid 2px white;
                        &::before {
                            content: '';
                            position: absolute;
                            top: calc(50% - 5px);
                            height: 10px;
                            background: white;
                            width: var(--width);
                        }
                    }
                    .countNumber {
                        width: 30px;
                        text-align: right;
                        font-size: 11px;
                    }
                }
            }
            .stColorSummary {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 110px;
                width: 600px;
                .stColorItem {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 20%;
                    width: inherit;
                    .stSubjectBar,
                    .stVerbusBar {
                        position: relative;
                        width: 202px;
                        height: 100%;
                        &::before {
                            content: '';
                            position: absolute;
                            top: 20%;
                            width: var(--width);
                            height: 60%;
                        }
                        &.blue {
                            &::before {
                                background: #0085ff;
                            }
                        }
                        &.green {
                            &::before {
                                background: #00c036;
                            }
                        }
                        &.yellow {
                            &::before {
                                background: #ffc700;
                            }
                        }
                        &.red {
                            &::before {
                                background: #e40000;
                            }
                        }
                        &.purple {
                            &::before {
                                background: #c600e6;
                            }
                        }
                    }
                    .stSubjectBar {
                        border-left: solid 2px white;
                        &::before {
                            right: 0;
                        }
                    }
                    .stVerbusBar {
                        border-right: solid 2px white;
                    }
                    .stColorRect {
                        width: 100px;
                        text-align: center;
                        font-size: 11px;
                    }
                    .stSubjectCount,
                    .stVerbusCount {
                        font-size: 11px;
                        padding: 0 5px;
                        width: 30px;
                        text-align: right;
                    }

                    // .stVerbusBar{
                    //     width: var(--width);
                    // }
                    // &.s, &.subject{
                    //     right:0;
                    //     &::before{
                    //         left: -20px
                    //     }
                    // }
                    // &.v, &.verbus{
                    //     left:0;
                    //     &::before{
                    //         right: -20px
                    //     }
                    // }
                }
            }
        }
        .deckList {
            margin: 0 auto;
            width: 975px;
            display: flex;
            height: 100px;
            justify-content: flex-start;
            align-items: center;
            transition: 0.2s;
            opacity: 1;
            .card {
                margin: 0 2px;
            }
            &.hide {
                opacity: 0;
            }
        }
    }
</style>
