export type WidgetTheme = "light" | "dark";

export type WidgetId =
	| "stock-heatmap"
	| "crypto-coins-heatmap"
	| "forex-heat-map"
	| "ticker-tape"
	| "single-quote"
	| "symbol-info"
	| "symbol-overview"
	| "advanced-chart";

export interface StockViewState {
	widget: WidgetId;
	symbol: string;
	theme: WidgetTheme;
	filters: Record<string, string>;
}

export interface FilterOption {
	value: string;
	label: string;
}

export interface FilterDef {
	id: string;
	label: string;
	type: "select" | "text";
	options?: FilterOption[];
	defaultValue: string;
}

export interface WidgetDef {
	id: WidgetId;
	label: string;
	description: string;
	scriptUrl: string;
	supportsSymbol: boolean;
	filters: FilterDef[];
	buildConfig: (
		state: StockViewState,
		filters: Record<string, string>
	) => Record<string, unknown>;
}
