import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "../../hooks/useUsers";
import type { UserRecord } from "../../types";

interface Props {
  user: UserRecord | null;
  onClose: () => void;
}

export default function DeleteUserDialog({ user, onClose }: Props) {
  const deleteUser = useDeleteUser();
  const error = deleteUser.error as any;

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser.mutateAsync(user.id);
      onClose();
    } catch {
      // keep dialog open; error is rendered below
    }
  };

  return (
    <AlertDialog open={!!user} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {user?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the {user?.role.toLowerCase()} account for{" "}
            <strong>{user?.email}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="text-sm text-destructive">
            {error?.response?.data?.message || "Failed to delete user."}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}