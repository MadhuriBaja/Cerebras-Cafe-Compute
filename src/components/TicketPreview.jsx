import React from "react";

const TicketPreview = ({ ticketUrl, onReset }) => {
  const shareText = `🚀 Excited to attend Cerebras Cafe Compute!

Looking forward to connecting, learning, collaborating and networking with the amazing @Cerebras community.

#KramersCommunity
#Hyderabad
#Trending
#Cerebras
#CafeCompute
#DevX;

  const handleDownload = async () => {
    try {
      const response = await fetch(ticketUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Cerebras_Cafe_Compute_Attendee_Poster.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download the Cerebras attendee poster.");
    }
  };

  const handleLinkedInShare = async () => {
    // Download attendee poster
    handleDownload();

    // Copy caption
    await navigator.clipboard.writeText(shareText);

    // Open LinkedIn
    setTimeout(() => {
      window.open("https://www.linkedin.com/feed/", "_blank");

      alert(
`✅ Cerebras attendee poster downloaded!

✅ Caption copied to clipboard!

Next Steps:
1. LinkedIn has been opened.
2. Create a new post.
3. Upload the downloaded Cerebras poster.
4. Paste the copied caption (Ctrl + V).
5. Add any @mentions if needed and post.`
      );
    }, 700);
  };

  const handleInstagramShare = async () => {
    // Download attendee poster
    handleDownload();

    // Copy caption
    await navigator.clipboard.writeText(shareText);

    // Open Instagram
    setTimeout(() => {
      window.open("https://www.instagram.com/", "_blank");

      alert(
`✅ Cerebras attendee poster downloaded!

✅ Caption copied to clipboard!

Next Steps:
1. Instagram has been opened.
2. Upload the downloaded Cerebras poster.
3. Paste the copied caption.
4. Share your post.`
      );
    }, 700);
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
        alt="Cerebras Cafe Compute Attendee Poster"
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "16px",
          marginBottom: "1.5rem",
        }}
      />

      <div className="action-buttons">

        {/* Download */}
        <button
          onClick={handleDownload}
          className="btn-secondary"
          style={{
            flex: "1 1 100%",
            marginBottom: "0.5rem",
          }}
        >
          Download Cerebras Poster
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className="btn-primary"
          style={{
            flex: 1,
            minWidth: "150px",
          }}
        >
          Share on LinkedIn
        </button>

        {/* Instagram */}
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

        {/* X */}
        <button
          onClick={handleTwitterShare}
          className="btn-primary"
          style={{
            flex: 1,
            minWidth: "150px",
            background:
              "linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)",
          }}
        >
          Share on X
        </button>
      </div>

      {/* What's Next */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#fffaf6",
          borderRadius: "12px",
          border: "1px solid #eadfd6",
          textAlign: "left",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#f36c21",
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
          <li>🔻 Download your personalized Cerebras attendee poster.</li>

          <li>
            ↪️ Share it on LinkedIn, Instagram or X.
          </li>

          <li>
            🚨 Tag Kramers Community, Cerebras and DevX.
          </li>

          <li>
            🎉 See you at Cerebras Cafe Compute!
          </li>
        </ul>
      </div>

      {/* Create Another */}
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
        ← Create Another Poster
      </button>
    </div>
  );
};

export default TicketPreview;