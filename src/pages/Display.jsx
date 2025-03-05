import "../styles/Display.css";
import { useLocation } from "react-router-dom";
import Back from "../components/Back";

export default function Display() {
  const location = useLocation();
  const result = location.state?.result;
  // console.log(result)

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
  );
}
