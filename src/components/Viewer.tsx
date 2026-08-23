import React, { useEffect, useMemo, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import "../styles/viewer.css";
import { ViewerProps } from "../types";

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

const Viewer: React.FC<ViewerProps> = ({ issues, initialIssueId }) => {
  const defaultIssueId = initialIssueId ?? issues[0]?.id ?? "";
  const [activeIssueId, setActiveIssueId] = useState(defaultIssueId);
  const [isSpreadMode, setIsSpreadMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);

  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const wheelPageNavigationLockRef = useRef(0);
  const primaryHostRef = useRef<HTMLDivElement | null>(null);
  const secondaryHostRef = useRef<HTMLDivElement | null>(null);
  const primaryViewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const secondaryViewerRef = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    const fullscreenDocument = document as FullscreenDocument;

    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;
      if (fullscreenElement) {
        setIsPseudoFullscreen(false);
      }
      setIsFullscreen(fullscreenElement === viewerContainerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isPseudoFullscreen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPseudoFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPseudoFullscreen]);

  useEffect(() => {
    if (!issues.some((issue) => issue.id === activeIssueId)) {
      setActiveIssueId(defaultIssueId);
    }
  }, [activeIssueId, defaultIssueId, issues]);

  const activeIndex = issues.findIndex((issue) => issue.id === activeIssueId);
  const activeIssue = useMemo(
    () => issues[activeIndex] ?? issues[0],
    [activeIndex, issues],
  );
  const secondaryIssue = useMemo(() => {
    if (!isSpreadMode) {
      return undefined;
    }

    return issues[activeIndex + 1];
  }, [activeIndex, isSpreadMode, issues]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [activeIssue?.id, isSpreadMode, secondaryIssue?.id]);

  useEffect(() => {
    const primaryHost = primaryHostRef.current;
    if (!primaryHost || !activeIssue) {
      return;
    }

    const primaryTileSource = activeIssue.tileSourceUrl ?? activeIssue.imageUrl;

    const primaryViewer = OpenSeadragon({
      element: primaryHost,
      tileSources: primaryTileSource,
      showNavigationControl: false,
      showNavigator: true,
      navigatorPosition: "BOTTOM_LEFT",
      navigatorAutoFade: false,
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

    const handlePrimaryOpen = () => {
      primaryViewer.viewport.goHome(true);
      if (!isSpreadMode || !secondaryIssue) {
        setIsLoading(false);
      }
    };

    const handlePrimaryOpenFailed = () => {
      setIsLoading(false);
      setHasError(true);
    };

    primaryViewer.addHandler("open", handlePrimaryOpen);
    primaryViewer.addHandler("open-failed", handlePrimaryOpenFailed);
    primaryViewerRef.current = primaryViewer;

    return () => {
      primaryViewer.removeHandler("open", handlePrimaryOpen);
      primaryViewer.removeHandler("open-failed", handlePrimaryOpenFailed);
      primaryViewer.destroy();
      primaryViewerRef.current = null;
    };
  }, [activeIssue, isSpreadMode, secondaryIssue]);

  useEffect(() => {
    if (!isSpreadMode || !secondaryIssue) {
      if (!hasError) {
        setIsLoading(false);
      }
      return;
    }

    const secondaryHost = secondaryHostRef.current;
    if (!secondaryHost) {
      return;
    }

    const secondaryTileSource = secondaryIssue.tileSourceUrl ?? secondaryIssue.imageUrl;

    const secondaryViewer = OpenSeadragon({
      element: secondaryHost,
      tileSources: secondaryTileSource,
      showNavigationControl: false,
      showNavigator: false,
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

    const handleSecondaryOpen = () => {
      secondaryViewer.viewport.goHome(true);
      setIsLoading(false);
    };

    const handleSecondaryOpenFailed = () => {
      setIsLoading(false);
      setHasError(true);
    };

    secondaryViewer.addHandler("open", handleSecondaryOpen);
    secondaryViewer.addHandler("open-failed", handleSecondaryOpenFailed);
    secondaryViewerRef.current = secondaryViewer;

    return () => {
      secondaryViewer.removeHandler("open", handleSecondaryOpen);
      secondaryViewer.removeHandler("open-failed", handleSecondaryOpenFailed);
      secondaryViewer.destroy();
      secondaryViewerRef.current = null;
    };
  }, [hasError, isSpreadMode, secondaryIssue]);

  if (!activeIssue) {
    return <div className="viewer-empty">Няма налични броеве на вестника.</div>;
  }

  const updateIssue = (issueId: string) => {
    if (issueId === activeIssueId) {
      return;
    }

    setActiveIssueId(issueId);
  };

  const goToIssueIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= issues.length) {
      return;
    }

    const nextIssueId = issues[nextIndex]?.id;
    if (!nextIssueId) {
      return;
    }

    updateIssue(nextIssueId);
  };

  const goToPreviousIssue = () => {
    const step = isSpreadMode ? 2 : 1;
    goToIssueIndex(activeIndex - step);
  };

  const goToNextIssue = () => {
    const step = isSpreadMode ? 2 : 1;
    goToIssueIndex(activeIndex + step);
  };

  const runViewportAction = (
    action: (viewer: OpenSeadragon.Viewer) => void,
  ) => {
    const viewers = [primaryViewerRef.current, secondaryViewerRef.current].filter(
      (viewer): viewer is OpenSeadragon.Viewer => Boolean(viewer),
    );

    viewers.forEach((viewer) => action(viewer));
  };

  const handleZoomIn = () => {
    runViewportAction((viewer) => {
      viewer.viewport.zoomBy(1.2);
      viewer.viewport.applyConstraints();
    });
  };

  const handleZoomOut = () => {
    runViewportAction((viewer) => {
      viewer.viewport.zoomBy(0.84);
      viewer.viewport.applyConstraints();
    });
  };

  const handleReset = () => {
    runViewportAction((viewer) => {
      viewer.viewport.goHome(true);
    });
  };

  const handleToggleFullscreen = () => {
    // Keep controls visible by using app-managed fullscreen mode consistently.
    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      return;
    }

    setIsPseudoFullscreen(true);
  };

  const handleViewerWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 16) {
      return;
    }

    const now = Date.now();
    if (now - wheelPageNavigationLockRef.current < 360) {
      return;
    }

    wheelPageNavigationLockRef.current = now;

    if (event.deltaY > 0) {
      goToNextIssue();
      return;
    }

    goToPreviousIssue();
  };

  const toggleSpreadMode = () => {
    setIsSpreadMode((previous) => !previous);
  };

  const counterLabel = isSpreadMode && secondaryIssue
    ? `${activeIndex + 1}-${activeIndex + 2} / ${issues.length}`
    : `${activeIndex + 1} / ${issues.length}`;

  return (
    <section className="viewer-shell">
      <header className="viewer-header">
        <div>
          <p className="viewer-kicker">Вестник</p>
          <h2 className="viewer-title">{activeIssue.title}</h2>
        </div>

        <div className="viewer-meta">
          <span className="viewer-counter">{counterLabel}</span>
        </div>
      </header>

      <div
        ref={viewerContainerRef}
        className={`viewer-container ${isPseudoFullscreen ? "viewer-container-force-fullscreen" : ""}`}
        onWheel={handleViewerWheel}
      >
        {isLoading && !hasError ? (
          <div className="loading-overlay">Зареждане на броя...</div>
        ) : null}

        {hasError ? (
          <div className="viewer-empty">Изображението за този брой не може да бъде заредено.</div>
        ) : null}

        <div className={`newspaper-stage ${isSpreadMode ? "newspaper-stage-spread" : ""}`}>
          <div className="newspaper-pane">
            <div ref={primaryHostRef} className="osd-host" />
          </div>

          {isSpreadMode && secondaryIssue ? (
            <div className="newspaper-pane newspaper-pane-secondary">
              <div ref={secondaryHostRef} className="osd-host" />
            </div>
          ) : null}
        </div>

        <div className="viewer-page-controls">
          <button
            type="button"
            className="viewer-page-control viewer-page-control-prev"
            onClick={goToPreviousIssue}
            disabled={activeIndex <= 0}
            aria-label="Предишна страница"
            title="Предишна страница"
          >
            Предишна
          </button>
          <button
            type="button"
            className="viewer-page-control viewer-page-control-next"
            onClick={goToNextIssue}
            disabled={activeIndex >= issues.length - 1}
            aria-label="Следваща страница"
            title="Следваща страница"
          >
            Следваща
          </button>
        </div>

        <div className="controls">
          <button
            type="button"
            onClick={toggleSpreadMode}
            className="control-button control-button-mode"
            title="Режим на четене"
            aria-label="Режим на четене"
          >
            {isSpreadMode ? "1 стр." : "2 стр."}
          </button>
          <a
            className="control-action-link"
            href={activeIssue.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Пълен
          </a>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="control-button control-button-fullscreen"
            title="Цял екран"
            aria-label="Цял екран"
          >
            {isFullscreen || isPseudoFullscreen
              ? <FullscreenExitIcon fontSize="small" />
              : <FullscreenIcon fontSize="small" />}
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="control-button control-button-zoom-in"
            title="Увеличи"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="control-button control-button-zoom-out"
            title="Намали"
          >
            -
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="control-button control-button-reset"
            title="Нулирай"
          >
            ↻
          </button>
        </div>
      </div>
    </section>
  );
};

export default Viewer;
