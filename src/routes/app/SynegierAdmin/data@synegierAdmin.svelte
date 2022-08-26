<script lang="ts">
    import { getCardDatus, healthCheck } from '$lib/api/app/synegierAdmin'
    import { onMount } from 'svelte'
    import Card from '$lib/component/SynegierAdmin/Card.svelte'
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { sleep } from '$lib/util/time'
    import easytoast from '$lib/component/toast/summon'
    import RoundFloweringLoader from '$lib/component/Loader/roundFloweringLoader.svelte'

    let isLoading = true
    let isSysterError = false
    let isLogoActive = false
    let datus: SynegierCard[] = []
    let datusDivRarity: { [name: string]: SynegierCard[] } = {
        C: [],
        R: [],
        SR: [],
        LE: []
    }

    onMount(async () => {
        try {
            isLoading = true
            await healthCheck()
            // await sleep(3000)
            datus = await getCardDatus('synegier_is_god_this_is_35')
            console.log(datus)
            datusDivRarity.C = datus.filter((card) => card.rarity == 'C')
            datusDivRarity.R = datus.filter((card) => card.rarity == 'R')
            datusDivRarity.SR = datus.filter((card) => card.rarity == 'SR')
            datusDivRarity.LE = datus.filter((card) => card.rarity == 'LE')
        } catch {
            isSysterError = true
            easytoast.errorToastPush(
                'システムエラー中です。<br>必要であれば管理者に問い合わせてください。'
            )
        } finally {
            isLoading = false
            isLogoActive = true
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
        <div />
    {:else}
        <div id="synegierDataCardList" class="com_scroll-y">
            {#each Object.entries(datusDivRarity) as [rarity, ds]}
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
            {/each}
        </div>
    {/if}
</section>

<style lang="scss">
    #loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
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
