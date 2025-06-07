
import { useDocs } from "@/contexts/DocsContext";
import MarkdownRenderer from "./MarkdownRenderer";
import Breadcrumb from "./Breadcrumb";

const ContentArea = () => {
  const { activePage, activeTab } = useDocs();

  // Mock content based on active page - در آینده از فایل‌های Markdown خوانده می‌شود
  const getPageContent = () => {
    const contents: Record<string, string> = {
      intro: `# مقدمه‌ای بر خودکارینو

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

> **نکته:** این فقط یک نمونه از قابلیت‌های خودکارینو است. برای اطلاعات بیشتر بخش‌های مختلف را مطالعه کنید.`,

      "quick-start": `# شروع سریع

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
- ⚠️ محدودیت‌های نرخ API را رعایت کنید`,

      iterator: `# تکرارگر (Iterator)

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
    };

    return contents[activePage] || `# صفحه ${activePage}

محتوای این صفحه هنوز آماده نیست. لطفاً بعداً مراجعه کنید.

## در حال توسعه

این بخش از مستندات در حال تکمیل است.`;
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Breadcrumb />
        </div>
        
        <article className="prose prose-lg max-w-none">
          <MarkdownRenderer content={getPageContent()} />
        </article>
      </div>
    </main>
  );
};

export default ContentArea;
