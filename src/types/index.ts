export type Language = 'en' | 'fa';

export type FontFamily = 'kalameh' | 'iransans' | 'iranyekan' | 'vazir';

export type ScreenType = 'archive' | 'repository' | 'specs' | 'stats';

export type ProjectStatus = 'active' | 'in_progress' | 'archived';

export type FileFormat = 'figma' | 'pdf' | 'tsx' | 'openapi';

export interface Project {
  id: string;
  name: string;
  nameFa: string;
  tagline?: string;
  taglineFa?: string;
  description: string;
  descriptionFa: string;
  category: 'web-app' | 'mobile' | 'design-system' | 'backend' | 'ai-tool';
  categoryFa: string;
  status: ProjectStatus;
  version: string;
  year: string;
  updatedAt: string;
  updatedAtFa: string;
  demoUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  formats: FileFormat[];
  techStack: string[];
  metrics: {
    filesCount: number;
    completion: number;
    locOrSize: string;
    roleTitle: string;
    roleTitleFa: string;
  };
  highlights?: string[];
  highlightsFa?: string[];
}

export interface DocumentItem {
  id: string;
  projectId?: string;
  title: string;
  titleFa: string;
  category: string;
  categoryFa: string;
  format: FileFormat;
  version: string;
  size: string;
  updatedAt: string;
  updatedAtFa: string;
  projectName?: string;
  projectNameFa?: string;
  status: ProjectStatus;
  downloads: number;
  description: string;
  descriptionFa: string;
  codeSnippet?: string;
  schemaDetails?: Record<string, string>;
}

export interface MetricWidget {
  id: string;
  label: string;
  labelFa: string;
  value: string;
  valueFa: string;
  change: string;
  changeFa: string;
  isPositive: boolean;
  period: string;
  periodFa: string;
  sparkline: number[];
  categoryIcon: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  summaryFa: string;
  latencyMs: number;
  status: number;
  sampleRequest?: string;
  sampleResponse: string;
  tags: string[];
}
