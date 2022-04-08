<script>


</script>

<header>
    <div class='n2-logo'>
        <a href='/'><img src='/img/n2-icon-white.svg' alt=''></a>
        <h1>Pokemon Card Game<br>Damage Counter Web Effector</h1>
    </div>
</header>

<article>
<slot></slot>
</article>

<style lang="scss">
    header{
        position: fixed;
        width:60%;
        max-width: 500px;
        right:50px;
        padding:20px;
        z-index:100;
        .n2-logo{
            display: flex;
            background: linear-gradient(135deg,rgba(0,0,0,1), rgba(0,0,0,0.2));
            padding:20px;
            img{width:40px;}
            h1{font-size: 14px;margin:0 20px;}
        }
        
    }
    article{
        position: relative;
        height:100vh;
        overflow: hidden;
    }
</style>
