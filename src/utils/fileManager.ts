
// Simulated file system for MD files
const mdFiles = new Map<string, string>();

export const createMdFile = (filePath: string, content: string): void => {
  mdFiles.set(filePath, content);
  console.log(`📄 فایل ایجاد شد: ${filePath}`);
};

export const readMdFile = (filePath: string): string | null => {
  return mdFiles.get(filePath) || null;
};

export const updateMdFile = (filePath: string, content: string): void => {
  mdFiles.set(filePath, content);
  console.log(`📝 فایل به‌روزرسانی شد: ${filePath}`);
};

export const deleteMdFile = (filePath: string): void => {
  mdFiles.delete(filePath);
  console.log(`🗑️ فایل حذف شد: ${filePath}`);
};

export const listMdFiles = (): string[] => {
  return Array.from(mdFiles.keys());
};

export const copyVersionFiles = (fromVersion: string, toVersion: string): void => {
  const filesToCopy = Array.from(mdFiles.keys()).filter(path => 
    path.startsWith(`docs/${fromVersion}/`)
  );
  
  filesToCopy.forEach(filePath => {
    const content = mdFiles.get(filePath);
    if (content) {
      const newPath = filePath.replace(`docs/${fromVersion}/`, `docs/${toVersion}/`);
      mdFiles.set(newPath, content);
      console.log(`📋 فایل کپی شد: ${filePath} -> ${newPath}`);
    }
  });
};

export const deleteVersionFiles = (version: string): void => {
  const filesToDelete = Array.from(mdFiles.keys()).filter(path => 
    path.startsWith(`docs/${version}/`)
  );
  
  filesToDelete.forEach(filePath => {
    mdFiles.delete(filePath);
    console.log(`🗑️ فایل نسخه حذف شد: ${filePath}`);
  });
};

export const renameVersionFiles = (oldVersion: string, newVersion: string): void => {
  const filesToRename = Array.from(mdFiles.keys()).filter(path => 
    path.startsWith(`docs/${oldVersion}/`)
  );
  
  filesToRename.forEach(filePath => {
    const content = mdFiles.get(filePath);
    if (content) {
      const newPath = filePath.replace(`docs/${oldVersion}/`, `docs/${newVersion}/`);
      mdFiles.set(newPath, content);
      mdFiles.delete(filePath);
      console.log(`📝 نام فایل تغییر یافت: ${filePath} -> ${newPath}`);
    }
  });
};

// Initialize default MD files
export const initializeDefaultFiles = (version: string = 'v1') => {
  createMdFile(`docs/${version}/program/introduction.md`, `# مقدمه‌ای بر خودکارینو

خوش آمدید به مستندات جامع **خودکارینو**! این پلتفرم قدرتمند برای ایجاد و مدیریت خودکارسازی‌های پیشرفته طراحی شده است.

## ویژگی‌های کلیدی

### 🔄 خودکارسازی هوشمند
- ایجاد فرآیندهای خودکار پیچیده
- پشتیبانی از شرط‌ها و حلقه‌ها
- تعامل با API های مختلف

### 📊 مانیتورینگ و گزارش‌گیری
- ردیابی عملکرد خودکارسازی‌ها
- گزارش‌های تفصیلی
- هشدارهای هوشمند

### 🎯 سادگی استفاده
رابط کاربری بصری و بدون نیاز به کدنویسی

\`\`\`javascript
// مثال کد ساده
const automation = {
  name: "خودکارسازی نمونه",
  trigger: "webhook",
  actions: ["send_email", "update_database"]
};
\`\`\`

> **نکته:** این فقط یک نمونه از قابلیت‌های خودکارینو است. برای اطلاعات بیشتر بخش‌های مختلف را مطالعه کنید.`);

  createMdFile(`docs/${version}/program/quick-start.md`, `# شروع سریع

در این بخش نحوه شروع کار با خودکارینو را یاد می‌گیرید.

## مرحله ۱: ایجاد حساب کاربری

ابتدا باید در پلتفرم خودکارینو ثبت‌نام کنید:

1. به صفحه ثبت‌نام بروید
2. اطلاعات خود را وارد کنید
3. ایمیل تأیید را چک کنید

## مرحله ۲: اولین خودکارسازی

\`\`\`python
# نمونه کد Python برای API
import requests

response = requests.post('https://api.khodkarino.com/automation', {
    'name': 'اولین خودکارسازی من',
    'trigger': 'schedule'
})
\`\`\`

### نکات مهم:
- ✅ همیشه API key خود را محرمانه نگه دارید
- ✅ تست کردن خودکارسازی قبل از اجرای نهایی
- ⚠️ محدودیت‌های نرخ API را رعایت کنید`);

  createMdFile(`docs/${version}/program/iterator.md`, `# تکرارگر (Iterator)

تکرارگر یکی از قدرتمندترین ابزارهای خودکارینو است که امکان تکرار اقدامات روی مجموعه‌ای از داده‌ها را فراهم می‌کند.

## نحوه کارکرد

تکرارگر روی هر آیتم در یک آرایه یا لیست عمل می‌کند:

\`\`\`json
{
  "iterator": {
    "input": ["آیتم ۱", "آیتم ۲", "آیتم ۳"],
    "actions": [
      {
        "type": "process_item",
        "value": "{{item}}"
      }
    ]
  }
}
\`\`\`

## مثال عملی

فرض کنید لیستی از ایمیل‌ها داریم و می‌خواهیم برای هر کدام ایمیل ارسال کنیم:

\`\`\`javascript
const emails = ['user1@example.com', 'user2@example.com'];

emails.forEach(email => {
  sendEmail({
    to: email,
    subject: 'خوش آمدید',
    body: 'سلام و به خودکارینو خوش آمدید!'
  });
});
\`\`\`

> **توجه:** تکرارگر محدودیت حداکثر ۱۰۰۰ آیتم در هر اجرا دارد.`);

  createMdFile(`docs/${version}/api/api-intro.md`, `# مقدمه API خودکارینو

API خودکارینو امکان تعامل برنامه‌نویسی با پلتفرم را فراهم می‌کند.

## URL پایه

\`\`\`
https://api.khodkarino.com/${version}
\`\`\`

## احراز هویت

برای استفاده از API، نیاز به API Key دارید:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.khodkarino.com/${version}/automations
\`\`\`

## نرخ محدودیت

- حداکثر ۱۰۰ درخواست در دقیقه
- حداکثر ۱۰۰۰ درخواست در ساعت`);

  createMdFile(`docs/${version}/app/app-intro.md`, `# مقدمه اپلیکیشن خودکارینو

اپلیکیشن خودکارینو رابط کاربری تحت وب برای مدیریت خودکارسازی‌هاست.

## ویژگی‌های اصلی

### داشبورد
- نمای کلی از خودکارسازی‌ها
- آمار عملکرد
- وضعیت سیستم

### ویرایشگر بصری
- ایجاد خودکارسازی بدون کد
- رابط Drag & Drop
- پیش‌نمایش زنده

### مدیریت
- تنظیمات حساب کاربری
- مدیریت API Keys
- گزارش‌گیری پیشرفته`);
};
