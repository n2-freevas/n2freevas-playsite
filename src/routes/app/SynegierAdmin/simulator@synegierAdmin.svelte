<script lang="ts">
    import { getCardDatus, healthCheck } from '$lib/api/app/synegierAdmin'
    import { onMount } from 'svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { sleep } from '$lib/util/time'
    import easytoast from '$lib/component/toast/summon'
    import RoundFloweringLoader from '$lib/component/Loader/roundFloweringLoader.svelte'
    import TwoPick from '$lib/component/SynegierAdmin/Simulator/TwoPick.svelte'

    let isLoading = true
    let isSysterError = false
    let datus: SynegierCard[] = []

    type phaseList = '2pick' | 'sweep' | 'boss'
    let nowPhase: phaseList = '2pick'

    onMount(async () => {
        try {
            isLoading = true
            await healthCheck()
            // await sleep(3000)
            datus = await getCardDatus('synegier_is_god_this_is_35')
        } catch {
            isSysterError = true
            easytoast.errorToastStaying(
                'システムエラー中です。<br>必要であれば管理者に問い合わせてください。'
            )
        } finally {
            isLoading = false
        }
    })
</script>

<section>
    {#if isLoading}
        <div id="loading">
            <RoundFloweringLoader />
            synegier admin
        </div>
    {:else if isSysterError}
        <div>System Error, try again?</div>
    {:else if nowPhase == '2pick'}
        <TwoPick cardDatus={datus} />
    {/if}
</section>

<style lang="scss">
    #loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
