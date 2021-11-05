<script lang="ts">
    import {decks, deckStore, isDeckFullStore, setDecks} from '$lib/store/app/bs2ndStore'
    import easytoast from '$lib/component/toast/summon'
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
    
    
    function deckRegisterHandler(deckid){
        console.log(deckid, $isDeckFullStore)
        if ($isDeckFullStore){
            $decks[deckid-1].list = $deckStore
            $decks[deckid-1].deckname = '新規デッキ'
            setDecks($decks)
        }
        else{
            easytoast.errorToastPush('デッキを編成にて<br>12体揃えてください。')
        }
    }
    function deckNameChangeHandler(deckid, deckname){
        $decks[deckid-1].deckname = deckname
        setDecks($decks)
    }

    function deckRemoveHandler(deckid){
        $decks[deckid-1].list = []
        $decks[deckid-1].deckname = ''
        setDecks($decks)
    }

    function deckAdoptHandler(deckid){
        console.log($decks[deckid-1].list)
        $deckStore = $decks[deckid-1].list
        dispatch('click');
    }



</script>
<section id='deck-list-panel'>
    {#each $decks as d}
        {#if d.list.length != 0}
        <div class='deck-box'>
            <input placeholder="deck name" class='deck-name' bind:value={d.deckname} on:change={()=>{deckNameChangeHandler(d.deckid, d.deckname)}}>
            <div class='deck-thumbnail' on:click={()=>deckAdoptHandler(d.deckid)}>
                <div class='deck-img' style="--url:url({d.list[0].figure})"></div>
                <div class='deck-img-filter'></div>
            </div>
            <div class='deck-list' on:click={()=>deckAdoptHandler(d.deckid)}>
                {#each d.list as dl, i}
                    {#if i!=0}
                        <img src='{dl.figure}' alt=''>
                    {/if}
                    
                {/each}
            </div>
            <div class='deck-delete-button' on:click={()=>deckRemoveHandler(d.deckid)}>
                <img src='/img/trash.svg' alt='削除'>
            </div>
        </div>
        {:else}
        <div class='deck-box'>
            <input style="color:gray;" class='deck-name' value={"Empty"} disabled={true}>
            <div class='deck-thumbnail' on:click={()=>deckRegisterHandler(d.deckid)}>
                <img class='deck-img-blank' src="/img/add_people.svg" alt='add deck'>
            </div>
        </div>
        {/if}
    
    {/each}
</section>
<style lang="scss">
    #deck-list-panel{
        font-family: 'Kosugi Maru', sans-serif;
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .deck-box{
            width:100%;
            height:100px;
            position: relative; 
            .deck-name{
                position: absolute;
                color:white;
                background:none;
                border:none;
                z-index:15;
                width:150px;
                font-size:15px;
                top:20px;
                left:10px;
                &:focus{
                    outline: none;
                    border: solid 1px var(--active-yellow);
                    border-radius: 5px;
                }
            }
            .deck-thumbnail{
                position: absolute;
                top:10px;
                right:0;
                width:70%;
                height:80px;
                .deck-img{
                    position: absolute;
                    width:100%;
                    height:inherit;
                    background-image: var(--url);
                    background-size: cover;
                    background-position: 50% 30%;
                    background-repeat: no-repeat;
                    background-blend-mode: screen;
                }
                .deck-img-blank{
                    position: absolute;
                    right:40px;
                    top:20px;
                    width:auto;
                    height:40px;
                    background-image: var(--url-blank);
                }
                .deck-img-filter{
                    position: absolute;
                    width:100%;
                    height:100%;
                    background: linear-gradient(to right,rgba(0,0,0,0.9), rgba(0,0,0,0)); 
                }
            }
            .deck-list{
                position: absolute;
                z-index:10;
                left:10px;
                bottom:0px;
                width:180px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap-reverse;
                
                img{
                    width:25px;
                    margin:0 3px 0 0;
                }
            }
            .deck-delete-button{
                position: absolute;
                bottom:0;right:10px;
                img{
                    width:30px;
                }
            }
        }
    }
</style>
