# SaaS Pro (أعمالى برو) — سكريبت المقابلة الكامل

> المرجع: `C:\Users\dell\Desktop\saas-platform` — كل حاجة هنا مأخوذة من الكود الفعلي، مش من الوصف.
> اقرأ الملف مرة، وبعدين راجع **§2 (قصة البناء)** و**§4 (Firebase)** و**§8 (الأسئلة)** قبل الكول.

---

## 0) الـ Pitch — 25 ثانية تفتح بيها

> «أعمالى برو منصة SaaS عربية متعددة الشركات لإدارة الأعمال. نفس النظام بيخدم 11 مجال مختلف — تجارة، مقاولات، عقارات، سوبر ماركت، صيدلية، مطعم، كافيه، أزياء، عيادات، HR — وكل شركة بتشوف وحداتها بس حسب مجاها. مبني بـ React 19 وVite وFirebase: Firestore وAuth وStorage وMessaging، بـ 7 أدوار مستخدمين، و64 collection محمية بقواعد أمان بتعزل كل شركة على بياناتها. المشروع حوالي 75 شاشة و60 ألف سطر، وفيه اختبارات وسكربتات تحقق بتشتغل قبل أي deploy.»

بعدها اسكت. خليهم يسألوا. أول سؤال هيكون «إزاي عملت ده؟» — وده جوابه تحت.

---

## 1) الأرقام اللي تتقال (احفظ 4 منهم)

| الرقم | القيمة |
|---|---|
| الشاشات/الصفحات | ~75 ملف صفحة (43+ route) |
| المجالات (industries) | 11 |
| الأدوار | 7 (+ حالة pending) |
| Firestore match blocks | 64 collection |
| سطور قواعد الأمان | ~1,200 سطر |
| Composite indexes | 56 |
| كود `src` | ~60,000 سطر (بدون tests) |
| اختبارات + أدوات تحقق | 15 test file + 35 سكربت `verify:*` |

**متقولش** رقم مش متأكد منه. لو نسيت: «حوالي 75 شاشة و64 collection» كفاية.

---

## 2) «إزاي عملته؟» — قصة البناء (أهم جزء)

احكيها **بالترتيب** كأنك بتبني رأسيًا، وبتعمّم بعدين. 7 مراحل:

### المرحلة 1 — التأسيس
- `Vite 6 + React 19 + React Router 7`، وتقسيم كل صفحة بـ `React.lazy` + `Suspense` → الـ bundle الأساسي صغير وكل شاشة بتتحمل عند الطلب.
- فصلت الستايلات: `tokens.css` (متغيرات الألوان) + `layout` + `forms-tables` + `responsive` + `print` + `themes` (dark mode). مش ملف CSS واحد عملاق.
- `ErrorBoundary` على مستوى التطبيق + `OfflineBanner` + `PageTracker`.
- **السبب اللي تقوله:** «عشان المشروع هيكبر لـ 70 شاشة، فبدأت بالهيكل مش بالشاشات.»

### المرحلة 2 — الهوية والعزل (Multi-tenancy)
- سجّلت شركة جديدة على مرحلتين: **الأول** `createUserWithEmailAndPassword` (عشان `request.auth` يبقى موجود)، **وبعدين** أكتب مستند `users/{uid}` ومستند `companies/{companyId}`.
  - السبب: لو كتبت Firestore قبل ما الـ Auth يخلص، الـ Rules هترفض لأن `request.auth` لسه null.
- كل مستند في النظام فيه `companyId`. وكل query بيمر على `getScopedQuery()` اللي بتحط `where('companyId','==',userCompanyId)` — والسوبر أدمن هو الوحيد اللي بياخد collection كاملة.
- الشركة بتتسجل بـ `creatorUid` = اللي أنشأها، والـ Rules بتتحقق من ده.

### المرحلة 3 — الأدوار والوحدات
- `utils/modules.js`: خريطة `MODULE_MAP` لكل مجال → قائمة الوحدات، و`getAvailableModules(industry, role, disabledModules, clinicSpecialty)` بترجّع `Set` بالمسموح.
- 3 طبقات حماية: **UI** (السايدبار بيرسم المسموح بس) → **Route** (`ProtectedRoute` + `IndustryRoute`) → **Firestore Rules**.
- **الجملة اللي تقولها:** «الواجهة بتخفي، والرولز بتمنع. مفيش حاجة بتتأمّن في الفرونت إند.»

### المرحلة 4 — الوحدة المالية end-to-end
- الفاتورة document واحد فيه `items[]` (اسم، كمية، سعر، إجمالي) + `amount` + `paidAmount` + `taxAmount/taxRate` + `status` (paid/pending/overdue) — مش collection فرعية لكل سطر (قراءة أرخص وأسرع).
- الحسابات في `utils/` دوال نقية: `revenue.js` (الإيراد، COGS، المرتجعات، الفترة) و`fmt.js` (فلوس/تواريخ/أرقام).
- المخزون بيتخصم **في نفس transaction الفاتورة** (`utils/stock.js` + `POS.js`): قراءة كل الأصناف الأول → تحقق الكمية → خصم → كتابة الفاتورة → ترقيم الأوردر اليومي. كله أو لا شيء.
- المشتريات بتزوّد الكمية وبتحدّث **متوسط التكلفة المتحرك** (`avgCost`) — ودي اللي التقارير بتحسب بيها تكلفة المبيعات.

### المرحلة 5 — السوبر أدمن والاشتراكات
- `companies` فيها: `isActive`, `plan`, `trialEndsAt`, `maxAdmins`, `maxUsers`, `adminsCount`, `usersCount`, `disabledModules`, `features` (زي `customLogo`)، `clinicSpecialty`.
- الاشتراك **يدوي** (بدون بوابة دفع): السوبر أدمن بيفعّل/يوقف وبيحدد السقوف، والتجربة تاريخ للعرض والتنبيه (مفيش إيقاف تلقائي).
- `SuperAdminDashboard` + `ManageUsers` لإدارة كل الشركات، و`disabledModules` بتقفل وحدات لشركة معينة من غير ما تلمس الكود.

### المرحلة 6 — قواعد الأمان (القلب)
- كتبت helper functions مشتركة، وبعدها 64 match block. (التفاصيل في §4.4.)

### المرحلة 7 — التلميع والتشغيل
- i18n عربي/إنجليزي (`translations.js` ~300KB) + RTL كامل + dark mode.
- طباعة: فواتير A4 + إيصالات حرارية 80mm + باركود CODE128 + QR للملف الطبي.
- Excel بـ `xlsx`، وPDF عن طريق **نافذة طباعة HTML** (مش jsPDF) — المتصفح بيحوّلها PDF.
- Offline: `persistentLocalCache` + `persistentMultipleTabManager` + wrappers مقاومة للأوفلاين.
- Push notifications (FCM + service worker)، ErrorBoundary بيرفع الأخطاء لـ `error_reports`، وسجل تدقيق `auditLogs`.
- Backup/Restore: تصدير كل بيانات الشركة JSON + CSV، والاستعادة على دفعات 400 مستند.
- اختبارات Vitest + `npm run verify:all` (35 سكربت: rules, i18n, RTL, a11y, print XSS, CSS، ...).

**الخلاصة اللي تقال:** «بنيت النظام بعمود رأسي: الهوية والعزل → وحدة واحدة كاملة → تعميمها → تشديد القواعد → التشغيل.»

---

## 3) الأدوار — الجدول وإجابة «ليه»

| الدور | بيشوف إيه | القيد المهم |
|---|---|---|
| `super_admin` | كل الشركات + المستخدمين + الاشتراكات | **ممنوع** يشوف بيانات المرضى إلا لو `phiAccess: true` على مستنده |
| `admin` | كل حاجة في شركته | **مش** بيحدد `plan/subscription/trialEndsAt/maxAdmins/maxUsers/disabledModules/features` |
| `user` | التشغيل اليومي | **مش** بيعدّل فواتير/مصروفات بعد إنشائها، ولا أسعار المخزون |
| `doctor` | المرضى، المواعيد، الروشتات، الأسنان/الجلدية حسب التخصص | **مش** بيشوف مصروفات ولا إعدادات الشركة |
| `receptionist` | استقبال + حجز + فواتير + ملف المريض | **مش** مصروفات ولا أعمار ديون |
| `cashier` | POS + عملاء + فواتير | **مش** مخزون ولا تقارير؛ وفي العيادة بيبقى استقبال |
| `kitchen` | شاشة المطبخ | **مش** بيغيّر غير حالة الطلب (`orderStatus`) — لا مبالغ ولا أصناف |
| `pending` | — | status مش role: الحساب متوقف لحد موافقة السوبر أدمن |

**ليه الأدوار دي بالظبط؟** «كل دور جاي من شغل حقيقي في المجال: الكاشير مش محتاج يشوف تكلفة الشراء، والمطبخ مش محتاج يشوف أسعار، والدكتور مش محتاج يشوف مصروفات الشركة. الفصل ده أمان + واجهة أبسط.»

**أهم نقطة تقال:** «فيه أدوار بتتشابه في الاسم بس بتختلف حسب المجال: نفس `cashier` في مطعم = POS، وفي عيادة = استقبال. ده اللي `getAvailableModules` بتعمله بـ `industry` + `clinicSpecialty`.»

---

## 4) Firebase بالتفصيل

### 4.1 Authentication
- **تسجيل على مرحلتين:** Auth أولًا → `users/{uid}`. (السبب فوق.)
- **`assertAccountAllowed` بعد الدخول:** لو المستند `isActive: false` → إيقاف، ولو `status: 'pending'` → رسالة «حسابك منتظر الموافقة»، ولو الشركة موقوفة → خروج فوري. اللي بيتوقف مش بيكمّل.
- **مستمع لحظي:** `onSnapshot` على `users/{uid}` + `onSnapshot` على `companies/{companyId}` → تغيير الدور أو إيقاف الشركة بيسري من غير refresh.
- **حماية من حالة قديمة:** متغير `listeningUid` بيتأكد إن الـ callback اللي وصل مش بتاع مستخدم قديم (بعد logout/login سريع)، و`unsubscribeAllDocs` بينضف الاتنين. (ده كان bug حقيقي: مستند المستخدم القديم كان بيفضل شغال ويكتب role فوق حساب تاني.)
- **إنشاء مستخدم من لوحة الأدمن بدون ما جلسة الأدمن تتغير:** Firebase app تاني (`initializeApp(config,'Secondary')` + `secondaryAuth`) → إنشاء → `signOut(secondaryAuth)`.
- **حذف حساب:** Firebase مش بيسمح بحذف حساب غيرك من المتصفح، فالحل **soft delete**: `isActive=false` + `deletedAt` (الـ Rules بتمنع فورًا) + إيميل إعادة تعيين باسورد عشان الباسورد القديم يبطل.
- **PIN للكاشير:** `pinHash` على مستند المستخدم لفتح الوردية/شاشة البيع السريعة.
- **`loading` guard:** لو شركة/مستخدم اتأخر (نت معلّق)، مؤقت 10 ثواني بينهي التحميل بدل سبينر أبدي.

### 4.2 Firestore — شكل الداتا
- **كل document فيه `companyId`** (عدا `users` و`companies`).
- **الفواتير:** document واحد فيه `items[]` — لأنك بتقرأ الفاتورة كاملة دايمًا، ومحتاجش subcollection لكل سطر.
- **العدادات:** `adminsCount`/`usersCount` على مستند الشركة — لأن **القواعد مش بتعرف تعدّ collection**.
- **الترقيم:** `counters` / `rx_counters` للترقيم المتسلسل (فاتورة/روشتة) بذرّية.
- **التدقيق:** `auditLogs` (مين عمل إيه) + `phi_access_log` (مين فتح سجل طبي) + `error_reports`.
- **الأجهزة:** `fcm_tokens` لتوكن Push لكل مستخدم.
- **الفهارس:** 56 composite index في `firestore.indexes.json` — أي query مركّب ليه index منشور مع الـ rules.

### 4.3 عزل الشركات (أهم إجابة تقنية)
1. **في الكويري:** `getScopedQuery` بتحط `where('companyId','==',userCompanyId)`. السوبر أدمن فقط بياخد الـ collection كلها.
2. **في القواعد:** `resource.data.companyId == userCompanyId()` للقراءة/التعديل، و`request.resource.data.companyId == userCompanyId()` للإنشاء.
3. **منع النقل:** `canUpdateCompanyDoc` بتمنع تغيير `companyId` أثناء التعديل — من غيرها أي حد يقدر ينقل مستند لشركة تانية وياخد صلاحية عليها.
4. **`list` مقفول على `users`:** لأن أي `list` مش بيذكر `resource.data` مش بيفرض شرط على الكويري — فكان ممكن `getDocs(collection('users'))` يرجّع إيميلات كل الشركات.
5. **السوبر أدمن استثناء صريح** في كل دالة — ومعاه استثناء في `userCompanyWasDeleted` عشان ما يتقفلش برّه لو شركته اتمسحت.

### 4.4 Firestore Rules — الهيكل (ده اللي هما عايزين يسمعوه)

**سلسلة الـ helpers:**
```
isLoggedIn()            → request.auth != null
getUserData()           → get(/users/$(request.auth.uid)).data
userCompanyId()         → getUserData().companyId
isAdmin() / isSuperAdmin()
requestingUserIsActive()      → المستخدم مش موقوف
requestingCompanyIsActive()   → الشركة مش موقوفة
userCompanyWasDeleted()       → الشركة موجودة فعلًا
fullyActive()           → التلاتة مع بعض
canCreateForCompany()   → fullyActive && (سوبر أدمن || companyId الجديد = شركتي)
canAccessCompanyDoc()   → fullyActive && (سوبر أدمن || مستند الشركة = شركتي)
canUpdateCompanyDoc()   → + ممنوع تغيير companyId
canDeleteCompanyDoc()   → + isAdmin()
```

**10 قواعد تحكيها كقصة أمان (كل واحدة كانت ثغرة اتقفلت):**

1. **العزل:** كل collection شركة → `canAccessCompanyDoc()`.
2. **دورة الحياة:** `fullyActive()` على كل عملية → إيقاف مستخدم أو شركة بيمنع الوصول **فورًا** حتى من الـ SDK مباشرة.
3. **allowlist للحقول:** `request.resource.data.diff(resource.data).affectedKeys().hasOnly([...])` — مفيش حقول مخفية زي `isSuperAdmin` أو `permissions` تتضاف.
4. **منع نقل الملكية:** `companyId` و`createdBy` ما بيتغيروش.
5. **المالي:** `canUpdateFinancialDoc()` → تعديل فاتورة/مصروف/مرتجع بعد الإنشاء **للأدمن فقط**. الموظف ينشئ لكن ما يعدّلش مبلغ أو يحوّل حالة لـ «مدفوعة».
6. **أسعار المخزون:** `canUpdateInventoryDoc()` → الموظف يعدّل الكمية، لكن `price/costPrice/sellingPrice/purchasePrice` للأدمن بس (عن طريق `affectedKeys().hasAny([...])`).
7. **المطبخ:** `canUpdateOrderStatus()` → بس `orderStatus/itemStatuses/deliveryStatus/driverName/driverPhone`، وبس من قايمة حالات محددة. مش بيلمس المبالغ.
8. **البيانات الطبية (PHI):** `canAccessClinicalDoc()` → لازم **دور سريري** (admin/user/doctor/receptionist). الكاشير والمطبخ ما يقراوش مرضى — **حتى لو فتحوا الكونسول**. والسوبر أدمن محتاج `phiAccess: true` صريح، و`phiAccess` نفسها ما تتغيرش غير بسوبر أدمن.
9. **السقوف (أقوى جزء):** إنشاء مستخدم مسموح بس لو في نفس الـ batch العدّاد اتزود **+1 بالظبط** والنتيجة `<=` السقف:
   ```
   seatAvailable(cid, role) && seatClaimed(cid, role)
   // seatAvailable: getAfter(company).adminsCount <= maxAdmins
   // seatClaimed:   getAfter(...) == get(...) + 1
   ```
   و`counterChangeIsSane` بتمنع القفزات: `+1` أو `−1` بس، والأدمن ما يعدّلش السقف نفسه.
10. **الحذف والقراءة الحساسة:** حذف الشركة للسوبر أدمن بس؛ `auditLogs`/`phi_access_log` قراءة مقيدة؛ `list` على الشركات للسوبر أدمن بس.

**المثال اللي تكتبه لو طلبوا:** (مختصر)
```
match /invoices/{docId} {
  allow get, list: if canAccessCompanyDoc();
  allow create:     if canCreateForCompany();
  allow update:     if canUpdateFinancialDoc() || canUpdateOrderStatus() || canUpdateOpenTab();
  allow delete:     if canDeleteCompanyDoc();
}
```

**جملة تخلص بيها الجزء ده:** «القواعد مش حماية للواجهة — دي الحدود الحقيقية. أي حد معاه الـ config بتاع Firebase يقدر يكلم Firestore مباشرة، فكل القرارات الأمنية لازم تكون في الـ Rules، والداتا اللي القواعد مش بتعرف تحسبها (زي عدد المستخدمين) بتتحوّل لعدّاد على مستند بيتحدّث في transaction.»

### 4.5 السقوف (Seat caps) — لو سألوا «إزاي ضمنت إن محدش يعدّي السقف؟»
- السقوف على مستند الشركة: `maxAdmins` و`maxUsers` (0 = غير محدود).
- الإنشاء بيمر على `createUserSeated()` → `runTransaction`: يقرأ الشركة → يتأكد إن فيه مكان → يكتب المستخدم → يزوّد العدّاد. لو اتنين ضغطوا في نفس اللحظة، واحد بس ينجح.
- الـ Rules بتتحقق من نفس الحكاية (`getAfter`) → العدّاد مش زينة.
- `releaseUserSeat` / `moveUserSeat` بترجّع المقعد عند الحذف/الإيقاف/تغيير الدور/نقل الشركة.
- `resyncCompanySeats` (سوبر أدمن) بيعيد العدّ من مستندات المستخدمين الحقيقية لو العدّاد عمل drift.

### 4.6 أوفلاين
- `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })` → IndexedDB، قراءة/كتابة بدون نت، ومزامنة عند الرجوع، وأكتر من تاب بيتشاركوا الكاش.
- wrappers (`getDocsResilient` / `countResilient`) بترجع للكاش لو النت قطع، و`OfflineBanner` بيوضح الحالة.
- **الحد اللي تقوله:** «الـ transaction مش بتشتغل أوفلاين — عشان كده عمليات البيع والمخزون بترفض تعمل offline وتطلب اتصال.»
- `getCountFromServer` للعدّادات (توفير قراءات) مع fallback للكاش.

### 4.7 Storage + Messaging + Deploy
- **Storage:** بقى محتاج خطة Blaze. عملت fallback تلقائي: لو Storage رجع 402/403 → base64 جوّه Firestore، مع بانر. (وحد Firestore 1MB → الصورة لازم < ~380KB في الوضع ده.)
- **Messaging:** `getToken` + VAPID + `fcm_tokens` + service worker موحّد في الإنتاج، وحدث `pushNotification` للـ foreground.
- **Deploy:** Vercel للفرونت (`vercel.json`)، و`npm run deploy:rules` / `deploy:indexes` / `deploy:storage` للـ backend config. مفاتيح Firebase من `import.meta.env` بس — مفيش مفاتيح في الكود.
- **Emulators:** `npm run emulators` (Firestore + Auth + Storage) للتجربة قبل النشر.

---

## 5) منطق الأعمال — إجابات «إزاي» السريعة

| السؤال | الإجابة |
|---|---|
| الفاتورة بتتحسب إزاي؟ | `items[]` (كمية × سعر) → `amount`، ثم `paidAmount` و`remaining = amount − paid`، و`taxAmount` لو `taxRate > 0`، و`status` حسب السداد/الاستحقاق. الحساب في `utils` مش في الـ JSX. |
| المخزون بيتخصم إمتى؟ | في **نفس transaction** الفاتورة: قراءة → تحقق → خصم → كتابة. لو الكمية أقل → رسالة عربية ومنع البيع. |
| تكلفة المبيعات (COGS)؟ | من `avgCost` المتحرك اللي بيتحدّث مع كل شراء، والمرتجعات بتتخصم. `computePeriod` بترجّع الإيراد − التكلفة − المصروفات. |
| مطعم: الطبق بيخصم إيه؟ | الوصفة (`recipe[]` على الصنف) → بتخصم **الخامات** مش الصنف نفسه. |
| الصلاحية (expiry)؟ | دفعات (batches) + خصم **FEFO** (الأقرب انتهاءً الأول) في نفس transaction البيع. |
| ترقيم الأوردر اليومي؟ | عدّاد `counters` بيتقرأ ويتزوّد في الـ transaction → مفيش رقم مكرر من جهازين. |
| طاولة مفتوحة اتحصّلت مرتين؟ | الـ transaction بتقرأ الفاتورة وتتأكد إن `tabStatus == 'open'` قبل التحصيل. |
| PDF؟ | نافذة HTML + `window.print()` → المستخدم يحفظ PDF من المتصفح (عربي RTL كامل، Cairo font). **مش jsPDF** — صحّح ده لو قالوه. |
| Excel؟ | `xlsx` (SheetJS): `json_to_sheet` + `writeFile`. |
| الباركود/QR؟ | CODE128 بـ JsBarcode في نافذة الطباعة، وQR بـ `qrcode` لملف المريض/الزيارة. |
| النسخ الاحتياطي؟ | تصدير JSON + CSV لكل collection، والاستعادة على دفعات 400 مستند، و`companyId` بيتفرض على كل سجل → مستحيل نسخة شركة تتكتب في شركة تانية. |
| اختبارات؟ | Vitest + jsdom لحسابات حساسة (revenue, returns, stock, invoice helpers, rules smoke) + 35 سكربت تحقق (i18n, RTL, a11y, print XSS, CSS, indexes). |

---

## 6) نقاط القوة — قول 4 بس (متقولش كل حاجة)
1. **عزل multi-tenant على مستوى القواعد**، مش إخفاء في الواجهة.
2. **سقوف ذرّية** بـ transaction + قواعد بتتحقق من نفس العدّاد.
3. **نفس الكود يخدم 11 مجال** بخريطة وحدات + `disabledModules` لكل شركة.
4. **جاهز للواقع:** أوفلاين، عربي/RTL، طباعة حرارية، Excel، باك أب.
5. **انضباط تسليم:** 35 سكربت تحقق + قواعد منشورة مع كل release + README تشغيل كامل.

---

## 7) القيود — قولها بثقة (دي علامة سينيور)

| القيد | الصياغة |
|---|---|
| مفيش Cloud Functions | «الحذف الحقيقي لحساب Firebase مستحيل من المتصفح، فاستخدمت soft delete + إعادة تعيين باسورد. لو المشروع كبر هضيف Cloud Function للحذف والإشعارات المجدولة.» |
| مفيش بوابة دفع | «الاشتراك يدوي بقصد في النسخة دي. Stripe/Paymob محتاج backend + webhook، مش نطاق الحالي.» |
| مفيش App Check | «دي الخطوة الجاية قبل الإنتاج الموسّع، مع rate limiting.» |
| عدّادات بدل count | «Rules مش بتعدّ collection — فبخزّن العدّاد وأزامنه في transaction، وفيه زر resync.» |
| مفيش TypeScript كامل | «فيه `tsconfig` وJSDoc types على الـ utils الحرجة، والترحيل تدريجي — مش هقول إني TS في المشروع ده.» |
| تغطية اختبارات جزئية | «الاختبارات مركّزة على الحسابات المالية والمخزون، مش UI coverage كاملة.» |
| 1MB doc | «الـ base64 fallback ليه حد ~380KB، والحل الصح Storage على Blaze.» |

---

## 8) الأسئلة المتوقعة — وإجاباتك

**1. «ليه Firebase مش Node/Postgres؟»**
> «لأن المنتج B2B صغير/متوسط ومحتاج realtime + auth + hosting بسرعة، وFirebase بيغطيهم كلهم بأمان acceptable لو القواعد مكتوبة صح. الثمن إن مفيش server logic، فحوّلت كل القواعد الممكنة لـ Security Rules وحسبت الباقي في transactions. لما احتاج مدفوعات أو تقارير تقيلة هضيف backend.»

**2. «إزاي بتعزل شركة عن شركة؟»** → §4.3 (companyId + getScopedQuery + Rules + منع النقل).

**3. «إزاي ضمنت السقوف؟»** → §4.5.

**4. «كاشير يقدر يشوف مرضى من الكونسول؟»**
> «لأ. `canAccessClinicalDoc` بتشترط دور سريري، والكاشير مش منهم. ودي كانت ثغرة فعلية: العزل كان بالشركة بس، فأي حساب جوه الشركة كان يقدر يقرأ المرضى. صلّحتها بفحص الدور جوه القاعدة، مش في الواجهة.»

**5. «إزاي بتختبر Rules؟»**
> «سكربت `verify:rules` بيتأكد إن القواعد متسقة وبتتنشر، وفيه اختبارات smoke للصفحات، والاختبارات الحسابية بـ Vitest. للـ Rules نفسها الأفضل emulator + @firebase/rules-unit-testing — دي الحاجة اللي هضيفها.»

**6. «إزاي منعت تلاعب موظف في فاتورة مدفوعة؟»**
> «`canUpdateFinancialDoc` بتسمح بالتعديل للأدمن بس بعد الإنشاء، و`canUpdateInventoryDoc` بتمنع تغيير أي حقل سعر لغير الأدمن. الموظف ينشئ، مش يعدّل.»

**7. «إزاي بتتعامل مع الأداء؟»**
> «Lazy load لكل صفحة، فهارس مركّبة لكل query، `getCountFromServer` بدل تحميل الدوكيومنتس للعد، pagination بـ `startAfter` مع cursor (مش offset)، وقراءة المخزون محليًا بعد البيع بدل إعادة تحميل كل الأصناف.»

**8. «إزاي PDF بالعربي؟»**
> «ببني HTML كامل بـ RTL وخط Cairo، وأفتحه في نافذة وأطبع. المتصفح بيعمل الـ PDF. كده العربية مضمونة 100% وبلا مكتبة PDF بتكسر التشكيل. (لو احتجت PDF مبرمج هاستخدم jsPDF + خط عربي مضمّن.)»

**9. «إيه أكبر مشكلة تقنية قابلتك؟»** — اختار واحدة من دول وقولها كقصة:
   - **تسريب الصلاحيات بين جلسات:** listener قديم على مستند مستخدم سابق بيفضل شغال بعد logout، بيكتب role/companyId فوق حساب جديد. الحل: `listeningUid` + إلغاء كل الـ listeners عند تغيير المستخدم.
   - **قفل السوبر أدمن برّه:** قاعدة `fullyActive` كانت بتمنعه من صفحة المستخدمين لو شركته اتمسحت → استثناء صريح + اختبار.
   - **السقوف:** check برّه transaction بيسمح بتجاوز السقف لما اتنين يضغطوا مع بعض → transaction + قواعد `getAfter`.
   - **البيع بالسالب:** التحقق قبل الـ transaction مش كفاية → إعادة قراءة وتحقق جوه الـ transaction.
   (اختار اللي إنت فاهمه أكتر، وقول: العَرَض → إزاي عرفت → الحل → إزاي منعت التكرار.)

**10. «لو المنصة بقت 1000 شركة؟»**
> «الفرونت ثابت على Vercel، والـ Firestore بيتوسّع أفقيًا. اللي هيتغير: فهارس أكتر، تقارير ثقيلة تروح BigQuery/Cloud Functions، وApp Check + مراقبة تكلفة. العدّادات هتتحول لحسابات مجمّعة مجدولة لو الأرقام كبرت.»

**11. «إيه اللي ناقص؟»** → §7.

**12. «إنت عملت المشروع ده لوحدك؟»**
> «أنا اللي كتبت الكود بالكامل: البنية، الـ Rules، الوحدات، الطباعة، الاختبارات. استخدامي للأدوات (بما فيها AI) في الـ debugging والتوثيق، والقرارات المعمارية والـ testing عليا.»
> ⚠️ **لو مش إنت اللي كتبته، متقولش الجملة دي.** قول دورك الحقيقي بالظبط — ده أهم من أي إجابة تقنية.

---

## 9) خطة الديمو — 3 دقايق (جرّبها قبل الكول)

**قبل الكول (إلزامي):**
- اعمل حساب شركة ديمو على Vercel بحاجة بسيطة (فاتورة + منتجين) **وجرّب المسار كامل** — متكتشفش إن الداتا فاضية على الهوا.
- `/demo` صفحة عامة ببيانات وهمية لكل مجال — **استخدمها كأول 20 ثانية** لو الدخول اتأخر أو النت فصل.
- جهّز تابين: تاب الأدمن، وتاب `super_admin` (أو نافذة incognito).

**الترتيب:**
1. `/demo` → «دي معاينة لكل مجال» (20 ث).
2. Login كأدمن → داشبورد → «الأرقام دي من Firestore مباشرة».
3. فاتورة جديدة (صنفين) → حفظ → **اطبع** (تظهر العربية RTL) → رجّع للمخزون: «الكمية نقصت في نفس الـ transaction» (40 ث).
4. المستخدمين → غيّر/اعرض دور **كاشير** → السايدبار بيقص → «نفس الحساب مش شايف المخزون ولا التقارير» (30 ث).
5. أدمن الشركة → لوحة **السوبر أدمن** → شركة → السقوف + التجربة + `disabledModules` → «أقفل موديول لشركة من غير deploy» (30 ث).
6. اقفل بـ `firestore.rules`: «كل اللي شوفته محمي هنا — 1,200 سطر» (20 ث).

**قاعدة:** متعملش live coding. لو طلبوا، قول «أفضل أوريك الملف على الشاشة وأشرحه» — أسرع وأأمن.

---

## 10) تصحيحات مهمة قبل ما تتكلم
1. **مفيش Node.js في المشروع ده** — هو client + Firebase. متقولش Node في سياق SaaS Pro.
2. **PDF مش jsPDF** — هو HTML + `window.print()`. (الـ README القديم فيه غلطة.)
3. **Firebase 60% في البورتفليو غلط** — المشروع ده Firebase فيه Auth + Firestore + Storage + Messaging + Rules + Indexes + Emulators. خليها 80–85% واشرح الحدود (مفيش Cloud Functions / App Check).
4. **مفيش TypeScript كامل** — متقولش «المشروع TypeScript».
5. **الـ SaaS مش multi-tenant بالـ subdomain** — العزل منطقي بـ `companyId` في نفس المشروع. لو سألوا: «ده اختيار متعمد: onboarding أسرع وتكلفة أقل، والعزل في القواعد. Subdomain/DB-per-tenant ممكن لو عميل enterprise طلبه.»

---

## 11) ورقة أخيرة — 6 جمل تحفظهم حرفيًا
1. «منصة SaaS متعددة الشركات، 11 مجال، 7 أدوار، 64 collection محمية بقواعد.»
2. «العزل بالـ `companyId` في الكويري وفي الـ Rules — والواجهة مش خط دفاع.»
3. «السقوف بتتحجز في transaction، والقواعد بتتحقق من العدّاد بـ `getAfter` — مفيش تجاوز.»
4. «البيانات الطبية بدور سريري فقط، والسوبر أدمن محتاج تصريح `phiAccess` صريح.»
5. «الفاتورة والمخزون في نفس الـ transaction — مفيش بيع بكمية مش موجودة ولا رصيد سالب.»
6. «اللي ناقص عندي بوضوح: Cloud Functions وApp Check وبوابة دفع — وكل واحدة ليها خطة.»
