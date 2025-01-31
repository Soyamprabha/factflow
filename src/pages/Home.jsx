import "../styles/Home.css";

import ContactUs from "../components/Contactus";
import Hero from "../components/Hero";
import Content from "../components/Content";

const Home = () => {
  return (
    <div className="container-fluid">
      <Hero />
      <Content />
      <ContactUs />
    </div>
  );
};

export default Home;
