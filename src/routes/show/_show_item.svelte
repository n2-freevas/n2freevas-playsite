<script lang="ts">
    export let name : String
    export let component : Function
</script>

<div class='loader-animation-box'>
    <svelte:component this={component} />
</div>
<p>{name}</p>

<style lang="scss">
    .loader-animation-box{
        padding:30px 0;
        border: solid 1px white;
        min-height: 290px;
        width: 100%;
        height:100%;
    }
</style>
