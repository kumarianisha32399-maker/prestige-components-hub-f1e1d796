import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, KEYS, write, logActivity } from "@/lib/store";
import { Field, ImagePicker, Toggle, toast } from "@/components/ui";
import { PageHeader, Panel } from "@/components/admin/kit";

export const Route = createFileRoute("/admin/content")({ component: Content });

function Content() {
  const saved = useStore<any>(KEYS.content);
  const [c, setC] = useState<any>(saved);
  const up = (sec: string, key: string, v: any) => setC({ ...c, [sec]: { ...c[sec], [key]: v } });
  const T = ({ sec, k, label, area }: { sec: string; k: string; label: string; area?: boolean }) => (
    <Field label={label}>{area
      ? <textarea rows={3} className="field" value={c[sec][k]} onChange={(e) => up(sec, k, e.target.value)} />
      : <input className="field" value={c[sec][k]} onChange={(e) => up(sec, k, e.target.value)} />}</Field>
  );
  const save = () => { if (!write(KEYS.content, c)) return toast("Could not save — storage is full.", "error"); logActivity("Website content updated"); toast("Website content saved"); };
  return (
    <div className="space-y-6">
      <PageHeader title="Website Content" text="Changes appear on the public website after saving." action={<button className="btn btn-accent" onClick={save}>Save All Changes</button>} />
      <Panel className="grid gap-4 p-6 md:grid-cols-2"><h2 className="font-semibold text-primary md:col-span-2">Hero Section</h2>
        {T({ sec: "hero", k: "heading", label: "Hero Heading" })}{T({ sec: "hero", k: "label", label: "Hero Subtitle" })}
        <div className="md:col-span-2">{T({ sec: "hero", k: "description", label: "Hero Description", area: true })}</div>
        {T({ sec: "hero", k: "cta1", label: "Primary Button Text" })}{T({ sec: "hero", k: "cta2", label: "Secondary Button Text" })}
        <div className="md:col-span-2"><ImagePicker label="Hero Banner Image" value={c.hero.image} onChange={(v) => up("hero", "image", v)} /></div></Panel>
      <Panel className="grid gap-4 p-6"><h2 className="font-semibold text-primary">About Section</h2>
        {T({ sec: "about", k: "heading", label: "About Heading" })}{T({ sec: "about", k: "description", label: "About Description", area: true })}
        {T({ sec: "about", k: "companyInfo", label: "Company Information" })}
        <ImagePicker label="About Image" value={c.about.image} onChange={(v) => up("about", "image", v)} /></Panel>
      <Panel className="grid gap-4 p-6"><h2 className="font-semibold text-primary">Why Choose Us</h2>
        {c.why.features.map((f: any, i: number) => (
          <div key={i} className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <Field label={`Feature ${i + 1} Title`}><input className="field" value={f.title} onChange={(e) => up("why", "features", c.why.features.map((x: any, j: number) => j === i ? { ...x, title: e.target.value } : x))} /></Field>
            <Field label="Description"><input className="field" value={f.text} onChange={(e) => up("why", "features", c.why.features.map((x: any, j: number) => j === i ? { ...x, text: e.target.value } : x))} /></Field>
            <Toggle label="Visible" checked={f.visible} onChange={(v) => up("why", "features", c.why.features.map((x: any, j: number) => j === i ? { ...x, visible: v } : x))} />
          </div>))}</Panel>
      <Panel className="grid gap-4 p-6"><h2 className="font-semibold text-primary">Contact & Footer</h2>
        {T({ sec: "contact", k: "email", label: "Email Address" })}{T({ sec: "contact", k: "address", label: "Business Address" })}
        {T({ sec: "contact", k: "description", label: "Contact Description", area: true })}
        {T({ sec: "footer", k: "description", label: "Footer Description", area: true })}
        {T({ sec: "footer", k: "copyright", label: "Copyright Text" })}{T({ sec: "footer", k: "credit", label: "Development Credit" })}</Panel>
      <button className="btn btn-accent" onClick={save}>Save All Changes</button>
    </div>
  );
}
