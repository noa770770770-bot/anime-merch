
import { PageModel } from "@/editor/page-model";

const g = globalThis as any;
export const draftStore: Record<string, PageModel> = g.__draftStore ?? (g.__draftStore = {});
export const publishedStore: Record<string, PageModel> = g.__publishedStore ?? (g.__publishedStore = {});



// --- Real editor node models for home and products ---
if (!draftStore["home"]) {
	const homeModel = {
		id: "home",
		title: "Home",
		rootId: "home.hero",
		nodes: {
			"home.hero": {
				id: "home.hero",
				type: "container",
				parentId: null,
				frame: { desktop: { x: 0, y: 0, w: 1200, h: 220 } },
				style: {},
				props: {},
			},
			"home.title": {
				id: "home.title",
				type: "text",
				parentId: "home.hero",
				frame: { desktop: { x: 0, y: 30, w: 1200, h: 60 } },
				style: { text: { fontFamily: "Montserrat", fontSize: 36, fontWeight: 800, color: "#fff", align: "center" } },
				props: { text: "Welcome to Anime Merch!" },
			},
			"home.subtitle": {
				id: "home.subtitle",
				type: "text",
				parentId: "home.hero",
				frame: { desktop: { x: 0, y: 100, w: 1200, h: 40 } },
				style: { text: { fontFamily: "Montserrat", fontSize: 20, fontWeight: 400, color: "#94a3b8", align: "center" } },
				props: { text: "You’re in the right place for the best anime goods, figures, apparel, and more. Shop our latest arrivals below!" },
			},
			"home.featured": {
				id: "home.featured",
				type: "container",
				parentId: null,
				frame: { desktop: { x: 0, y: 240, w: 1200, h: 600 } },
				style: {},
				props: {},
			},
			"home.featured.title": {
				id: "home.featured.title",
				type: "text",
				parentId: "home.featured",
				frame: { desktop: { x: 0, y: 0, w: 1200, h: 40 } },
				style: { text: { fontFamily: "Montserrat", fontSize: 28, fontWeight: 700, color: "#23232b", align: "center" } },
				props: { text: "Featured Products" },
			},
			"home.featured.grid": {
				id: "home.featured.grid",
				type: "container",
				parentId: "home.featured",
				frame: { desktop: { x: 0, y: 60, w: 1200, h: 500 } },
				style: {},
				props: { placeholder: "Product grid goes here" },
			},
		},
		background: { fill: { kind: "color", value: "#23232b" } },
	};
	draftStore["home"] = homeModel;
}
if (!draftStore["products"]) {
	const productsModel = {
		id: "products",
		title: "Products",
		rootId: "products.root",
		nodes: {
			"products.root": {
				id: "products.root",
				type: "container",
				parentId: null,
				frame: { desktop: { x: 0, y: 0, w: 1200, h: 800 } },
				style: {},
				props: {},
			},
			"products.item.1": {
				id: "products.item.1",
				type: "container",
				parentId: "products.root",
				frame: { desktop: { x: 60, y: 60, w: 320, h: 320 } },
				style: { },
				props: {
					title: "Naruto Headband",
					price: "$12.99",
					image: "/products/anime-ai-placeholder.svg"
				},
			},
			"products.item.2": {
				id: "products.item.2",
				type: "container",
				parentId: "products.root",
				frame: { desktop: { x: 400, y: 60, w: 320, h: 320 } },
				style: { },
				props: {
					title: "One Piece Straw Hat",
					price: "$15.99",
					image: "/products/anime-ai-placeholder.svg"
				},
			},
			"products.item.3": {
				id: "products.item.3",
				type: "container",
				parentId: "products.root",
				frame: { desktop: { x: 740, y: 60, w: 320, h: 320 } },
				style: { },
				props: {
					title: "Attack on Titan Hoodie",
					price: "$39.99",
					image: "/products/anime-ai-placeholder.svg"
				},
			},
			"products.item.4": {
				id: "products.item.4",
				type: "container",
				parentId: "products.root",
				frame: { desktop: { x: 60, y: 400, w: 320, h: 320 } },
				style: { },
				props: {
					title: "Sailor Moon Mug",
					price: "$9.99",
					image: "/products/anime-ai-placeholder.svg"
				},
			},
			"products.item.5": {
				id: "products.item.5",
				type: "container",
				parentId: "products.root",
				frame: { desktop: { x: 400, y: 400, w: 320, h: 320 } },
				style: { },
				props: {
					title: "My Hero Academia Keychain",
					price: "$6.99",
					image: "/products/anime-ai-placeholder.svg"
				},
			},
		},
		background: { fill: { kind: "color", value: "#23232b" } },
	};
	draftStore["products"] = productsModel;
}

// Auto-publish fallback: if publishedStore is missing but draftStore exists, copy for first run
for (const id of Object.keys(draftStore)) {
	if (!publishedStore[id]) {
		publishedStore[id] = draftStore[id];
	}
}
