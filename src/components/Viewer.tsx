import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDeepZoomPane } from "./useDeepZoomPane";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);

  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const wheelPageNavigationLockRef = useRef(0);

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

  // Each pane owns its own OpenSeadragon lifecycle and reports its own state. The second pane is
  // switched off by passing no tile source, which is what "not in spread mode" means here.
  const primary = useDeepZoomPane(
    activeIssue ? activeIssue.tileSourceUrl ?? activeIssue.imageUrl : undefined,
    { showNavigator: true },
  );
  const secondary = useDeepZoomPane(
    secondaryIssue ? secondaryIssue.tileSourceUrl ?? secondaryIssue.imageUrl : undefined,
  );

  const panes = [primary, secondary];
  const hasError = panes.some((pane) => pane.status === "failed");
  const isLoading = !hasError && panes.some((pane) => pane.status === "loading");

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

  const handleZoomIn = () => panes.forEach((pane) => pane.zoomBy(1.2));

  const handleZoomOut = () => panes.forEach((pane) => pane.zoomBy(0.84));

  const handleReset = () => panes.forEach((pane) => pane.goHome());

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
            <div ref={primary.hostRef} className="osd-host" />
          </div>

          {isSpreadMode && secondaryIssue ? (
            <div className="newspaper-pane newspaper-pane-secondary">
              <div ref={secondary.hostRef} className="osd-host" />
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
