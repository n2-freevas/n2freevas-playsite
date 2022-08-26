<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import DamageKanComponent from './DamageKanComponent.svelte'
    import type { PoisonKan, BurnKan, DamageKan } from '$lib/model/app/PokemonCardGameEffectorStore'
    import PoisonKanComponent from './PoisonKanComponent.svelte'
    import BurnKanComponent from './BurnKanComponent.svelte'

    let dx = 40
    let dy = 250
    // let moving = false

    const initPositionDamageKan = { x: 50, y: 0 }
    const initPositionPoisonKan = { id: 100, x: 200, y: 25, damage: 10, active: false }
    const initPositionBurnKan = { id: 100, x: 300, y: 25, damage: 10, active: false }

    let damageKanArray: DamageKan[] = []
    let poisonKan: PoisonKan = Object.assign({}, initPositionPoisonKan)
    let burnKan: BurnKan = Object.assign({}, initPositionBurnKan)

    onMount(() => {
        let id_counter = 0
        for (let i = 0; i < 10; i++) {
            damageKanArray.push({
                id: id_counter,
                x: initPositionDamageKan.x,
                y: initPositionDamageKan.y + id_counter * 2,
                counter: 0
            })
            id_counter += 1
        }
        // 再描画を誘発
        damageKanArray = damageKanArray
    })
    // function mouseDownHandler(){
    //     moving = true
    // }
    // function mouseMoveHandler(event: MouseEvent){
    //     if (moving){
    //         dx -= event.movementX
    //         dy += event.movementY
    //     }
    // }
    // function mouseUpHandler(){
    //     moving = false
    // }
    function resetDamageKanPosition() {
        let i = 0
        damageKanArray.forEach((item) => {
            ;(item.x = initPositionDamageKan.x), (item.y = initPositionDamageKan.y + i * 2)
            item.counter = 0
            i += 1
        })
        // 再描画を誘発
        damageKanArray = damageKanArray
        poisonKan = Object.assign({}, initPositionPoisonKan)
        burnKan = Object.assign({}, initPositionBurnKan)
    }
</script>

<div class="storage-box" style="--dx:{dx}px;--dy:{dy}px;">
    {#each damageKanArray as item}
        <DamageKanComponent model={item} />
    {/each}
    <PoisonKanComponent model={poisonKan} />
    <BurnKanComponent model={burnKan} />
    <button on:click={resetDamageKanPosition}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 501 503"
            ><path
                d="m300.2 272.2 36.2 60.2a43 43 0 0 0 47.8 18.9l84.1-24v110c0 14.6-9.9 27.2-24 30.8l-134.6 33.6a41.3 41.3 0 0 1-20.4 0l-134.6-33.6a31.7 31.7 0 0 1-24-30.7V327.3l84.1 24a43 43 0 0 0 47.8-18.9l36.2-60.2h1.4ZM138.4 209l161.1 19.5-54.9 91.6a20.7 20.7 0 0 1-23.8 10l-107.5-30.8a21 21 0 0 1-13-29.7l27.4-54.9c2-4 6.3-6.3 10.7-5.7Zm333 5.7 27.4 55c5.8 11.7-.4 26-13.1 29.6l-107.5 30.8c-9.1 2.5-19-1.3-23.8-10l-54.9-91.6 161.1-19.5c4.4-.6 8.7 1.7 10.7 5.7ZM181.5 1.5c58.8 9.2 109 42.5 150.7 100.1l21-5.4-6-35L369.4 92l3.8-1-9-31.4 23.1 27.7 33.2-8.6c22.1-6-66.4 126.3-83.1 130.1-16.7 4-182-60.6-156.8-67.5l32.2-8.6-2.2-30.6 14.3 27.5 6.7-1.8-5.7-33 20.5 29.1 12.5-3.2C239.3 82.3 201.8 59.9 146 53.5c-63-7.3-111.3 14.2-145 64.5l-1 1.5 1.6-2.6C57.7 30 117.6-8.4 181.7 1.5ZM269 164l3.3 18.4 38.1 15v-4.8L269 164Zm101-21-19 40v8l19-27.5V143Z"
                fill="#000"
                fill-rule="nonzero" /></svg>
    </button>
</div>

<style lang="scss">
    .storage-box {
        position: absolute;
        right: var(--dx);
        top: var(--dy);
        width: 120px;
        height: 500px;
        background: linear-gradient(127deg, rgb(1, 0, 12), rgb(13, 22, 53));
        /* box-shadow: 10px 10px 1px rgba(255,255,255,0.3); */
        border-radius: 100px / 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    button {
        --size: 40px;
        position: absolute;
        right: 40px;
        bottom: 20px;
        background: white;
        width: var(--size);
        height: var(--size);
        border-radius: calc(var(--size) / 2);
        svg {
            width: 100%;
            height: 100%;
        }
    }
</style>
