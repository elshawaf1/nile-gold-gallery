export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>تعذر تحميل الصفحة</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.6 "Cairo", system-ui, -apple-system, sans-serif; background: #0c0b09; color: #f3efe6; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2.5rem; border: 1px solid rgba(212,175,55,.3); border-radius: 1.25rem; background: #14120e; box-shadow: 0 30px 80px -50px rgba(212,175,55,.8); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; color: #d4af37; }
      p { color: #a9a294; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.55rem 1.15rem; border-radius: 999px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #d4af37; color: #14120e; font-weight: 600; }
      .secondary { background: transparent; color: #f3efe6; border-color: rgba(243,239,230,.2); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>تعذر تحميل الصفحة</h1>
      <p>حدث خطأ من جانبنا. جرّب تحديث الصفحة أو العودة للرئيسية.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">إعادة المحاولة</button>
        <a class="secondary" href="/">الرئيسية</a>
      </div>
    </div>
  </body>
</html>`;
}
