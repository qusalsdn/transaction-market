import type { NextPage } from "next";

const Upload: NextPage = () => {
  return (
    <div className="px-4 py-10">
      <div>
        {/* input 태그를 label 태그 안에 넣으면 input을 숨길 수 있다. */}
        <label
          className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2
           border-dashed border-gray-300 py-6 text-gray-800 transition-colors
            hover:border-orange-400 hover:text-orange-400"
        >
          <svg className="h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <input type="file" className="hidden" />
        </label>
      </div>

      <div className="my-5">
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
          <div className="pointer-events-none absolute right-0 flex items-center pr-3">
            <span className="text-gray-500">USD</span>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-gray-800">Description</label>

        <textarea
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
        Upload product
      </button>
    </div>
  );
};

export default Upload;
