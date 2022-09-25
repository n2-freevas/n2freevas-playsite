<script lang="ts">
    import type { kotodaman } from '$lib/model/app/Bs2ndModel'
    import { createEventDispatcher } from 'svelte'
    import { isDeckFullStore } from '$lib/store/app/bs2ndStore'

    const dispatch = createEventDispatcher()

    export let kotodaman: kotodaman
    export let full: boolean = false

    function kotodamanOnClickHandler() {
        if (kotodaman.disable) {
            const obj = Object.assign({}, kotodaman)
            dispatch('click', {
                kotodaman: obj
            })
            kotodaman.disable = false
        } else {
            const obj = Object.assign({}, kotodaman)
            if (!kotodaman.indeck && !$isDeckFullStore) {
                kotodaman.disable = true
            }
            dispatch('click', {
                kotodaman: obj
            })
        }
    }
</script>

<div class="kotodaman {!full ? 'no-margin' : ''}" on:click={kotodamanOnClickHandler}>
    <div class="smart-info-box">
        <img class={kotodaman.disable ? 'disable' : ''} src={kotodaman.figure} alt={kotodaman.name} />
        {#if full}
            <div class="elems-tribe-box">
                <div class="tribe-box {kotodaman.disable ? 'disable' : ''}">
                    <p>{kotodaman.tribe[0]}</p>
                </div>

                <div class="elems-box">
                    {#if kotodaman.elem.includes('火')}
                        <div class="elem fire" />{/if}
                    {#if kotodaman.elem.includes('水')}
                        <div class="elem water" />{/if}
                    {#if kotodaman.elem.includes('木')}
                        <div class="elem wood" />{/if}
                    {#if kotodaman.elem.includes('光')}
                        <div class="elem light" />{/if}
                    {#if kotodaman.elem.includes('闇')}
                        <div class="elem dark" />{/if}
                    {#if kotodaman.elem.includes('冥')}
                        <div class="elem hell" />{/if}
                    {#if kotodaman.elem.includes('天')}
                        <div class="elem heaven" />{/if}
                </div>
            </div>
        {/if}
    </div>
    {#if full}
        <p class="name {kotodaman.disable ? 'disable' : ''}">{kotodaman.name}</p>
    {/if}
</div>

<style lang="scss">
    .kotodaman {
        font-family: 'Kosugi Maru', sans-serif;
        width: 71px;
        margin: 10px;
        &.no-margin {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 70px;
            height: 70px;
            margin: 0px;
        }
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
                .tribe-box {
                    position: absolute;
                    top: 2px;
                    left: -10px;
                    width: 19px;
                    height: 17px;
                    background-color: rgb(255, 215, 38);
                    box-shadow: 1px 2px 1px white;
                    border-radius: 1px 8px;
                    &.disable {
                        color: rgb(182, 182, 182);
                        background-color: rgb(136, 126, 67);
                    }
                    p {
                        font-size: 14px;
                        line-height: 17px;
                        text-align: center;
                        text-shadow: 1px 1px 2px black;
                    }
                }
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
