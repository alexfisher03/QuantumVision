<script>
	export let error;
	export let status;
</script>

<svelte:head>
	<title>{status} - Something went wrong</title>
</svelte:head>

<section>
    <h1 class="text-xl font-bold text-white">{status}</h1>
    <p class="body-text">{error.message}</p>
    <p class="text-sm">Sorry, something went wrong on our end. Click <a href="/">here to go back</a></p>
</section>

<style>
    section {
        background-image: url(../src/lib/images/body-image-error.png);
        min-height: 100vh;
	    margin: 0;
	    background-attachment: fixed;
	    background-size: 100vw 100vh;
	    background-color: #1e1e1e;
    }
</style>