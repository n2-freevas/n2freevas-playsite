<script lang="ts">
    import {getCards} from '$lib/api/app/DM-download'
import { onMount } from 'svelte';
    onMount(()=>{
        getCards('テンセイ',1)
    })
</script>



<style lang="scss"></style>
