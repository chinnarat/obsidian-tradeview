import { useEffect, useRef } from "react";
import type { StockViewState } from "@/types";
import { getWidgetDef } from "@/widgets/widget-configs";

interface Props {
	state: StockViewState;
	onLoad: () => void;
	onError: () => void;
}

export default function TradingViewWidget({ state, onLoad, onError }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);

	// Keep latest callbacks in refs so the effect never needs to re-run for them.
	const onLoadRef = useRef(onLoad);
	const onErrorRef = useRef(onError);
	onLoadRef.current = onLoad;
	onErrorRef.current = onError;

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const def = getWidgetDef(state.widget);
		const config = def.buildConfig(state, state.filters);

		const script = document.createElement("script");
		script.src = def.scriptUrl;
		script.type = "text/javascript";
		script.async = true;
		// TradingView reads its JSON config from the text content of the
		// <script> element that triggered it, even when src is also set.
		script.text = JSON.stringify(config);
		script.onload = () => onLoadRef.current();
		script.onerror = () => onErrorRef.current();

		el.appendChild(script);

		return () => {
			// Clear all widget DOM on unmount / state change
			el.innerHTML = "";
		};
	}, [state]); // re-run only when state changes

	return (
		<div
			className="tradingview-widget-container"
			ref={containerRef}
		>
			<div
				className="tradingview-widget-container__widget"
			/>
		</div>
	);
}
