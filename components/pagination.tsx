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
      if (countProduct && countProduct + 1 !== 21) {
        window.alert("이후 페이지의 데이터는 없습니다.");
      } else if (countProduct === 0) {
        router.push(`${router.pathname}?page=${page - 1}`);
      } else router.push(`${router.pathname}?page=${page + 1}`);
    }
  };

  const onClickHome = () => {
    router.push(`${router.pathname}?page=1`);
  };

  return (
    <div className="fixed bottom-24 w-full max-w-xl border-none text-lg font-bold">
      {page === 1 && countProduct === 0 ? null : (
        <div className="flex flex-col items-center justify-center">
          {page !== 1 && (
            <div>
              <button onClick={onClickHome}>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </button>
            </div>
          )}
          <div>
            <button onClick={() => onClick("left")}>&larr;</button>
            <span>{page}</span>
            <button onClick={() => onClick("right")}>&rarr;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
