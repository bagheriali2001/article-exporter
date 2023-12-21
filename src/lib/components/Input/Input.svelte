<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let custom_class = '';
</script>

<input bind:value {placeholder} class={`${custom_class} hover:bg-[var(--tertiary-hover)]`}/>

<style lang="scss">
	input {
		color: inherit;
		background-color: transparent;
		border: 1px solid var(--border);
		padding: 10px 20px;
		border-radius: 15px;
		flex: 1;
		font-size: 1.15em;
		height: 50px;

		&:focus {
			outline: 1px solid var(--border-hover);
		}
	}
</style>
