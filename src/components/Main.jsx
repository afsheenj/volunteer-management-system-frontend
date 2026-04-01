import styles from "./Main.module.css";
import heroImg from "../assets/hero1.svg";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.container}>

        {/* LEFT CONTENT */}
        <div className={styles.left}>
          <h1>
            Connecting Volunteers with Those in Need
          </h1>

          <p>
            A platform that unites individuals, volunteer groups, NGOs, and
            community-driven initiatives to create meaningful real-world impact.
          </p>

          <div className={styles.buttons}>
            <Link to="/register">
              <button className={styles.primaryBtn}>Register</button>
            </Link>
            <a href="#about">
            <button className={styles.secondaryBtn} >Learn More</button>
            </a>
          </div>

          {/* STATS STRIP */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>5,400+</h3>
              <span>Volunteers</span>
            </div>
            <div className={styles.statCard}>
              <h3>38+</h3>
              <span>Cities</span>
            </div>
            <div className={styles.statCard}>
              <h3>1,200+</h3>
              <span>Requests</span>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className={styles.right}>
          <div className={styles.blob}>
            <img src={heroImg} alt="Volunteer platform illustration" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Main;
