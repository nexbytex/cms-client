import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import type { UserRecord } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import UserFormModal from "../../components/users/UserFormModal";
import DeleteUserDialog from "../../components/users/DeleteUserDialog";

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);

  const { data: users = [], isLoading, isError } = useUsers(
    roleFilter === "ALL" ? undefined : roleFilter
  );

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditingUser(null); setModalOpen(true); };
  const openEdit = (user: UserRecord) => { setEditingUser(user); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingUser(null); };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teachers and students</p>
        </div>
        <Button onClick={openCreate}>+ Add User</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="TEACHER">Teachers</SelectItem>
            <SelectItem value="STUDENT">Students</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading users...</p>
      ) : isError ? (
        <p className="text-destructive text-sm">Failed to load users.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "TEACHER" ? "default" : "secondary"}>
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(user)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeletingUser(user)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <UserFormModal open={modalOpen} onClose={closeModal} editingUser={editingUser} />
      <DeleteUserDialog user={deletingUser} onClose={() => setDeletingUser(null)} />
    </div>
  );
}