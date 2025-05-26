// src/components/Chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from "react";
import babyGif from "/workspaces/Dream-Decoder/dream-decoder-ui/src/assets/ppt_gif.gif";
import lastFrame from "/workspaces/Dream-Decoder/dream-decoder-ui/src/assets/lastframe.png";

export default function ChatWindow() {
  const [dream, setDream] = useState("");
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selected, setSelected] = useState<"Meaning" | "Poem" | "Image" | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const NAV_TIME = 4500;
  const [showGif, setShowGif] = useState(true);
  useEffect(() => {
    if (!showGif) return;
    const t = setTimeout(() => setShowGif(false), NAV_TIME);
    return () => clearTimeout(t);
  }, [showGif]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && dream.trim()) {
      e.preventDefault();
      setOptionsVisible(true);
      setSelected(null);
      setResult("");
    }
  };

  const handleSelect = async (mode: "Meaning" | "Poem" | "Image") => {
    setSelected(mode);
    setLoading(true);
    try {
      const body = JSON.stringify({ dream_text: dream });
      let res: Response;
      if (mode === "Meaning") {
        res = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        setResult(await res.json());
      } else if (mode === "Poem") {
        res = await fetch("/api/poem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        setResult(await res.json());
      } else {
        res = await fetch("/api/visualize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const json = await res.json();
        setResult(json.image_url);
      }
    } catch {
      setResult("Oops—something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setOptionsVisible(false);
    }
  };

  const btnStyle: React.CSSProperties = {
    background: "#0b2545",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 14,
  };

  const c1Circles = [
    { top: 28, left: 0, width: 180, height: 100 },
    { top: 0, left: 100, width: 200, height: 120 },
    { top: 36, left: 260, width: 120, height: 80 },
  ];
  const c1Dots = [
    { bottom: -12, left: "44%", size: 12 },
    { bottom: -30, left: "58%", size: 8 },
  ];

  const c2Circles = [
    { top: 24, left: 0, width: 140, height: 80 },
    { top: 0, left: 80, width: 180, height: 100 },
    { top: 32, left: 240, width: 100, height: 60 },
  ];
  const c2Dots = c1Dots;

  return (
    <div
      onClick={() => !showGif && setShowGif(true)}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        cursor: showGif ? "default" : "pointer",
        background: `url(${showGif ? babyGif : lastFrame}) center/cover no-repeat`,
      }}
    >
      {/* Dream input */}
      {!selected && !optionsVisible && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "2%",
            left: "18%",
            width: 400,
            height: 240,
            pointerEvents: "auto",
            zIndex: 2,
            overflow: "visible",
          }}
        >
          {c1Circles.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: d.top,
                left: d.left,
                width: d.width,
                height: d.height,
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              }}
            />
          ))}
          {c1Dots.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: d.bottom,
                left: d.left,
                width: d.size,
                height: d.size,
                background: "#b0c4a0",
                borderRadius: "50%",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            />
          ))}
          <textarea
            ref={textareaRef}
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tell me what you dreamed today"
            rows={3}
            style={{
              position: "absolute",
              top: 40,
              left: 24,
              width: "calc(100% - 48px)",
              height: "calc(3 * 1.4em)",
              padding: 8,
              border: "none",
              background: "transparent",
              resize: "none",
              outline: "none",
              fontSize: 14,
              lineHeight: "1.4",
              color: "#333",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          />
        </div>
      )}

      {/* Options cloud */}
      {optionsVisible && !selected && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "40%",
            left: "18%",
            width: 300,
            height: 160,
            pointerEvents: "auto",
            zIndex: 2,
            overflow: "visible",
          }}
        >
          {c2Circles.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: d.top,
                left: d.left,
                width: d.width,
                height: d.height,
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              }}
            />
          ))}
          {c2Dots.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: d.bottom,
                left: d.left,
                width: d.size,
                height: d.size,
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 16,
              width: "calc(100% - 32px)",
              fontSize: 14,
              lineHeight: "1.4",
              color: "#333",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Now that I've interpreted your dream,
            <br />
            pick any for more insights:
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 50,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 8,
            }}
          >
            {(["Meaning", "Poem", "Image"] as const).map((label) => (
              <button key={label} style={btnStyle} onClick={() => handleSelect(label)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result cloud (moved up) */}
      {selected && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "5%",         // ← moved up from 15%
            left: "5%",
            width: 700,
            height: 460,        // ← slightly shorter
            pointerEvents: "auto",
            zIndex: 2,
            overflow: "visible",
          }}
        >
          <svg
            width="700"
            height="500"
            viewBox="0 0 700 500"
            style={{
              overflow: "visible",
              display: "block",
              pointerEvents: "none",
              position: "relative",
              zIndex: 1,
            }}
          >
            <defs>
              <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="rgba(0,0,0,0.1)" />
              </filter>
            </defs>
            <path
              d="
                M450 100
                C290 100 240 238 278 286
                C261 300 195 316 195 376
                C195 443 270 487 360 450
                C402 517 567 517 600 450
                C697 450 720 345 630 300
                C660 225 600 100 450 100
                Z
              "
              fill="#E3F2FD"
              filter="url(#cloudShadow)"
            />
            <foreignObject
              x="250"
              y="150"
              width="440"
              height="300"
              style={{ pointerEvents: "auto" }}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  height: "100%",
                  padding: "2rem 2rem 2rem 4rem",
                  boxSizing: "border-box",
                  fontSize: 14,
                  lineHeight: "1.6",
                  color: "#333",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,0,0,0.2) transparent",
                }}
              >
                <style>{`
                  div::-webkit-scrollbar { width: 6px; }
                  div::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.2);
                    border-radius: 3px;
                  }
                  div::-webkit-scrollbar-track { background: transparent; }
                `}</style>
                {loading ? (
                  <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading…</div>
                ) : selected === "Image" ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={result}
                      alt="Dream visualization"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "280px",
                        borderRadius: 8,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "1rem",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      maxHeight: "calc(100% - 4rem)",
                      overflowY: "auto",
                    }}
                  >
                    {result}
                  </div>
                )}
              </div>
            </foreignObject>
          </svg>

          {/* ← Back (now fully on the cloud) */}
          <button
            onClick={() => {
              setSelected(null);
              setOptionsVisible(true);
            }}
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              pointerEvents: "auto",
              ...btnStyle,
            }}
          >
            ← Back
          </button>

          {/* decorative dots */}
          <div
            style={{
              position: "absolute",
              bottom: -12,
              left: "38%",
              width: 28,
              height: 28,
              background: "#E3F2FD",
              borderRadius: "50%",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -28,
              left: "53%",
              width: 20,
              height: 20,
              background: "#E3F2FD",
              borderRadius: "50%",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}
    </div>
  );
}
