import { NextPage } from "next";
import Layout from "../../components/layout";

const EditProfile: NextPage = () => {
  return (
    <Layout canGoBack>
      <div className="space-y-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-slate-400" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-bold
         text-gray-700 transition-colors hover:border-orange-400 focus:ring-2 focus:ring-orange-400
          focus:ring-offset-2"
          >
            Change
            <input id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-bold text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2
                 placeholder-gray-400 transition-colors focus:border-orange-400 focus:shadow-md
                  focus:outline-none focus:ring-orange-400"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-bold text-gray-700">
            Phone Number
          </label>
          <div className="flex rounded-md shadow-md">
            <span
              className="flex select-none items-center justify-center rounded-l-md border border-r-0
                 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              +82
            </span>
            <input
              id="input"
              type="number"
              className="w-full appearance-none rounded-md rounded-l-none border border-gray-300 px-3
             py-2 placeholder-gray-400 transition-colors focus:border-orange-400 focus:shadow-md
              focus:outline-none focus:ring-orange-400"
              required
            />
          </div>
        </div>

        <button
          className="focus mt-6 w-full rounded-md border border-transparent bg-orange-400 py-2 px-4
         font-bold text-white shadow-md transition-colors hover:bg-orange-500 focus:outline-none
             focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          Update profile
        </button>
      </div>
    </Layout>
  );
};

export default EditProfile;
