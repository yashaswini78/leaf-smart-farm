import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, Leaf, FlaskConical, HardDriveDownload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { crops, diseases } from "@/lib/agri-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Treatment Guide — Offline Crop Disease Remedies | AgriSense AI" },
      {
        name: "description",
        content:
          "Searchable offline knowledge base of tomato, maize, rice and wheat diseases with organic and chemical treatment steps and prevention tips.",
      },
      { property: "og:title", content: "Treatment Guide — AgriSense AI" },
      {
        property: "og:description",
        content: "Offline crop disease remedies and prevention steps for smallholder farmers.",
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return diseases.filter((d) => {
      const matchCrop = crop === "All" || d.crop === crop;
      const matchQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.pathogen.toLowerCase().includes(q) ||
        d.symptoms.some((s) => s.toLowerCase().includes(q));
      return matchCrop && matchQuery;
    });
  }, [query, crop]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Treatment Guide</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <HardDriveDownload className="size-4 text-leaf" /> Full database stored on this phone —
          no data needed.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search disease or symptom…"
          aria-label="Search diseases"
          className="h-13 border-2 py-3.5 pl-11 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...crops].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCrop(c)}
            className={cn(
              "rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors",
              crop === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-sm font-semibold text-muted-foreground">
          No matching disease in the offline database.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((d) => (
          <Card key={d.id} className="overflow-hidden border-2 p-0">
            <img
              src={d.image}
              alt={`${d.name} symptoms on ${d.crop} leaf`}
              loading="lazy"
              width={768}
              height={576}
              className="h-40 w-full object-cover"
            />
            <CardHeader className="pt-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-soil text-soil-foreground">{d.crop}</Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-2 font-bold",
                    d.severity === "High"
                      ? "border-destructive text-destructive"
                      : "border-warning text-foreground",
                  )}
                >
                  {d.severity}
                </Badge>
              </div>
              <CardTitle className="text-xl">{d.name}</CardTitle>
              <p className="text-sm italic text-muted-foreground">{d.pathogen}</p>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="flex flex-wrap gap-1.5">
                {d.symptoms.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-leaf/40 bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <Accordion type="single" collapsible className="mt-3">
                <AccordionItem value="organic">
                  <AccordionTrigger className="font-bold">
                    <span className="flex items-center gap-2">
                      <Leaf className="size-4 text-leaf" /> Organic treatment
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="space-y-2.5">
                      {d.organic.map((s, i) => (
                        <li key={s.title} className="flex gap-3">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf text-xs font-bold text-leaf-foreground">
                            {i + 1}
                          </span>
                          <span className="text-sm">
                            <strong className="font-bold">{s.title}.</strong> {s.detail}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="chemical">
                  <AccordionTrigger className="font-bold">
                    <span className="flex items-center gap-2">
                      <FlaskConical className="size-4 text-soil" /> Chemical treatment
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="space-y-2.5">
                      {d.chemical.map((s, i) => (
                        <li key={s.title} className="flex gap-3">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-soil text-xs font-bold text-soil-foreground">
                            {i + 1}
                          </span>
                          <span className="text-sm">
                            <strong className="font-bold">{s.title}.</strong> {s.detail}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="prevention" className="border-b-0">
                  <AccordionTrigger className="font-bold">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-primary" /> Prevention
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm">
                      {d.prevention.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
