
export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  isCustom?: boolean;
}

export interface PageFileConfig {
  title: string;
  slug: string;
  tab: string;
  fileName: string; // نام فایل انگلیسی
  filePath: string; // مسیر کامل فایل
}
