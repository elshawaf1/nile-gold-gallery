import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";
export type Dir = "rtl" | "ltr";

const messages = {
  "nav.all": { ar: "كل الذهب", en: "All gold" },
  "gold.today": { ar: "سعر شراء الذهب اليوم للجرام", en: "Gold Bullion buy price / gram" },
  "gold.live": { ar: "جولد بيليون", en: "Gold Bullion" },
  "gold.manual": { ar: "سعر المتجر", en: "Store rate" },
  "gold.offline": { ar: "آخر سعر معروف", en: "Last known rate" },
  "gold.snapshot": { ar: "سعر تجريبي وقت النشر", en: "Build-time demo price" },
  "gold.updated": { ar: "آخر تحديث", en: "Updated" },
  "help.need": { ar: "تحتاج مساعدة؟", en: "Need help?" },
  "action.whatsapp": { ar: "واتساب", en: "WhatsApp" },
  "action.saved": { ar: "المفضلة", en: "Saved" },
  "action.cart": { ar: "السلة", en: "Cart" },
  "action.home": { ar: "الرئيسية", en: "Go home" },
  "action.retry": { ar: "إعادة المحاولة", en: "Try again" },
  "action.browse": { ar: "تسوق الذهب", en: "Browse gold" },
  "lang.switch": { ar: "English", en: "العربية" },
  "lang.aria": { ar: "تغيير اللغة", en: "Change language" },
  "theme.light": { ar: "الوضع الفاتح", en: "Light mode" },
  "theme.dark": { ar: "الوضع الداكن", en: "Dark mode" },
  "theme.toggle": { ar: "تبديل المظهر", en: "Toggle theme" },
  "notfound.title": { ar: "الصفحة غير موجودة", en: "Page not found" },
  "notfound.desc": {
    ar: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    en: "The page you're looking for doesn't exist or has been moved.",
  },
  "error.title": { ar: "تعذر تحميل الصفحة", en: "This page didn't load" },
  "error.desc": {
    ar: "حدث خطأ من جانبنا. جرّب تحديث الصفحة أو العودة للرئيسية.",
    en: "Something went wrong on our end. You can try refreshing or head back home.",
  },
  "footer.tagline": {
    ar: "ذهب عيار ١٨ و٢١ و٢٤ من دكرنس، الدقهلية.",
    en: "18K, 21K and 24K gold from Dekernes, Dakahlia.",
  },
  "footer.visit": { ar: "زورونا", en: "Visit" },
  "footer.hours": { ar: "المواعيد", en: "Hours" },
  "footer.whatsapp": { ar: "راسلنا على واتساب", en: "WhatsApp us" },
  "footer.rights": {
    ar: "الأسعار تتبع سعر الذهب اليومي. يتم تأكيد الطلبات على واتساب — الدفع في المحل أو عند الاستلام.",
    en: "Prices follow the daily gold rate. Orders are confirmed on WhatsApp — pay in store or on delivery.",
  },
  "promo.carousel": { ar: "عروض ومنتجات مختارة", en: "Featured products and offers" },
  "promo.carouselRole": { ar: "عارض شرائح", en: "carousel" },
  "promo.eyebrow": { ar: "اختيارات الصفا المروة", en: "Picked for you" },
  "promo.shopNow": { ar: "شاهد التفاصيل", en: "Shop this piece" },
  "promo.previous": { ar: "الشريحة السابقة", en: "Previous slide" },
  "promo.next": { ar: "الشريحة التالية", en: "Next slide" },
  "promo.pause": { ar: "إيقاف العرض التلقائي", en: "Pause slideshow" },
  "promo.play": { ar: "تشغيل العرض التلقائي", en: "Play slideshow" },
  "promo.goToSlide": { ar: "انتقل إلى الشريحة {n}", en: "Go to slide {n}" },
  "sort.featured": { ar: "المميزة", en: "Featured" },
  "sort.priceAsc": { ar: "السعر: من الأقل للأعلى", en: "Price: low to high" },
  "sort.priceDesc": { ar: "السعر: من الأعلى للأقل", en: "Price: high to low" },
  "sort.rating": { ar: "الأعلى تقييمًا", en: "Top rated" },
  "filter.karat": { ar: "العيار", en: "Karat" },
  "filter.anyKarat": { ar: "كل العيارات", en: "Any karat" },
  "filter.price": { ar: "السعر", en: "Price" },
  "filter.anyPrice": { ar: "كل الأسعار", en: "Any price" },
  "filter.category": { ar: "النوع", en: "Category" },
  "filter.allCategories": { ar: "كل الأنواع", en: "All categories" },
  "pricing.title": { ar: "كيف تُحسب الأسعار؟", en: "How pricing works" },
  "pricing.desc": {
    ar: "الوزن × سعر الجرام اليوم + المصنعية. السعر النهائي يؤكده المحل.",
    en: "Weight × today's gram rate + workmanship. Final price confirmed by the shop.",
  },
  "sort.label": { ar: "ترتيب حسب", en: "Sort by" },
  "results.items": { ar: "{n} قطعة", en: "{n} items" },
  "results.for": { ar: "نتائج البحث عن «{q}»", en: "Results for “{q}”" },
  "results.all": { ar: "كل الذهب", en: "All gold" },
  "results.none": { ar: "لا توجد قطع مطابقة لبحثك.", en: "No pieces match your search." },
  "results.seeAll": { ar: "شاهد كل الذهب", en: "See all gold" },
  "unit.perGram": { ar: "/جم", en: "/g" },
  "unit.g": { ar: "جم", en: "g" },
  "product.unavailable": { ar: "هذه القطعة غير متاحة حاليًا.", en: "This piece isn't available." },
  "product.back": { ar: "العودة للمتجر", en: "Back to the store" },
  "product.estimated": { ar: "سعر تقديري بسعر الذهب اليوم", en: "Estimated at today's gold rate" },
  "product.karat": { ar: "العيار", en: "Karat" },
  "product.weight": { ar: "الوزن", en: "Weight" },
  "product.goldPrice": { ar: "سعر الجرام", en: "Gold price / g" },
  "product.workmanship": { ar: "المصنعية / جم", en: "Workmanship / g" },
  "product.inStock": { ar: "متوفر", en: "In stock" },
  "product.qty": { ar: "الكمية", en: "Qty" },
  "product.add": { ar: "أضف إلى السلة", en: "Add to cart" },
  "product.added": { ar: "تمت الإضافة إلى السلة", en: "Added to cart" },
  "product.viewCart": { ar: "عرض السلة", en: "View cart" },
  "product.order": { ar: "اطلب على واتساب", en: "Order on WhatsApp" },
  "product.hallmark": { ar: "ذهب مدموغ مع فاتورة", en: "Hallmarked gold with invoice" },
  "product.pay": { ar: "تأكيد الطلب عبر واتساب", en: "Order confirmation on WhatsApp" },
  "product.alsoLike": { ar: "قد يعجبك أيضًا", en: "You may also like" },
  "card.quickView": { ar: "نظرة سريعة", en: "Quick view" },
  "qty.decrease": { ar: "تقليل الكمية", en: "Decrease quantity" },
  "qty.increase": { ar: "زيادة الكمية", en: "Increase quantity" },
  "quick.details": { ar: "كل التفاصيل", en: "See full details" },
  "cart.title": { ar: "سلتك ({n})", en: "Your cart ({n})" },
  "cart.subtitle": {
    ar: "لا يوجد دفع إلكتروني — أرسل طلبك للمحل على واتساب.",
    en: "No online payment — send your order to the shop on WhatsApp.",
  },
  "cart.empty": { ar: "سلتك فارغة", en: "Your cart is empty" },
  "cart.emptyHint": {
    ar: "أضف عقدًا أو خاتمًا أو جنيه ذهب للبدء.",
    en: "Add a necklace, ring or gold pound to get started.",
  },
  "cart.remove": { ar: "إزالة {name}", en: "Remove {name}" },
  "cart.estimated": { ar: "الإجمالي التقديري", en: "Estimated total" },
  "cart.finalNote": {
    ar: "السعر النهائي يؤكده المحل بسعر الذهب اليوم. الدفع في المحل أو عند الاستلام.",
    en: "Final price is confirmed by the shop at today's gold rate. Pay in store or on delivery.",
  },
  "cart.send": { ar: "أرسل الطلب على واتساب", en: "Send order on WhatsApp" },
  "cart.clear": { ar: "إفراغ السلة", en: "Clear cart" },
  "wishlist.title": { ar: "القطع المحفوظة", en: "Saved pieces" },
  "wishlist.items": { ar: "{n} قطعة", en: "{n} items" },
  "wishlist.addAll": { ar: "أضف الكل إلى السلة", en: "Add all to cart" },
  "wishlist.empty": { ar: "لا توجد قطع محفوظة بعد", en: "No saved pieces yet" },
  "wishlist.emptyHint": {
    ar: "اضغط على القلب في أي قطعة لحفظها هنا.",
    en: "Tap the heart on any piece to save it here.",
  },
  "wishlist.addedAll": { ar: "تمت إضافة {n} قطع إلى السلة", en: "Added {n} pieces to cart" },
  "wishlist.add": { ar: "أضف {name} للمفضلة", en: "Save {name} to wishlist" },
  "wishlist.remove": { ar: "أزل {name} من المفضلة", en: "Remove {name} from wishlist" },
  "wishlist.saved": { ar: "تم الحفظ في المفضلة", en: "Saved to wishlist" },
  "wishlist.removed": { ar: "تمت الإزالة من المفضلة", en: "Removed from wishlist" },
  "search.aria": { ar: "ابحث في الذهب", en: "Search gold" },
  "search.placeholder": {
    ar: "ابحث… جرّب «جنيه» أو «٢١» أو «خاتم»",
    en: "Search gold… try “pound”, “21K” or “خاتم”",
  },
  "search.clear": { ar: "مسح البحث", en: "Clear search" },
  "search.submit": { ar: "بحث", en: "Search" },
  "search.recent": { ar: "أحدث عمليات البحث", en: "Recent searches" },
  "search.clearRecent": { ar: "مسح", en: "Clear" },
  "search.popular": { ar: "الأكثر بحثًا", en: "Popular searches" },
  "search.in": { ar: "داخل {c}", en: "in {c}" },
  "search.none": {
    ar: "لا توجد قطع تطابق «{q}». جرّب «خاتم» أو «٢١» أو «جنيه».",
    en: "No pieces match “{q}”. Try “ring”, “21K” or “جنيه”.",
  },
  "search.seeAll": { ar: "شاهد كل النتائج ({n}) لـ «{q}»", en: "See all {n} results for “{q}”" },
  "stars.aria": { ar: "{rating} من ٥ نجوم", en: "{rating} out of 5 stars" },
  backToTop: { ar: "العودة للأعلى", en: "Back to top" },
  "cart.open": { ar: "افتح السلة، {n} قطعة", en: "Open cart, {n} items" },
  "wishlist.open": { ar: "المفضلة، {n} محفوظة", en: "Wishlist, {n} saved" },
  "whatsapp.greeting": {
    ar: "مرحبًا، لدي سؤال عن الذهب.",
    en: "Hello, I have a question about your gold.",
  },
  "whatsapp.hello": { ar: "مرحبًا!", en: "Hello!" },
  "order.intro": { ar: "مرحبًا {shop}، أود طلب:", en: "Hello {shop}, I'd like to order:" },
  "order.total": { ar: "الإجمالي التقديري: {total}", en: "Estimated total: {total}" },
  "order.confirm": {
    ar: "من فضلك أكدوا التوفر وسعر اليوم.",
    en: "Please confirm availability and today's price.",
  },
  "common.save": { ar: "حفظ", en: "Save" },
  "common.saving": { ar: "جارٍ الحفظ…", en: "Saving…" },
  "common.cancel": { ar: "إلغاء", en: "Cancel" },
  "common.delete": { ar: "حذف", en: "Delete" },
  "common.edit": { ar: "تعديل", en: "Edit" },
  "common.add": { ar: "إضافة", en: "Add" },
  "common.loading": { ar: "جارٍ التحميل…", en: "Loading…" },
  "common.error": { ar: "حدث خطأ. حاول مرة أخرى.", en: "Something went wrong. Try again." },
  "common.saved": { ar: "تم الحفظ", en: "Saved" },
  "admin.title": { ar: "لوحة التحكم", en: "Admin" },
  "admin.login.title": { ar: "دخول لوحة التحكم", en: "Admin sign in" },
  "admin.login.subtitle": {
    ar: "أدخل كلمة مرور المتجر للمتابعة.",
    en: "Enter the shop password to continue.",
  },
  "admin.login.password": { ar: "كلمة المرور", en: "Password" },
  "admin.login.submit": { ar: "دخول", en: "Sign in" },
  "admin.login.invalid": { ar: "كلمة المرور غير صحيحة.", en: "Incorrect password." },
  "admin.logout": { ar: "خروج", en: "Sign out" },
  "admin.nav.dashboard": { ar: "نظرة عامة", en: "Dashboard" },
  "admin.nav.products": { ar: "المنتجات", en: "Products" },
  "admin.nav.categories": { ar: "الأنواع", en: "Categories" },
  "admin.nav.prices": { ar: "الأسعار", en: "Prices" },
  "admin.nav.orders": { ar: "الطلبات", en: "Enquiries" },
  "admin.nav.settings": { ar: "الإعدادات", en: "Settings" },
  "admin.nav.site": { ar: "عرض الموقع", en: "View site" },
  "admin.dashboard.products": { ar: "المنتجات", en: "Products" },
  "admin.dashboard.active": { ar: "المنتجات النشطة", en: "Active products" },
  "admin.dashboard.enquiries": { ar: "الطلبات", en: "Enquiries" },
  "admin.dashboard.newEnquiries": { ar: "طلبات جديدة", en: "New enquiries" },
  "admin.dashboard.rates": { ar: "أسعار الذهب", en: "Gold rates" },
  "admin.dashboard.manual": { ar: "أسعار يدوية", en: "Manual rates" },
  "admin.dashboard.live": { ar: "سعر مباشر", en: "Live rate" },
  "admin.dashboard.latest": { ar: "أحدث الطلبات", en: "Latest enquiries" },
  "admin.dashboard.empty": { ar: "لا توجد طلبات بعد.", en: "No enquiries yet." },
  "admin.products.title": { ar: "المنتجات", en: "Products" },
  "admin.products.add": { ar: "منتج جديد", en: "New product" },
  "admin.products.empty": { ar: "لا توجد منتجات بعد.", en: "No products yet." },
  "admin.products.nameEn": { ar: "الاسم (إنجليزي)", en: "Name (English)" },
  "admin.products.nameAr": { ar: "الاسم (عربي)", en: "Name (Arabic)" },
  "admin.products.descEn": { ar: "الوصف (إنجليزي)", en: "Description (English)" },
  "admin.products.descAr": { ar: "الوصف (عربي)", en: "Description (Arabic)" },
  "admin.products.category": { ar: "النوع", en: "Category" },
  "admin.products.karat": { ar: "العيار", en: "Karat" },
  "admin.products.weight": { ar: "الوزن (جم)", en: "Weight (g)" },
  "admin.products.making": { ar: "المصنعية / جم", en: "Making / g" },
  "admin.products.rating": { ar: "التقييم", en: "Rating" },
  "admin.products.reviews": { ar: "عدد المراجعات", en: "Reviews" },
  "admin.products.image": { ar: "رابط الصورة", en: "Image URL" },
  "admin.products.upload": { ar: "ارفع صورة", en: "Upload image" },
  "admin.products.inStock": { ar: "متوفر", en: "In stock" },
  "admin.products.active": { ar: "ظاهر في الموقع", en: "Visible on site" },
  "admin.products.sort": { ar: "الترتيب", en: "Order" },
  "admin.products.actions": { ar: "إجراءات", en: "Actions" },
  "admin.products.deleteConfirm": { ar: "حذف هذا المنتج؟", en: "Delete this product?" },
  "admin.products.newTitle": { ar: "منتج جديد", en: "New product" },
  "admin.products.editTitle": { ar: "تعديل المنتج", en: "Edit product" },
  "admin.products.back": { ar: "كل المنتجات", en: "All products" },
  "admin.categories.title": { ar: "الأنواع", en: "Categories" },
  "admin.categories.slug": { ar: "المعرّف", en: "Slug" },
  "admin.categories.nameEn": { ar: "الاسم (إنجليزي)", en: "Name (English)" },
  "admin.categories.nameAr": { ar: "الاسم (عربي)", en: "Name (Arabic)" },
  "admin.categories.sort": { ar: "الترتيب", en: "Order" },
  "admin.categories.active": { ar: "ظاهر", en: "Visible" },
  "admin.categories.new": { ar: "نوع جديد", en: "New category" },
  "admin.categories.deleteConfirm": { ar: "حذف هذا النوع؟", en: "Delete this category?" },
  "admin.prices.title": { ar: "أسعار الذهب والفلترة", en: "Gold rates & filters" },
  "admin.prices.override": { ar: "استخدام أسعار يدوية", en: "Use manual rates" },
  "admin.prices.overrideHint": {
    ar: "عند التفعيل تُستخدم هذه الأسعار بدلًا من السعر المباشر.",
    en: "When enabled these prices replace the live feed.",
  },
  "admin.prices.perGram": { ar: "سعر الجرام (ج.م)", en: "Price per gram (EGP)" },
  "admin.prices.ranges": { ar: "نطاقات السعر", en: "Price ranges" },
  "admin.prices.key": { ar: "المفتاح", en: "Key" },
  "admin.prices.labelEn": { ar: "الاسم (إنجليزي)", en: "Label (English)" },
  "admin.prices.labelAr": { ar: "الاسم (عربي)", en: "Label (Arabic)" },
  "admin.prices.min": { ar: "الحد الأدنى", en: "Min" },
  "admin.prices.max": { ar: "الحد الأقصى", en: "Max" },
  "admin.orders.title": { ar: "طلبات واتساب", en: "WhatsApp enquiries" },
  "admin.orders.empty": { ar: "لا توجد طلبات بعد.", en: "No enquiries yet." },
  "admin.orders.status": { ar: "الحالة", en: "Status" },
  "admin.orders.status.new": { ar: "جديد", en: "New" },
  "admin.orders.status.contacted": { ar: "تم التواصل", en: "Contacted" },
  "admin.orders.status.done": { ar: "تم", en: "Done" },
  "admin.orders.product": { ar: "المنتج", en: "Product" },
  "admin.orders.source": { ar: "المصدر", en: "Source" },
  "admin.orders.date": { ar: "التاريخ", en: "Date" },
  "admin.orders.deleteConfirm": { ar: "حذف هذا الطلب؟", en: "Delete this enquiry?" },
  "admin.settings.title": { ar: "إعدادات المتجر", en: "Shop settings" },
  "admin.settings.nameEn": { ar: "اسم المتجر (إنجليزي)", en: "Shop name (English)" },
  "admin.settings.nameAr": { ar: "اسم المتجر (عربي)", en: "Shop name (Arabic)" },
  "admin.settings.taglineEn": { ar: "الوصف (إنجليزي)", en: "Tagline (English)" },
  "admin.settings.taglineAr": { ar: "الوصف (عربي)", en: "Tagline (Arabic)" },
  "admin.settings.phone": { ar: "الهاتف", en: "Phone" },
  "admin.settings.whatsapp": { ar: "رقم واتساب", en: "WhatsApp number" },
  "admin.settings.addressEn": { ar: "العنوان (إنجليزي)", en: "Address (English)" },
  "admin.settings.addressAr": { ar: "العنوان (عربي)", en: "Address (Arabic)" },
  "admin.settings.hoursEn": { ar: "المواعيد (إنجليزي)", en: "Hours (English)" },
  "admin.settings.hoursAr": { ar: "المواعيد (عربي)", en: "Hours (Arabic)" },
} as const;

export type MsgKey = keyof typeof messages;

type Vars = Record<string, string | number>;

type I18nValue = {
  lang: Lang;
  dir: Dir;
  isAr: boolean;
  t: (key: MsgKey, vars?: Vars) => string;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "dahab-lang";

function interpolate(text: string, vars?: Vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((current) => {
      const next: Lang = current === "ar" ? "en" : "ar";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: MsgKey, vars?: Vars) => interpolate(messages[key][lang], vars),
    [lang],
  );

  const value = useMemo<I18nValue>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", isAr: lang === "ar", t, setLang, toggle }),
    [lang, t, setLang, toggle],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
