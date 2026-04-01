import styles from "./About.module.css";
import aboutImg1 from "../assets/About1.jpg";
import aboutImg2 from "../assets/About2.jpg";

const About = () => {
  return (
    <section id="about" className={styles.aboutSection}>

   
      <div className={styles.row}>
        <div className={styles.textBlock}>
          <h1><span>About</span> <span className={styles.logo}>V-Serve</span></h1>
          <p>
            V-Serve is a smart volunteer coordination platform built to connect
            people who need help with people who are ready to help. The system
            is designed to manage volunteer requests for social causes such as
            disaster response, education support, orphanages, and community welfare
            in a simple, reliable, and transparent way.
          </p>
        </div>

        <div className={styles.imageBlock}>
          <img src={aboutImg1} alt="Volunteers working together" />
        </div>
      </div>

      <div className={`${styles.row} ${styles.reverse}`}>
        <div className={styles.imageBlock}>
          <img src={aboutImg2} alt="Our mission" />
        </div>

        <div className={styles.textBlock}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to make volunteering more organized, efficient, and
            impactful. V-Serve uses location-based notifications, skill-based
            matching, and structured request handling to ensure that the right
            people reach the right place at the right time. By maintaining volunteer profiles, participation history, and impact
            scores, the platform builds trust, accountability, and long-term
            community engagement.
          </p>
        </div>
      </div>

    </section>
  );
};

export default About;
