import type { NextPage } from "next";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Index: NextPage = () => {
  const router = useRouter();
  const [currentAccessKey, setCurrentAccessKey] = useState<string>("");
  const [currentSecretKey, setCurrentSecretKey] = useState<string>("");

  const onChangeInput = (e: any) => {
    const { name, value } = e.target;
    window.localStorage.setItem(name, value);
  };

  const onGoHome = () => {
    const sendOwlKey = window.localStorage.getItem("sendOwlKey");
    const sendOwlSecret = window.localStorage.getItem("sendOwlSecret");

    if (sendOwlKey && sendOwlSecret) {
      return router.push(`/home?sendOwlKey=${sendOwlKey}&sendOwlSecret=${sendOwlSecret}`);
    }
    alert("Please fill in SendOwl credentials");
  };

  const rendeForm = () => (
    <>
      SendOwl key:{" "}
      <input
        name="sendOwlKey"
        onChange={onChangeInput}
        defaultValue={currentAccessKey}
      />
      <br />
      SendOwl secret:
      <input
        name="sendOwlSecret"
        onChange={onChangeInput}
        defaultValue={currentSecretKey}
      />
      <button type="button" onClick={onGoHome}>
        Go
      </button>
    </>
  );

  useEffect(() => {
    const sendOwlKey = window.localStorage.getItem("sendOwlKey") || "";
    const sendOwlSecret = window.localStorage.getItem("sendOwlSecret") || "";
    setCurrentAccessKey(sendOwlKey);
    setCurrentSecretKey(sendOwlSecret);
  }, []);

  return (
    <Layout>
      <p className={styles.description}>
        Please enter your SendOwl credentials, they will only be saved on your
        browser&apos;s localstorage!
      </p>
      <p>Find your keys <a target="_blank" href="https://dashboard.sendowl.com/settings/api_credentials" rel="noreferrer"><b>here</b></a></p>
      <p>More instructions <a target="_blank" href="https://help.sendowl.com/help/using-the-api#enabling-the-api" rel="noreferrer"><b>here</b></a></p>
      {rendeForm()}
    </Layout>
  );
};

export default Index;
