import { App, PluginSettingTab, Setting } from "obsidian";

import type StockViewPlugin from "@/main";
import type { StockViewState, WidgetId, WidgetTheme } from "@/types";
import { getAllWidgets, getDefaultFiltersFor } from "@/widgets/widget-configs";

export interface StockViewSettings {
	defaultWidget: WidgetId;
	defaultSymbol: string;
	defaultTheme: WidgetTheme;
}

export const DEFAULT_SETTINGS: StockViewSettings = {
	defaultWidget: "advanced-chart",
	defaultSymbol: "NASDAQ:AAPL",
	defaultTheme: "dark",
};

export const settingsToInitialViewState = (
	settings: StockViewSettings
): StockViewState => ({
	widget: settings.defaultWidget,
	symbol: settings.defaultSymbol,
	theme: settings.defaultTheme,
	filters: getDefaultFiltersFor(settings.defaultWidget),
});

export class StockViewSettingTab extends PluginSettingTab {
	plugin: StockViewPlugin;

	constructor(app: App, plugin: StockViewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Default widget")
			.setDesc("Widget shown when the stock view is first opened.")
			.addDropdown((dd) => {
				for (const w of getAllWidgets()) {
					dd.addOption(w.id, w.label);
				}
				dd.setValue(this.plugin.settings.defaultWidget);
				dd.onChange(async (value) => {
					this.plugin.settings.defaultWidget = value as WidgetId;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Default symbol")
			.setDesc(
				"Default ticker (e.g. NASDAQ:AAPL) used by widgets that show a single symbol."
			)
			.addText((text) =>
				text
					.setPlaceholder("NASDAQ:AAPL")
					.setValue(this.plugin.settings.defaultSymbol)
					.onChange(async (value) => {
						this.plugin.settings.defaultSymbol = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Default theme")
			.setDesc("Color theme used to render widgets.")
			.addDropdown((dd) => {
				dd.addOption("light", "Light");
				dd.addOption("dark", "Dark");
				dd.setValue(this.plugin.settings.defaultTheme);
				dd.onChange(async (value) => {
					this.plugin.settings.defaultTheme = value as WidgetTheme;
					await this.plugin.saveSettings();
				});
			});
	}
}
