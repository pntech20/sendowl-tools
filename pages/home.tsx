import type { NextPage } from "next";
import useSWR from "swr";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Table from "rc-table";
import { CSVLink } from "react-csv";
import { PacmanLoader, BarLoader } from "react-spinners";
import axios from "axios";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const { query } = useRouter();
  const { sendOwlKey, sendOwlSecret } = query;
  const [isLoading, setIsLoading] = useState(false)

  const updateAllProducts = async () => {
    try {
      setIsLoading(true)
      await axios.put(
        `/api/products/?sendOwlKey=${sendOwlKey}&sendOwlSecret=${sendOwlSecret}`,
      );
      setIsLoading(false)
      window.alert("Success! Please reload the page.")
    } catch (error) {
      setIsLoading(false)
      window.alert(error || "Please try again!")
      throw error;
    }
  };

  const { data } = useSWR(
    () => sendOwlKey && sendOwlSecret &&
      `/api/products/?sendOwlKey=${sendOwlKey}&sendOwlSecret=${sendOwlSecret}`,
    fetcher
  );

  if (!data)
    return (
      <div className="center">
        <PacmanLoader color="#36D7B7" />
      </div>
    );

  if (!data?.success)
    return (
      <div className="center">
        <span>{data?.message}</span>
      </div>
    );

  return (
    <Layout>
      <br />
      {
        isLoading ? <BarLoader color="#36d7b7" /> : <button disabled={isLoading} onClick={() => {
          updateAllProducts()
        }}>Limit to single qty in cart for all products</button>
      }

      <CSVLink
        data={data.data.rows}
        headers={data.data.columns}
        filename={'SendOwl-products.csv'}
      >
        <button>Export to CSV</button>
      </CSVLink>

      <Table
        style={{ width: 1200 }}
        scroll={{ x: 1500, y: 500 }}
        columns={data.data.columns}
        data={data.data.rows}
      />
    </Layout>
  );
};

export default Home;
