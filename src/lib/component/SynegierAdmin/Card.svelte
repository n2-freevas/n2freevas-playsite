<script lang="ts">
    import type { SynegierCard } from '$lib/model/app/SynegierAdmin'
    import { MovementMap } from '$lib/model/app/SynegierAdmin'
    export let model: SynegierCard
    export let scale: number = 1
    let showText: boolean = true
    if(scale != 1){
        showText = false
    }
</script>


<div class='cardBody' style="--scale:{scale}">
    <div class='backgroundFrame {model.rarity}'></div>
    <img src={model.img} alt="">
    <div class='cardInfo'>
        <div class="cardTopInfo">
            <div class='cost {model.rarity}'>
                {model.cost}
            </div>
            <div class="name">{#if showText}{model.name}{/if}</div>
        </div>
        <div class="synegierTextInfo">
            {#each model.synegierText as st}
                <div class="{st.type} {st.color}">{#if showText}{st.text}{/if}</div>
            {/each}
        </div>
        <div class="cardBottomInfo">
            <div class="textInfo">
                {#if showText}{@html model.text}{/if}
            </div>
            <div class="movementInfo">
                {#each MovementMap as mm}
                    {#if mm.v == 0 && mm.h == 0}
                        <div class='center'></div>
                    {:else}
                        {#if model.movement.find(m => m.v ==  mm.v && m.h == mm.h)}
                            <div class="active"></div>
                        {:else if model.redTiles?.find(m => m.v ==  mm.v && m.h == mm.h)}
                            <div class="fuck"></div>
                        {:else}
                            <div></div>
                        {/if}
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .cardBody{
        --C_colorRule: linear-gradient(0, #b8b8b8, #e2e2e2);
        --R_colorRule: linear-gradient(0, #89c6ff, #bc9cff);
        --SR_colorRule: linear-gradient(0, #ffc700, #ffe600);
        --LR_colorRule_cost: conic-gradient(from 180deg at 50% 50%, #C750FF 0%, #FF6F6F 10%, #FFE976 34%, #FFFB72 53%, #4DF4FF 71%, #C750FF 100%);
        --LR_colorRule_frame: conic-gradient(from 180deg at 50% 50%, #5B7DFF 0%, #B157FF 15%, #FF5B5B 42%, #FFD600 60%, #31FFCE 71%, #5B7DFF 100%);
        --w: calc( 378px * var(--scale) );
        --h: calc( 600px * var(--scale) );
        --b: calc( 9px * var(--scale) );
        --c: calc( 70px * var(--scale) );
        --synegierTextWidth: calc( 320px * var(--scale) );
        --synegierTextHeight: calc( 45px * var(--scale) );
        --synegierTextRibbonWidth: calc( 22px * var(--scale) );
        --synegierTextMargin: calc( ( 20px * var(--scale) ) + var(--synegierTextHeight) );
        --fontsize: calc( 10px * var(--scale));
        --costFontSize: calc( 32px * var(--scale) );
        --nameBarWidth: calc( var(--w) * 0.634 );
        --cardSpacing25: calc( var(--h) / 24);
        --cardSpacing20: calc( var(--h) / 30);
        --cardSpacing15: calc( var(--h) * 0.025);
        --cardSpacing10: calc( var(--h) / 60);
        --cardSpacing05: calc( var(--h) / 120);
        --basicTextWidth: calc( 340px * var(--scale) );
        --basicTextHeight: calc( 140px * var(--scale) );
        --basicTextPadding: calc( 10px * var(--scale) );
        --movementBoxWidth: calc( 120px * var(--scale) );
        --movementBoxHeight: calc( 120px * var(--scale) );
        --movementCellMargin: calc( 2px * var(--scale) );
        --movementCellWidth: calc( ( var(--movementBoxWidth) - ( var(--movementCellMargin) * 14 ) ) / 7);
        --movementCellHeight: calc( ( var(--movementBoxHeight) - ( var(--movementCellMargin) * 14 ) ) / 7);
        font-size: var(--fontsize);
        // transform: scale(var(--scale));

        position: relative;
        margin:unset;
        width: var(--w);
        height: var(--h);
        font-family: 'Press Start 2P', cursive;
    }
    .backgroundFrame{
        position: absolute;
        width: inherit;
        height: inherit;
        &.C{background: var(--C_colorRule);}
        &.R{background: var(--R_colorRule);}
        &.SR{background: var(--SR_colorRule);}
        &.LE{background: var(--LR_colorRule_frame);}
    }
    img{
        position: absolute;
        border-radius: calc( var(--b) * 2 );
        width: calc( var(--w) - ( var(--b) * 2 ) );
        height: calc( var(--h) - ( var(--b) * 2 ) );
        top: var(--b);
        left: var(--b);
        image-rendering: pixelated;
    }
    .cardInfo{
        position: absolute;
        top:0;
        left:0;
        width:inherit;
        height:inherit;
        .cardTopInfo{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--cardSpacing20) var(--cardSpacing15);
            text-align: center;
            .cost{
                width: var(--c);
                height: var(--c);
                border-radius: calc( var(--c) / 2 );
                line-height: var(--c);
                font-size: var(--costFontSize);
                &.C{color: black; background: var(--C_colorRule);}
                &.R{color: white; background: var(--R_colorRule);}
                &.SR{color: white; text-shadow: 3px 3px 0px #FF8A00; background: var(--SR_colorRule);}
                &.LE{color: white; text-shadow: 3px 3px 3px #393939; background: var(--LR_colorRule_cost);}
            }
            .name{
                width: var(--nameBarWidth);
                margin-bottom: var(--nameBarMarginBottom);
                background: rgba($color: #000000, $alpha: 0.7);
                padding: 0 var(--cardSpacing10);
                --nameHeight: calc( var(--fontsize) * 2.5 );
                height: var(--nameHeight);
                border-radius: var(--nameHeight);
                line-height: var(--nameHeight);
            }
        }
        .synegierTextInfo{
            position: relative;
            width:inherit;
            height: calc( var(--synegierTextMargin) * 4 + var(--synegierTextHeight) );
            div{
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                width: var(--synegierTextWidth);
                height: var(--synegierTextHeight);
                background: rgba($color: #000000, $alpha: 0.6);
                padding: 0 var(--cardSpacing20);
                align-items: center;
                &::before{
                    position: absolute;
                    content: "";
                    width: var(--synegierTextRibbonWidth);
                    height: var(--synegierTextHeight);
                }
                &.blue{
                    &::before{background: #0085FF;}
                    top:0;
                }
                &.green{
                    &::before{background: #00c036;}
                    top: var(--synegierTextMargin);
                }
                &.yellow{
                    &::before{background: #ffc700;}
                    top:calc( var(--synegierTextMargin) * 2 );
                }
                &.red{
                    &::before{background: #e40000;}
                    top:calc( var(--synegierTextMargin) * 3 );
                }
                &.purple{
                    &::before{background: #c600e6;}
                    top:calc( var(--synegierTextMargin) * 4 );
                }
                &.s, &.subject{
                    right:0;
                    &::before{
                        left: calc( -1 * var(--synegierTextRibbonWidth) )
                    }
                }
                &.v, &.verbus{
                    left:0;
                    &::before{
                        right: calc( -1 * var(--synegierTextRibbonWidth) )
                    }
                }
            }   
        }
        .cardBottomInfo{
            display: flex;
            width: var(--basicTextWidth);
            height: var(--basicTextHeight);
            background: rgba($color: #000000, $alpha:0.4);
            margin: var(--cardSpacing25) auto;
            align-items: center;
            padding:0 var(--basicTextPadding);
            .textInfo{
                display: flex;
                align-items: center;
                width: calc( var(--basicTextWidth) - var(--movementBoxWidth) - ( var(--basicTextPadding) * 2 ));
                padding:var(--cardSpacing15) var(--cardSpacing05);
            }
            .movementInfo{
                width: var(--movementBoxWidth);
                height: var(--movementBoxHeight);
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                div{
                    width: var(--movementCellWidth);
                    height: var(--movementCellHeight);
                    
                    margin: var(--movementCellMargin);
                    &.center{
                        position: relative;
                        background: white;
                        &::before{
                            content: "";
                            position: absolute;
                            width: calc( var(--movementCellWidth) * 0.6);
                            height: calc( var(--movementCellHeight) * 0.6);
                            top:50%;
                            left:50%;
                            transform: translate(-50%, -50%);
                            background: #444444;
                        }

                    }
                    &.active{
                        background: white;
                    }
                }
            }
        }
    }
        

    

</style>
