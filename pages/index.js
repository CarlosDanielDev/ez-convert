import { SpeedInsights } from "@vercel/speed-insights/next";
import styles from "./styles.module.css";
import { useCallback, useState } from "react";

function Home() {
  const [, setCurrencyList] = useState([]);

  const handleAddNewCurrency = useCallback((currency) => {
    setCurrencyList((prevState) => [...prevState, currency]);
  }, []);

  console.log({
    handleAddNewCurrency,
  });

  return (
    <>
      <SpeedInsights />
      <div className={styles.container}>
        <h1 className={styles.title}>Easy Convert</h1>
        teste
        <button className={styles["button-primary"]}>Add Currency</button>
      </div>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8636863724055857"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}

export default Home;
