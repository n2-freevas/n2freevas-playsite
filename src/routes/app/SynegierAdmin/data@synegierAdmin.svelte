<script lang="ts">
    import { N2API_ERROR_CODE } from '$lib/api/api'
    import { getCardDatus } from '$lib/api/app/synegierAdmin'
    import { onMount } from 'svelte'
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import easytoast from '$lib/component/toast/summon'
    import { showLoading, hideLoading } from './__layout-synegierAdmin.svelte'
    import { synegierAdminAccessToken, cardDatus } from '$lib/store/app/synegierAdmin'
    import { sleep } from '$lib/util/time'

    let isSysterError = false
    let datus: SynegierCard[] = []
    let datusDivRarity: { [name: string]: SynegierCard[] } = {
        C: [],
        R: [],
        SR: [],
        LE: []
    }

    onMount(async () => {
        try {
            showLoading(window)

            datus = await getCardDatus($synegierAdminAccessToken)

            await sleep(1000)
            datusDivRarity.C = datus.filter((card) => card.rarity == 'C')
            datusDivRarity.R = datus.filter((card) => card.rarity == 'R')
            datusDivRarity.SR = datus.filter((card) => card.rarity == 'SR')
            datusDivRarity.LE = datus.filter((card) => card.rarity == 'LE')
        } catch (e) {
            console.error(`In Data: ${e}`)
            if (e == N2API_ERROR_CODE.ACCESS_INVALID) {
                $synegierAdminAccessToken = new Date().toISOString()
            }
            isSysterError = true
            easytoast.errorToastPush(
                'システムエラー中です。<br>必要であれば管理者に問い合わせてください。'
            )
        } finally {
            hideLoading(window)
        }
    })
</script>

<section>
    {#if isSysterError}
        <div />
    {:else}
        <div id="synegierDataCardList" class="com_scroll-y">
            {#each Object.entries(datusDivRarity) as [rarity, ds]}
                {#if ds.length != 0}
                    <div class="rarityBox">
                        <h1>{rarity}</h1>
                        <div class="list">
                            {#each ds as d}
                                <div class="card">
                                    <Card model={d} scale={0.25} />
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</section>

<style lang="scss">
    #synegierDataCardList {
        height: 85vh;
        max-width: 1100px;
        margin: 0 auto;
    }
    .rarityBox {
        margin: 30px 0;
        .list {
            display: flex;
            flex-wrap: wrap;
            .card {
                margin: 5px;
            }
        }
    }
</style>
