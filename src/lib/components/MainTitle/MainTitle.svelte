<script lang="ts">
	export let classes = '';
</script>

<h1 class={`text-[2em] sm:text-[2.5em] md:text-[3em] lg:text-[3.5em] ${classes}`}><slot /></h1>

<style lang="scss">
	h1 {
		font-family: var(--title-f);
		font-weight: 900;
		letter-spacing: 4px;
		text-align: center;

		background: linear-gradient(var(--main-text), var(--accent-text-hover));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
