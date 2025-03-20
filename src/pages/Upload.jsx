import "../styles/Upload.css";
import { useState } from "react";
import axios from "axios";
import Back from "../components/Back";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Upload() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false); // State to control result section visibility

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setImgSrc(URL.createObjectURL(file));
    }
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let response;
      if (uploadedImage) {
        const formData = new FormData();
        formData.append("image", uploadedImage);
        response = await axios.post(`${BASE_URL}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (link.trim() !== "") {
        response = await axios.post(`${BASE_URL}/link`, { link });
      } else if (text.trim() !== "") {
        response = await axios.post(`${BASE_URL}/text`, { text });
      } else {
        alert("Please select an image or enter a link or text.");
        return;
      }
      setResult(response.data);
      setShowResult(true); // Show result section on submit
    } catch (error) {
      console.error("Error during submission:", error);
      alert("There was an error submitting your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`upload-page ${showResult ? "expanded" : "centered"}`}>
      <div className="upload-section">
        <Back />
        <div className="upload-container">
          <h3>Upload File</h3>
          <p>Drag and drop your file here or click to upload</p>
          <div
            className="upload-box"
            onClick={() => document.getElementById("file-input").click()}
          >
            {uploadedImage ? (
              <img src={imgSrc} alt="Uploaded" className="preview-image" />
            ) : (
              <p>Upload Image</p>
            )}
            <input
              type="file"
              id="file-input"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <input
            type="text"
            className="form-control url-input"
            placeholder="Enter the link"
            value={link}
            onChange={handleLinkChange}
          />
          <input
            type="text"
            className="form-control url-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text"
          />
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                Processing...
                <span className="small-loader"></span>{" "}
                {/* Loader next to text */}
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
      <div className={`result-section ${showResult ? "slide-in" : "hidden"}`}>
        {loading ? (
          <div className="loading-container">
            <h2 className="loading-text">Please wait...</h2>
            <div className="loader"></div>
          </div>
        ) : result ? (
          <>
            <h2 className={`result-header ${result.isFake ? "false" : "true"}`}>
              {result.isFake ? "This news is false" : "This news is true"}
            </h2>
            <p className="result-text">{result.summary}</p>

            {result.evidence && (
              <div className="evidence">
                <h3>Supporting Evidence:</h3>
                {result.evidence.map((item, index) => (
                  <div key={index} className="evidence-box">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="evidence-title"
                    >
                      {item.title}
                    </a>
                    <br />
                    <em className="evidence-meta">
                      by {item.source}, dated{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </em>
                    <p className="evidence-summary">{item.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
