import React, { useState } from "react";
import "./index.css";
import InputForm from "./components/InputForm";
import TicketPreview from "./components/TicketPreview";
import Loader from "./components/Loader";
import { generateTicketCanvas } from "./utils/ticketGenerator";

function App() {
  const [ticketUrl, setTicketUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateTicket = async (data) => {
    console.log("Button clicked", data);

    setLoading(true);

    try {
      const { name, role, photo } = data;

      const url = await generateTicketCanvas(
        name,
        role,
        photo
      );

      setTicketUrl(url);
    } catch (error) {
      console.error(error);

      alert(
        "Error generating your Cerebras attendee poster."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTicketUrl(null);
  };

  return (
    <div className="app-container">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="hero-section">

        <h1>
          <span className="cafe-word">
            CAFE
          </span>{" "}

          <span className="compute-word">
            COMPUTE
          </span>
        </h1>

        <h2>
          Cerebras
        </h2>

        <p>
          Upload your photo and generate your
          personalized "I'm Attending" poster.
        </p>

      </div>

      {/* =========================================
          MAIN CONTENT
          ========================================= */}

      <main className="glass-card">

        {loading ? (
          <Loader />

        ) : ticketUrl ? (

          <TicketPreview
            ticketUrl={ticketUrl}
            onReset={handleReset}
          />

        ) : (

          <InputForm
            onSubmit={handleGenerateTicket}
          />

        )}

      </main>

    </div>
  );
}

export default App;