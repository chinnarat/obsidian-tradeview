import { Plugin, WorkspaceLeaf } from "obsidian";

import {
	DEFAULT_SETTINGS,
	StockViewSettingTab,
	StockViewSettings,
	settingsToInitialViewState,
} from "@/settings";
import { STOCK_VIEW_TYPE, StockView } from "@/views/stock-view";
import type { StockViewState } from "@/types";

export default class StockViewPlugin extends Plugin {
	settings!: StockViewSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(
			STOCK_VIEW_TYPE,
			(leaf) => new StockView(leaf, this)
		);

		this.addRibbonIcon("line-chart", "Open stock view", () => {
			void this.activateView();
		});

		this.addCommand({
			id: "open-stock-view",
			name: "Open stock view",
			callback: () => {
				void this.activateView();
			},
		});

		this.addSettingTab(new StockViewSettingTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<StockViewSettings>
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	getInitialViewState(): StockViewState {
		return settingsToInitialViewState(this.settings);
	}

	private async activateView(): Promise<void> {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const existing = workspace.getLeavesOfType(STOCK_VIEW_TYPE);
		if (existing.length > 0) {
			leaf = existing[0] ?? null;
		} else {
			leaf = workspace.getLeaf("tab");
			await leaf.setViewState({ type: STOCK_VIEW_TYPE, active: true });
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}
}
