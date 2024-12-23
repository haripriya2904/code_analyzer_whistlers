import React, { useState } from "react";

const CodeAnalyzer = () => {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [animatedOutput, setAnimatedOutput] = useState(""); // Animated output state
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_CHAT_GPT_TOKEN;

  // Function to animate text word by word
  const animateText = (text) => {
    const words = text.split(" "); // Split the text into words
    let index = 0;

    setAnimatedOutput(""); // Reset animated output

    const interval = setInterval(() => {
      if (index < words.length) {
        setAnimatedOutput((prev) => (prev ? `${prev} ${words[index]}` : words[index]));
        index++;
      } else {
        clearInterval(interval); // Stop the interval when all words are displayed
      }
    }, 200); // Adjust delay (in milliseconds) for word-by-word animation
  };

  const handleAnalyzeCode = async () => {
    if (!inputCode.trim()) {
      setOutputCode("Please enter some code to analyze or enhance.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_CHAT_GPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert code analyzer. Analyze the given code, resolve code smells, eliminate duplications, improve code quality, and ensure it follows best practices."
            },
            {
              role: "user",
              content: `Analyze the following code. If there are errors, correct them. If it's correct, enhance it by optimizing or improving readability:\n\n${inputCode}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const analyzedCode = data.choices[0].message.content;
        setOutputCode(analyzedCode);
        animateText(analyzedCode); // Animate the output text
      } else {
        setOutputCode("Unexpected response structure from the API.");
      }
    } catch (error) {
      console.error("Error analyzing code:", error);
      setOutputCode("An error occurred while analyzing the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (animatedOutput) {
      navigator.clipboard.writeText(animatedOutput)
        .then(() => {
          alert("Code copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy code: ", err);
        });
    }
  };

  const handleResetInput = () => {
    setInputCode("");
  };

  const handleResetOutput = () => {
    setOutputCode("");
    setAnimatedOutput(""); // Reset animated output
    navigator.clipboard.writeText(animatedOutput)
      .then(() => {
        alert("Code cleared and copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  };

  return (
    <>
      <h1 style={{ textAlign: "center", fontSize: "37px", paddingTop: "20px", marginBottom: "15px" }}>Code Analyzer</h1>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "50px", padding: "20px" }}>
        {/* Left Side */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "50%" }}>
          <label htmlFor="inputCode" style={{ marginBottom: "15px", textAlign: "center" }}>
            <strong>Analyze Your Code Here</strong>
          </label>
          <textarea
            id="inputCode"
            style={{ height: "350px", width: "100%", marginBottom: "15px", resize: "none", padding: "20px", border: "1px solid #ccc" }}
            placeholder="Enter your code here..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
            <button
              onClick={handleAnalyzeCode}
              disabled={loading}
              style={{
                background: "#f44336",
                padding: "10px 20px",
                fontWeight: "600",
                color: "white"
              }}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
            <button
              onClick={handleResetInput}
              style={{
                background: "#ccc",
                color: "black",
                padding: "10px 20px",
                fontWeight: "600",
              }}
            >
              Reset Input
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "50%" }}>
          <label htmlFor="outputCode" style={{ marginBottom: "10px", textAlign: "center" }}>
            <strong>Reviewed/Optimized Code</strong>
          </label>
          <textarea
            id="outputCode"
            style={{
              height: "350px",
              width: "100%",
              resize: "none",
              padding: "20px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
            placeholder="The analyzed/enhanced code will appear here..."
            value={animatedOutput} // Display animated output
            readOnly
          />
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
            <button
              onClick={handleCopy}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                fontWeight: "600",
              }}
            >
              Copy
            </button>
            <button
              onClick={handleResetOutput}
              style={{
                background: "#ccc",
                color: "black",
                padding: "10px 20px",
                fontWeight: "600",
              }}
            >
              Copy and Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeAnalyzer;
