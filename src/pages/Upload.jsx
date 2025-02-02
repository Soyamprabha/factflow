import "../styles/Upload.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Back from "../components/Back";

const BASE_URL = process.env.BASE_URL;

export default function Upload() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [link, setLink] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let response;
      if (uploadedImage) {
        const formData = new FormData();
        formData.append("image", uploadedImage);

        response = await axios.post(`${BASE_URL}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (link.trim() !== "") {
        response = await axios.post(`${BASE_URL}/link`, { link });
      } else {
        alert("Please select an image or enter a link.");
        return;
      }
      console.log("Submission response:", response.data);
      if (response.data) {
        navigate("/display", { state: { result: response.data } }); // Navigate to Display with data
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("There was an error submitting your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <Back />
      <div className="container1 d-flex justify-content-center flex-column align-items-center">
        <div className="img-area1" data-img="">
          {uploadedImage ? (
            <img src={imgSrc} style={{ position: "absolute" }} alt="Uploaded" />
          ) : (
            <div>
              <h3>Upload Image</h3>
            </div>
          )}
        </div>

        <label
          htmlFor="file-input"
          style={{ cursor: "pointer" }}
          className="select-image"
        >
          {uploadedImage ? uploadedImage.name : "Select File"}
          <input
            type="file"
            name="file-input"
            id="file-input"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>

        <div style={{ margin: "1rem 0", textAlign: "center", color: "white" }}>
          OR
        </div>

        <textarea
          placeholder="Enter the link"
          value={link}
          onChange={handleLinkChange}
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
          className="select-image"
          style={{ marginTop: "1rem" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
        <div
          className="position-absolute"
          style={{
            left: "50px",
            bottom: "50px",
            width: "400px",
            height: "300px",
          }}
        >
          <img
            src="https://i.imghippo.com/files/ALR7050iTM.png"
            alt="Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
