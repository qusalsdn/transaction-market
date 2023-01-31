import { ProductWithCount } from "pages";
import useSWR from "swr";
import Item from "@components/item";

interface ProductListProps {
  kind: "sales" | "purchases" | "favs";
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {/* data.sales, data.pusrchases, data.favs 처럼 유동적으로 객체를 참조해야 할 때는 data[] 형식으로 참조하면 된다. */}
      {data[kind]?.map((record) => (
        <Item
          id={record?.product?.id}
          key={record?.id}
          title={record?.product?.name}
          price={record?.product?.price}
          comments={1}
          hearts={record?.product?._count?.favs}
          image={record.product.image}
        />
      ))}
    </>
  ) : null;
}
