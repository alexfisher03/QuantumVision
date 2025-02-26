<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
</script>

<header>
    <nav class="flex flex-row justify-end pr-6 sm:pr-0 sm:justify-center w-full -translate-y-8">
		<ul class="flex flex-row space-x-6 font-light text-lg">
			<li class="hover:scale-105 transform transition duration-300 ease-in-out">
				<a href="/" class:nav-under={page.url.pathname === '/'}>Home</a>
			</li>
			<li class="hover:scale-105 transform transition duration-300 ease-in-out">
				<a href="/simulations" class:nav-under={page.url.pathname === '/simulations'}>Simulations</a>
			</li>
		</ul>
	</nav>
</header>

<style>

.nav-under {
	border-bottom: 1px solid;
}
	
</style>