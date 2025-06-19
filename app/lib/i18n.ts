// 语言工具函数
export const locales = ['en', 'zh'] as const;
export type Locale = typeof locales[number];

/**
 * 检测当前语言
 */
export function getCurrentLocale(pathname: string): Locale {
  // 简单可靠的路径检测
  if (pathname.startsWith('/zh')) {
    return 'zh';
  }
  return 'en';
}

/**
 * 获取本地化路径
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // 移除现有的语言前缀
  const cleanPath = path.replace(/^\/zh/, '');
  
  // 如果是中文，添加 /zh 前缀
  if (locale === 'zh') {
    return `/zh${cleanPath === '' ? '' : cleanPath}`;
  }
  
  // 英文不需要前缀
  return cleanPath === '' ? '/' : cleanPath;
}

/**
 * 检查是否为当前路径
 */
export function isCurrentPath(currentPath: string, targetPath: string): boolean {
  const currentLocale = getCurrentLocale(currentPath);
  const localizedTargetPath = getLocalizedPath(targetPath, currentLocale);
  
  return currentPath === localizedTargetPath;
}

/**
 * 切换语言
 */
export function switchLanguage(currentPath: string, targetLocale: Locale): string {
  // 移除当前语言前缀，获取基础路径
  const basePath = currentPath.replace(/^\/zh/, '');
  
  // 返回目标语言的路径
  return getLocalizedPath(basePath, targetLocale);
}

/**
 * 获取浏览器首选语言
 */
export function getPreferredLocale(): Locale {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
      return 'zh';
    }
  }
  return 'en';
} 