import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreateUser, useUpdateUser } from "../../hooks/useUsers";
import type { UserRecord } from "@/types";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["TEACHER", "STUDENT"]),
  password: z.string().optional(),
});

const createSchema = baseSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const editSchema = baseSchema.extend({
  password: z.union([z.string().min(6), z.literal("")]).optional(),
});

type FormValues = z.infer<typeof baseSchema> & { password?: string };

interface Props {
  open: boolean;
  onClose: () => void;
  editingUser?: UserRecord | null;
}

export default function UserFormModal({ open, onClose, editingUser }: Props) {
  const isEdit = !!editingUser;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: { name: "", email: "", role: "STUDENT", password: "" },
  });

  useEffect(() => {
    if (editingUser) {
      reset({ name: editingUser.name, email: editingUser.email, role: editingUser.role, password: "" });
    } else {
      reset({ name: "", email: "", role: "STUDENT", password: "" });
    }
  }, [editingUser, open]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && editingUser) {
        const payload: any = { name: values.name, email: values.email, role: values.role };
        if (values.password) payload.password = values.password;
        await updateUser.mutateAsync({ id: editingUser.id, data: payload });
      } else {
        await createUser.mutateAsync({
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password!,
        });
      }
      onClose();
    } catch (err: any) {
      // error handled via mutation state
    }
  };

  const error = createUser.error || updateUser.error;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select
              value={watch("role")}
              onValueChange={(val) => setValue("role", val as "TEACHER" | "STUDENT")}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">
              {isEdit ? "New Password (leave blank to keep current)" : "Password"}
            </Label>
            <Input id="password" type="password" placeholder="••••••" {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {(error as any)?.response?.data?.message || "Something went wrong"}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}