export type FindingSeverity = "info" | "warn" | "error";
export type FindingCategory =
  | "docs"
  | "track"
  | "workspace"
  | "skills"
  | "roles"
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
  plans_dir?: string;
  docs_index_file?: string;
  features?: {
    repo_skills?: boolean;
    docs_index?: boolean;
  };
}
