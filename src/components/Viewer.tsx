import React, { useEffect, useRef, useState } from 'react';
import Zoomist from 'zoomist';
import 'zoomist/css';
import '../styles/viewer.css';

const Viewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomistRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Store the current ref value to avoid timing issues
    const container = containerRef.current;
    
    if (container) {
      // Destroy existing instance if it exists
      if (zoomistRef.current) {
        zoomistRef.current.destroy();
      }

      const timer = setTimeout(() => {
        // Check again if container is available and if component is still mounted
        if (container instanceof HTMLElement) {
          zoomistRef.current = new Zoomist(container, {
            bounds: true,
            wheelable: true,
            draggable: true,
            pinchable: true,
            zoomRatio: 0.1,
            maxScale: 10,
            minScale: 0.1,
            slider: {
              el: '.zoomist-slider',
              direction: 'vertical',
            },
            zoomer: true,
            on: {
              ready: () => {
                setIsLoading(false);
              }
            }
          });
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        if (zoomistRef.current) {
          zoomistRef.current.destroy();
        }
      };
    }
  }, []);

  const handleResetView = () => {
    if (zoomistRef.current) {
      zoomistRef.current.reset();
    }
  };

  const handleZoomIn = () => {
    if (zoomistRef.current) {
      zoomistRef.current.zoom(0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoomistRef.current) {
      zoomistRef.current.zoom(-0.1);
    }
  };

  return (
    <div className="viewer-container">
      {isLoading && <div className="loading-overlay">Loading newspaper...</div>}
      <div className="viewer-wrapper" ref={containerRef}>
        <img 
          src={`${process.env.PUBLIC_URL}/Assets/newspaper/dzc_output_images/newspapper.jpg`} 
          alt="Newspaper Page"
          className="newspaper-image"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      
      <div className="controls">
        <button onClick={handleZoomIn} className="control-button" title="Zoom In">+</button>
        <button onClick={handleZoomOut} className="control-button" title="Zoom Out">-</button>
        <button onClick={handleResetView} className="control-button" title="Reset View">↻</button>
      </div>
      
      <div className="zoomist-slider-wrapper">
        <div className="zoomist-slider"></div>
      </div>
    </div>
  );
};

export default Viewer;