import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, RefreshCw, WifiOff, Wifi, Database, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAgri } from "@/lib/agri-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sync")({
  head: () => ({
    meta: [
      { title: "Sync Status — Offline Queue | AgriSense AI" },
      {
        name: "description",
        content:
          "See which leaf scans are stored on your device and push the pending queue to the cloud when a signal returns.",
      },
      { property: "og:title", content: "Sync Status — AgriSense AI" },
      {
        property: "og:description",
        content: "Offline queue and cloud sync status for your crop scans.",
      },
    ],
  }),
  component: SyncPage,
});

function SyncPage() {
  const { online, toggleOnline, scans, pending, syncAll, syncing } = useAgri();
  const total = scans.length;
  const syncedPct = total ? Math.round(((total - pending) / total) * 100) : 100;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sync Status</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Scans are saved on the device first, then uploaded when a signal is available.
        </p>
      </header>

      <Card
        className={cn("border-2", online ? "border-success bg-success/10" : "border-warning bg-warning/15")}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-xl",
                online ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground",
              )}
            >
              {online ? <Wifi className="size-5" /> : <WifiOff className="size-5" />}
            </span>
            <div className="flex-1">
              <p className="text-lg font-bold">{online ? "Connected" : "Offline mode"}</p>
              <p className="text-sm text-foreground/80">
                {online
                  ? "A network is available. You can push the queue now."
                  : "No network. Diagnoses still run on-device with Edge AI."}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span>{total - pending} of {total} scans uploaded</span>
              <span className="tabular-nums">{syncedPct}%</span>
            </div>
            <Progress value={syncedPct} className="h-2.5" />
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button
              className="h-13 py-3.5 font-bold"
              disabled={!online || pending === 0 || syncing}
              onClick={syncAll}
            >
              <RefreshCw className={cn("size-5", syncing && "animate-spin")} />
              {syncing ? "Uploading…" : pending === 0 ? "Everything synced" : `Sync ${pending} items`}
            </Button>
            <Button variant="outline" className="h-13 border-2 py-3.5 font-bold" onClick={toggleOnline}>
              {online ? "Simulate losing signal" : "Simulate finding signal"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-2">
          <CardContent className="flex items-center gap-3 p-4">
            <Cpu className="size-6 text-leaf" />
            <div>
              <p className="text-sm font-bold">Edge model</p>
              <p className="text-xs text-muted-foreground">TFLite v2.4 · 6.8 MB · 38 classes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex items-center gap-3 p-4">
            <Database className="size-6 text-soil" />
            <div>
              <p className="text-sm font-bold">Offline database</p>
              <p className="text-xs text-muted-foreground">Treatment guide cached · 2.1 MB</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scans.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border-2 border-border p-3">
              <img
                src={s.image}
                alt={`${s.diseaseName} scan`}
                loading="lazy"
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {s.diseaseName} <span className="font-medium text-muted-foreground">#{s.id}</span>
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {s.crop} · {s.when} · {s.mode === "offline" ? "Edge AI" : "Cloud"}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 border-2 text-xs font-bold",
                  s.synced ? "border-success text-success" : "border-warning text-foreground",
                )}
              >
                {s.synced ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                {s.synced ? "Synced" : "Pending"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
