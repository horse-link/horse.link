import { decrementPage, incrementPage } from "../../utils/bets";

type Props = {
  page: number;
  maxPages: number;
  setPage: (page: number) => void;
};

const BetTablePageSelector: React.FC<Props> = ({ page, maxPages, setPage }) => (
  <div className="w-full flex justify-end col-span-2 font-semibold mt-2 select-none">
    <div className="bg-white flex p-1 border-gray-300 border rounded-md">
      <div className="mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="black"
          className="w-5 h-5 mt-1 cursor-pointer"
          onClick={() => setPage(decrementPage(page, maxPages))}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </div>
      <span className="text-xl flex items-center">
        <span className="block mr-1">
          {page} / {maxPages}
        </span>
      </span>
      <div className="ml-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="black"
          className="w-5 h-5 mt-1 cursor-pointer"
          onClick={() => setPage(incrementPage(page, maxPages))}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default BetTablePageSelector;
