import Coin from "../Coin";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Pagination } from "@mui/material";
import TableHead from "../TableHead";
import 'react-loading-skeleton/dist/skeleton.css'

import './CoinList.scss';

const CoinList = ({ coins, isLoading }) => {
  const [page, setPageNum] = useState(1);
  const coinsPerPage = 20;

  const getPageRange = () => {
    const startIndex = (page - 1) * coinsPerPage;
    const endIndex = startIndex + coinsPerPage;
    return [startIndex, endIndex];
  };

  const renderCoins = () => {
    return coins
      ?.slice(...getPageRange())
      ?.map((coin) => {
        return <Coin key={coin.id} coin={coin} />;
      });
  };

  const renderPagination = () => {
    const totalCoins = coins ? coins.length : coinsPerPage;
    const totalPages = Math.ceil(totalCoins / coinsPerPage);

    return (
      <Pagination
        className="w-fit"
        count={totalPages}
        variant="outlined"
        color="primary"
        size="small"
        onChange={(e, val) => {
          setPageNum(val);
        }}
      />
    );
  };

  return (
    <>
      <div className="coin-list">
        <table className="coin-list__table">
          <TableHead />
          {
            !isLoading && <tbody>{renderCoins()}</tbody>
          }
        </table>
        {isLoading && (
            <div className="coin-list__skeleton-wrapper">
              {Array.from({ length: coinsPerPage }, (_, index) => (
                <Skeleton key={index} className="coin-list__skeleton" />
              ))}
              </div>
          )}
      </div>
      <div className="pagination-wrapper">{renderPagination()}</div>
    </>
  );
};

export default CoinList;
