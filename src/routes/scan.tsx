import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  Cpu,
  Cloud,
  Volume2,
  Square,
  ShieldCheck,
  Leaf,
  FlaskConical,
  RotateCcw,
  CloudOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { diseases, type Disease } from "@/lib/agri-data";
import { useAgri } from "@/lib/agri-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Leaf Scanner — AgriSense AI Crop Disease Detection" },
      {
        name: "description",
        content:
          "Scan a crop leaf and get an offline AI disease diagnosis with confidence score and organic or chemical treatment steps.",
      },
      { property: "og:title", content: "Leaf Scanner — AgriSense AI" },
      {
        property: "og:description",
        content: "Offline-first crop disease detection for smallholder farmers.",
      },
    ],
  }),
  component: ScanPage,
});

const stages = [
  "Loading TFLite model weights…",
  "Segmenting leaf from background…",
  "Analyzing leaf patterns via Edge AI…",
  "Matching against 38 disease classes…",
];

function ScanPage() {
  const { mode, setMode, online, addScan } = useAgri();
  const [phase, setPhase] = useState<"idle" | "analyzing" | "result">("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<Disease | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startAnalysis = useCallback(
    (imageSrc?: string) => {
      const picked =
        diseases[Math.floor(Math.random() * diseases.length)] ?? diseases[0]!;
      setResult(picked);
      setPreview(imageSrc ?? picked.image);
      setPhase("analyzing");
      setProgress(0);
      setStage(0);
    },
    [],
  );

  useEffect(() => {
    if (phase !== "analyzing") return;
    const tick = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 4 + Math.random() * 6);
        setStage(Math.min(stages.length - 1, Math.floor(next / 26)));
        return next;
      });
    }, 90);
    return () => window.clearInterval(tick);
  }, [phase]);

  useEffect(() => {
    if (phase === "analyzing" && progress >= 100 && result) {
      const t = window.setTimeout(() => {
        setPhase("result");
        addScan({
          id: `s-${Math.floor(Math.random() * 9000 + 1000)}`,
          diseaseId: result.id,
          diseaseName: result.name,
          crop: result.crop,
          confidence: result.confidence,
          image: result.image,
          when: "Just now",
          mode,
          synced: mode === "cloud" && online,
        });
      }, 350);
      return () => window.clearTimeout(t);
    }
  }, [phase, progress, result, addScan, mode, online]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    startAnalysis(file ? URL.createObjectURL(file) : undefined);
  };

  const speak = () => {
    if (!result) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeaking((s) => !s);
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `Detected ${result.name} in ${result.crop}, ${result.confidence} percent match. Organic treatment. ${result.organic
      .map((s, i) => `Step ${i + 1}. ${s.title}. ${s.detail}`)
      .join(" ")}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Leaf Scanner</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Hold one affected leaf flat inside the frame. Works fully offline.
        </p>
      </header>

      {/* Mode toggle */}
      <Card className="border-2">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="grid flex-1 grid-cols-2 gap-2 rounded-xl bg-muted p-1.5">
            <button
              type="button"
              onClick={() => setMode("offline")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold transition-colors",
                mode === "offline"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Cpu className="size-4" /> Offline · TFLite
            </button>
            <button
              type="button"
              onClick={() => online && setMode("cloud")}
              disabled={!online}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold transition-colors disabled:opacity-45",
                mode === "cloud" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {online ? <Cloud className="size-4" /> : <CloudOff className="size-4" />} Cloud ·
              Gemini
            </button>
          </div>
        </CardContent>
      </Card>
      {!online && (
        <p className="-mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="size-4 text-leaf" />
          No signal needed — Edge AI runs on this device. Switch the pill at the top to go online.
        </p>
      )}

      {/* Viewport */}
      <Card className="overflow-hidden border-2 p-0">
        <div className="scan-frame relative aspect-[4/3] w-full bg-soil/90">
          {preview ? (
            <img
              src={preview}
              alt="Captured crop leaf"
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 text-center text-primary-foreground">
              <Camera className="size-12 opacity-80" />
              <p className="max-w-xs px-6 text-sm font-semibold opacity-90">
                Camera preview — align a single leaf inside the corner guides
              </p>
            </div>
          )}
          {phase === "analyzing" && (
            <div className="absolute inset-0 bg-primary/45">
              <div className="scan-sweep h-10 w-full" />
              <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
                <p className="text-sm font-bold text-primary-foreground">{stages[stage]}</p>
                <Progress value={progress} className="h-2.5" />
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          size="lg"
          className="h-14 text-base font-bold"
          onClick={() => startAnalysis()}
          disabled={phase === "analyzing"}
        >
          <Camera className="size-5" /> Capture leaf
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-14 border-2 text-base font-bold"
          onClick={() => fileRef.current?.click()}
          disabled={phase === "analyzing"}
        >
          <Upload className="size-5" /> Upload photo
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
          aria-label="Upload a leaf photo"
        />
      </div>

      {phase === "result" && result && (
        <Card className="border-2 border-primary/25">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge className="mb-2 bg-soil text-soil-foreground">{result.crop}</Badge>
                <CardTitle className="text-2xl">{result.name}</CardTitle>
                <p className="mt-1 text-sm italic text-muted-foreground">{result.pathogen}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary tabular-nums">
                  {result.confidence}%
                </p>
                <p className="text-xs font-semibold text-muted-foreground">Match confidence</p>
              </div>
            </div>
            <Progress value={result.confidence} className="h-2.5" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "border-2 font-bold",
                  result.severity === "High"
                    ? "border-destructive text-destructive"
                    : "border-warning text-warning-foreground",
                )}
              >
                {result.severity} severity
              </Badge>
              <Badge variant="secondary" className="font-semibold">
                {mode === "offline" ? "Edge AI · on-device" : "Gemini Vision · cloud"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Visual symptoms detected
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.symptoms.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border-2 border-leaf/40 bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <Button
              onClick={speak}
              variant={speaking ? "secondary" : "default"}
              className="h-13 w-full py-4 text-base font-bold"
            >
              {speaking ? <Square className="size-5" /> : <Volume2 className="size-5" />}
              {speaking ? "Stop reading" : "Listen to treatment instructions"}
            </Button>

            <Tabs defaultValue="organic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="organic" className="font-bold">
                  <Leaf className="size-4" /> Organic
                </TabsTrigger>
                <TabsTrigger value="chemical" className="font-bold">
                  <FlaskConical className="size-4" /> Chemical
                </TabsTrigger>
              </TabsList>
              {(["organic", "chemical"] as const).map((key) => (
                <TabsContent key={key} value={key}>
                  <Accordion type="single" collapsible className="w-full">
                    {result[key].map((step, i) => (
                      <AccordionItem key={step.title} value={`${key}-${i}`}>
                        <AccordionTrigger className="text-left text-base font-semibold">
                          <span className="flex items-center gap-3">
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                              {i + 1}
                            </span>
                            {step.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-10 text-sm leading-relaxed">
                          {step.detail}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>

            <Button
              variant="outline"
              className="w-full border-2 font-bold"
              onClick={() => {
                setPhase("idle");
                setPreview(null);
                setResult(null);
              }}
            >
              <RotateCcw className="size-4" /> Scan another leaf
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
