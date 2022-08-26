<script lang="ts">
    import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<div class="toast_wrap">
    <SvelteToast />
</div>

<div class="toast_wrap error_wrap">
    <SvelteToast target="error" />
</div>

<style lang="scss">
    .toast_wrap {
        --toastMsgPadding: 10px 20px;
        font-size: 0.85rem;
    }
    .error_wrap {
        --toastWidth: 100%;
        --toastMaxWidth: 500px;
        --toastMinHeight: 1.5rem;
    }
</style>
