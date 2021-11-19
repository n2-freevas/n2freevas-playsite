<script lang="ts">
    import { elemStore, tribeStore, gimmickStore } from '$lib/store/app/bs2ndStore'
    import {ElemEngDict, TribeEngDict, GimmickEngDict} from '$lib/model/app/Bs2ndModel'

    function elemClickHandler(id){
        for(let i=0; i < $elemStore.length; i++){
            if ($elemStore[i].id == id){
                $elemStore[i].active = $elemStore[i].active? false:true
                break
            }
        }
    }
    function tribeClickHandler(id){
        for(let i=0; i < $tribeStore.length; i++){
            if ($tribeStore[i].id == id){
                $tribeStore[i].active = $tribeStore[i].active? false:true
                break
            }
        }
    }
    function gimmickClickHandler(id){
        for(let i=0; i < $gimmickStore.length; i++){
            if ($gimmickStore[i].id == id){
                $gimmickStore[i].active = $gimmickStore[i].active? false:true
                break
            }
        }
    }

    

</script>


<article id='specify-filter-box'>
    <h3>属性</h3>
    <section id='elem-box'>
        {#each $elemStore as es, i}
            <div class='elem {ElemEngDict[es.elem]} {i<3?"long":""} {es.active ? "active":""}'
            on:click={() => elemClickHandler(es.id)}>{es.elem}</div>
        {/each}
    </section>
    <h3>種族</h3>
    <section id='tribe-box'>
        {#each $tribeStore as ts}
            <div class='tribe {TribeEngDict[ts.tribe]} {ts.active ? "active":""}'
            on:click={() => tribeClickHandler(ts.id)}>{ts.tribe}</div>
        {/each}
        <div class='tribe blank'></div>
    </section>
    <h3>ギミック</h3>
    <section id='gimmick-box'>
        {#each $gimmickStore as gs}
            <div class='gimmick {gs.active ? "active":""}' on:click={()=>gimmickClickHandler(gs.id)}>
                <img src={`/img/bs2nd/${GimmickEngDict[gs.gimmick]}.svg`} alt={gs.gimmick}></div>
        {/each}
    </section>
</article>


<style lang="scss">
    #specify-filter-box{
        width:100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        font-family: 'Kosugi Maru', sans-serif;
    }
    h3{
        margin:10px 0 0 0;
    }
    #elem-box, #tribe-box, #gimmick-box{
        width:100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin:0 0 10px 0;
    }
    .elem{
        width:50px;
        font-size: 18px;
        font-weight:900;
        text-align: center;
        margin:5px;
        border-radius: 5px;
        border:solid 2px white;
        padding:3px;
        div{width:25px; height:25px; margin:0 auto; border-radius: 12px;}
        &.active{
            &.fire{border-color:rgb(255, 0, 0); color:rgb(255, 0, 0); text-shadow: 2px 1px 0px rgb(255, 115, 0);}
            &.water{border-color:rgb(44, 128, 255); color:rgb(44, 128, 255); text-shadow: 2px 1px 0px rgb(162, 191, 255);}
            &.wood{border-color:rgb(53, 175, 0); color: rgb(53, 175, 0); text-shadow: 2px 1px 0px rgb(46, 115, 0);}
            &.light{border-color:rgb(255, 244, 195); color:rgb(255, 232, 131); text-shadow: 2px 1px 0px rgb(255, 196, 0);}
            &.dark{border-color:rgb(200, 62, 255); color:rgb(200, 62, 255); text-shadow: 2px 1px 0px rgb(219, 129, 255);}
            &.hell{border-color:rgb(255, 196, 0); color:rgb(61, 45, 0); text-shadow: 2px 1px 0px rgb(255, 196, 0);}
            &.heaven{border-color:rgb(255, 180, 245); color:rgb(241, 218, 222); text-shadow: 2px 1px 0px rgb(255, 95, 234);}
        }
        &.long{width: 70px;}
        
    }
    .tribe{
        width:50px;
        height:35px;
        margin:5px;
        border-radius: 5px;
        text-align: center;
        justify-content: space-around;
        line-height: 30px;
        border:solid 2px white;
        &.blank{border:none}
        &.active{border:solid 2px var(--active-yellow);color:var(--active-yellow)}
        //&.god,&.evil,&.hero,&.dragon,&.beast,&.ghost,&.object{}
    }
    .gimmick{
        width:50px;
        height:40px;
        margin:5px;
        justify-content: space-around;
        border-radius: 5px;
        border:solid 2px white;
        padding:3px;
        &.active{border:solid 2px var(--active-yellow);}
        img{
            margin:0 auto;
            height: 30px;
        }
    }
    .elem,.tribe,.gimmick{
        cursor: pointer;
    }

</style>
