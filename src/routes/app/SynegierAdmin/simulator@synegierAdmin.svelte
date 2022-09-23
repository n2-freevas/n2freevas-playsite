<script lang="ts">
    import { getCardDatus } from '$lib/api/app/synegierAdmin'
    import { N2API_ERROR_CODE } from '$lib/api/api'
    import { onMount } from 'svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { sleep } from '$lib/util/time'
    import easytoast from '$lib/component/toast/summon'
    import { showLoading, hideLoading } from './__layout-synegierAdmin.svelte'
    import { synegierAdminAccessToken, deckStore } from '$lib/store/app/synegierAdmin'
    import Duel from './_Simulator/Duel.svelte'
    import TwoPick from './_Simulator/TwoPick.svelte'

    let isSysterError = false
    let datus: SynegierCard[] = []

    type phaseList = '2pick' | 'sweep' | 'boss' | ''
    let nowPhase: phaseList = ''

    let isShowScreen: boolean = false

    onMount(async () => {
        try {
            showLoading(window)
            datus = await getCardDatus($synegierAdminAccessToken)

            $deckStore = datus.slice(0, 4)
            nowPhase = 'sweep'
            // await sleep(1000)
            // nowPhase = '2pick'
        } catch (e) {
            console.error(`In Simulator: ${e}`)
            if (e == N2API_ERROR_CODE.ACCESS_INVALID) {
                $synegierAdminAccessToken = new Date().toISOString()
            }
            isSysterError = true
            easytoast.errorToastStaying(
                'システムエラー中です。<br>必要であれば管理者に問い合わせてください。'
            )
        } finally {
            hideLoading(window)
        }
    })

    function gotoDuel() {
        isShowScreen = true
        window.setTimeout(() => {
            nowPhase = 'sweep'
            isShowScreen = false
        }, 800)
    }
</script>

{#if isSysterError}
    <div>System Error, try again?</div>
{:else if nowPhase == '2pick'}
    <TwoPick cardDatus={datus} on:finish={gotoDuel} />
{:else if nowPhase == 'sweep'}
    <Duel />
{/if}
<div id="screenAnimation" class={isShowScreen ? 'open' : ''} />

<style lang="scss">
    #screenAnimation {
        position: fixed;
        width: 0;
        height: 100%;
        background: black;
        transition: 0.3s;
        &.open {
            width: 100%;
        }
    }
</style>
