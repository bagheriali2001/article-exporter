<script lang="ts">
	import Icon from '../Icon/Icon.svelte';
	import { Icons } from '$lib/utils';
	import Modal from '../Modal/Modal.svelte';

	let modal_open = false;
</script>

<div class="footer-div">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="footer-div-item-label cursor-pointer hover:text-[color:var(--accent-hover)] text-[var(--secondary-text)] font-semibold text-[0.9em] md:text-[1.1em]"
		on:click={() => modal_open = true}
	>
		<p>
			Donate to keep this project running
		</p>
	</div>

	<Modal bind:open={modal_open} on:close={() => modal_open = false} title="Donate" subtitle="Please wait while we are exporting the article for you ...">
		<span slot="body">
			Your donation will help me to keep this project running, and to add more features to it.
			<br>
			You can donate using the following methods:
			<br>
			<br>

			<ul class="list-disc list-inside">
				<li>
					<a href="https://buymeacoffee.com/bagheriali2001" target="_blank" class="underline">Buy Me A Coffee</a>
				</li>
				<li>
					<a href="https://zarinp.al/bagheriali2001" target="_blank" class="underline">Zarinpal</a>
				</li>
				<li>
					Or you can send USDT TCR20 to this address:
					<br>
					<br>
					<img src="/images/TRC20.png" alt="USDT TCR20 Address" class="w-[200px] mx-auto">
					<br>
					<p class="text-center font-semibold">T9zsTLCF3XW9po3NHnJ1a3ob2YqsccEE8s</p>
				</li>
			</ul>

		</span>
	</Modal>
</div>

<style lang="scss">
	.footer-div {
		position: fixed;
		bottom: 0px;

		display: flex;
		justify-content: center;
		position: sticky;
		top: 0px;
		z-index: 10;
		padding: 10px 10px;
		border-top: 2px solid var(--secondary);
		background-color: var(--main);
	}
</style>
