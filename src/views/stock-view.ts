import { createElement, createRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { ItemView, Notice, WorkspaceLeaf, requestUrl } from "obsidian";

import type StockViewPlugin from "@/main";
import StockViewUI, { type StockViewUIHandle } from "@/views/stock-view-ui";


export const STOCK_VIEW_TYPE = "tradingview-stock-view";

const CONNECTIVITY_PROBE_URL = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";

export class StockView extends ItemView {
	private plugin: StockViewPlugin;
	private reactRoot: Root | null = null;
	private uiRef = createRef<StockViewUIHandle>();

	constructor(leaf: WorkspaceLeaf, plugin: StockViewPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return STOCK_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Stock view";
	}

	getIcon(): string {
		return "line-chart";
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		container.addClass("stock-view-root");


		this.reactRoot = createRoot(container);
		this.reactRoot.render(
			createElement(StockViewUI, {
				ref: this.uiRef,
				getInitialViewState: () => this.plugin.getInitialViewState(),
				checkConnectivity: () => this.checkConnectivity(),
			})
		);
	}

	async onClose(): Promise<void> {
		this.reactRoot?.unmount();
		this.reactRoot = null;
	}

	private async checkConnectivity(): Promise<boolean> {
		try {
			const res = await requestUrl({
				url: CONNECTIVITY_PROBE_URL,
				method: "GET",
				throw: false,
			});
			if (res.status >= 200 && res.status < 400) return true;
			new Notice(
				`Stock view: TradingView returned status ${res.status}. Try again later.`
			);
			return false;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "unknown error";
			new Notice(
				`Stock view: failed to reach TradingView. Check your internet connection or try again later.`
			);
			return false;
		}
	}
}
