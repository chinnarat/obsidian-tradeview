import type { StockViewState } from "@/types";
import { getWidgetDef } from "@/widgets/widget-configs";

interface Props {
	state: StockViewState;
	onLoad: () => void;
	onError: () => void;
}

function buildSrcdoc(scriptUrl: string, config: Record<string, unknown>): string {
	// Escape </script> sequences so they don't break the surrounding HTML.
	const safeConfig = JSON.stringify(config).replace(/<\//g, "<\\/");
	return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
  *, *::before, *::after { box-sizing: border-box; }
  .tradingview-widget-container { height: 100%; width: 100%; }
  .tradingview-widget-container__widget { height: 100%; width: 100%; }
</style>
</head>
<body>
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="${scriptUrl}">${safeConfig}</script>
</div>
</body>
</html>`;
}

function stateKey(state: StockViewState): string {
	return `${state.widget}|${state.symbol}|${state.theme}|${JSON.stringify(state.filters)}`;
}

export default function TradingViewWidget({ state, onLoad, onError }: Props) {
	const def = getWidgetDef(state.widget);
	const config = def.buildConfig(state, state.filters);

	return (
		<iframe
			key={stateKey(state)}
			className="stock-view-iframe"
			srcDoc={buildSrcdoc(def.scriptUrl, config)}
			onLoad={onLoad}
			onError={onError}
			sandbox="allow-scripts allow-same-origin allow-popups"
			title="TradingView widget"
		/>
	);
}
