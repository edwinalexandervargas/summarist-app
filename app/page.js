import Features from "./components/Features";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <Navbar />
    <Landing/>
    <Features/>
    </>
  )
}
