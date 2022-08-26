<script lang="ts">
    import { onMount } from 'svelte'

    let page_id
    let data

    onMount(async () => {
        const urlParams = new URLSearchParams() //window.location.search);
        if (urlParams.has('page_id')) {
            page_id = urlParams.get('page_id')
            try {
                //data = await getPage(page_id)
                data = await getPage(page_id)
                console.log(data)
            } catch (e) {
                console.error(e)
            }
        }
    })
    console.log(data)
</script>

<h1>{data}</h1>
<p>list</p>
