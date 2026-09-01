import Features from "./components/Features";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Numbers from "./components/Numbers";
import Reviews from "./components/Reviews";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <Navbar />
    <Landing/>
    <Features/>
    <Reviews/>
    <Numbers/>
    <Footer/>
    </>
  )
}
