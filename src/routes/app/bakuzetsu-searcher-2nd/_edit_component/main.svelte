<script lang="ts">
    import Specify from './specify.svelte'
    import Kana from './kana.svelte'
    import {kanaStore, elemStore, tribeStore, gimmickStore,
            unitListStore, filterConditionStore, deckStore,
            isSettingFilterCondition, isBottomOfScroll, isListLoading} from '$lib/store/app/bs2ndStore'
    import { getUnitsUsingFilter } from '$lib/api/app/bs2ndApi'
    import type {elem, tribe, gimmick} from '$lib/model/app/Bs2ndModel'
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    let tabs = [
        {   label: '種別',
            value: 1,
            component: Specify
        },
        {   label: '50音',
            value: 2,
            component: Kana
        }
    ];
    let activeTabs = 1

    const handleClick = val => ()=> (activeTabs = val)

    async function searchButtonHandler(){
        $isListLoading = true
        $unitListStore = []
        let word:string[] = []
        let elem:elem[] = []
        let tribe:tribe[] = []
        let gimmick:gimmick[] = []
        $isBottomOfScroll = false
        $kanaStore.forEach(kana=>{
            if(kana.active){kana.kanas.forEach(k=>{word.push(k)})}
        })
        $elemStore.forEach(el=> {
            if(el.active){elem.push(el.elem)}
        })
        $tribeStore.forEach(tr=> {
            if(tr.active){tribe.push(tr.tribe)}
        })
        $gimmickStore.forEach(gm => {
            if(gm.active){gimmick.push(gm.gimmick)}
        })
        $isSettingFilterCondition = true
        if(word.length==0 && elem.length==0 && tribe.length==0 && gimmick.length==0){
            $isSettingFilterCondition = false
        }
        $filterConditionStore.offset = 0
        $unitListStore = await getUnitsUsingFilter(
            $filterConditionStore.offset,
            $filterConditionStore.limit,
            word,elem,tribe,gimmick)
        if($filterConditionStore.limit != $unitListStore.length){
            console.log('check')
            $isBottomOfScroll = true
        }
        for(let i=0; i<12; i++){
            if ($deckStore[i] != undefined){
                for(let j=0; j<$unitListStore.length; j++){
                    if($deckStore[i].id == $unitListStore[j].id){
                        $unitListStore[j].indeck = true
                        $unitListStore[j].disable = true
                    }
                }
            }
        }
        $filterConditionStore.word = word
        $filterConditionStore.elem = elem
        $filterConditionStore.tribe = tribe
        $filterConditionStore.gimmick = gimmick
        $isListLoading = false
        dispatch('close');
    }

    function resetButtonHandler(){
        $isSettingFilterCondition = false
        for(let i=0; i<$kanaStore.length; i++){
            $kanaStore[i].active = false
        }
        for(let i=0; i<$elemStore.length; i++){
            $elemStore[i].active = false
        }
        for(let i=0; i<$tribeStore.length; i++){
            $tribeStore[i].active = false
        }
        for(let i=0; i<$gimmickStore.length; i++){
            $gimmickStore[i].active = false
        }
    }
</script>

<article id='bs2nd-edit-filter-panel'>
    <ul>
        {#each tabs as t}
            <li class={activeTabs === t.value ? 'active' : ''}>
                <span on:click={handleClick(t.value)}>{t.label}</span>
            </li>
        {/each}
    </ul>
    {#each tabs as t}
        {#if activeTabs == t.value}
        <div class= 'tabbox'>
            <svelte:component this={t.component}/>
        </div>
        {/if}
    {/each}
    <section id='filter-execute-box'>
        <button id='search-button' on:click={searchButtonHandler}>検索</button>
        <button id='reset-button' on:click={resetButtonHandler}>リセット</button>
    </section>
</article>

<style lang="scss">
    #bs2nd-edit-filter-panel{
        padding:5px;
        width: 100%;
        height:100%;
        position: relative;
        .tabbox {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #dee2e6;
            border-radius: 0 0 .5rem .5rem;
            border-top: 0;
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            padding-left: 0;
            margin: 0 0;
            list-style: none;
            border-bottom: 1px solid #dee2e6;
        }
        li {
            width:50%;
            text-align: center;
            margin-bottom: -1px;
        }
        span {
            border: 1px solid transparent;
            border-top-left-radius: 0.25rem;
            border-top-right-radius: 0.25rem;
            display: block;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: 0.3s;
        }

        span:hover {
            border-color: #e9ecef #e9ecef #dee2e6;
        }

        li.active > span {
            //color: #495057;
            //background-color: #fff;
            border-color: #dee2e6 #dee2e6 #fff;
        }
        #filter-execute-box{
            position: absolute;
            bottom:25px;
            width:100%;
            text-align: center;
            button{
                margin:0 10px;
                border:solid 1px white;
                border-radius: 5px;
                color:white;
                width:110px;
                height:35px;
            }
        }
    }
</style>
