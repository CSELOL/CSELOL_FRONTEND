import { Users, Search, MoreHorizontal, Shield, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  { id: 1, name: "TitanLGT", email: "titan@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "FakerSE", email: "faker@example.com", role: "User", status: "Active" },
  { id: 3, name: "Troll420", email: "troll@example.com", role: "User", status: "Suspended" },
  { id: 4, name: "Newbie01", email: "new@example.com", role: "User", status: "Active" },
  { id: 5, name: "ModGuy", email: "mod@example.com", role: "Moderator", status: "Active" },
];

export function UserManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-zinc-400">Manage platform users and permissions.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Users className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-lg border border-white/5">
        <Search className="h-5 w-5 text-zinc-500 ml-2" />
        <Input 
          placeholder="Search users..." 
          className="border-0 bg-transparent focus-visible:ring-0 text-white" 
        />
      </div>

      <div className="rounded-md border border-white/10 bg-zinc-900/40">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-zinc-400">User</TableHead>
              <TableHead className="text-zinc-400">Role</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage src={`/avatars/${user.id}.png`} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-400">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-zinc-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-white/10 text-zinc-300">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      user.status === "Active" 
                        ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/10" 
                        : "border-red-500/20 text-red-500 bg-red-500/10"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:text-red-300">
                        <Ban className="mr-2 h-4 w-4" /> Suspend User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
