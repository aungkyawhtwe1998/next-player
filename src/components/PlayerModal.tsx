import { motion } from "framer-motion";
import { FiPlusCircle, FiX, FiXCircle } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Player } from "@/features/players/types";
import { useAlert } from "@/hooks/useAlert";
import { useEffect, useRef, useState } from "react";
import { fetchPlayers } from "@/features/players/playerSlice";
import {
  addPlayerToTeam,
  removePlayerFromTeam,
} from "@/features/teams/teamSlice";

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
  players: Player[];
  isLoading: boolean;
  loadMore: () => void;
}

export default function PlayerModal({
  isOpen,
  onClose,
  teamId,
  players,
  isLoading,
  loadMore,
}: PlayerModalProps) {
  return (
    <ModalContent
      isOpen={isOpen}
      onClose={onClose}
      teamId={teamId}
      players={players}
      isLoading={isLoading}
      loadMore={loadMore}
    />
  );
}

function ModalContent({
  isOpen,
  onClose,
  teamId,
  players,
  isLoading,
  loadMore,
}: PlayerModalProps) {
  const dispatch = useAppDispatch();
  const { teams } = useAppSelector((state) => state.teams);
  const team = teams.find((team) => team.id === teamId);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedOnce = useRef(false);
  const [activeTab, setActiveTab] = useState<"all" | "members">("members");
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      dispatch(fetchPlayers(null));
      hasFetchedOnce.current = true;
    }
  }, [dispatch]);

  const handleAddPlayer = (player: Player) => {
    if (!team) return;

    const current_count = team.players?.length ?? 0;

    // Check if this player is in *any* team already
    const isAlreadyInOtherTeam = teams.some(
      (t) => t.id !== team.id && t.players?.some((p) => p.id === player.id)
    );

    if (isAlreadyInOtherTeam) {
      showAlert({
        title: "Player already assigned",
        description: `${player.first_name} ${player.last_name} is already in another team.`,
        confirmText: "Ok",
      });
      return;
    }

    if (current_count >= team.player_count!) {
      showAlert({
        title: "Sorry",
        description: "Member limit is already full!",
        confirmText: "Ok",
      });
      return;
    }

    dispatch(addPlayerToTeam({ teamId: team.id, player }));
  };

  const handleRemovePlayer = (playerId: string) => {
    if (teamId) {
      dispatch(removePlayerFromTeam({ teamId, playerId }));
    }
  };

  useEffect(() => {
    const currentRef = observerRef.current;
    if (!currentRef || activeTab !== "all") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root: document.querySelector(".player-scroll-container"),
        threshold: 1.0,
      }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [loadMore, activeTab]);

  if (!isOpen || !team) return null;

  const displayedPlayers = activeTab === "all" ? players : team.players ?? [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-600 p-6 rounded w-full max-w-md space-y-4">
        <div className="flex justify-between gap-5 items-center">
          <h2 className="text-xl font-bold">{team.name} - Manage Players</h2>
          <button
            onClick={onClose}
            className="text-gray-800 hover:scale-105 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-b-gray-400 mb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-300 dark:text-blue-300"
                : "text-gray-500 dark:text-gray-300 hover:dark:text-blue-300 hover:text-blue-600"
            }`}>
            All Players
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "members"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-300 dark:text-blue-300"
                : "text-gray-500 dark:text-gray-300 hover:dark:text-blue-300 hover:text-blue-600"
            }`}>
            Team Members
          </button>
        </div>

        {/* Player list */}
        <div className="space-y-2 min-h-[50vh] max-h-[50vh] overflow-y-scroll player-scroll-container">
          {displayedPlayers.length > 0 ? (
            displayedPlayers.map((player) => {
              const isInTeam = team.players?.some((p) => p.id === player.id);

              return (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-2 border rounded shadow-sm">
                  <div>
                    <p className="text-sm font-semibold">
                      {player.first_name} {player.last_name}
                    </p>
                    <p className="text-xs">{player.position}</p>
                  </div>

                  {activeTab === "all" && !isInTeam ? (
                    <button
                      className="text-green-500 hover:scale-105 hover:text-green-700 px-2"
                      onClick={() => handleAddPlayer(player)}>
                      <FiPlusCircle size={20} />
                    </button>
                  ) : activeTab === "all" && isInTeam ? (
                    <button
                      className="text-red-500 hover:scale-105 hover:text-red-700 px-2"
                      onClick={() => handleRemovePlayer(player.id)}>
                      <FiXCircle size={20} />
                    </button>
                  ) : (
                    <button
                      className="text-red-500 hover:scale-105 hover:text-red-700 px-2"
                      onClick={() => handleRemovePlayer(player.id)}>
                      <FiXCircle size={20} />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No players found.
            </p>
          )}

          {activeTab === "all" && (
            <>
              <div
                ref={observerRef}
                className="h-1"
              />
              {isLoading && (
                <p className="text-center text-sm text-gray-400">
                  Loading more players...
                </p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
