import { NextPage } from "next";
import { useRouter } from "next/router";

interface PaginationProps {
  page: number;
  countProduct: number | undefined;
}

const Pagination: NextPage<PaginationProps> = ({ page, countProduct }) => {
  const router = useRouter();
  const onClick = async (direction: string) => {
    if (direction === "left") {
      const countPage = page - 1;
      if (countPage <= 0) {
        window.alert("이전 페이지의 데이터는 없습니다.");
      } else {
        router.push(`${router.pathname}?page=${countPage}`);
      }
    }
    if (direction === "right") {
      if (countProduct && countProduct + 1 !== 11) {
        window.alert("이후 페이지의 데이터는 없습니다.");
      } else router.push(`${router.pathname}?page=${page + 1}`);
    }
  };

  return (
    <div>
      <button onClick={() => onClick("left")}>&larr;</button>
      <span>{page}</span>
      <button onClick={() => onClick("right")}>&rarr;</button>
    </div>
  );
};

export default Pagination;
