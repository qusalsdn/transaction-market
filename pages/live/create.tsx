import { NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/layout";

const Create: NextPage = () => {
  return (
    <Layout canGoBack>
      <div className="space-y-5 px-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-gray-800">
            Name
          </label>
          <div className="relative flex items-center rounded-md shadow-md">
            <input
              id="name"
              className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 
             placeholder-gray-400 transition-colors focus:border-orange-400 focus:shadow-md
              focus:outline-none focus:ring-orange-400"
              type="text"
            />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-gray-800">
            Price
          </label>
          <div className="relative flex items-center rounded-md shadow-md">
            <div
              className="pointer-events-none absolute left-0 flex items-center
           justify-center pl-3"
            >
              <span className="text-gray-500">$</span>
            </div>
            <input
              id="price"
              className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pl-7
             placeholder-gray-400 transition-colors focus:border-orange-400 focus:shadow-md
              focus:outline-none focus:ring-orange-400"
              type="text"
              placeholder="0.00"
            />
            <div className="pointer-events-none absolute right-0 ml-5 flex items-center pr-3">
              <span className="text-gray-500">USD</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-gray-800">
            Description
          </label>

          <textarea
            id="description"
            className="mt-1 w-full rounded-md border-gray-400 shadow-md
           transition-colors focus:border-orange-400 focus:ring-orange-300"
            rows={5}
          />
        </div>

        <button
          className="focus mt-5 w-full rounded-md border border-transparent bg-orange-400 py-2 px-4
         font-bold text-white shadow-md transition-colors hover:bg-orange-500 focus:outline-none
          focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          Go live
        </button>
      </div>
    </Layout>
  );
};

export default Create;
