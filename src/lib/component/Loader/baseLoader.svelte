<script lang="ts">
    export let color: string = 'white'
    export let is_animate: boolean = true
</script>

<div class="loader">
    <div class="fulcrum" />
</div>

<style lang="scss">
    .loader {
        position: relative;
        width: 100%;
        height: 100%;
        .fulcrum {
            position: absolute;
            left: 50%;
        }
    }
</style>
