import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const CONFIG = {
  headers: {
    Accept: "application/json",
  },
};

const DATA = {
  product: {
    limit_to_single_qty_in_cart: true,
  },
};

const updateProduct = async (
  sendOwlKey: string | string[],
  sendOwlSecret: string | string[],
  productId: string
) => {
  try {
    const rs = await axios.put(
      `https://${sendOwlKey}:${sendOwlSecret}@www.sendowl.com/api/v1/products/${productId}`,
      DATA,
      CONFIG
    );
    return rs.status;
  } catch (error) {
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { sendOwlKey, sendOwlSecret } = req.query;
      const rs = await axios.get(
        `https://${sendOwlKey}:${sendOwlSecret}@www.sendowl.com/api/v1/products`,
        CONFIG
      );
      const products = rs.data;

      for (const item of products) {
        await updateProduct(sendOwlKey, sendOwlSecret, item.product.id);
      }
      return res.status(200).json({
        success: true,
        data: "Success",
      });
    } catch (error) {}
  }

  try {
    const { sendOwlKey, sendOwlSecret } = req.query;
    const rs = await axios.get(
      `https://${sendOwlKey}:${sendOwlSecret}@www.sendowl.com/api/v1/products`,
      CONFIG
    );

    const columns = [
      {
        dataIndex: "id",
        key: "id",
        title: "ID",
        // label is used for react-csv
        label: "ID",
      },
      {
        dataIndex: "name",
        key: "name",
        title: "Name",
        label: "Name",
      },
      {
        dataIndex: "price",
        key: "price",
        title: "Price",
        label: "Price",
      },
      {
        dataIndex: "currency_code",
        key: "currency_code",
        title: "Currency",
        label: "Currency",
      },
      {
        dataIndex: "limit_to_single_qty_in_cart",
        key: "limit_to_single_qty_in_cart",
        title: "Limit to single qty in cart",
        label: "Limit to single qty in cart",
      },
      {
        dataIndex: "instant_buy_url",
        key: "instant_buy_url",
        title: "Instant buy URL",
        label: "Instant buy URL",
      },
      {
        dataIndex: "add_to_cart_url",
        key: "add_to_cart_url",
        title: "Add to cart URL",
        label: "Add to cart URL",
      },
      {
        dataIndex: "sales_page_url",
        key: "sales_page_url",
        title: "Sales page URL",
        label: "Sales page URL",
      },
    ];

    const rows = rs.data.map((item) => ({
      ...item.product,
      limit_to_single_qty_in_cart: item.product.limit_to_single_qty_in_cart
        ? "Yes"
        : "No",
    }));

    return res.status(200).json({
      success: true,
      data: {
        columns,
        rows,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
