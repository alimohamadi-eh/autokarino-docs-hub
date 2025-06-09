
import { NavigationItem, PageContent } from '@/types/docs';

export const mockPageContents: Record<string, PageContent> = {
  intro: {
    title: "مقدمه‌ای بر خودکارینو",
    slug: "intro",
    tab: "program",
    content: `# مقدمه‌ای بر خودکارینو

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

> **نکته:** این فقط یک نمونه از قابلیت‌های خودکارینو است. برای اطلاعات بیشتر بخش‌های مختلف را مطالعه کنید.`
  },
  "quick-start": {
    title: "شروع سریع",
    slug: "quick-start",
    tab: "program",
    content: `# شروع سریع

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
- ⚠️ محدودیت‌های نرخ API را رعایت کنید`
  },
  iterator: {
    title: "تکرارگر (Iterator)",
    slug: "iterator", 
    tab: "program",
    content: `# تکرارگر (Iterator)

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

> **توجه:** تکرارگر محدودیت حداکثر ۱۰۰۰ آیتم در هر اجرا دارد.`
  }
};

export const mockNavigationData: Record<string, NavigationItem[]> = {
  program: [
    {
      title: "مقدمه",
      slug: "intro",
      children: [
        { title: "شروع سریع", slug: "quick-start" },
        { title: "نصب و راه‌اندازی", slug: "installation" }
      ]
    },
    {
      title: "خودکارسازی",
      slug: "automation", 
      children: [
        { title: "تکرارگر", slug: "iterator" },
        { title: "شرط‌ها", slug: "conditions" },
        { title: "متغیرها", slug: "variables" }
      ]
    }
  ],
  api: [
    {
      title: "مقدمه API",
      slug: "api-intro",
      children: [
        { title: "احراز هویت", slug: "authentication" },
        { title: "نرخ محدودیت", slug: "rate-limiting" }
      ]
    }
  ],
  app: [
    {
      title: "مقدمه اپلیکیشن",
      slug: "app-intro",
      children: [
        { title: "رابط کاربری", slug: "ui-guide" },
        { title: "تنظیمات", slug: "settings" }
      ]
    }
  ]
};
