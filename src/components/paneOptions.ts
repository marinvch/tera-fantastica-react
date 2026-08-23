// `import type` on purpose: openseadragon touches `document` at module load, so importing it for
// real here would make this file unusable outside a browser. Keeping the options pure is what
// lets them be tested without a DOM — see useDeepZoomPane.test.ts.
import type OpenSeadragon from "openseadragon";

/**
 * The OpenSeadragon options every pane shares.
 *
 * Two settings carry intent and must not be "tidied": `scrollToZoom: false`, because the component
 * repurposes the wheel to turn pages, and `showNavigationControl: false`, because the viewer ships
 * its own control strip.
 */
export const paneOptions = (
  tileSource: string,
  { showNavigator = false }: { showNavigator?: boolean } = {},
): OpenSeadragon.Options => ({
  tileSources: tileSource,
  showNavigationControl: false,
  showNavigator,
  ...(showNavigator
    ? { navigatorPosition: "BOTTOM_LEFT" as const, navigatorAutoFade: false }
    : {}),
  animationTime: 0.9,
  minZoomImageRatio: 0.7,
  maxZoomPixelRatio: 4,
  visibilityRatio: 0.8,
  gestureSettingsMouse: {
    scrollToZoom: false,
  },
  gestureSettingsTouch: {
    flickEnabled: true,
    pinchToZoom: true,
  },
});
