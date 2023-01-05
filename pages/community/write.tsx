import { NextPage } from "next";

const Write: NextPage = () => {
  return (
    <form className="px-4 py-10">
      <textarea
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm transition-colors
           focus:border-orange-400 focus:ring-orange-400"
        rows={4}
        placeholder="Ask a question!"
      />
      <button
        className="mt-2 w-full rounded-md border border-transparent bg-orange-400 py-2 px-4
         text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-500
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};

export default Write;
