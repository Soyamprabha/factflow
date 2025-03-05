import "../styles/Upload.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Back from "../components/Back";
import illustration from "../images/illustration.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Upload() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      console.log("Submission response:", response.data);
      if (response.data) {
        navigate("/display", { state: { result: response.data } });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("There was an error submitting your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-body">
      <Back />
      <div className="upload-container">
        <div
          className="upload-box"
          onClick={() => document.getElementById("file-input").click()}
          style={{
            minHeight: uploadedImage ? "auto" : "150px",
          }}
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

        <p className="text-center text-muted">OR</p>

        <input
          type="text"
          className="form-control url-input"
          placeholder="Enter the link"
          value={link}
          onChange={handleLinkChange}
        />

        <p className="text-center text-muted">OR</p>

        <input
          type="text"
          className="form-control url-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text"
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
            minHeight: "100px",
            textAlign: "center",
            fontWeight: "bold",
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>
      <div className="illustration-container">
        <img
          src={illustration}
          alt="Illustration"
          className="illustration-image"
        />
      </div>
    </div>
  );
}
