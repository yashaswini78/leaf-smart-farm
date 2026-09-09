import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Droplets, Thermometer, CloudRain, MapPin, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { outbreaks, weather } from "@/lib/agri-data";
import { useAgri } from "@/lib/agri-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Field Dashboard — AgriSense AI Outbreak & Weather Risk" },
      {
        name: "description",
        content:
          "Track regional crop disease outbreaks, 48-hour fungal risk alerts and your recent leaf scans with offline sync status.",
      },
      { property: "og:title", content: "Field Dashboard — AgriSense AI" },
      {
        property: "og:description",
        content: "Regional outbreak heatmap, weather risk alerts and recent scan history.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { scans } = useAgri();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Field Dashboard</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <MapPin className="size-4" /> {weather.location}
        </p>
      </header>

      {/* Weather alert */}
      <Card className="border-2 border-warning bg-warning/15">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning text-warning-foreground">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <p className="text-base font-bold">{weather.risk}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">{weather.advice}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Thermometer, label: "Temp", value: `${weather.temperatureC}°C` },
              { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
              { icon: CloudRain, label: "Rain", value: `${weather.rainChance}%` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border-2 border-border bg-card px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Icon className="size-3.5" /> {label}
                </p>
                <p className="text-lg font-bold tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outbreak heatmap */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Regional outbreak reports</CardTitle>
          <p className="text-sm text-muted-foreground">
            Community-reported cases within 15 km, last 14 days.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-6 gap-1.5 rounded-xl border-2 border-border bg-muted p-2">
            {Array.from({ length: 24 }).map((_, i) => {
              const base = [88, 64, 41, 22, 10, 5][i % 6] ?? 10;
              const intensity = base - ((i * 7) % 18);
              const level = Math.max(4, intensity);
              return (
                <span
                  key={i}
                  aria-hidden
                  className="aspect-square rounded-md"
                  style={{
                    backgroundColor: `color-mix(in oklch, var(--color-destructive) ${level}%, var(--color-leaf))`,
                    opacity: 0.35 + level / 160,
                  }}
                />
              );
            })}
          </div>

          <ul className="space-y-3">
            {outbreaks.map((o) => (
              <li key={o.village}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-bold">
                    {o.village}{" "}
                    <span className="font-medium text-muted-foreground">· {o.distanceKm} km</span>
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-muted-foreground">
                    {o.reports} reports
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{o.disease}</p>
                <Progress value={o.intensity} className="mt-1.5 h-2" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recent scans */}
      <Card className="border-2">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent scans</CardTitle>
          <Button asChild variant="ghost" size="sm" className="font-bold">
            <Link to="/sync">Sync status</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {scans.slice(0, 5).map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-xl border-2 border-border p-3"
            >
              <img
                src={s.image}
                alt={`${s.diseaseName} on ${s.crop}`}
                loading="lazy"
                className="size-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{s.diseaseName}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {s.crop} · {s.when} · {s.confidence}% match
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1.5 gap-1 border-2 text-xs font-bold",
                    s.synced ? "border-success text-success" : "border-warning text-foreground",
                  )}
                >
                  {s.synced ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                  {s.synced ? "Synced" : "Pending sync"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
