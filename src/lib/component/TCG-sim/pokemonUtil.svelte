<script lang="ts">
    import { deckListStore, boardListStore } from '$lib/store/app/TCGsimStore'

    function putsSide() {
        let top_six_cards = $deckListStore.slice(0, 6)
        let i = 0
        top_six_cards.forEach((card) => {
            $boardListStore.push({
                ...card,
                x: 25,
                y: 25 + i,
                rotate: 90
            })
            i += 50
        })
        $boardListStore = $boardListStore
    }
</script>

<div id="pokemon_utils">
    <button on:click={putsSide}>puts side</button>
</div>

<style lang="scss">
    #pokemon_utils {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        button {
            background: var(--color_pokemon);
            position: relative;
            font-family: 'Press Start 2P', cursive;
            height: 36px;
            padding: 5px;
            margin: 10px 0;
            width: 180px;
            &::after {
                content: '';
                position: absolute;
                top: 0;
                right: -20px;
                --af_size: 25px;
                border-left: 20px solid var(--color_pokemon);
                border-bottom: 36px solid transparent;
            }
        }
    }
</style>
