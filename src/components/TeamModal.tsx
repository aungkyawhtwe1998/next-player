"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeam, updateTeam } from "@/features/teams/teamSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { Team } from "@/features/teams/types";
import { motion } from "framer-motion";
import { useAlert } from "@/hooks/useAlert";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  editTeam?: Team | null;
}

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
  player_count: z
    .number({ invalid_type_error: "Player count must be a number" })
    .min(0, "Player count must be 0 or greater"),
});

type TeamForm = z.infer<typeof teamSchema>;

export default function TeamModal({ isOpen, onClose, editTeam }: Props) {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);
  const { showAlert } = useAlert();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamForm>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      region: "",
      country: "",
      player_count: 0,
    },
  });

  useEffect(() => {
    if (editTeam) {
      reset({
        name: editTeam.name,
        region: editTeam.region,
        country: editTeam.country,
        player_count: editTeam.player_count,
      });
    } else {
      reset({
        name: "",
        region: "",
        country: "",
        player_count: 0,
      });
    }
  }, [editTeam, reset]);

  const onSubmit = (data: TeamForm) => {
    const team: Team = {
      ...data,
      id: editTeam ? editTeam.id : uuidv4(),
    };

    const isDuplicate =
      !editTeam &&
      teams.some((t) => t.name.toLowerCase() === data.name.toLowerCase());

    if (isDuplicate) {
      showAlert({
        title: "Duplicate team",
        description: `The name "${data.name}" has been already used. Pleae give another name.`,
        confirmText: "Ok",
      });
      return;
    }

    if (editTeam) {
      dispatch(updateTeam(team));
    } else {
      dispatch(createTeam({ players: [], ...team }));
    }
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white min-w-[30vw] dark:bg-gray-600 p-6 rounded w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">
            {editTeam ? "Edit Team" : "Create Team"}
          </h2>

          <div>
            <input
              className="border w-full p-2 rounded"
              placeholder="Team Name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              className="border w-full p-2 rounded"
              type="number"
              placeholder="Player Count"
              min={0}
              {...register("player_count", { valueAsNumber: true })}
            />
            {errors.player_count && (
              <p className="text-red-500 text-sm">
                {errors.player_count.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="border w-full p-2 rounded"
              placeholder="Region"
              {...register("region")}
            />
            {errors.region && (
              <p className="text-red-500 text-sm">{errors.region.message}</p>
            )}
          </div>

          <div>
            <input
              className="border w-full p-2 rounded"
              placeholder="Country"
              {...register("country")}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="bg-gray-300 dark:bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-300 dark:bg-blue-800  px-4 py-2 rounded">
              {editTeam ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
