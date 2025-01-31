import "../styles/Home.css";
export default function Content() {
  return (
    <div>
      <section id="about" className="about section-padding">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="about-img">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZrfbPzAb_sJs7kSJKPdH85ys5YhikFRzghw&s"
                  alt=""
                  className="img-fluid rounded"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12 ps-lg-5 mt-md-5">
              <div className="about-text">
                <h2 style={{ color: "#3E7C17" }}>What do we do?</h2>
                <p>
                  Our project tackles the pervasive issue of online
                  misinformation by providing an automated, real-time detection
                  and verification system. Leveraging cutting-edge AI, we
                  analyze text to identify potentially false content,
                  significantly reducing the manual effort required for
                  fact-checking. We empower users to critically assess online
                  information by flagging questionable content and offering
                  reliable sources for comparison. This fosters a more informed
                  online experience, enhancing trust in credible content and
                  reducing the spread of harmful misinformation.
                </p>
                <p>
                  Our solution prioritizes speed and accuracy, processing posts
                  rapidly to provide users with timely results. We aim to
                  improve detection accuracy, minimize response time, and
                  maximize user engagement to effectively combat the spread of
                  misinformation and promote a more trustworthy digital
                  environment. Ultimately, our work strives to measurably reduce
                  the circulation of false content and contribute to a more
                  informed and discerning online community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
