<script lang="ts">
    import { kanaStore } from '$lib/store/app/bs2ndStore'

    function kanaClickHandler(kanaId) {
        for (let i = 0; i < $kanaStore.length; i++) {
            if ($kanaStore[i].id == kanaId) {
                $kanaStore[i].active = $kanaStore[i].active ? false : true
                break
            }
        }
    }
</script>

<article id="kana-filter-box">
    <section id="kana-box">
        {#each $kanaStore as k}
            {#if k.kanas[0] != ''}
                <div
                    class="kana {k.active ? 'active' : ''}"
                    on:click={() => kanaClickHandler(k.id)}>
                    {k.kanas[0]}
                </div>
            {:else}
                <div class="kana-blank" />
            {/if}
        {/each}
    </section>
    <p>* 濁音や促音などは、全てその直音に含まれます。</p>
</article>

<style lang="scss">
    #kana-filter-box {
        width: 100%;
        font-family: 'Kosugi Maru', sans-serif;
        p {
            margin: 10px 0 0 0;
            font-size: 10px;
        }
    }
    #kana-box {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        --kana-box-size: 38px;
        .kana {
            cursor: pointer;
            border: solid 1px white;
            border-radius: 3px;
            width: var(--kana-box-size);
            height: var(--kana-box-size);
            margin: 2px 5px;
            line-height: var(--kana-box-size);
            text-align: center;
            &.active {
                border-color: var(--active-yellow);
                color: var(--active-yellow);
            }
        }
        .kana-blank {
            width: var(--kana-box-size);
            height: var(--kana-box-size);
            margin: 2px;
        }
    }
</style>
