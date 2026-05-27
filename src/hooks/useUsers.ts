import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../lib/api";
import type { CreateUserPayload, UpdateUserPayload } from "../types";

export const useUsers = (role?: string) =>
    useQuery({
        queryKey: ["users", role],
        queryFn: async () => {
            const res = await usersApi.getAll(role);
            return res.data.users;
        },
    });

export const useCreateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateUserPayload) => usersApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
    });
};

export const useUpdateUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
            usersApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
    });
};

export const useDeleteUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => usersApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
    });
};