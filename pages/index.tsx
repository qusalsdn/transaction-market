import type { GetServerSideProps, NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import Loading from "@components/loading";
import client from "@libs/server/client";
import Pagination from "@components/pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductsRespons {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data } = useSWR<ProductsRespons>(`/api/products?page=${page}`);

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, [page, router]);

  return (
    <Layout title="홈" hasTabBar seoTitle="홈">
      <div className="flex flex-col space-y-5 divide-y">
        {data ? (
          data?.products?.map((product) => (
            <Item
              id={product.id}
              key={product.id}
              image={product.image ? product.image : ""}
              title={product.name}
              price={product.price}
              comments={1}
              hearts={product._count?.favs || 0}
            />
          ))
        ) : (
          <Loading />
        )}

        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
        <Pagination page={page} countProduct={data?.products?.length} />
      </div>
    </Layout>
  );
};

// SWR과 같이 사용하는 방법
const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  // fallback은 캐시의 초기값을 설정해준다.
  return (
    <SWRConfig value={{ fallback: { "/api/products": { ok: true, products } } }}>
      <Home />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await client?.product.findMany();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

export default Page;
