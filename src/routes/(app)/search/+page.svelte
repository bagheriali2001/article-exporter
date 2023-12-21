<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Input from '$lib/components/Input/Input.svelte';
	import DropDown from '$lib/components/DropDown/DropDown.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import { browser } from '$app/environment';
	import ArticleCard from '$lib/components/ArticleCard/ArticleCard.svelte';

	export let search = '';
	export let categories: Array<String> = [];
	export let category = '';
	let article_search_query = '';
	let articles: Array<any> = [];
	let timeoutPromise: any = null;

	const dispatch = createEventDispatcher();

	let mounted = false;

	$: {
		dispatch('search', { search: search.trim().toLowerCase(), category });
	}

	$: {
		if (browser && mounted) {
			if(timeoutPromise) {
				clearTimeout(timeoutPromise);
			}

			let searchParams = new URLSearchParams(window.location.search);

			if(search.trim().length > 0) {
				searchParams.set('q', search);
			} else {
				searchParams.delete('q');
			}
			
			if(category.trim().length > 0) {
				searchParams.set('category', category);
			} else {
				searchParams.delete('category');
			}

			const url = `${window.location.protocol}//${window.location.host}${
				window.location.pathname
			}${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`;

			const state = window.history.state;

			window.history.replaceState(state, '', url);

			let new_article_search_query = '';
			if(search.trim().length > 0) {
				new_article_search_query += `name=${search}&`;
			}
			if(category.trim().length > 0) {
				new_article_search_query += `category=${category}&`;
			}

			if (new_article_search_query !== article_search_query) {
				article_search_query = new_article_search_query;
				timeoutPromise = setTimeout(() => {
					fetch(`/api/article?${article_search_query}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						},
					})
						.then((res) => res.json())
						.then((data) => {
							articles = data.articles;
							articles.forEach((article: any) => {
								article.categories = JSON.parse(article.categories);
								article.files = JSON.parse(article.files);
							});
						});
				}, 1000);
			}
		}
	}

	onMount(async () => {
		let searchParams = new URLSearchParams(window.location.search);

		search = searchParams.get('q') ?? '';
		category = searchParams.get('category') ?? '';

		if(search.trim().length > 0) {
			article_search_query += `name=${search}&`;
		}
		if(category.trim().length > 0) {
			article_search_query += `category=${category}&`;
		}

		mounted = true;

		const categories_data_raw = await fetch(`/api/categories`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		});

		const categories_data = await categories_data_raw.json();

		let temp_categories: Array<any> = [];

			categories_data.categories.forEach((category: any) => {
			for (let cat of JSON.parse(category)){
				if(temp_categories && temp_categories.length > 0) {
					if(!temp_categories.includes(cat)) {
						temp_categories.push(cat);
					}
				} else {
					temp_categories.push(cat);
				}
			}
		});

		categories = temp_categories;

		const articles_data_raw = await fetch(`/api/article?${article_search_query}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		});

		const articles_data = await articles_data_raw.json();

		articles = articles_data.articles;
		articles.forEach((article: any) => {
			article.categories = JSON.parse(article.categories);
			article.files = JSON.parse(article.files);
		});

		console.log(`🌩️ articles:`, articles);
	});
</script>

<svelte:head>
	<title>Article Exporter | Search</title>
	<meta name="title" content="Article Exporter | Search"/>
	<meta name="type" content="website"/>
	<meta name="url" content="https://articleexporter.tryitout.click/search"/>
	<meta name="site_name" content="Article Exporter"/>
	<meta name="description" content="Article Exporter Search Page"/>
	<meta name="robots" content="index, follow"/>
	<meta name="googlebot" content="index, follow"/>
	<meta name="google" content="notranslate"/>
</svelte:head>


<div class="flex-1 flex flex-col gap-5 px-4 sm:px-6 md:px-6 py-4 sm:py-8 md:py-12">
	<MainTitle>Search Exported Articles</MainTitle>
	<div class="flex flex-col gap-5">
		<div class="w-100% grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 lg:gap-5 mt-10">
			<div class='col-span-4 md:col-span-3'>
				<Input bind:value={search} custom_class={"w-full"} placeholder={'Search ...'} />
			</div>
	
			<div class='col-span-4 md:col-span-1'>
				<DropDown bind:value={category} placeholder={'Category ...'} items_list={categories} />
			</div>
		</div>
		<div class="w-100% flex flex-col">
			<div class="grid grid-cols-1 gap-2 md:gap-3 lg:gap-5 mt-10">
				{#each articles as article (article.id)}
					<ArticleCard article={article} />
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
</style>
