<script lang="ts" context="module">
    export function showLoading(win: Window){
        win.document.getElementById("loading").classList.add("show")
    }
    export function hideLoading(win: Window){
        win.document.getElementById("loading").classList.remove("show")
    }
</script>

<script lang="ts">
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte';
    import { ENV, ENV_SYNEGIER_ADMIN_ACCESS_TOKEN } from '$lib/K/env'
    import ToastArea from '$lib/component/toast/ToastArea.svelte'
    import { healthCheck, tryPassingAuth } from '$lib/api/app/synegierAdmin'
    import { synegierAdminAccessToken, cardDetailLeft, cardDetailRight } from '$lib/store/app/synegierAdmin'
    import easytoast from '$lib/component/toast/summon';
    import RoundFloweringLoader from '$lib/component/Loader/roundFloweringLoader.svelte'
    import { sleep } from '$lib/util/time';
import CardDetail from '$lib/component/SynegierAdmin/CardDetail.svelte';
    
    // Require : Size of parent element is width:1100px height:800px.
    let requireWidth = 1100
    let requireHeight = 800
    let isShowPasswordUI = true
    let accessToken = ""
    let isCheckingPassword = false
    if (ENV == 'dev'){
        isShowPasswordUI = false
        accessToken = ENV_SYNEGIER_ADMIN_ACCESS_TOKEN
        $synegierAdminAccessToken = ENV_SYNEGIER_ADMIN_ACCESS_TOKEN
        console.info("Development Mode")
    }
    let isShowAll = false
    
    $:{
        if(accessToken != $synegierAdminAccessToken){
            isShowPasswordUI = true
        }
    }
    
    onMount(async ()=>{
        isShowAll = checkDisplayRequirement(window.innerWidth, window.innerHeight)
        if(isShowAll){
            try{
                await healthCheck()
                hideLoading(window)
            } catch {
                easytoast.errorToastStaying(`システムが停止している可能性があります。開発者に問い合わせてください。<br>発生時刻： ${new Date().toISOString()}`)
            }
        }
    })
    
    function checkDisplayRequirement(width, height): boolean {    
        if (!width || !height) {
            easytoast.toastStay(
                `Require browser size is ${requireWidth}*${requireHeight}.<br>Resize brouser and reload page.`
            )
        }
        if (width >= requireWidth && height >= requireHeight) {
            return true
        } else if (width < requireWidth && height < requireHeight) {
            easytoast.remove()
            easytoast.toastStay(
                `Require browser size is ${requireWidth}*${requireHeight}.<br>Resize brouser and reload page.`
            )
            return false
        } else if (width < requireWidth) {
            easytoast.remove()
            easytoast.toastStay(
                `Require
                 inner width of browser is ${requireWidth}.<br>Resize brouser and reload page.`
            )
            return false
        } else if (height < requireHeight) {
            easytoast.remove()
            easytoast.toastStay(
                `Require
                 inner height of browser is ${requireHeight}.<br>Resize brouser and reload page.`
            )
            return false
        } else {
            easytoast.remove()
            easytoast.toastStay(`Please reload a page, because UI error.`)
            return false
        }
    }

    async function enteredPassword(event: KeyboardEvent){
        if(event.code == "Enter") {
            try{
                isCheckingPassword = true
                await sleep(1000)
                await tryPassingAuth(accessToken)
                
                $synegierAdminAccessToken = accessToken
                isShowPasswordUI = false
            } catch(e) {
                isShowPasswordUI = true
                easytoast.errorToastPush("Invalid accessToken")
            } finally {
                isCheckingPassword = false
            }
        }
    }
</script>

<svelte:window on:contextmenu|preventDefault />

<article id="synegierAdminLayout">
    <header>
        <div class="title">
            <img src="/img/synegierAdmin/logo_illust.png" alt="" />
            synegier<br />admin
        </div>
        <div class="pagelinks">
            <div
                on:click={() => {
                    goto('/app/SynegierAdmin/simulator')
                }}>
                Simulator
            </div>
            <div
                on:click={() => {
                    goto('/app/SynegierAdmin/data')
                }}>
                Data
            </div>
            <div
                on:click={() => {
                    goto('/app/SynegierAdmin/document')
                }}>
                Document
            </div>
        </div>
    </header>
    {#if isShowAll}
        <div id="loading" class="show">
            <RoundFloweringLoader />
            synegier admin
        </div>
        {#if isShowPasswordUI}
            <div id="passwordUI" class={isShowPasswordUI? "show":""}>
                Are you member?
                <input bind:value={accessToken} placeholder="Enter the accessToken" maxlength={55} on:keydown={enteredPassword}/>
                {#if isCheckingPassword}
                <RoundFloweringLoader small_round_size={20} large_round_size={30}/>
                {/if}
            </div>
        {:else}
            <div id="slot">
                <slot />
            </div>
            <CardDetail model={$cardDetailLeft} sideOfShowDetail="left" isShowDetail={$cardDetailLeft? true:false}></CardDetail>
            <CardDetail model={$cardDetailRight} sideOfShowDetail="right" isShowDetail={$cardDetailRight? true:false}></CardDetail>
        {/if}
    {/if}
</article>

<ToastArea />

<style lang="scss">
    #synegierAdminLayout {
        // width:100vw;
        // overflow: hidden;
        font-family: 'Press Start 2P', cursive;
    }
    header {
        z-index: 1;
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top: 20px;
        left: 5vw;
        width: 90vw;
        min-width: 300px;
        overflow: hidden;
        height: 60px;
        background: black;
        border-radius: 10px;
        background: rgba($color: #222222, $alpha: 0.9);
        div {
            padding: 0 20px;
            cursor: pointer;
        }
        .title {
            display: flex;
            align-items: center;
            margin-right: 200px;
            img {
                width: 45px;
                margin: 0 20px;
                filter: grayscale(0.4);
            }
        }
        .pagelinks {
            display: flex;
        }
    }
    #slot {
        z-index: 0;
        padding-top: 100px;
    }
    #passwordUI{
        position: fixed;
        --passwordUIWidth: 600px;
        --passwordUIHeight: 400px;
        width: var(--passwordUIWidth);
        height: var(--passwordUIHeight);
        top: calc( 50% - ( var(--passwordUIHeight) / 2 ) );
        left: calc( 50% - ( var(--passwordUIWidth) / 2 ) );
        background: rgba($color: #555555, $alpha: 0.3);
        padding: 10px;
        display:flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        input {
            margin: 20px 10px;
            background: rgba($color: #555555, $alpha: 0.3);
            border: none;
            color:white;
            text-align: center;
            padding: 10px;
            font-size: 13px;
        }
    }
    #loading {
        display: none;
        position: fixed;
        z-index: 100;
        padding: 150px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(rgba(#111111,1),rgba(#111111,0.8),rgba(#111111,0.1));
        &.show{
            display: block;
        }
    }
</style>
