import "../styles/Home.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";

export default function Content() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("about");
      if (section) {
        const top = section.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tagData = [
    { value: "Fact-Checking", count: 25 },
    { value: "AI-Powered", count: 18 },
    { value: "Misinformation", count: 30 },
    { value: "Verification", count: 22 },
    { value: "Deep Learning", count: 20 },
    { value: "Fake News", count: 28 },
  ];

  return (
    <section id="about" className="about section-padding">
      <div className="container">
        <motion.div
          className="content-container"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-section">
            <h2 className="section-title">What We Do</h2>
            <p>
              Our AI-powered platform detects misinformation in real-time,
              reducing manual fact-checking efforts. We empower users to verify
              content with trusted sources, helping to combat the spread of fake
              news across social media.
            </p>
            <p>
              With cutting-edge technology, we ensure high accuracy and minimal
              response time. Our goal is to build a more informed digital
              community through reliable and fast fact-checking.
            </p>
          </div>

          <div className="visual-section">
            <motion.img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZrfbPzAb_sJs7kSJKPdH85ys5YhikFRzghw&s"
              alt="Fact-Checking"
              className="about-img"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <TagCloud
              minSize={12}
              maxSize={35}
              tags={tagData}
              className="tag-cloud"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
