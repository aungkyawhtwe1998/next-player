"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchPlayers } from "@/features/players/playerSlice";
import Image from "next/image";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { players, loading, nextCursor } = useAppSelector(
    (state) => state.players
  );
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      dispatch(fetchPlayers(null));
      hasFetchedOnce.current = true;
    }
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (nextCursor !== null && !loading) {
      dispatch(fetchPlayers(nextCursor));
    }
  }, [dispatch, nextCursor, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleLoadMore]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-4xl font-bold">Players</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-start items-center gap-5 p-5 shadow-sm rounded-xl dark:bg-gray-800 overflow-hidden">
            <div className="rounded-full">
              <Image
                src={`/default-img.webp`}
                width={100}
                height={100}
                alt={`${player.first_name} ${player.last_name}`}
                className="object-contain max-w-[100px] bg-center w-full h-full aspect-[100/100]"
              />
            </div>

            <div className="">
              <h2 className="text-xl font-semibold ">
                {player.first_name} {player.last_name}
              </h2>
              <p className="text-sm text-nowrap text-amber-500">
                {player.position}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={observerRef}
        className="h-10"
      />
      {loading && <p className="text-center">Loading more players...</p>}
    </div>
  );
}
