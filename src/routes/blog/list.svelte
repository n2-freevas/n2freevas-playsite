<script lang="ts">
    import { notion_pages } from '$lib/store/NotionModels'
    import { getPage } from '$lib/api/blogApi'
    import { onMount } from 'svelte'
    import ListItem from './_list_item.svelte'

    let db_id = '9defcc2aa743412397eb6d24d167d230'

    onMount(async () => {
        const page = getPage()
        console.log(page)
    })
</script>

<div class="background">
    <section class="title">
        <h2>BLOG LIST</h2>
    </section>
    <section class="blog_list">
        {#each $notion_pages as page}
            <ListItem id={page.page_id} title={page.page_title} tags={page.tags} thumbnail={page.thumbnail} />
        {/each}
    </section>
</div>

<style lang="scss">
    h2 {
        color: black;
    }
    .background {
        padding: 30px 20px;
        width: 100%;
        height: 100%;
        background: white;
    }
</style>
