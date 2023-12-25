import { useCallback, useEffect, useState } from "react";

/**
 * @description Custom hook for fetching infinite data
 * @param limits Number of data to be fetched each page
 * @param callback Data fetching function that takes a page parameter and returns data
 * @param initData T first page of data
 * @returns {data: T[], fetchNextPage: () => void, isFetching: boolean, isEnded: boolean}
 */
export default function useInfinityQuery<T>(
  limits: number,
  callback: (pageParam: number) => Promise<T[]>,
  initData: T[],
) {
  const [data, setData] = useState<T[]>(initData);
  const [page, setPage] = useState<number>(2);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  const fetchNextPage = useCallback(async () => {
    if (isFetching || isEnded) return;

    setIsFetching(true);

    try {
      const newData = await callback(page);
      if (newData.length > 0) {
        setData((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      }
      if (newData.length < limits) {
        setIsEnded(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetching(false);
    }
  }, [callback, isFetching, isEnded, limits, page]);

  return { data, setData, fetchNextPage, isFetching, isEnded };
}
