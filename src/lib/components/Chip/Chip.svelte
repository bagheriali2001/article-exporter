<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLElement;

	export let label = '';
	export let active = false;
	export let hoverable = true;
	export let size = 'auto';
	export let margin = 'margin: 2.5px;';
	export let padding = 'padding: 5px 10px;';

	onMount(() => {
		el.style.setProperty('--size', size);
	});
</script>

<p
	bind:this={el}
	class="chip"
	class:chip-active={active}
	class:chip-hoverable={hoverable}
	data-size={size}
	style={`${margin} ${padding}`}
>
	{label}
</p>

<style lang="scss">
	.chip {
		--size: auto;
		display: inline-block;
		border: 1px solid var(--border);
		border-radius: 20px;
		cursor: pointer;
		font-weight: 200;
		font-size: 0.95em;
		transition-duration: 150ms;
		font-size: var(--size);

		&-hoverable {
			&:hover {
				background-color: var(--secondary);
			}
		}

		&-active {
			background-color: var(--tertiary);

			&:hover {
				background-color: var(--accent);
			}
		}
	}
</style>
