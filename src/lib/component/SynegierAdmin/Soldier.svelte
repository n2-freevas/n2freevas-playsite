<script lang="ts">
    import type { SoldierCard } from '$lib/model/app/SynegierAdmin'
    import SynegierText from './_SynegierText.svelte'
    
    export let model: SoldierCard
    export let scale: 'small' | 'middle' | 'full'
</script>

<div class="soldier {scale}">
    <div class="topPart">
        <div class="topLeftPart {scale}">
            <img src={model.img} alt="" />
            {#if scale == 'full'}
                <div class="nameAndAka {scale}">
                    <div class="aka">{model.aka}</div>
                    <div class="name">{model.name}</div>
                </div>
            {/if}
        </div>
        <div class="topRightPart {scale}">
            <div class="titleBox">
                {#if scale == 'small'}
                    {model.name}
                {:else if scale == 'middle'}
                    <div class="titleBoxFullName">
                        {model.aka}<span>{model.name}</span>
                    </div>
                {:else}
                    <div>status</div>
                {/if}
            </div>
            <div class="statusBox {scale}">
                <div class="initStatus">
                    <div class="initStatusKey">
                        {#each Object.entries(model.initStatus) as [key, _]}
                            <div style="text-align: right;">{key}:</div>
                        {/each}
                    </div>
                    <div class="initStatusValue">
                        {#each Object.entries(model.initStatus) as [_, value]}
                            <div style="padding-left:10px; text-align:right;">{value}</div>
                        {/each}
                    </div>
                </div>
                {#if scale != 'small'}
                    {#each model.levelUpRule as rule}
                        <div class="levelUpRule">
                            <div>lv{rule.level}~</div>
                            <div style="text-align: right;">
                                {#if rule.HP > 0}+{/if}{rule.HP}
                            </div>
                            <div style="text-align: right;">
                                {#if rule.ATK > 0}+{/if}{rule.ATK}
                            </div>
                            <div style="text-align: right;">
                                {#if rule.DEF > 0}+{/if}{rule.DEF}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
            {#if scale != 'small'}
                <div class="abilityBox">
                    {@html model.ability}
                </div>
            {/if}
        </div>
    </div>
    {#if scale=='full'}
    <div class="synegierTextPart">
        <!-- <div class="synegierEffectBg">
            <svg width="215" height="128" viewBox="0 0 215 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M172 64L108 0L44 64L108 128L172 64ZM128.919 63.9555L107.955 42.9921L86.9921 63.9555L107.955 84.919L128.919 63.9555ZM35 45L16.2863 63.5L35 82V45ZM0 63.8453L12.9556 76.653V51.0376L0 63.8453ZM180 82L198.714 63.5L180 45V82ZM215 63.8453L202.044 51.0376L202.044 76.653L215 63.8453Z" fill="#303030"/>
            </svg>
        </div> -->
        <div class="soldierSynegierText">
            <SynegierText synegierText={model.synegierText} showText={true}></SynegierText>
        </div>
    </div>    
    {/if}
</div>

<style lang="scss">
    .soldier {
        font-size: 10px;
        background: #5c5c5c;
        padding: 10px;
        display: flex;
        border-radius: 10px;
        &.small{
            width:250px;
        }
        &.middle{
            width:490px;
        }
        &.full{
            width:800px;
        }
        
    }
    .topPart {
        display: flex;
    }
    img {
        image-rendering: pixelated;
    }
    .topLeftPart {
        position: relative;
        overflow: hidden;
        &.small {
            border-radius: 20px;
            width: 90px;
            height:120px;
        }
        &.middle {
            width: 150px;
        }
        &.full {
            width: 180px;
        }
        img {
            width: inherit;
        }
        .nameAndAka {
            position: absolute;
            width: 95%;
            bottom: 10px;
            left: 2.5%;
            text-align: center;
            &.middle {
                border-radius: 5px;
                padding: 10px;
            }
            &.full {
                border-radius: 10px;
                padding: 10px 0px;
            }
            .name {
                font-size: 13px;
            }
        }
    }
    .topRightPart {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 20px;
        &.middle {
            width: 300px;
        }
        &.full {
            width: 250px;
        }
    }
    .nameAndAka,
    .titleBox,
    .statusBox,
    .abilityBox {
        background: rgba(#000000, 0.7);
        padding: 10px 15px;
        border-radius: 10px;
    }
    .titleBox {
        padding: 5px 10px;
        text-align: center;
        .titleBoxFullName {
            display: flex;
            align-items: center;
            justify-content: center;
            span {
                padding: 0 15px;
                font-size: 14px;
            }
        }
    }
    .statusBox {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        &.small {
            font-size: 13px;
        }
    }

    .initStatus {
        display: flex;
        align-items: center;
        .initStatusKey,
        .initStatusValue {
            display: flex;
            flex-direction: column;
        }
        div {
            div {
                padding: 1px;
            }
        }
    }
    .levelUpRule {
        display: flex;
        flex-direction: column;
        div {
            padding: 1px;
        }
    }
    .abilityBox {
        padding: 20px 15px;
    }
    .synegierTextPart{
        position: relative;
        width:360px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .synegierEffectBg{
            position: absolute;
        }        
        .soldierSynegierText{
            width:inherit;
            transform: scale(0.8);
        }
    }
    
</style>
