import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Upload, AlertTriangle, Send, Shield, Flame, Car, CloudLightning, Siren } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const incidentTypes = [
  { id: "medical", label: "Medical", icon: Siren, color: "bg-emergency-medical/10 text-emergency-medical border-emergency-medical/30" },
  { id: "fire", label: "Fire", icon: Flame, color: "bg-emergency-fire/10 text-emergency-fire border-emergency-fire/30" },
  { id: "crime", label: "Crime", icon: Shield, color: "bg-emergency-police/10 text-emergency-police border-emergency-police/30" },
  { id: "accident", label: "Accident", icon: Car, color: "bg-emergency-accident/10 text-emergency-accident border-emergency-accident/30" },
  { id: "disaster", label: "Disaster", icon: CloudLightning, color: "bg-emergency-disaster/10 text-emergency-disaster border-emergency-disaster/30" },
];

const analyzeUrgency = (text: string): { level: "low" | "medium" | "high" | "critical"; keywords: string[] } => {
  const lower = text.toLowerCase();
  const criticalWords = ["dying", "death", "kill", "weapon", "gun", "stabbed", "bleeding heavily", "unconscious", "not breathing"];
  const highWords = ["help", "danger", "attack", "fire", "trapped", "injured", "bleeding", "collapse", "explosion"];
  const mediumWords = ["accident", "broken", "pain", "smoke", "flood", "stuck", "emergency"];

  const found: string[] = [];
  for (const w of criticalWords) if (lower.includes(w)) found.push(w);
  if (found.length > 0) return { level: "critical", keywords: found };

  for (const w of highWords) if (lower.includes(w)) found.push(w);
  if (found.length > 0) return { level: "high", keywords: found };

  for (const w of mediumWords) if (lower.includes(w)) found.push(w);
  if (found.length > 0) return { level: "medium", keywords: found };

  return { level: "low", keywords: [] };
};

const urgencyColors = {
  low: "bg-emergency-shelter/10 text-emergency-shelter border-emergency-shelter/30",
  medium: "bg-emergency-accident/10 text-emergency-accident border-emergency-accident/30",
  high: "bg-emergency-fire/10 text-emergency-fire border-emergency-fire/30",
  critical: "bg-primary/10 text-primary border-primary/30",
};

const EmergencyReport = () => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeUrgency> | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!description) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalysis(analyzeUrgency(description));
      setAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !description) {
      toast({ title: "Missing Fields", description: "Select type and add description", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Report Submitted!", description: "Emergency teams have been notified (demo)" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="section-container py-10 max-w-3xl mx-auto">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="text-3xl font-bold font-display flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-primary" />
          AI Emergency Report
        </h1>
        <p className="text-muted-foreground mb-8">Report an emergency with AI-powered urgency detection</p>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold font-display mb-2">Report Submitted</h2>
            <p className="text-muted-foreground mb-6">Emergency responders have been notified (demo mode)</p>
            {analysis && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${urgencyColors[analysis.level]}`}>
                <AlertTriangle className="w-4 h-4" />
                Urgency: {analysis.level.toUpperCase()}
              </div>
            )}
            <button onClick={() => navigate("/")} className="block mx-auto mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all">
              Return Home
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-3">Incident Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {incidentTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${type === t.id ? t.color + " ring-2 ring-ring" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <t.icon className="w-6 h-6" />
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-3">Description</h3>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setAnalysis(null); }}
                placeholder="Describe the emergency situation in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none"
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!description || analyzing}
                className="mt-3 flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all disabled:opacity-50"
              >
                <Brain className="w-4 h-4" />
                {analyzing ? "Analyzing..." : "Analyze Urgency (AI)"}
              </button>

              {analysis && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${urgencyColors[analysis.level]}`}>
                    <AlertTriangle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Urgency Level: {analysis.level.toUpperCase()}</p>
                      {analysis.keywords.length > 0 && (
                        <p className="text-xs mt-1 opacity-80">Detected keywords: {analysis.keywords.join(", ")}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-3">Photo Evidence (Optional)</h3>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-input rounded-xl cursor-pointer hover:border-muted-foreground/50 transition-all bg-background">
                {image ? (
                  <img src={image} alt="Uploaded" className="h-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload photo</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl text-lg font-semibold hover:brightness-110 transition-all"
            >
              <Send className="w-5 h-5" /> Submit Emergency Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmergencyReport;
