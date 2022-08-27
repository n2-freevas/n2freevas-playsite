<script lang="ts">
    import { getCardDatus} from '$lib/api/app/synegierAdmin'
    import { N2API_ERROR_CODE } from '$lib/api/api'
    import { onMount } from 'svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { sleep } from '$lib/util/time'
    import easytoast from '$lib/component/toast/summon'
    import { showLoading, hideLoading } from './__layout-synegierAdmin.svelte'
    import TwoPick from '$lib/component/SynegierAdmin/Simulator/TwoPick.svelte'
    import { synegierAdminAccessToken } from '$lib/store/app/synegierAdmin'

    let isSysterError = false
    let datus: SynegierCard[] = []

    type phaseList = '2pick' | 'sweep' | 'boss' |''
    let nowPhase: phaseList = ''

    onMount(async () => {
        try {
            showLoading(window)
            datus = await getCardDatus($synegierAdminAccessToken)
            await sleep(1000)
            nowPhase = '2pick'
        } catch (e){
            console.error(`In Simulator: ${e}`)
            if(e == N2API_ERROR_CODE.ACCESS_INVALID){
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
</script>


{#if isSysterError}
    <div>System Error, try again?</div>
{:else if nowPhase == '2pick'}
    <TwoPick cardDatus={datus} />
{/if}

