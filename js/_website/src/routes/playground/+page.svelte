<script lang="ts">
	import DemosLite from "../../lib/components/DemosLite.svelte";
	import MetaTags from "$lib/components/MetaTags.svelte";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import { gradio_logo } from "$lib/assets";

	export let data: {
		demos_by_category: {
			category: string;
			demos: {
				name: string;
				dir: string;
				code: string;
				requirements: string[];
			}[];
		}[];
	};

	let all_demos = data.demos_by_category.flatMap((category) => category.demos);
	let current_selection = all_demos[0].name;

	let shared = "";
	if (browser) {
		let linked_demo = $page.url.searchParams.get("demo");
		if (linked_demo) {
			current_selection = linked_demo.replaceAll("_", " ");
			shared = current_selection;
		}
	}

	let show_nav = true;

	$: show_nav;
</script>

<MetaTags
	title="Gradio Playground"
	url="https://gradio.app/playground"
	canonical="https://gradio.app/playground"
	description="Play Around with Gradio Demos"
/>

<!-- 4.0 Launch BANNER  -->
<div class="flex-row">
	<div class="flex flex-row relative items-center px-1 py-1 pr-6 text-lg gap-8">
		<div class="flex">
			<a href="/">
				<img src={gradio_logo} alt="Gradio logo" />
			</a>
			<p class="self-center text-xl font-light -m-1">Playground</p>
		</div>

		<nav class="flex w-auto flex-row gap-6">
			<a class="thin-link flex items-center gap-3" href="/docs" target="_blank"
				><span>✍️</span> <span>Docs</span></a
			>
			<a
				class="thin-link flex items-center gap-3"
				href="/guides/gradio-lite"
				target="_blank"><span>💡</span> <span>Gradio Lite</span></a
			>
		</nav>
	</div>
</div>

<main class="playground flex flex-col justify-between">
	<div class="container mx-auto px-4 gap-4">
		<p class="mt-4 mb-8 text-lg text-gray-600 md:hidden">
			Playground renders best on desktop.
		</p>
	</div>

	<div class="w-full border border-gray-200 shadow-xl h-full relative">
		<div
			class="w-[200px] h-full rounded-tr-none rounded-bl-xl overflow-y-scroll mb-0 p-0 pb-4 text-md block rounded-t-xl bg-gradient-to-r from-white to-gray-50 overflow-x-clip"
			style="word-break: normal; overflow-wrap: break-word; white-space:nowrap; width: {show_nav
				? 200
				: 37}px;"
		>
			<div class="flex justify-between align-middle h-8 border-b px-2">
				{#if show_nav}
					<h3 class="pl-2 pt-1">Demos</h3>
				{/if}
				<button
					on:click={() => (show_nav = !show_nav)}
					class="float-right text-gray-600 pl-1"
					>{#if show_nav}&larr;{:else}&rarr;{/if}</button
				>
			</div>
			{#if show_nav}
				<button
					on:click={() => (current_selection = "Blank")}
					class:current-playground-demo={current_selection == "Blank"}
					class:shared-link={shared == "Blank"}
					class="thin-link font-light px-4 mt-2 block">Blank</button
				>
				{#each data.demos_by_category as { category, demos } (category)}
					<p class="px-4 my-2">{category}</p>
					{#each demos as demo, i}
						<button
							on:click={() => (current_selection = demo.name)}
							class:current-playground-demo={current_selection == demo.name}
							class:shared-link={shared == demo.name}
							class="thin-link font-light px-4 block">{demo.name}</button
						>
					{/each}
				{/each}
			{/if}
		</div>

		<DemosLite demos={all_demos} {current_selection} {show_nav} />
	</div>
</main>

<style>
	.code {
		white-space: pre-wrap;
	}
</style>
