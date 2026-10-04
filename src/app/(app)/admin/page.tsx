"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DataSourceBadge } from "@/components/shared/Badges";
import { useAppStore } from "@/store/useAppStore";
import type { SourceType } from "@/types";
import { formatDate } from "@/lib/formatters";
import { ROLE_LABELS } from "@/lib/roles";

export default function AdminPage() {
  const modelVersion = useAppStore((s) => s.modelVersion);
  const auditLog = useAppStore((s) => s.auditLog);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getAdmin>> | null>(null);
  const [perms, setPerms] = useState<
    { action: string; planner: boolean; training: boolean; employer: boolean; admin: boolean }[]
  >([]);

  useEffect(() => {
    api.getAdmin().then((d) => {
      setData(d);
      setPerms(d.permissions);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Administration</h1>
        <p className="text-xs text-slate-500">Platform configuration · Active model {modelVersion}</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="flex h-auto flex-wrap">
          {[
            "users",
            "roles",
            "sources",
            "models",
            "ontology",
            "occupations",
            "centres",
            "audit",
            "consent",
            "config",
          ].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t === "roles"
                ? "Roles & Permissions"
                : t === "sources"
                  ? "Data Sources"
                  : t === "models"
                    ? "Model Versions"
                    : t === "ontology"
                      ? "Skill Ontology"
                      : t === "occupations"
                        ? "Occupation Mapping"
                        : t === "centres"
                          ? "Training Centres"
                          : t === "audit"
                            ? "Audit Logs"
                            : t === "consent"
                              ? "Consent"
                              : t === "config"
                                ? "System Config"
                                : "Users"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Org</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.role}</td>
                      <td>{u.org}</td>
                      <td>
                        <Badge variant={u.status === "Active" ? "success" : "secondary"}>
                          {u.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Permission matrix</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Planner</th>
                    <th>Training</th>
                    <th>Employer</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {perms.map((p, i) => (
                    <tr key={p.action}>
                      <td>{p.action}</td>
                      {(["planner", "training", "employer", "admin"] as const).map((k) => (
                        <td key={k}>
                          <Switch
                            checked={p[k]}
                            onCheckedChange={(v) =>
                              setPerms((prev) =>
                                prev.map((row, idx) => (idx === i ? { ...row, [k]: v } : row))
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Last sync</th>
                    <th>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dataSources.map((s) => (
                    <tr key={s.name}>
                      <td>{s.name}</td>
                      <td>
                        <DataSourceBadge type={s.type as SourceType} />
                      </td>
                      <td>{s.lastSync}</td>
                      <td>
                        <Badge variant={s.health === "Healthy" ? "success" : "saffron"}>
                          {s.health}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Accuracy</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.models.map((m) => (
                    <tr key={m.version}>
                      <td className="font-medium">
                        {m.version}
                        {m.version === modelVersion && (
                          <Badge className="ml-2" variant="success">
                            Session active
                          </Badge>
                        )}
                      </td>
                      <td>{m.accuracy}</td>
                      <td>
                        <Badge
                          variant={
                            m.status === "Active"
                              ? "success"
                              : m.status === "Candidate"
                                ? "saffron"
                                : "secondary"
                          }
                        >
                          {m.status}
                        </Badge>
                      </td>
                      <td>{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ontology">
          <div className="grid gap-3 md:grid-cols-2">
            {data.ontology.map((node) => (
              <Card key={node.name}>
                <CardHeader>
                  <CardTitle>{node.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {node.children.map((c) => (
                      <li key={c} className="rounded bg-slate-50 px-2 py-1">
                        → {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="occupations">
          <Card>
            <CardContent className="space-y-4 p-4">
              {data.occupations.map((o) => (
                <div key={o.nco} className="rounded-md border border-slate-200 p-3">
                  <p className="font-semibold text-navy-900">
                    {o.standard}{" "}
                    <span className="font-mono text-xs text-slate-500">NCO {o.nco}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Aliases: {o.aliases.join(" · ")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centres">
          <Card>
            <CardContent className="p-4 text-sm text-slate-600">
              Training centre master data is managed in the Training Capacity module. Admins can
              sync NSDC / DGT registries from Data Sources.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardContent className="max-h-96 overflow-y-auto p-4">
              {auditLog.length === 0 ? (
                <p className="text-sm text-slate-500">No session audit entries yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {auditLog.map((a) => (
                    <li key={a.id} className="border-b border-slate-100 pb-2">
                      <strong>{a.action}</strong> — {a.detail}
                      <br />
                      <span className="text-xs text-slate-500">
                        {formatDate(a.timestamp)} · {a.user} · {ROLE_LABELS[a.role]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent">
          <Card>
            <CardContent className="space-y-3 p-4 text-sm">
              <div className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                <span>Default: share consented profiles with employers</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                <span>Allow training recommendations from inferred skills</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                <span>Require re-consent every 12 months</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardContent className="space-y-3 p-4 text-sm">
              <div className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                <span>Pilot mode (synthetic data badge)</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                <span>API latency simulation (600–1500ms)</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                <span>Guided tour coach-marks</span>
                <Switch defaultChecked />
              </div>
              <p className="text-xs text-slate-500">Environment: sanket-pilot · Region: India</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
