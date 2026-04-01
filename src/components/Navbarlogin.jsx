import { useState } from "react";
import styles from "./Navbarlogin.module.css";
import logo from "../assets/logo1-r1.png";
import { Link } from "react-router-dom";

const Navbarlogin = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

     <Link to="/">
        <div className={styles.logoContainer} >
          <img src={logo} alt="V-Serve Logo" className={styles.logoImg} />
          <h1 className={styles.logoText}>V-Serve</h1>
        </div>
      </Link>

   
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#1e40af"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
        </div>

       
        <div className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
          
          <ul className={styles.ul}>
            <li><a className={styles.a} href="#home" onClick={()=>setMenuOpen(false)}>Home</a></li>
            <li><a className={styles.a} href="#about" onClick={()=>setMenuOpen(false)}>About</a></li>
            <li><a className={styles.a} href="#how" onClick={()=>setMenuOpen(false)}>How It Works</a></li>
            <li><a className={styles.a} href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a></li>
          </ul>

          <div className={styles.BtnContainer}>
              <Link to="/register">
              <button className={styles.Btn}>Register</button>
              </Link>

              <Link to="/login">
              <button className={styles.Btn}>Login</button>
              </Link>

          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbarlogin;
