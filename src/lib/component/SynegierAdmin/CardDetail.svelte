<script lang="ts">
import Movement from "./_Movement.svelte";

import SynegierText from "./_SynegierText.svelte";

    export let isShowDetail: boolean = true
    export let sideOfShowDetail: "left" | "right" = "left"
    export let model
    
</script>

<div class="cardDetail {isShowDetail? "show":""} {sideOfShowDetail}">
    <div class="cardDetailLeft">
        <img src={model?.img} alt=""/>
    </div>
    <div class="cardDetailRight">
        <div class="cardDetailName">
            <div class="name">{model?.name}</div>
            <div class="cost"><span>{model?.cost}</span>cost</div>
        </div>
        <SynegierText synegierText={model?.synegierText} showText={true}
            savingShow={true}/>
        <div class="cardBottomInfo">
            <div class="textInfo">
                {@html model?.text}
            </div>
            <Movement movement={model?.movement} redTiles={model?.redTiles} scale={1}
                showBlankTile={true}/>
        </div>
    </div>
</div>

<style lang="scss">
    .cardDetail{
        z-index:90;
        --cardDetailWidth: 500px;
        --cardDetailLeftWidth: 150px;
        --cardDetailRightWidth: calc( var(--cardDetailWidth) - var(--cardDetailLeftWidth) );
        --cardDetailHeight: 300px;
        font-size: 10px;
        padding: 0 20px 0 0;
        position: fixed;
        display: flex;
        align-items: flex-start;
        width: var(--cardDetailWidth);
        background: rgba(#333333, 0.9);
        top: 20%;
        opacity: 0;
        transition: 0.2s;
        &.left{
            left: -100%;
        }
        &.right{
            right: -100%;
        }
        &.show{
            opacity: 1;
            &.left{
                left:50px;
            }
            &.right{
                right:50px;
            }
        }
        .cardDetailLeft{
            width:150px;
            padding: 20px 10px;
            img{
                width:100%;
                margin:0 auto;
                image-rendering: pixelated;
            }
        }
        .cardDetailRight{
            width: calc( var(--cardDetailWidth) - 150px );
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .cardDetailName{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding:15px 0;
                .cost{
                    span{
                        margin:0 3px;
                        font-size: 15px;
                    }
                }
                .name{
                    font-size: 14px;
                }
            }
            .cardBottomInfo{
                width: 100%;
                height: 100%;
                padding: 15px 0;
                margin: 0;
                background: none;
                justify-content: center;
                display: flex;
                .textInfo{
                    width: 200px;
                    padding:10px 10px 10px 0;
                }
            }
        }
    }
</style>
