<script lang="ts">
    import ToastArea from '$lib/component/toast/ToastArea.svelte'
    import { onMount } from 'svelte';
    let active = [false,false,false]
    function touchMenuHandler(index){
        active = [false,false,false]
        active[index] = true
    }
    onMount(()=>{
        const path = location.pathname.split('/').slice(-1)[0]
        if(path == 'analyze'){
            active[1] = true
        }
        else if(path == 'post'){
            active[2] = true
        }
        else{
            active[0] = true
        }
    })
</script>

<svelte:head><title>ばくぜつさあち | コトダマン単語 検索 | コトダマン辞書 検索</title></svelte:head>

<header>
    <div class='n2-logo'>
        <a href='/'>
            <img src='/img/n2-icon-white.svg' alt=''>
        </a>
    </div>
</header>
<ToastArea/>
<section id='base'>
<slot></slot>
</section>

<footer>
    <div class='footer-icon-box'>
    <a class='{active[0]? "active":""}' href='/app/bakuzetsu-searcher-2nd/edit' on:click={()=>{touchMenuHandler(0)}}>
        <div class='footer-icon-bg'></div>
        <img src='/img/bs2nd/e_gray_fill.svg' alt='EDIT'>
        <p>EDIT</p>
    </a>
    <a class='{active[1]? "active":""}' href='/app/bakuzetsu-searcher-2nd/analyze' on:click={()=>{touchMenuHandler(1)}}>
        <div class='footer-icon-bg'></div>
        <img src='/img/bs2nd/a_gray_fill.svg' alt='ANALYZE'>
        <p>ANALYZE</p>
    </a>
    <!-- <a class='{active[2]? "active":""}' href='/app/bakuzetsu-searcher-2nd/post' on:click={()=>{touchMenuHandler(2)}}>
        <div class='footer-icon-bg'></div>
        <img src='/img/bs2nd/menu_post.svg' alt='POST'>
        <p>POST</p>
    </a> -->
    </div>
</footer>
<style lang="scss">
    header{
        display: flex;
        justify-content: space-between;
        height:40px;
        .n2-logo{
            padding:10px;
            img{
                height:20px;
            }
        }
    }
    #base{
        background: black;
    }
    footer{
        position: fixed;
        z-index:50;
        bottom:0;
        width:100%;
        height:75px;
        box-shadow: 0 -1px 2px white;
        padding:10px;
        background: black;
        .footer-icon-box{
            display: flex;
            justify-content: space-around;
            max-width: 700px;
            margin:0 auto;
            a{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                position: relative;
                width:40px;
                height:40px;
                border-radius: 27px;
                &.active{
                    
                    .footer-icon-bg{
                        position: absolute;
                        width:30px;height:30px;
                        border:solid 2px var(--active-yellow);
                        border-radius: 15px;
                    }
                    p{
                        color:var(--active-yellow);
                    }
                }
                img{height:25px;}
                
                p{font-size:12px; font-weight: bold;}
            }
        }
    }
</style>
