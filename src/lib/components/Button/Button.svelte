<script lang="ts">
	export let custom_class = '';
</script>

<button class={custom_class}>
    <slot></slot>
</button>

<style lang="scss">
    button {
        color: inherit;
        background-color: transparent;
        border: 1px solid var(--border);
        border-radius: 15px;

        &:focus {
            outline: 1px solid var(--border-hover);
        }
    }
</style>
