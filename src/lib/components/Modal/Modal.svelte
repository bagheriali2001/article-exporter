<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { browser } from '$app/environment';
    import { Icons } from '$lib/utils';
    import Icon from '../Icon/Icon.svelte';
    import { onMount } from 'svelte';

    export let title: string;
    export let subtitle: string;
    export let open = false;

    const dispatch = createEventDispatcher();

    let mounted = false;

    $: {
        if (browser && mounted) {
            const modal = document.querySelector('.modal');
            const modal_content = document.querySelector('.modal-content');

            if (modal && modal_content) {
                modal_content.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                modal.addEventListener('click', () => {
                    dispatch('close');
                });
            }
        }
    }

    onMount(() => {
        mounted = true;
    });

    $: {
        dispatch('close');
    }
</script>

<div class={open ? 'modal flex' : 'modal hidden'}>
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">
                <slot name="title">
                    {title}
                </slot>
            </h3>
            <button class="modal-close" on:click={() => dispatch('close')}>
                <Icon icon={Icons.Close} size="20px" />
            </button>
        </div>
        <div class="modal-body">
            <slot name="body">
                {subtitle}
            </slot>
        </div>
        <div class="modal-footer">
            <slot name="footer">
                <button class="modal-close" on:click={() => dispatch('close')}>
                    Close
                </button>
            </slot>
        </div>
    </div>
</div>

<style lang="scss">
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-color: rgba(30, 30, 30, 0.4);
        z-index: 1000;
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        max-width: 500px;
        max-height: 100%;
        background-color: var(--main);
        border-radius: 15px;
        overflow: auto;
        z-index: 1001;
        margin: 0px 10px;

    }

    .modal-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        border-bottom: 1px solid var(--border);
    }

    .modal-title {
        font-size: 1.25em;
        font-weight: 600;
        color: var(--text);
    }

    .modal-close {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        color: var(--text);
        cursor: pointer;
        padding: 5px;
        border-radius: 10px;

        &:hover {
            background-color: var(--secondary);
        }
    }

    .modal-body {
        padding: 10px 20px;
        overflow: auto;
    }

    .modal-footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 10px 20px;
        border-top: 1px solid var(--border);
    }
</style>