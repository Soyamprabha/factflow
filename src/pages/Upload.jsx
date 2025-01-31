import "../styles/Upload.css";
import { useState } from "react";
import Back from "../components/Back";

export default function Upload() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setImgSrc(URL.createObjectURL(file));
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
          {uploadedImage ? uploadedImage.name : `Select File`}
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
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
            minHeight: "100px",
            textAlign: "center", // Center the text within the textarea
            fontWeight: "bold", // Make placeholder bold (affects typed text too)
            color: "black", // Make placeholder and typed text black
            // These next two lines are for better placeholder centering (cross-browser)
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />

        <button className="select-image" style={{ marginTop: "1rem" }}>
          Submit
        </button>
      </div>
    </div>
  );
}
