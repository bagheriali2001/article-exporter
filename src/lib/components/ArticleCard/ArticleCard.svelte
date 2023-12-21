<script lang="ts">
	import type { Article } from '$lib/types';
	import Card from '../Card/Card.svelte';
	import CardTitle from '../Card/CardTitle.svelte';
	import Chip from '../Chip/Chip.svelte';
	import CardDivider from '../Card/CardDivider.svelte';
	import { Icons } from '$lib/utils';
	import Icon from '../Icon/Icon.svelte';
	import Button from '../Button/Button.svelte';

	export let article: Article;
</script>

<Card margin="0px 0px 20px 0px" tiltDegree={2} color="#ffffff">
	<div class="article">
		<div class="article-data w-full sm:w-[90%] sm:mx-[5%]">
			<h3 class="article-title flex flex-row justify-between">
				<CardTitle title={article.name} />
				<div class="article-title-divider" />
				<Chip label={article.website == 'Scientific American'? 'SA':''} size="1em" />
			</h3>
			<CardDivider />

			<div class="flex flex-row justify-between">
				<div>
					{#each article.categories as category}
						<Chip label={category} size="0.75em" margin="margin: 2.5px 5px 2.5px 0px;" />
					{/each}
				</div>
				<div class="hidden md:flex flex-row gap-2">
					<Button custom_class={"my-[2.5px] mr-[5px] md-0 py-[5px] px-[10px]"}>
						<a href={article.url} target="_blank" class="flex gap-3">
							<p class="md:text-[0.75em] block">Visit</p>
							<Icon icon={Icons.Link} size="17px" />
						</a> 
					</Button>

					<Button custom_class={"my-[2.5px] mr-[5px] md-0 py-[5px] px-[10px]"}>
						<a href={article.files[0]} target="_blank" class="flex gap-3">
							<p class="md:text-[0.75em] block">Download</p>
							<svg xmlns="http://www.w3.org/2000/svg" class="md:w-full md:mx-auto w-[18px] h-[18px] md:w-[15px] md:h-[15px]"
								viewBox="0 0 24 24" fill="none" stroke="var(--secondary-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
							</svg>
						</a> 
					</Button>
				</div>
			</div>
			
			<div class="md:hidden block">
				<CardDivider />
			</div>

			<div class="md:hidden flex flex-row-reverse gap-2">
				<Button custom_class={"my-[2.5px] mr-[5px] md-0 py-[5px] px-[10px]"}>
					<a href={article.files[0]} target="_blank" class="flex gap-3">
						<p class="text-[0.75em] block">Download</p>
						<svg xmlns="http://www.w3.org/2000/svg" class="md:w-full md:mx-auto w-[18px] h-[18px] md:w-[15px] md:h-[15px]"
							viewBox="0 0 24 24" fill="none" stroke="var(--secondary-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
						</svg>
					</a> 
				</Button>

				<Button custom_class={"my-[2.5px] mr-[5px] md-0 py-[5px] px-[10px]"}>
					<a href={article.url} target="_blank" class="flex gap-3">
						<p class="text-[0.75em] block">Visit</p>
						<Icon icon={Icons.Link} size="17px" />
					</a> 
				</Button>
			</div>
		</div>
	</div>
</Card>

<style lang="scss">
	.article {
		display: flex;
		align-items: flex-start;

		&-data {
			display: flex;
			flex-direction: column;
		}

		@media (max-width: 800px) {
			flex-direction: column;

			&-data {
				margin-left: 0px;
			}
		}

		&-title {
			margin: 0;
			display: flex;
			align-items: center;

			&-divider {
				width: 10px;
			}

			@media (max-width: 800px) {
				& {
					align-items: center;
					margin: 5px 0px;
				}
			}
		}
	}
</style>
