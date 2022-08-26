<script lang="ts">
    import type { advent } from '$lib/model/app/Bs2ndModel'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let advent: advent
    export let full: boolean = false

    function adventOnClickHandler() {
        const obj = Object.assign({}, advent)
        if (advent.disable) {
            dispatch('pickdown', {
                advent: obj
            })
        } else {
            dispatch('pickup', {
                advent: obj
            })
            advent.disable = true
        }
    }
</script>

<div class="advent {!full ? 'scaleup' : ''}" on:click={adventOnClickHandler}>
    <div class="smart-info-box">
        <img class={advent.disable ? 'disable' : ''} src={advent.figure} alt={advent.name} />
        {#if full}
            <div class="elems-tribe-box">
                <div class="elems-box">
                    {#if advent.elem.includes('火')}
                        <div class="elem fire" />{/if}
                    {#if advent.elem.includes('水')}
                        <div class="elem water" />{/if}
                    {#if advent.elem.includes('木')}
                        <div class="elem wood" />{/if}
                    {#if advent.elem.includes('光')}
                        <div class="elem light" />{/if}
                    {#if advent.elem.includes('闇')}
                        <div class="elem dark" />{/if}
                    {#if advent.elem.includes('冥')}
                        <div class="elem hell" />{/if}
                    {#if advent.elem.includes('天')}
                        <div class="elem heaven" />{/if}
                </div>
            </div>
        {/if}
    </div>
    {#if full}
        <p class="name {advent.disable ? 'disable' : ''}">{advent.name}</p>
    {/if}
</div>

<style lang="scss">
    .advent {
        font-family: 'Kosugi Maru', sans-serif;
        width: 71px;
        margin: 10px;
        .smart-info-box {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            img {
                width: 60px;
                height: 50px;
                &.disable {
                    filter: grayscale(85%);
                }
            }
            .elems-tribe-box {
                position: relative;
                .elems-box {
                    height: 100%;
                    display: flex;
                    flex-direction: column-reverse;
                    .elem {
                        width: 11px;
                        height: 11px;
                        border-radius: 6px;
                        margin: 0 0 2px 0;
                        border: solid 2px;
                        &.fire {
                            background-color: rgb(219, 70, 70);
                            border-color: rgb(255, 145, 0);
                        }
                        &.water {
                            background-color: rgb(41, 126, 255);
                            border-color: rgb(167, 215, 255);
                        }
                        &.wood {
                            background-color: rgb(105, 172, 105);
                            border-color: rgb(175, 216, 171);
                        }
                        &.light {
                            background-color: rgb(255, 210, 62);
                            border-color: rgb(255, 240, 158);
                        }
                        &.dark {
                            background-color: rgb(146, 85, 165);
                            border-color: rgb(208, 172, 255);
                        }
                        &.hell {
                            background-color: rgb(49, 31, 4);
                            border-color: rgb(214, 166, 9);
                        }
                        &.heaven {
                            background-color: rgb(250, 243, 248);
                            border-color: rgb(255, 175, 248);
                        }
                    }
                }
            }
        }
        &.scaleup {
            width: 120px;
            img {
                width: 120px;
                height: 100px;
            }
        }
        .name {
            text-align: center;
            line-height: 10px;
            font-size: 10px;
            width: 100%;
            margin: 3px 0 0 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.disable {
                color: gray;
            }
        }
    }
</style>
