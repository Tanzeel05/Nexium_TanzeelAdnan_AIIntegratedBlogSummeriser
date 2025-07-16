"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { translateToUrduApi } from "../../utils/translate";
import { generateSummary } from "../../utils/summarize";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarise = async () => {
    setError("");
    setLoading(true);
    setSummary("");
    setTranslated("");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const { text } = await res.json();
      const staticSummary = generateSummary(text);
      const urdu = await translateToUrduApi(staticSummary);

      setSummary(staticSummary);
      setTranslated(urdu);

      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullText: text, summary: urdu })
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black p-10 font-sans text-white">
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <motion.h1
          className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🚀 AI Blog Summariser
        </motion.h1>

        <p className="text-gray-300 text-lg">
          Generate English Summary & Urdu Translation with AI-Powered Analysis
        </p>

        <Input
          placeholder="Paste Blog URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-purple-500 rounded-lg px-4 py-2 bg-black text-white focus:ring-2 focus:ring-blue-500"
        />

        {/* Centered Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSummarise}
            disabled={loading || !url}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:scale-105 hover:shadow-lg transition-transform rounded-lg px-4 py-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Summarise Now"}
          </Button>
        </div>

        {/* Engaging Loading Text */}
        <AnimatePresence>
          {loading && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="text-purple-400 font-semibold text-lg"
            >
              ✨ Summarising your blog... Please wait! ✨
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 font-semibold"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mt-6"
            >
              <Card className="bg-white/10 backdrop-blur-lg border border-purple-500 rounded-2xl shadow-xl text-left text-white hover:scale-[1.02] transition-transform">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-bold text-2xl text-blue-400">📋 Summary</h2>
                  <p className="text-gray-100 leading-relaxed">{summary}</p>

                  <h2 className="font-bold text-2xl text-purple-400 mt-4">🌐 Urdu Translation</h2>
                  <p className="text-gray-100 leading-relaxed text-right">{translated}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
