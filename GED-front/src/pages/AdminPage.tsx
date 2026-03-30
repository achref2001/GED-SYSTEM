import { useState } from 'react';
import { mockData } from '@/data/mockData';
import { formatFileSize, formatDate, formatDateTime } from '@/lib/helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Users, FileText, Download, Shield, Search, User,
  Mail, HardDrive, MoreVertical, Pencil, Trash2,
} from 'lucide-react';
import type { UserRole } from '@/types';

const roleBadgeColors: Record<UserRole, string> = {
  admin: 'bg-destructive/10 text-destructive',
  manager: 'bg-primary/10 text-primary',
  user: 'bg-success/10 text-success',
  viewer: 'bg-muted text-muted-foreground',
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrateur',
  manager: 'Gestionnaire',
  user: 'Utilisateur',
  viewer: 'Lecteur',
};

export default function AdminPage() {
  const [searchUsers, setSearchUsers] = useState('');
  const [searchAudit, setSearchAudit] = useState('');

  const filteredUsers = (mockData.users || []).filter((u) =>
    u.fullName.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredAudit = (mockData.auditLog || []).filter((e) =>
    e.entityName?.toLowerCase().includes(searchAudit.toLowerCase()) ||
    e.userName?.toLowerCase().includes(searchAudit.toLowerCase()) ||
    e.action?.toLowerCase().includes(searchAudit.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Administration
        </h1>
        <p className="text-muted-foreground mt-1">Gérez les utilisateurs et consultez les journaux</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" /> Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="w-4 h-4" /> Journal d'audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Users className="w-4 h-4" /> Ajouter un utilisateur
            </Button>
          </div>

          <div className="bg-card rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Utilisateur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Rôle</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Stockage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Inscrit le</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="secondary" className={`text-xs ${roleBadgeColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{formatFileSize(user.storageUsed)}</span>
                          <span>{formatFileSize(user.storageLimit)}</span>
                        </div>
                        <Progress value={(user.storageUsed / user.storageLimit) * 100} className="h-1.5" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                placeholder="Rechercher dans le journal..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Exporter CSV
            </Button>
          </div>

          <div className="bg-card rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Document</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Utilisateur</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAudit.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">{entry.action}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{entry.entityName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{entry.userName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{formatDateTime(entry.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
