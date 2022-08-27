<script lang="ts">
import Movement from "./_Movement.svelte";

import SynegierText from "./_SynegierText.svelte";

    export let isShowDetail: boolean = false
    export let sideOfShowDetail: "left" | "right" = "left"
    export let model
    
</script>

{#if model}
<div class="cardDetail {isShowDetail? "show":""} {sideOfShowDetail}">
    <div class="cardDetailLeft">
        <img src={model.img} alt=""/>
    </div>
    <div class="cardDetailRight">
        <div class="cardDetailName">
            <div class="name">{model.name}</div>
            <div class="cost"><span>{model.cost}</span>cost</div>
        </div>
        <SynegierText synegierText={model.synegierText} showText={true}
            savingShow={true}/>
        <div class="cardBottomInfo">
            <div class="textInfo">
                {@html model.text}
            </div>
            <Movement movement={model.movement} redTiles={model.redTiles} scale={1}
                showBlankTile={true}/>
        </div>
    </div>
</div>
{/if}
