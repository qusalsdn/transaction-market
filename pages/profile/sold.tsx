import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import ProductList from "@components/product-list";
import { useRouter } from "next/router";

const Sold: NextPage = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  return (
    <Layout title="판매내역" canGoBack seoTitle="판매 내역">
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind="sales" otherProfileId={id} />
      </div>
    </Layout>
  );
};

export default Sold;
