import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { l as require_react_dom, u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { _ as extendContext, a as createOverlayComponent, b as require_leaflet_src, c as createLayerHook, d as addClassName, f as withPane, g as createLeafletContext, h as LeafletContext, i as createLayerComponent, l as createElementHook, m as createContainerComponent, n as updateGridLayer, o as createPathComponent, p as createControlHook, r as createControlComponent, s as createTileLayerComponent, t as updateMediaOverlay, u as createElementObject, v as useLeafletContext, y as updateCircle } from "./leaflet+react-leaflet__core.mjs";
//#region node_modules/react-leaflet/lib/hooks.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useMap() {
	return useLeafletContext().map;
}
function useMapEvent(type, handler) {
	const map = useMap();
	(0, import_react.useEffect)(function addMapEventHandler() {
		map.on(type, handler);
		return function removeMapEventHandler() {
			map.off(type, handler);
		};
	}, [
		map,
		type,
		handler
	]);
	return map;
}
function useMapEvents(handlers) {
	const map = useMap();
	(0, import_react.useEffect)(function addMapEventHandlers() {
		map.on(handlers);
		return function removeMapEventHandlers() {
			map.off(handlers);
		};
	}, [map, handlers]);
	return map;
}
//#endregion
//#region node_modules/react-leaflet/lib/AttributionControl.js
var import_leaflet_src = require_leaflet_src();
var AttributionControl = createControlComponent(function createAttributionControl(props) {
	return new import_leaflet_src.Control.Attribution(props);
});
//#endregion
//#region node_modules/react-leaflet/lib/Circle.js
var Circle = createPathComponent(function createCircle({ center, children: _c, ...options }, ctx) {
	const circle = new import_leaflet_src.Circle(center, options);
	return createElementObject(circle, extendContext(ctx, { overlayContainer: circle }));
}, updateCircle);
//#endregion
//#region node_modules/react-leaflet/lib/CircleMarker.js
var CircleMarker = createPathComponent(function createCircleMarker({ center, children: _c, ...options }, ctx) {
	const marker = new import_leaflet_src.CircleMarker(center, options);
	return createElementObject(marker, extendContext(ctx, { overlayContainer: marker }));
}, updateCircle);
//#endregion
//#region node_modules/react-leaflet/lib/FeatureGroup.js
var FeatureGroup = createPathComponent(function createFeatureGroup({ children: _c, ...options }, ctx) {
	const group = new import_leaflet_src.FeatureGroup([], options);
	return createElementObject(group, extendContext(ctx, {
		layerContainer: group,
		overlayContainer: group
	}));
});
//#endregion
//#region node_modules/react-leaflet/lib/GeoJSON.js
var GeoJSON = createPathComponent(function createGeoJSON({ data, ...options }, ctx) {
	const geoJSON = new import_leaflet_src.GeoJSON(data, options);
	return createElementObject(geoJSON, extendContext(ctx, { overlayContainer: geoJSON }));
}, function updateGeoJSON(layer, props, prevProps) {
	if (props.style !== prevProps.style) {
		if (props.style == null) layer.resetStyle();
		else layer.setStyle(props.style);
	}
});
//#endregion
//#region node_modules/react-leaflet/lib/ImageOverlay.js
var ImageOverlay = createLayerComponent(function createImageOverlay({ bounds, url, ...options }, ctx) {
	const overlay = new import_leaflet_src.ImageOverlay(url, bounds, options);
	return createElementObject(overlay, extendContext(ctx, { overlayContainer: overlay }));
}, function updateImageOverlay(overlay, props, prevProps) {
	updateMediaOverlay(overlay, props, prevProps);
	if (props.bounds !== prevProps.bounds) {
		const bounds = props.bounds instanceof import_leaflet_src.LatLngBounds ? props.bounds : new import_leaflet_src.LatLngBounds(props.bounds);
		overlay.setBounds(bounds);
	}
	if (props.url !== prevProps.url) overlay.setUrl(props.url);
});
//#endregion
//#region node_modules/react-leaflet/lib/LayerGroup.js
var LayerGroup = createLayerComponent(function createLayerGroup({ children: _c, ...options }, ctx) {
	const group = new import_leaflet_src.LayerGroup([], options);
	return createElementObject(group, extendContext(ctx, { layerContainer: group }));
});
//#endregion
//#region node_modules/react-leaflet/lib/LayersControl.js
var useLayersControlElement = createElementHook(function createLayersControl({ children: _c, ...options }, ctx) {
	const control = new import_leaflet_src.Control.Layers(void 0, void 0, options);
	return createElementObject(control, extendContext(ctx, { layersControl: control }));
}, function updateLayersControl(control, props, prevProps) {
	if (props.collapsed !== prevProps.collapsed) {
		if (props.collapsed === true) control.collapse();
		else control.expand();
	}
});
var useLayersControl = createControlHook(useLayersControlElement);
var LayersControl = createContainerComponent(useLayersControl);
function createControlledLayer(addLayerToControl) {
	return function ControlledLayer(props) {
		const parentContext = useLeafletContext();
		const propsRef = (0, import_react.useRef)(props);
		const [layer, setLayer] = (0, import_react.useState)(null);
		const { layersControl, map } = parentContext;
		const addLayer = (0, import_react.useCallback)((layerToAdd) => {
			if (layersControl != null) {
				if (propsRef.current.checked) map.addLayer(layerToAdd);
				addLayerToControl(layersControl, layerToAdd, propsRef.current.name);
				setLayer(layerToAdd);
			}
		}, [
			addLayerToControl,
			layersControl,
			map
		]);
		const removeLayer = (0, import_react.useCallback)((layerToRemove) => {
			layersControl?.removeLayer(layerToRemove);
			setLayer(null);
		}, [layersControl]);
		const context = (0, import_react.useMemo)(() => {
			return extendContext(parentContext, { layerContainer: {
				addLayer,
				removeLayer
			} });
		}, [
			parentContext,
			addLayer,
			removeLayer
		]);
		(0, import_react.useEffect)(() => {
			if (layer !== null && propsRef.current !== props) {
				if (props.checked === true && (propsRef.current.checked == null || propsRef.current.checked === false)) map.addLayer(layer);
				else if (propsRef.current.checked === true && (props.checked == null || props.checked === false)) map.removeLayer(layer);
				propsRef.current = props;
			}
		});
		return props.children ? /*#__PURE__*/ import_react.createElement(LeafletContext, { value: context }, props.children) : null;
	};
}
LayersControl.BaseLayer = createControlledLayer(function addBaseLayer(layersControl, layer, name) {
	layersControl.addBaseLayer(layer, name);
});
LayersControl.Overlay = createControlledLayer(function addOverlay(layersControl, layer, name) {
	layersControl.addOverlay(layer, name);
});
//#endregion
//#region node_modules/react-leaflet/lib/MapContainer.js
function MapContainerComponent({ bounds, boundsOptions, center, children, className, id, placeholder, style, whenReady, zoom, ...options }, forwardedRef) {
	const [props] = (0, import_react.useState)({
		className,
		id,
		style
	});
	const [context, setContext] = (0, import_react.useState)(null);
	const mapInstanceRef = (0, import_react.useRef)(void 0);
	(0, import_react.useImperativeHandle)(forwardedRef, () => context?.map ?? null, [context]);
	const mapRef = (0, import_react.useCallback)((node) => {
		if (node !== null && !mapInstanceRef.current) {
			const map = new import_leaflet_src.Map(node, options);
			mapInstanceRef.current = map;
			if (center != null && zoom != null) map.setView(center, zoom);
			else if (bounds != null) map.fitBounds(bounds, boundsOptions);
			if (whenReady != null) map.whenReady(whenReady);
			setContext(createLeafletContext(map));
		}
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			context?.map.remove();
		};
	}, [context]);
	const contents = context ? /*#__PURE__*/ import_react.createElement(LeafletContext, { value: context }, children) : placeholder ?? null;
	return /*#__PURE__*/ import_react.createElement("div", {
		...props,
		ref: mapRef
	}, contents);
}
var MapContainer = /*#__PURE__*/ (0, import_react.forwardRef)(MapContainerComponent);
//#endregion
//#region node_modules/react-leaflet/lib/Marker.js
var Marker = createLayerComponent(function createMarker({ position, ...options }, ctx) {
	const marker = new import_leaflet_src.Marker(position, options);
	return createElementObject(marker, extendContext(ctx, { overlayContainer: marker }));
}, function updateMarker(marker, props, prevProps) {
	if (props.position !== prevProps.position) marker.setLatLng(props.position);
	if (props.icon != null && props.icon !== prevProps.icon) marker.setIcon(props.icon);
	if (props.zIndexOffset != null && props.zIndexOffset !== prevProps.zIndexOffset) marker.setZIndexOffset(props.zIndexOffset);
	if (props.opacity != null && props.opacity !== prevProps.opacity) marker.setOpacity(props.opacity);
	if (marker.dragging != null && props.draggable !== prevProps.draggable) {
		if (props.draggable === true) marker.dragging.enable();
		else marker.dragging.disable();
	}
});
//#endregion
//#region node_modules/react-leaflet/lib/Pane.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var DEFAULT_PANES = [
	"mapPane",
	"markerPane",
	"overlayPane",
	"popupPane",
	"shadowPane",
	"tilePane",
	"tooltipPane"
];
function omitPane(obj, pane) {
	const { [pane]: _p, ...others } = obj;
	return others;
}
function createPane(name, props, context) {
	if (DEFAULT_PANES.indexOf(name) !== -1) throw new Error(`You must use a unique name for a pane that is not a default Leaflet pane: ${name}`);
	if (context.map.getPane(name) != null) throw new Error(`A pane with this name already exists: ${name}`);
	const parentPaneName = props.pane ?? context.pane;
	const parentPane = parentPaneName ? context.map.getPane(parentPaneName) : void 0;
	const element = context.map.createPane(name, parentPane);
	if (props.className != null) addClassName(element, props.className);
	if (props.style != null) for (const key of Object.keys(props.style)) element.style[key] = props.style[key];
	return element;
}
function PaneComponent(props, forwardedRef) {
	const [paneName] = (0, import_react.useState)(props.name);
	const [paneElement, setPaneElement] = (0, import_react.useState)(null);
	(0, import_react.useImperativeHandle)(forwardedRef, () => paneElement, [paneElement]);
	const context = useLeafletContext();
	const newContext = (0, import_react.useMemo)(() => ({
		...context,
		pane: paneName
	}), [context]);
	(0, import_react.useEffect)(() => {
		setPaneElement(createPane(paneName, props, context));
		return function removeCreatedPane() {
			context.map.getPane(paneName)?.remove?.();
			if (context.map._panes != null) {
				context.map._panes = omitPane(context.map._panes, paneName);
				context.map._paneRenderers = omitPane(context.map._paneRenderers, paneName);
			}
		};
	}, []);
	return props.children != null && paneElement != null ? /*#__PURE__*/ (0, import_react_dom.createPortal)(/*#__PURE__*/ import_react.createElement(LeafletContext, { value: newContext }, props.children), paneElement) : null;
}
var Pane = /*#__PURE__*/ (0, import_react.forwardRef)(PaneComponent);
//#endregion
//#region node_modules/react-leaflet/lib/Polygon.js
var Polygon = createPathComponent(function createPolygon({ positions, ...options }, ctx) {
	const polygon = new import_leaflet_src.Polygon(positions, options);
	return createElementObject(polygon, extendContext(ctx, { overlayContainer: polygon }));
}, function updatePolygon(layer, props, prevProps) {
	if (props.positions !== prevProps.positions) layer.setLatLngs(props.positions);
});
//#endregion
//#region node_modules/react-leaflet/lib/Polyline.js
var Polyline = createPathComponent(function createPolyline({ positions, ...options }, ctx) {
	const polyline = new import_leaflet_src.Polyline(positions, options);
	return createElementObject(polyline, extendContext(ctx, { overlayContainer: polyline }));
}, function updatePolyline(layer, props, prevProps) {
	if (props.positions !== prevProps.positions) layer.setLatLngs(props.positions);
});
//#endregion
//#region node_modules/react-leaflet/lib/Popup.js
var Popup = createOverlayComponent(function createPopup(props, context) {
	const popup = new import_leaflet_src.Popup(props, context.overlayContainer);
	return createElementObject(popup, context);
}, function usePopupLifecycle(element, context, { position }, setOpen) {
	(0, import_react.useEffect)(function addPopup() {
		const { instance } = element;
		function onPopupOpen(event) {
			if (event.popup === instance) {
				instance.update();
				setOpen(true);
			}
		}
		function onPopupClose(event) {
			if (event.popup === instance) setOpen(false);
		}
		context.map.on({
			popupopen: onPopupOpen,
			popupclose: onPopupClose
		});
		if (context.overlayContainer == null) {
			if (position != null) instance.setLatLng(position);
			instance.openOn(context.map);
		} else context.overlayContainer.bindPopup(instance);
		return function removePopup() {
			context.map.off({
				popupopen: onPopupOpen,
				popupclose: onPopupClose
			});
			context.overlayContainer?.unbindPopup();
			context.map.removeLayer(instance);
		};
	}, [
		element,
		context,
		setOpen,
		position
	]);
});
//#endregion
//#region node_modules/react-leaflet/lib/Rectangle.js
var Rectangle = createPathComponent(function createRectangle({ bounds, ...options }, ctx) {
	const rectangle = new import_leaflet_src.Rectangle(bounds, options);
	return createElementObject(rectangle, extendContext(ctx, { overlayContainer: rectangle }));
}, function updateRectangle(layer, props, prevProps) {
	if (props.bounds !== prevProps.bounds) layer.setBounds(props.bounds);
});
//#endregion
//#region node_modules/react-leaflet/lib/ScaleControl.js
var ScaleControl = createControlComponent(function createScaleControl(props) {
	return new import_leaflet_src.Control.Scale(props);
});
//#endregion
//#region node_modules/react-leaflet/lib/SVGOverlay.js
var useSVGOverlayElement = createElementHook(function createSVGOverlay(props, context) {
	const { attributes, bounds, ...options } = props;
	const container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	container.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	if (attributes != null) for (const name of Object.keys(attributes)) container.setAttribute(name, attributes[name]);
	const overlay = new import_leaflet_src.SVGOverlay(container, bounds, options);
	return createElementObject(overlay, context, container);
}, updateMediaOverlay);
var useSVGOverlay = createLayerHook(useSVGOverlayElement);
function SVGOverlayComponent({ children, ...options }, forwardedRef) {
	const { instance, container } = useSVGOverlay(options).current;
	(0, import_react.useImperativeHandle)(forwardedRef, () => instance);
	return container == null || children == null ? null : /*#__PURE__*/ (0, import_react_dom.createPortal)(children, container);
}
var SVGOverlay = /*#__PURE__*/ (0, import_react.forwardRef)(SVGOverlayComponent);
//#endregion
//#region node_modules/react-leaflet/lib/TileLayer.js
var TileLayer$1 = createTileLayerComponent(function createTileLayer({ url, ...options }, context) {
	const layer = new import_leaflet_src.TileLayer(url, withPane(options, context));
	return createElementObject(layer, context);
}, function updateTileLayer(layer, props, prevProps) {
	updateGridLayer(layer, props, prevProps);
	const { url } = props;
	if (url != null && url !== prevProps.url) layer.setUrl(url);
});
//#endregion
//#region node_modules/react-leaflet/lib/Tooltip.js
var Tooltip = createOverlayComponent(function createTooltip(props, context) {
	const tooltip = new import_leaflet_src.Tooltip(props, context.overlayContainer);
	return createElementObject(tooltip, context);
}, function useTooltipLifecycle(element, context, { position }, setOpen) {
	(0, import_react.useEffect)(function addTooltip() {
		const container = context.overlayContainer;
		if (container == null) return;
		const { instance } = element;
		const onTooltipOpen = (event) => {
			if (event.tooltip === instance) {
				if (position != null) instance.setLatLng(position);
				instance.update();
				setOpen(true);
			}
		};
		const onTooltipClose = (event) => {
			if (event.tooltip === instance) setOpen(false);
		};
		container.on({
			tooltipopen: onTooltipOpen,
			tooltipclose: onTooltipClose
		});
		container.bindTooltip(instance);
		return function removeTooltip() {
			container.off({
				tooltipopen: onTooltipOpen,
				tooltipclose: onTooltipClose
			});
			if (container._map != null) container.unbindTooltip();
		};
	}, [
		element,
		context,
		setOpen,
		position
	]);
});
//#endregion
//#region node_modules/react-leaflet/lib/VideoOverlay.js
var VideoOverlay = createLayerComponent(function createVideoOverlay({ bounds, url, ...options }, ctx) {
	const overlay = new import_leaflet_src.VideoOverlay(url, bounds, options);
	if (options.play === true) overlay.getElement()?.play();
	return createElementObject(overlay, extendContext(ctx, { overlayContainer: overlay }));
}, function updateVideoOverlay(overlay, props, prevProps) {
	updateMediaOverlay(overlay, props, prevProps);
	if (typeof props.url === "string" && props.url !== prevProps.url) overlay.setUrl(props.url);
	const video = overlay.getElement();
	if (video != null) {
		if (props.play === true && !prevProps.play) video.play();
		else if (!props.play && prevProps.play === true) video.pause();
	}
});
//#endregion
//#region node_modules/react-leaflet/lib/WMSTileLayer.js
var WMSTileLayer = createTileLayerComponent(function createWMSTileLayer({ eventHandlers: _eh, params = {}, url, ...options }, context) {
	const layer = new import_leaflet_src.TileLayer.WMS(url, {
		...params,
		...withPane(options, context)
	});
	return createElementObject(layer, context);
}, function updateWMSTileLayer(layer, props, prevProps) {
	updateGridLayer(layer, props, prevProps);
	if (props.params != null && props.params !== prevProps.params) layer.setParams(props.params);
});
//#endregion
//#region node_modules/react-leaflet/lib/ZoomControl.js
var ZoomControl = createControlComponent(function createZoomControl(props) {
	return new import_leaflet_src.Control.Zoom(props);
});
//#endregion
//#region node_modules/react-leaflet/lib/index.js
var lib_exports = /* @__PURE__ */ __exportAll({
	AttributionControl: () => AttributionControl,
	Circle: () => Circle,
	CircleMarker: () => CircleMarker,
	FeatureGroup: () => FeatureGroup,
	GeoJSON: () => GeoJSON,
	ImageOverlay: () => ImageOverlay,
	LayerGroup: () => LayerGroup,
	LayersControl: () => LayersControl,
	MapContainer: () => MapContainer,
	Marker: () => Marker,
	Pane: () => Pane,
	Polygon: () => Polygon,
	Polyline: () => Polyline,
	Popup: () => Popup,
	Rectangle: () => Rectangle,
	SVGOverlay: () => SVGOverlay,
	ScaleControl: () => ScaleControl,
	TileLayer: () => TileLayer$1,
	Tooltip: () => Tooltip,
	VideoOverlay: () => VideoOverlay,
	WMSTileLayer: () => WMSTileLayer,
	ZoomControl: () => ZoomControl,
	useMap: () => useMap,
	useMapEvent: () => useMapEvent,
	useMapEvents: () => useMapEvents
});
//#endregion
export { lib_exports as t };
