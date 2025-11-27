import { Save, Server, Shield, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SystemSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <p className="text-zinc-400">Configure platform-wide settings.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="bg-zinc-900/40 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-white">General Information</CardTitle>
            </div>
            <CardDescription>Platform name and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="platform-name" className="text-white">Platform Name</Label>
              <Input id="platform-name" defaultValue="CSELOL League" className="bg-zinc-950/50 border-white/10 text-white" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-email" className="text-white">Support Email</Label>
              <Input id="support-email" defaultValue="support@cselol.com" className="bg-zinc-950/50 border-white/10 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card className="bg-zinc-900/40 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-white">Feature Flags</CardTitle>
            </div>
            <CardDescription>Toggle platform features on or off.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Tournament Registration</Label>
                <p className="text-sm text-zinc-500">Allow new teams to register for tournaments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Match Reporting</Label>
                <p className="text-sm text-zinc-500">Enable users to report their own match results</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Maintenance Mode</Label>
                <p className="text-sm text-zinc-500">Disable all public access to the platform</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-zinc-900/40 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <CardTitle className="text-white">Security</CardTitle>
            </div>
            <CardDescription>Security and access control settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Two-Factor Authentication</Label>
                <p className="text-sm text-zinc-500">Enforce 2FA for all admin accounts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
