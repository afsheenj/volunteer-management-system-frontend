import styles from "./Footerlogin.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} <span >V-Serve</span>. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
