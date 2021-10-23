<script lang="ts">
    export let name :string
    export let path :string
    export let img : string
    export let explain: string
</script>

<div class='menu-box'>
    <a href={path}>
        <img src={img} alt="">
        <p>{name}</p>
        <p>{@html explain}</p>
    </a>
</div>

<style lang="scss">
    .menu-box{
        img{width:50px;}
    }
</style>