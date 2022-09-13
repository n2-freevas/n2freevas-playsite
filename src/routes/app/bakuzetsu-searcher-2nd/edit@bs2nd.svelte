<script lang="ts">
    import { getUnits, getUnitsUsingFilter } from '$lib/api/app/bs2ndApi'
    import MediaQuery from 'svelte-media-query'
    import { onMount } from 'svelte'
    import Kotodaman from '$lib/component/bs2nd/kotodaman.svelte'
    import {
        deckStore,
        unitListStore,
        isDeckFullStore,
        filterConditionStore,
        DEFAULT_LIMIT,
        isSettingFilterCondition,
        isBottomOfScroll,
        isListLoading
    } from '$lib/store/app/bs2ndStore'
    import Bs2ndLoader from '$lib/component/Loader/bs2ndLoader.svelte'
    import EditCompMain from './_edit_component/main.svelte'
    import Storage from './_deck_storage/storage.svelte'
    import InfiniteScroll from '$lib/component/InfiniteScroll.svelte'

    let isLoadingError: boolean = false
    let isUnitFilterMenuOpen = false
    let isDeckMenuOpen = false

    onMount(async () => {
        // const units = await getUnits(10,10)
        // console.log(units)
        console.log('edit')
        $isListLoading = true
        try {
            if ($unitListStore.length == 0) {
                $unitListStore = await getUnitsUsingFilter(
                    0,
                    $filterConditionStore.limit,
                    $filterConditionStore.word,
                    $filterConditionStore.elem,
                    $filterConditionStore.tribe,
                    $filterConditionStore.gimmick
                )
                if ($filterConditionStore.limit < $unitListStore.length) {
                    $isBottomOfScroll = true
                }
                isBottomOfScroll
                for (let i = 0; i < 12; i++) {
                    if ($deckStore[i] != undefined) {
                        for (let j = 0; j < $unitListStore.length; j++) {
                            if ($deckStore[i].id == $unitListStore[j].id) {
                                $unitListStore[j].indeck = true
                                $unitListStore[j].disable = true
                            }
                        }
                    }
                }
            }
        } catch {
            isLoadingError = true
        } finally {
            $isListLoading = false
        }
    })
    async function handleGetUnits(append: boolean = true) {
        $isListLoading = true
        try {
            if (append) {
                //@ts-ignore
                let unit = await getUnits($filterConditionStore.offset, $filterConditionStore.limit)
                if ($filterConditionStore.limit != unit.length) {
                    $isBottomOfScroll = true
                }
                $unitListStore = $unitListStore.concat(unit)
            } else {
                $unitListStore = await getUnits(
                    $filterConditionStore.offset,
                    $filterConditionStore.limit
                )
                if ($filterConditionStore.limit != $unitListStore.length) {
                    $isBottomOfScroll = true
                }
            }
            for (let i = 0; i < 12; i++) {
                if ($deckStore[i] != undefined) {
                    for (let j = 0; j < $unitListStore.length; j++) {
                        if ($deckStore[i].id == $unitListStore[j].id) {
                            $unitListStore[j].indeck = true
                            $unitListStore[j].disable = true
                        }
                    }
                }
            }
        } catch {
            isLoadingError = true
        } finally {
            $isListLoading = false
        }
    }
    async function handleGetUnitsFilter(append: boolean = true) {
        $isListLoading = true
        try {
            if (append) {
                let units = await getUnitsUsingFilter(
                    $filterConditionStore.offset,
                    $filterConditionStore.limit,
                    $filterConditionStore.word,
                    $filterConditionStore.elem,
                    $filterConditionStore.tribe,
                    $filterConditionStore.gimmick
                )
                if ($filterConditionStore.limit != units.length) {
                    $isBottomOfScroll = true
                }
                $unitListStore = $unitListStore.concat(units)
            } else {
                $unitListStore = await getUnitsUsingFilter(
                    $filterConditionStore.offset,
                    $filterConditionStore.limit,
                    $filterConditionStore.word,
                    $filterConditionStore.elem,
                    $filterConditionStore.tribe,
                    $filterConditionStore.gimmick
                )
                if ($filterConditionStore.limit != $unitListStore.length) {
                    $isBottomOfScroll = true
                }
            }
            for (let i = 0; i < 12; i++) {
                if ($deckStore[i] != undefined) {
                    for (let j = 0; j < $unitListStore.length; j++) {
                        if ($deckStore[i].id == $unitListStore[j].id) {
                            $unitListStore[j].indeck = true
                            $unitListStore[j].disable = true
                        }
                    }
                }
            }
        } catch {
            isLoadingError = true
        } finally {
            $isListLoading = false
        }
    }

    function handleClickKotodamanInList(event) {
        //console.log('deckin',event.detail.kotodaman)
        let count_undef = 0
        let insert_flag = false
        let insert_ignore_flg = false
        for (let i = 0; i < 12; i++) {
            if ($deckStore[i] != undefined) {
                if ($deckStore[i].id == event.detail.kotodaman.id) {
                    $deckStore[i] = undefined
                    insert_ignore_flg = true
                    $isDeckFullStore = false
                    break
                }
            }
        }
        if (!$isDeckFullStore && !event.detail.kotodaman.indeck && !insert_ignore_flg) {
            for (let i = 0; i < 12; i++) {
                if ($deckStore[i] == undefined) {
                    count_undef += 1
                    if (!insert_flag) {
                        $deckStore[i] = event.detail.kotodaman
                        $deckStore[i].indeck = true
                        insert_flag = true
                    }
                }
            }
            if (count_undef == 1) {
                $isDeckFullStore = true
            }
        }
    }

    function handleClickKotodamanInDeck(event) {
        //console.log('deckout',event.detail.kotodaman)
        for (let i = 0; i < 12; i++) {
            if ($deckStore[i] != undefined) {
                $isDeckFullStore = false
                if ($deckStore[i].id == event.detail.kotodaman.id) {
                    for (let j = 0; j < $unitListStore.length; j++) {
                        if ($unitListStore[j].id == event.detail.kotodaman.id) {
                            $unitListStore[j].indeck = false
                            $unitListStore[j].disable = false
                        }
                    }
                    $deckStore[i] = undefined
                    break
                }
            }
        }
    }

    function deckStoreReset() {
        for (let i = 0; i < 12; i++) {
            let obj = $deckStore[i]
            if (obj) {
                for (let j = 0; j < $unitListStore.length; j++) {
                    if ($unitListStore[j].id == obj.id) {
                        $unitListStore[j].disable = false
                    }
                }
                $deckStore[i] = undefined
            }
        }
        $isDeckFullStore = false
    }
</script>

<article id="bs2nd-screen">
    <MediaQuery query="(min-width: 701px)" let:matches
        >{#if matches}
            <section class="panel-box">
                <h2>絞り込み</h2>
                <p>本家ゲームとほぼ同じ要領で、<br />キャラの絞り込み検索ができます。</p>
                <section id="bs2nd-units-filter-panel" class={isUnitFilterMenuOpen ? 'open' : ''}>
                    <EditCompMain
                        on:close={() => {
                            isUnitFilterMenuOpen = false
                        }} />
                    <div
                        id="bs2nd-units-filter-slider-button"
                        on:click={() => {
                            isUnitFilterMenuOpen
                                ? (isUnitFilterMenuOpen = false)
                                : (isUnitFilterMenuOpen = true)
                        }}>
                        <img
                            class={isUnitFilterMenuOpen ? 'open' : ''}
                            src="/img/arrow-circle-left-solid.svg"
                            alt="⇦" />
                    </div>
                </section>
            </section>
        {/if}</MediaQuery>
    <section id="bs2nd-edit-panels">
        <section id="bs2nd-deck-edit">
            <section id="bs2nd-deck-edit-panel">
                {#each $deckStore as unit}
                    {#if unit == undefined}
                        <div class="unit-in-deck-blank-slot" />
                    {:else}
                        <Kotodaman kotodaman={unit} on:click={handleClickKotodamanInDeck} />
                    {/if}
                {/each}
            </section>
            <button on:click={deckStoreReset}>リセット</button>
        </section>
        <section id="bs2nd-show-units-panel">
            {#each $unitListStore as unit}
                <Kotodaman kotodaman={unit} full={true} on:click={handleClickKotodamanInList} />
            {/each}
            {#if $isListLoading}
                <div style="margin-top:80px">
                    <Bs2ndLoader />
                </div>
            {/if}
            {#if isLoadingError}
                <p>エラー！</p>
            {/if}
            <InfiniteScroll
                threshold={100}
                on:loadMore={() => {
                    $filterConditionStore.offset += DEFAULT_LIMIT
                    !$isListLoading && !$isBottomOfScroll
                        ? isSettingFilterCondition
                            ? handleGetUnitsFilter()
                            : handleGetUnits()
                        : null
                }} />
        </section>
    </section>
    <MediaQuery query="(max-width: 700px)" let:matches
        >{#if matches}
            <section id="bs2nd-deck-select-slider" class={isDeckMenuOpen ? 'open' : ''}>
                <Storage
                    on:click={() => {
                        isDeckMenuOpen = false
                    }} />
                <div
                    id="bs2nd-deck-select-slider-button"
                    on:click={() => {
                        isDeckMenuOpen ? (isDeckMenuOpen = false) : (isDeckMenuOpen = true)
                    }}>
                    <img
                        class={isDeckMenuOpen ? 'open' : ''}
                        src="/img/arrow-circle-left-solid.svg"
                        alt="⇦" />
                </div>
            </section>
            <section id="bs2nd-units-filter-slider" class={isUnitFilterMenuOpen ? 'open' : ''}>
                <EditCompMain
                    on:close={() => {
                        isUnitFilterMenuOpen = false
                    }} />
                <div
                    id="bs2nd-units-filter-slider-button"
                    on:click={() => {
                        isUnitFilterMenuOpen
                            ? (isUnitFilterMenuOpen = false)
                            : (isUnitFilterMenuOpen = true)
                    }}>
                    <img
                        class={isUnitFilterMenuOpen ? 'open' : ''}
                        src="/img/arrow-circle-left-solid.svg"
                        alt="⇦" />
                </div>
            </section>
        {/if}</MediaQuery>

    <MediaQuery query="(min-width: 701px)" let:matches
        >{#if matches}
            <section class="panel-box">
                <h2>デッキストレージ</h2>
                <p>
                    編成したデッキを保存できます。<br />デッキは、このブラウザの<br />ローカルストレージに保存されます。
                </p>
                <section id="bs2nd-deck-select-panel">
                    <Storage
                        on:click={() => {
                            isDeckMenuOpen = false
                        }} />
                </section>
            </section>
        {/if}</MediaQuery>
</article>

<style lang="scss">
    #bs2nd-screen {
        margin: 0 auto;
        height: calc(100vh - 120px);
        overflow: hidden;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        #bs2nd-edit-panels {
            max-width: 90vw;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            #bs2nd-deck-edit {
                margin: 10px auto 10px auto;
                #bs2nd-deck-edit-panel {
                    height: 225px;
                    width: 300px;
                    margin: 0 0 5px 0;
                    background: white;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    flex-wrap: wrap;
                    .unit-in-deck-blank-slot {
                        width: 50px;
                        height: 50px;
                        border-radius: 25px;
                        margin: 10px;
                        background-color: rgb(51, 51, 51);
                    }
                }
                button {
                    width: 100px;
                    margin: 0 0 0 15px;
                    border: solid 1px white;
                    border-radius: 10px;
                    color: white;
                    font-size: 12px;
                }
            }

            #bs2nd-show-units-panel {
                flex-grow: 2;
                overflow-y: scroll;
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
                margin: 10px 0 15px 0;
                width: 100%;
                max-width: 400px;
                border: solid 2px white;
                border-radius: 20px;
                padding: 25px 0 200px 0;
                &::-webkit-scrollbar {
                    width: 5px;
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 2px;
                }
            }
        }
        .panel-box {
            h2 {
                margin: 0 0 5px 0;
            }
            p {
                margin: 0 0 25px 0;
                font-size: 12px;
            }
        }
        #bs2nd-deck-select-slider {
            position: fixed;
            top: 50px;
            right: -250px;
            border: solid 2px white;
            border-radius: 20px 0 0 20px;
            &.open {
                right: -5px;
            }
        }
        #bs2nd-deck-select-panel {
            border: solid 2px white;
            border-radius: 10px;
        }
        #bs2nd-deck-select-slider,
        #bs2nd-deck-select-panel {
            width: 250px;
            height: 550px;

            background: linear-gradient(90deg, rgba(black, 1), rgba(black, 0.7));

            transition: 0.3s;
            padding: 5px 0 5px 5px;
            #bs2nd-deck-select-slider-button {
                position: absolute;
                border-top: solid 2px white;
                border-left: solid 2px white;
                border-bottom: solid 2px white;
                border-right: solid 4px black;
                background-color: black;
                border-radius: 15px 0 0 15px;
                top: 200px;
                left: -59px;
                width: 60px;
                height: 60px;
                img {
                    width: 40px;
                    margin: 8px auto;
                    transition: 0.5s 0.3s;
                    &.open {
                        transform: rotate(180deg);
                    }
                }
            }
        }
        #bs2nd-units-filter-slider {
            position: fixed;
            bottom: 80px;
            right: -300px;
            width: 300px;
            height: 600px;
            border: solid 2px white;
            border-radius: 15px 0 0 15px;
        }
        #bs2nd-units-filter-panel {
            width: 300px;
            height: 600px;
            border: solid 2px white;
            border-radius: 10px;
        }
        #bs2nd-units-filter-slider,
        #bs2nd-units-filter-panel {
            background: linear-gradient(45deg, rgba(black, 1), rgba(black, 0.7));

            transition: 0.3s;
            padding: 5px;
            &.open {
                right: 0;
            }
            #bs2nd-units-filter-slider-button {
                position: absolute;
                border-top: solid 2px white;
                border-left: solid 2px white;
                border-bottom: solid 2px white;
                border-right: solid 4px black;
                background-color: black;
                border-radius: 15px 0 0 15px;
                bottom: 10px;
                left: -59px;
                width: 60px;
                height: 60px;
                img {
                    width: 40px;
                    margin: 8px auto;
                    transition: 0.5s 0.3s;
                    &.open {
                        transform: rotate(180deg);
                    }
                }
            }
        }
    }
</style>
