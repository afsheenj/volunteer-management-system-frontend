import Navbarlogin from "../components/Navbarlogin.jsx";
import Main from "../components/Main.jsx";
import About from "../components/About.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footerlogin.jsx";
import FloatingMenu from "../components/FloatingMenu.jsx";


const Home=()=>{
    return (
        <>
        <Navbarlogin/>
        <Main/>
        <About/>
        <HowItWorks/>
        {/* <FloatingMenu/> */}
      <Contact/>
      <Footer/>
        </>
    );
}
export default Home;