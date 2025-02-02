import "../styles/Display.css";
import { useLocation } from "react-router-dom";
import Back from "../components/Back";

export default function Display() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="whole">
        <Back />
        <h1 className="heading-opt"> No results found! </h1>
      </div>
    );
  }

  const isTrueNews = result.response;
  const message = isTrueNews ? "This news is true" : "This news is false";

  return (
    <div className="whole">
      <Back />
      <h1 className="heading-opt">{message}</h1>
      <div className="holder">
        <h3>Supporting Evidence:</h3>
        <ul>
          {result.evidence_titles.map((title, index) => (
            <li key={index}>
              <a
                href={result.evidence_links[index]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
