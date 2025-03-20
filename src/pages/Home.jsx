// import "../styles/Home.css";

// import ContactUs from "../components/Contactus";
// import Hero from "../components/Hero";
// import Content from "../components/Content";

// const Home = () => {
//   return (
//     <div className="container-fluid">
//       <Hero />
//       <Content />
//       <ContactUs />
//     </div>
//   );
// };

// export default Home;

// import "../styles/Home.css";
// import ContactUs from "../components/Contactus";
// import Hero from "../components/Hero";
// import Content from "../components/Content";
// import { useState, useEffect } from "react";

// const statistics = [
//   {
//     id: 1,
//     value: 66,
//     text: "of U.S. consumers believe that 76% or more of the news on social media is biased.",
//   },
//   {
//     id: 2,
//     value: 60,
//     text: "globally say news organizations regularly report false stories.",
//   },
//   {
//     id: 3,
//     value: 82,
//     text: "of Argentinians reported seeing deliberately false stories often, compared to lower percentages in Germany, Japan, and South Korea.",
//   },
//   {
//     id: 4,
//     value: 60,
//     text: "of U.S. journalists express high concern about possible press freedom limitations.",
//   },
//   {
//     id: 5,
//     value: 94,
//     text: "of journalists see made-up news as a significant problem.",
//   },
//   {
//     id: 6,
//     value: 38.2,
//     text: "of U.S. news consumers unknowingly shared fake news on social media.",
//   },
//   {
//     id: 7,
//     value: 16,
//     text: "of overall respondents found news content on Twitter accurate, with stark contrasts based on political alignment.",
//   },
//   {
//     id: 8,
//     value: 66,
//     text: "of bots discussing COVID-19 were spreading misinformation and 47% of U.S. adults encountered a significant amount of made-up news about COVID-19.",
//   },
// ];

// const StatisticsSection = () => {
//   const [counts, setCounts] = useState(statistics.map(() => 0));

//   useEffect(() => {
//     const intervals = statistics.map((stat, index) => {
//       return setInterval(() => {
//         setCounts((prevCounts) => {
//           const newCounts = [...prevCounts];
//           if (newCounts[index] < stat.value) {
//             newCounts[index] += Math.ceil(stat.value / 50); // Smooth increment
//           } else {
//             newCounts[index] = stat.value;
//           }
//           return newCounts;
//         });
//       }, 30);
//     });
//     setTimeout(() => intervals.forEach(clearInterval), 2000);
//     return () => intervals.forEach(clearInterval);
//   }, []);

//   return (
//     <section className="statistics-section">
//       <div className="container">
//         <h2 className="section-title">Facts vs. Fiction: The Data Speaks</h2>
//         <div className="stats-grid">
//           {statistics.map((stat, index) => (
//             <div key={stat.id} className="stat-box">
//               <h3>
//                 {counts[index]}
//                 {stat.id === 10 ? "x" : "%"}{" "}
//               </h3>
//               <p>{stat.text}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// const Home = () => {
//   return (
//     <div className="container-fluid">
//       <Hero />
//       <StatisticsSection />
//       <Content />
//       <ContactUs />
//     </div>
//   );
// };

// export default Home;
import "../styles/Home.css";
import ContactUs from "../components/Contactus";
import Hero from "../components/Hero";
import Content from "../components/Content";
import { useState, useEffect } from "react";
import { Chart } from "react-google-charts"; // Google Charts Import
import "chart.js/auto";

const statistics = [
  {
    id: 1,
    value: 66,
    text: "of U.S. consumers believe that 76% or more of the news on social media is biased.",
  },
  {
    id: 2,
    value: 60,
    text: "globally say news organizations regularly report false stories.",
  },
  {
    id: 3,
    value: 82,
    text: "of Argentinians reported seeing deliberately false stories often, compared to lower percentages in Germany, Japan, and South Korea.",
  },
  {
    id: 4,
    value: 60,
    text: "of U.S. journalists express high concern about possible press freedom limitations.",
  },
  {
    id: 5,
    value: 94,
    text: "of journalists see made-up news as a significant problem.",
  },
  {
    id: 6,
    value: 38.2,
    text: "of U.S. news consumers unknowingly shared fake news on social media.",
  },
  {
    id: 7,
    value: 16,
    text: "of overall respondents found news content on Twitter accurate, with stark contrasts based on political alignment.",
  },
  {
    id: 8,
    value: 66,
    text: "of bots discussing COVID-19 were spreading misinformation and 47% of U.S. adults encountered a significant amount of made-up news about COVID-19.",
  },
];

const StatisticsSection = () => {
  const [counts, setCounts] = useState(statistics.map(() => 0));

  useEffect(() => {
    const intervals = statistics.map((stat, index) => {
      return setInterval(() => {
        setCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          if (newCounts[index] < stat.value) {
            newCounts[index] += Math.ceil(stat.value / 50); // Smooth increment
          } else {
            newCounts[index] = stat.value;
          }
          return newCounts;
        });
      }, 30);
    });
    setTimeout(() => intervals.forEach(clearInterval), 2000);
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="statistics-section">
      <div className="container">
        <h2 className="section-title">Facts vs. Fiction: The Data Speaks</h2>
        <div className="stats-grid">
          {statistics.map((stat, index) => (
            <div key={stat.id} className="stat-box">
              <h3>
                {counts[index]}
                {stat.id === 10 ? "x" : "%"}{" "}
              </h3>
              <p>{stat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsTicker = () => {
  return (
    <div className="news-ticker">
      <marquee className="ticker-text">
        🔥 Latest: AI-generated deepfakes increase 8x in one year! | 🚨 Fake
        news spreads 3x faster than real news! | 📰 60% of people struggle to
        differentiate real from fake news.
      </marquee>
    </div>
  );
};

const FakeNewsStatistics = () => {
  const fakeNewsData = [
    ["Category", "Percentage"],
    ["Political Fake News", 46],
    ["General Issues", 33.6],
    ["Religious Misinfo", 16.8],
  ];

  const socialMediaData = [
    ["Platform", "Percentage"],
    ["Twitter", 61],
    ["Facebook", 34],
    ["Other Social Media", 97.4 - (61 + 34)],
  ];

  return (
    <section className="fake-news-section">
      <div className="container">
        <h2 className="section-title">
          🔍 India - The Misinformation Rich Country
        </h2>
        <p className="section-subtitle">
          India ranks first in misinformation spread. Let us explore the major
          types of fake news and how social media platforms contribute.
        </p>

        <div className="charts-container">
          <div className="chart-box">
            <h3>Fake News by Type</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="350px"
              data={fakeNewsData}
              options={{
                is3D: true,
                backgroundColor: "transparent",
                colors: ["#ff6384", "#36a2eb", "#ffcc29"],
              }}
            />
          </div>

          <div className="chart-box">
            <h3>Fake News via Social Media</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="350px"
              data={socialMediaData}
              options={{
                is3D: true,
                backgroundColor: "transparent",
                colors: ["#36a2eb", "#ffcc29", "#ff6384"],
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeatmapSection = () => {
  useEffect(() => {
    const loadGoogleCharts = () => {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.async = true;
      script.onload = () => {
        window.google.charts.load("current", {
          packages: ["geochart"],
        });
        window.google.charts.setOnLoadCallback(drawRegionsMap);
      };
      document.body.appendChild(script);
    };

    const drawRegionsMap = () => {
      const data = window.google.visualization.arrayToDataTable([
        ["Country", "Misinformation Level"],
        ["India", 92],
        ["United States", 80],
        ["Mexico", 68],
        ["United Kingdom", 66],
        ["Indonesia", 54],
        ["Russia", 76],
        ["Brazil", 78],
        ["Germany", 62],
        ["Japan", 48],
        ["South Korea", 47],
        ["Australia", 42],
      ]);

      const options = {
        colorAxis: { colors: ["#f4cccc", "#cc0000"] },
        backgroundColor: "#f8f9fa",
        datalessRegionColor: "#d3d3d3",
      };

      const chart = new window.google.visualization.GeoChart(
        document.getElementById("heatmap1")
      );

      chart.draw(data, options);
    };

    loadGoogleCharts();
  }, []);

  return (
    <section className="heatmap-section">
      <div className="container">
        <h2 className="section-title">Global Misinformation Hotspots</h2>
        <p>
          Misinformation is spreading like wildfire! Explore this interactive
          heatmap to see how different countries are affected. Darker regions
          signal a higher spread of fake news. Stay informed, stay sharp!
        </p>

        <div id="heatmap1" className="heatmap-container"></div>
        <p className="heatmap-note">
          Data is based on misinformation studies from 2020-2024.
        </p>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="container-fluid">
      <NewsTicker />
      <Hero />
      <StatisticsSection />
      <HeatmapSection />
      <FakeNewsStatistics />
      <Content />
      <ContactUs />
    </div>
  );
};

export default Home;
