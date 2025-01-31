import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

export default function Back() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/")}>
      <img
        src={logo}
        className="back"
        style={{
          position: "absolute",
          left: "1rem",
          top: "1rem",
        }}
        alt=""
      />
    </button>
  );
}
