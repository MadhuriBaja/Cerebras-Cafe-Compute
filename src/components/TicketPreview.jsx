import React from "react";

const TicketPreview = ({ ticketUrl, onReset }) => {
  const shareText =
    "I'm attending Miro Canvas 26 - Hyderabad Watch Party! 🚀 Excited to connect, learn, collaborate, and network with the Miro community. #Miro #Canvas26 #Hyderabad #DevX #KramersCommunity";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "Miro_Canvas26_Attendee_Pass.png";
    link.href = ticketUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLinkedInShare = () => {
  // Download the attendee pass first
  handleDownload();

  // Open LinkedIn after a short delay
  setTimeout(() => {
    window.open("https://www.linkedin.com/feed/", "_blank");

    alert(
      "Your attendee pass has been downloaded.\n\nCreate a new LinkedIn post, upload the downloaded image, and tag Miro, DevX, and Kramers Community."
    );
  }, 600);
};

  const handleInstagramShare = () => {
    handleDownload();
    setTimeout(() => {
      alert(
        "Attendee pass downloaded! 📸 Share it on Instagram and tag Miro Hyderabad Watch Party."
      );
    }, 500);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={ticketUrl}
        alt="Attendee Pass"
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "16px",
          marginBottom: "1.5rem",
        }}
      />

      <div className="action-buttons">
        <button
          onClick={handleDownload}
          className="btn-secondary"
          style={{ flex: "1 1 100%", marginBottom: "0.5rem" }}
        >
          Download Attendee Pass
        </button>

        <button
          onClick={handleLinkedInShare}
          className="btn-primary"
          style={{ flex: 1, minWidth: "150px" }}
        >
          Share on LinkedIn
        </button>

        <button
          onClick={handleInstagramShare}
          className="btn-primary"
          style={{
            flex: 1,
            minWidth: "150px",
            background:
              "linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)",
          }}
        >
          Share on Instagram
        </button>

        <button
          onClick={handleTwitterShare}
          className="btn-primary"
          style={{
            flex: 1,
            minWidth: "150px",
            background:"linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)",
          }}
        >
          Share on X
        </button>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "left",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#6C4CF1",
          }}
        >
          What's Next?
        </h3>

        <ul
          style={{
            paddingLeft: "20px",
            lineHeight: "1.8",
          }}
        >
          <li>Download your personalized attendee pass.</li>
          <li>Share it on LinkedIn, Instagram or X.</li>
          <li>Tag Miro, DevX and Kramers Community.</li>
          <li>See you at Canvas 26 Hyderabad Watch Party! 🎉</li>
        </ul>
      </div>

      <button
        onClick={onReset}
        className="btn-secondary"
        style={{
          marginTop: "2rem",
          background: "none",
          border: "none",
          opacity: 0.7,
        }}
      >
        ← Create Another Pass
      </button>
    </div>
  );
};

export default TicketPreview;