// src/components/Chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from "react";
import babyGif from "/workspaces/Dream-Decoder/dream-decoder-ui/src/assets/ppt_gif.gif";
import lastFrame from "/workspaces/Dream-Decoder/dream-decoder-ui/src/assets/lastframe.png";

export default function ChatWindow() {
  const [dream, setDream] = useState("");
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selected, setSelected] = useState<"Meaning" | "Poem" | "Image" | null>(null);
  const [result, setResult] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // show intro GIF for NAV_TIME ms
  const NAV_TIME = 4500;
  const [showGif, setShowGif] = useState(true);
  useEffect(() => {
    if (!showGif) return;
    const t = setTimeout(() => setShowGif(false), NAV_TIME);
    return () => clearTimeout(t);
  }, [showGif]);

  // open options on Enter
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && dream.trim()) {
      e.preventDefault();
      setOptionsVisible(true);
      setSelected(null);
      setResult("");
      setImageUrl("");
    }
  };

  // fetch from the right endpoint based on mode
  const handleSelect = async (mode: "Meaning" | "Poem" | "Image") => {
    setSelected(mode);
    setLoading(true);

    try {
      let res: Response;
      const body = JSON.stringify({ dream_text: dream });

      if (mode === "Meaning") {
        res = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const text = await res.json(); // returns a string
        setResult(text);
      } else if (mode === "Poem") {
        res = await fetch("/api/poem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const poem = await res.json(); // returns a string
        setResult(poem);
      } else {
        // Image
        res = await fetch("/api/visualize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const json = await res.json(); // { image_url: string }
        setImageUrl(json.image_url);
      }
    } catch (err) {
      console.error(err);
      setResult("Oops—something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

  // CLOUD shape data (unchanged) …
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
      {/* ── CLOUD 1: Input ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: "12%",
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
            pointerEvents: "auto",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        />
      </div>

      {/* ── CLOUD 2: Options ── */}
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
                left: d.left - 16,
                width: d.width + 32,
                height: d.height + 32,
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
            Now that I’ve interpreted your dream,
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

      {/* ── CLOUD 3: Result ── */}
      {selected && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "40%",
            left: "18%",
            width: 300,
            height: 180,
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
                left: d.left - 16,
                width: d.width + 32,
                height: d.height + 48,
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

          {loading ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 14,
                color: "#666",
              }}
            >
              Loading...
            </div>
          ) : selected === "Image" ? (
            <img
              src={imageUrl}
              alt="Dream Visual"
              style={{
                position: "absolute",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                maxWidth: "80%",
                maxHeight: "60%",
                borderRadius: 4,
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                top: 24,
                left: 16,
                width: "calc(100% - 32px)",
                fontSize: 14,
                lineHeight: "1.4",
                color: "#333",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {result}
            </div>
          )}

          <button
            onClick={() => {
              setSelected(null);
              setOptionsVisible(true);
            }}
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              ...btnStyle,
              background: "#cc3333",
            }}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
