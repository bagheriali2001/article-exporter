<script lang="ts">
	import { onMount } from 'svelte';

	export let value = '';
	export let placeholder = 'Options';
	export let items_list: Array<string> = [];
	let open = false;
	let random_id = Math.random().toString(36).substring(7);

	function toggleDropdown() {
		open = !open;
	}

	function selectItem(item: string) {
		value = item;
		open = false;
	}

	function handleOutsideClick(event: any) {
		if (open && !event.target.id.includes(`select-${random_id}`)) {
			open = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
	});

</script>

<div class="relative inline-block text-left w-full h-[50px]" id={`select-${random_id}-container`}>
	<div class="w-full h-[50px] rounded-[15px] hover:bg-[var(--tertiary-hover)]" id={`select-${random_id}`}>
		<button
			type="button"
			class="w-full h-[50px] gap-x-1.5 rounded-[15px] px-3 py-2 font- text-gray-900 shadow-sm ring-1 ring-[var(--border)] inline-flex text-inherit select"
			id={`select-${random_id}-button`}
			aria-expanded={open}
			aria-haspopup="true"
			on:click={toggleDropdown}
		>
		<p id={`select-${random_id}-text`} class={!value ? 'flex-1 truncate text-left place-middle self-center text-gray-400 select-text' : 'flex-1 truncate text-left place-middle self-center select-text'}>
			{value || placeholder}
		</p>
		<svg
			class="-mr-1 h-5 w-5 text-gray-400 self-center"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
			id={`select-${random_id}-svg`}
		>
			<path
			fill-rule="evenodd"
			d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
			clip-rule="evenodd"
			/>
		</svg>
		</button>
	</div>

	{#if open}
		<div
		class="absolute right-0 z-10 mt-2 w-[100%] origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-inherit select-options"
		role="menu"
		aria-orientation="vertical"
		aria-labelledby="select-button"
		tabindex="-1"
		id={`select-${random_id}-options-dev`}
		>
		<div class="py-1 select-options-div text-inherit" role="none">
			<div class="block px-4 py-2 text-inherit hover:bg-[var(--tertiary-hover)]">
					<!-- svelte-ignore a11y-invalid-attribute -->
				<a
					href="#"
					style="opacity: 0.7;"
					role="menuitem"
					tabindex="-1"
					id={`select-${random_id}-option-null`}
					on:click={() => selectItem('')}
				>
					{placeholder}
				</a>
			</div>
			{#each items_list as item (item)}
			<!-- svelte-ignore a11y-invalid-attribute -->
				<div class="block px-4 py-2 text-inherit hover:bg-[var(--tertiary-hover)]">
						<a
						href="#"
						role="menuitem"
						tabindex="-1"
						id={`select-${random_id}-option-${item}`}
						on:click={() => selectItem(item)}
					>
						{item}
					</a>
				</div>
			{/each}
		</div>
		</div>
	{/if}
</div>

<style lang="scss">
/* Your existing select styles can be omitted */
.select {
	color: inherit;
	background-color: transparent;
}

.select-text {
	padding: 10px 8px;
}

.select-options {
	background-color: var(--main);
}

.select-options-div {
	border-radius: 15px;
	border: 1px solid var(--border);
}

</style>