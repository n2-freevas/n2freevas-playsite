<script lang="ts">
    import type {kotodaman} from '$lib/model/app/Bs2ndModel'
    
    export let kotodaman: kotodaman

</script>

<div class="kotodaman">
    <img src={kotodaman.figure} alt={kotodaman.name}>
    <p>{kotodaman.name}</p>

</div>

<style lang="scss">
    


</style>
