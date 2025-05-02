"use client";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { deleteTeam } from "@/features/teams/teamSlice";
import TeamModal from "@/components/TeamModal";
import PlayerModal from "@/components/PlayerModal"; // Import the PlayerModal component
import { FiEdit3, FiPlus, FiTrash, FiUserPlus } from "react-icons/fi";
import { fetchPlayers } from "@/features/players/playerSlice";
import { useAlert } from "@/hooks/useAlert";
import { Team } from "@/features/teams/types";

export default function TeamsPage() {
  const teams = useAppSelector((state) => state.teams.teams);
  const dispatch = useAppDispatch();

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { players, loading, nextCursor } = useAppSelector(
    (state) => state.players
  );
  const { showAlert } = useAlert();

  const [mounted, setMounted] = useState(false);

  const handleLoadMore = useCallback(() => {
    if (nextCursor !== null && !loading) {
      dispatch(fetchPlayers(nextCursor));
    }
  }, [dispatch, nextCursor, loading]);

  const handleDeleteTeam = (id: string) => {
    showAlert({
      title: "Delete Confirmation",
      description: "Are you sure to delete",
      cancelText:"No",
      confirmText: "Yes",
      onConfirm: () => handleConfirm(id),
    });
  };

  const handleConfirm = (id: string) => {
    dispatch(deleteTeam(id));
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="p-6 space-y-4 w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Teams</h1>
        <button
          onClick={() => {
            setSelectedTeam(null);
            setIsTeamModalOpen(true);
          }}
          className="border-2 border-green-600/80 hover:bg-green-600 hover:text-white transition-all ease-in-out duration-300 flex items-center gap-2 px-4 py-2 rounded">
          <FiPlus size={20} /> Create New
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams && teams.length>0 ? teams?.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-2 border border-gray-500 hover:shadow-md transition">
            <h2 className="text-lg font-semibold">{team.name}</h2>
            <p className="text-sm ">
              <span className="font-medium">Players:</span>{" "}
              {team.players?.length} / {team.player_count}
            </p>
            <p className="text-sm ">
              <span className="font-medium">Region:</span> {team.region}
            </p>
            <p className="text-sm ">
              <span className="font-medium">Country:</span> {team.country}
            </p>

            <div className="flex gap-3 pt-2">
              <button
                className="text-blue-600 hover:text-blue-400"
                onClick={() => {
                  setSelectedTeam(team);
                  setIsPlayerModalOpen(true);
                }}>
                <FiUserPlus size={18} />
              </button>
              <button
                className=" hover:text-gray-400"
                onClick={() => {
                  setSelectedTeam(team);
                  setIsTeamModalOpen(true);
                }}>
                <FiEdit3 size={18} />
              </button>
              <button
                className="text-red-600 hover:text-red-400"
                onClick={() => handleDeleteTeam(team.id)}>
                <FiTrash size={18} />
              </button>
            </div>
          </div>
        )): <p>No Team found!</p>}
      </div>
      {/* Team Modal */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        editTeam={selectedTeam}
      />

      {/* Player Modal */}
      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        teamId={selectedTeam?.id}
        players={players}
        isLoading={loading}
        loadMore={handleLoadMore}
      />
    </div>
  );
}
