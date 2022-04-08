<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import DamageKanComponent from "./DamageKanComponent.svelte";
    import type {PoisonKan, BurnKan, DamageKan} from '$lib/model/app/PokemonCardGameEffectorStore'
    
    const dispatch = createEventDispatcher()
    
    let dx = 50;
    let dy = 300;
    let moving = false

    let damageKanArray: DamageKan[] = []
    onMount(()=>{
        let id_counter = 0
        for(let i = 0; i<10; i++){
            damageKanArray.push({
                id:id_counter,
                x:0,
                y:0,
                counter: 100
            })
            id_counter += 1
        }
        damageKanArray = damageKanArray
    })
    function mouseDownHandler(){
        moving = true
    }
    function mouseMoveHandler(event: MouseEvent){
        if (moving){
            dx -= event.movementX
            dy += event.movementY
        }
    }
    function mouseUpHandler(){
        moving = false
    }

</script>

<svelte:window on:mouseup={mouseUpHandler} on:mousemove={mouseMoveHandler} />

<div class='storage-box' style="--dx:{dx}px;--dy:{dy}px;"
    on:mousedown={mouseDownHandler}
>
{#each damageKanArray as item}
    <DamageKanComponent model={item}></DamageKanComponent>    
{/each}

<button>整</button>
</div>


<style>
    .storage-box{
        position: absolute;
        right:var(--dx);
        top:var(--dy);
        width:120px;
        height:500px;
        background: linear-gradient(
            127deg,
            rgb(0, 0, 0),
            rgb(26, 32, 53)
        );
        box-shadow: -5px 10px 0 rgba(0,0,0,0.5);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    button{
        position: absolute;
        right:10px;
        bottom:10px;
        background: white;
        --size:40px;
        width:var(--size);
        height:var(--size);
        border-radius: calc( var(--size) / 2);
    }
</style>
