<script lang="ts">
    import type { SynegierText } from '$lib/model/app/SynegierAdmin'

    export let synegierText: SynegierText[]
    export let showText:boolean
    export let savingShow: boolean = false
    export let scale: number = 1
</script>


<div class="synegierTextInfo {savingShow?"savingShow":""}" style="--scale:{scale}">
    {#each synegierText as st}
        <div class="{st.type} {st.color}">
            {#if showText}{st.text}{/if}
        </div>
    {/each}
</div>


<style lang="scss">
    .synegierTextInfo {
        --synegierTextWidth: calc(320px * var(--scale));
        --synegierTextHeight: calc(45px * var(--scale));
        --synegierTextRibbonWidth: calc(22px * var(--scale));
        --synegierTextMargin: calc((20px * var(--scale)) + var(--synegierTextHeight));
        --fontsize: calc(10px * var(--scale));
        // --cardSpacing20: calc(var(--h) / 30);
        position: relative;
        width: inherit;
        height: calc(var(--synegierTextMargin) * 4 + var(--synegierTextHeight));
        div {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--synegierTextWidth);
            height: var(--synegierTextHeight);
            background: rgba($color: #000000, $alpha: 0.6);
            padding: 0 var(--cardSpacing20);
            align-items: center;
            &::before {
                position: absolute;
                content: '';
                width: var(--synegierTextRibbonWidth);
                height: var(--synegierTextHeight);
            }
            &.blue {
                &::before {
                    background: #0085ff;
                }
                top: 0;
            }
            &.green {
                &::before {
                    background: #00c036;
                }
                top: var(--synegierTextMargin);
            }
            &.yellow {
                &::before {
                    background: #ffc700;
                }
                top: calc(var(--synegierTextMargin) * 2);
            }
            &.red {
                &::before {
                    background: #e40000;
                }
                top: calc(var(--synegierTextMargin) * 3);
            }
            &.purple {
                &::before {
                    background: #c600e6;
                }
                top: calc(var(--synegierTextMargin) * 4);
            }
            &.s,
            &.subject {
                right: 0;
                &::before {
                    left: calc(-1 * var(--synegierTextRibbonWidth));
                }
            }
            &.v,
            &.verbus {
                left: 0;
                &::before {
                    right: calc(-1 * var(--synegierTextRibbonWidth));
                }
            }
        }
        &.savingShow{
            height: auto;
            width: var(--synegierTextWidth);
            --synegierTextRibbonWidth2: calc( var(--synegierTextRibbonWidth) / 2 );
            div{
                position: static;
                margin: 5px 0;
                &::before{
                    width: var(--synegierTextRibbonWidth2);
                }
                &.s,&.subject {
                    &::before{
                        left: calc( -1 * ( var(--synegierTextRibbonWidth2) / 2 ));
                    }
                }
                &.v,&.verbus {
                    &::before{
                        right: calc( -1 * ( var(--synegierTextRibbonWidth2) / 2 ));;
                    }
                    
                }
            }
        }
    }
</style>
