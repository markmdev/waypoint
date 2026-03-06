export type FindingSeverity = "info" | "warn" | "error";
export type FindingCategory =
  | "docs"
  | "workspace"
  | "skills"
  | "roles"
  | "rules"
  | "automations"
  | "install";

export interface Finding {
  severity: FindingSeverity;
  category: FindingCategory;
  message: string;
  remediation: string;
  paths?: string[];
}

export interface WaypointConfig {
  version?: number;
  profile?: "universal" | "app-friendly";
  workspace_file?: string;
  docs_dir?: string;
  docs_index_file?: string;
  features?: {
    repo_skills?: boolean;
    docs_index?: boolean;
    roles?: boolean;
    rules?: boolean;
    automations?: boolean;
  };
}

export interface SyncRecord {
  artifact_type: "rules" | "automation";
  source_path: string;
  target_path: string;
  source_hash: string;
  target_hash: string;
}

export interface AutomationSpec {
  id?: string;
  name?: string;
  prompt?: string;
  rrule?: string;
  execution_environment?: "local" | "worktree";
  cwds?: string[];
  status?: "ACTIVE" | "PAUSED";
  enabled?: boolean;
}

