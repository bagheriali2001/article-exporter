<script lang="ts">
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import Input from '$lib/components/Input/Input.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';

	let modal_open = false;

	let url = '';
	let email = '';

	let useLoader = false;
	let requestResponse = null;

	const isBlank = (str: string): boolean => {
		return !str || /^\s*$/.test(str);
	};

	const isEmail = (email: string): boolean => {
		const reg =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return !isBlank(email) && reg.test(email);
	};

	const addToQueue = async () => {
		if (isBlank(url)) {
			alert('Please enter a valid url');
			return;
		} else if (email!='' && !isEmail(email)) {
			alert('Please enter a valid email');
			return;
		} else if (!url.startsWith("https://www.scientificamerican.com/article/")) {
			alert('Please enter a valid Scientific American article url, not podcast url!');
			return;
		}

		useLoader = true;

		const res = await fetch('/api/article', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fetch_url: url, email }),
		});

		console.log("🥳 res:", res);
		requestResponse = {...await res.json(), status: res.status};
		console.log("🥳 requestResponse:", requestResponse);

		useLoader = false;
		modal_open = true;
	};
</script>

<svelte:head>
	<title>Article Exporter</title>
	<meta name="title" content="Article Exporter"/>
	<meta name="type" content="website"/>
	<meta name="url" content="https://articleexporter.tryitout.click"/>
	<meta name="site_name" content="Article Exporter"/>
	<meta name="description" content="Article Exporter Search Page"/>
	<meta name="keywords" content="Article Exporter, Article, Exporter, Scientific American, Export, PDF"/>
	<meta name="robots" content="index, follow"/>
	<meta name="googlebot" content="index, follow"/>
	<meta name="google" content="notranslate"/>
</svelte:head>

<div class="home">
	<div class="home-section">
		<MainTitle>Article Exporter</MainTitle>
		<p class="home-subtitle text-[1em] sm:text-[1.2em] mx-2 sm:mx-8">
			<b>How to use</b>: Enter the url of the article you want to download as pdf. We will convert the article to pdf and email you when it's ready.
			<br>
			<br>
			<b>Supported Websites</b>: Scientific American (Articles only, not podcasts)
			<br>
			<br>
			<b>Disclaimer</b>: This project is only for education. If you can subscribe to these website, please consider dosing so.  (My personal use is reading the articles for expanding my vocabulary in English across different domains)
		</p>
		<div class="grid grid-cols-7 gap-3 md:gap-3 lg:gap-7 mt-10 mx-2 sm:mx-8">
			<div class="col-span-7 md:col-span-3">
				<Input bind:value={url} custom_class={"w-full"} placeholder={'Paste URL here ...'} />
			</div>

			<div class="col-span-7 md:col-span-3 ">
				<Input bind:value={email} custom_class={"w-full"} placeholder={'Enter your email ...'} />
			</div>

			<div class="col-span-5 col-start-2 md:col-span-1 justify-self-center">
				<Button custom_class={"h-[50px]"}>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="flex justify-center items-center md:inline-block mx-auto py-[10px] px-[20px] text-[1.15em]"  on:click={()=>{addToQueue()}}>
						<p class="text-[0.8em] md:hidden mr-4">Export the article</p>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
					</div>
				</Button>
			</div>
		</div>
	</div>

	<Modal bind:open={modal_open} on:close={() => modal_open = false} title="Exporting Article" subtitle="Please wait while we are exporting the article for you ...">
		<span slot="body">
			{#if requestResponse?.status == '200' && requestResponse?.type == 'Article'}
				<p class="text-[1.2em]">This article is already exported, please check <a href='/search' class="underline">Search page</a>, and search for it.</p>
			{:else if requestResponse?.status == '200' && requestResponse?.type == 'ExportQueue'}
				<p class="text-[1.2em]">This article is in export queue, please check <a href='/search' class="underline">Search page</a> in a few minute, and search for it.</p>
			{:else if requestResponse?.status == '201'}
				<p class="text-[1.2em]">Article was successfully added to export queue, if you entered a valid email, you will receive an email when the article is ready (Check SPAM Folder), otherwise you can check <a href='/search' class="underline">Search page</a> in a few minute, and search for it.</p>
			{:else if requestResponse?.status == '400' && requestResponse?.error == 'fetch_url_required'}
				<p class="text-[1.2em]">Please enter a valid url.</p>
			{:else if requestResponse?.status == '400' && requestResponse?.error == 'fetch_url_not_string'}
				<p class="text-[1.2em]">Please enter a valid url.</p>
			{:else if requestResponse?.status == '400' && requestResponse?.error == 'fetch_url_not_valid!'}
				<p class="text-[1.2em]">Please enter a valid Scientific American article url, not podcast url!</p>
			{:else if requestResponse?.status == '500'}
				<p class="text-[1.2em]">Error while connecting to the server, please try again later.</p>
			{:else}
				<p class="text-[1.2em]">Something went wrong, please try again later.</p>
			{/if}
		</span>
	</Modal>
</div>

<style lang="scss">
	.home {
		align-self: center;
		display: flex;
		flex-direction: row;
		flex: 1;
		align-self: stretch;
		align-items: center;
		padding: 0px 10px;

		&-subtitle {
			color: var(--tertiary-text);
			font-weight: 00;
			text-align: left;
		}
	}
</style>
