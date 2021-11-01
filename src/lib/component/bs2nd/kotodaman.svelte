<script lang="ts">
    import type { kotodaman } from '$lib/model/app/Bs2ndModel';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let kotodaman: kotodaman;
    export let full: boolean = false;

    function kotodamanOnClickHandler(){
        if (!kotodaman.indeck){
            dispatch('click', {
                kotodaman: Object.assign({},kotodaman)
            });
            kotodaman.indeck = true
        }
    }
</script>

<div class="kotodaman {!full ? 'no-margin': ''}" on:click={kotodamanOnClickHandler}>
    <div class='smart-info-box'>
        <img class="{kotodaman.indeck ? 'disable' : ''}" src={kotodaman.figure} alt={kotodaman.name}>
        {#if full}
        <div class='elems-tribe-box'>
            <div class='tribe-box {kotodaman.indeck ? 'disable' : ''}'>
                <p>{kotodaman.tribe[0]}</p>
            </div>
            
            <div class='elems-box'>
                {#if kotodaman.elem.includes('火')}
                    <div class='elem fire'></div>{/if}
                {#if kotodaman.elem.includes('水')}
                    <div class='elem water'></div>{/if}
                {#if kotodaman.elem.includes('木')}
                    <div class='elem wood'></div>{/if}
                {#if kotodaman.elem.includes('光')}
                    <div class='elem light'></div>{/if}
                {#if kotodaman.elem.includes('闇')}
                    <div class='elem dark'></div>{/if}
                {#if kotodaman.elem.includes('冥')}
                    <div class='elem hell'></div>{/if}
                {#if kotodaman.elem.includes('天')}
                    <div class='elem heaven'></div>{/if}
            </div>
        </div>
        {/if}
    </div>
    {#if full}
        <p class='name {kotodaman.indeck ? 'disable' : ''}'>{kotodaman.name}</p>
    {/if}
    
</div>

<style lang="scss">
    .kotodaman{
        font-family: 'Kosugi Maru', sans-serif;
        width:90px;
        margin:10px;
        &.no-margin{
            display: flex;
            align-items: center;
            width:70px;height:70px;margin:0px
        }
        .smart-info-box{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            img{
                width:70px;
                height: auto;
                &.disable{
                    filter:grayscale(85%)
                }
            }
            .elems-tribe-box{
                position: relative;
                .tribe-box{
                    position: absolute;
                    top:2px;
                    left:-10px;
                    width:21px;
                    height:19px;
                    background-color: rgb(255, 215, 38);
                    box-shadow: 1px 2px 1px white;
                    border-radius: 1px 8px;
                    &.disable{
                        color:rgb(182, 182, 182);
                        background-color: rgb(136, 126, 67);
                    }
                    p{
                        font-size: 16px;
                        line-height: 19px;
                        text-align: center;
                        text-shadow: 1px 1px 2px black;
                    }
                }
                .elems-box{
                    height:100%;
                    display: flex;
                    flex-direction: column-reverse;
                    .elem{
                        width:11px;height:11px;
                        border-radius: 6px;
                        margin:0 0 2px 0;
                        border: solid 2px;
                        &.fire{background-color: rgb(219, 70, 70);border-color: rgb(255, 199, 199);}
                        &.water{background-color: rgb(41, 126, 255);border-color: rgb(167, 215, 255);}
                        &.wood{background-color: rgb(105, 172, 105);border-color: rgb(175, 216, 171);}
                        &.light{background-color: rgb(255, 210, 62);border-color: rgb(255, 240, 158);}
                        &.dark{background-color: rgb(146, 85, 165);border-color: rgb(208, 172, 255);}
                        &.hell{background-color: rgb(49, 31, 4);border-color: rgb(214, 166, 9);}
                        &.heaven{background-color: rgb(250, 243, 248);border-color: rgb(255, 175, 248);}
                    }
                }
            }
        }
        
        .name{
            text-align: center;
            line-height: 12px;
            font-size: 12px;
            width:100%;
            margin:5px 0 0 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.disable{
                color: gray;
            }
        }
        
    }    


</style>
