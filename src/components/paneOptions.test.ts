import { describe, expect, it } from "vitest";
import { paneOptions } from "./paneOptions";

describe("paneOptions", () => {
  it("never lets the wheel zoom", () => {
    // The component repurposes the wheel to turn pages, behind a 360ms lock. Re-enabling
    // scroll-to-zoom would make that gesture unusable.
    expect(paneOptions("a.dzi").gestureSettingsMouse?.scrollToZoom).toBe(false);
  });

  it("never shows OpenSeadragon's own controls", () => {
    // The viewer ships its own control strip; OSD's would be a second, differently-styled one.
    expect(paneOptions("a.dzi").showNavigationControl).toBe(false);
  });

  it("passes the tile source through untouched", () => {
    expect(paneOptions("/NewspaperDeepZoom/tfnpp3/dzc_output.xml").tileSources).toBe(
      "/NewspaperDeepZoom/tfnpp3/dzc_output.xml",
    );
  });

  it("gives only the primary pane a navigator", () => {
    const primary = paneOptions("a.dzi", { showNavigator: true });
    const secondary = paneOptions("b.dzi");

    expect(primary.showNavigator).toBe(true);
    expect(primary.navigatorPosition).toBe("BOTTOM_LEFT");
    expect(secondary.showNavigator).toBe(false);
    // No navigator means no navigator placement to configure.
    expect(secondary.navigatorPosition).toBeUndefined();
  });

  it("uses the same viewport limits for both panes, so a spread stays in step", () => {
    const { minZoomImageRatio, maxZoomPixelRatio, visibilityRatio, animationTime } =
      paneOptions("a.dzi", { showNavigator: true });

    expect(paneOptions("b.dzi")).toMatchObject({
      minZoomImageRatio,
      maxZoomPixelRatio,
      visibilityRatio,
      animationTime,
    });
  });
});
