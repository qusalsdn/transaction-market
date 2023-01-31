import { NextPage } from "next";

const Pagination: NextPage = () => {
  return (
    <div>
      <button>&larr;</button>
      <span>1 2 3 4 5</span>
      <button>&rarr;</button>
    </div>
  );
};

export default Pagination;
