import { useCallback, useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { paneOptions } from "./paneOptions";

export type PaneStatus = "idle" | "loading" | "ready" | "failed";

export interface DeepZoomPane {
  /** Attach to the element the viewer should mount into. */
  hostRef: React.RefObject<HTMLDivElement | null>;
  status: PaneStatus;
  zoomBy: (factor: number) => void;
  goHome: () => void;
}

/**
 * One OpenSeadragon viewport, with its whole lifecycle in one place.
 *
 * **The rule this module exists to hold:** a viewer must be destroyed when its effect cleans up.
 * The effect re-runs on every page turn, so a missed `destroy()` leaks a canvas and a live
 * tile-fetch loop each time. It used to be a discipline repeated across two near-identical
 * effects; now there is one copy.
 *
 * Pass `undefined` as the tile source for an inactive pane — it reports `idle` and mounts nothing,
 * which is how the second pane switches off outside spread mode.
 */
export function useDeepZoomPane(
  tileSource: string | undefined,
  options: { showNavigator?: boolean } = {},
): DeepZoomPane {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const [status, setStatus] = useState<PaneStatus>(tileSource ? "loading" : "idle");

  const { showNavigator } = options;

  useEffect(() => {
    const host = hostRef.current;

    if (!host || !tileSource) {
      setStatus("idle");
      return;
    }

    setStatus("loading");

    const viewer = OpenSeadragon({ element: host, ...paneOptions(tileSource, { showNavigator }) });

    const handleOpen = () => {
      viewer.viewport.goHome(true);
      setStatus("ready");
    };
    const handleOpenFailed = () => setStatus("failed");

    viewer.addHandler("open", handleOpen);
    viewer.addHandler("open-failed", handleOpenFailed);
    viewerRef.current = viewer;

    return () => {
      viewer.removeHandler("open", handleOpen);
      viewer.removeHandler("open-failed", handleOpenFailed);
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [tileSource, showNavigator]);

  const zoomBy = useCallback((factor: number) => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }

    viewer.viewport.zoomBy(factor);
    viewer.viewport.applyConstraints();
  }, []);

  const goHome = useCallback(() => {
    viewerRef.current?.viewport.goHome(true);
  }, []);

  return { hostRef, status, zoomBy, goHome };
}
