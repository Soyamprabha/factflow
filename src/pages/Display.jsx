import "../styles/Display.css";
import { useLocation } from "react-router-dom";
import Back from "../components/Back";

export default function Display() {
  const location = useLocation();
  const result = location.state?.result;
  // console.log(result)

  if (!result) {
    return (
      <div className="display-wrapper">
        <Back />
        <h1 className="display-heading"> No results found! </h1>
      </div>
    );
  }

  const isTrueNews = result.response;
  const message = isTrueNews ? "This news is true" : "This news is false";
  const textColor = isTrueNews ? "green-text" : "red-text";

  return (
    <div className="display-wrapper">
      <Back />
      <h1 className={`display-heading ${textColor}`}>{message}</h1>
      <div className="display-container">
        <div className="display-left">
          <div className="display-summary">
            <p>{result.summary}</p>
          </div>
        </div>
        <div className="display-right">
          <h3>Supporting Evidence:</h3>
          <ul>
            {result.evidence.map((item, index) => (
              <li key={index}>
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
