# دليل النشر - منصة أم البنين التعليمية

## نظرة عامة
هذا الدليل يوضح كيفية نشر منصة أم البنين التعليمية على مختلف المنصات.

## متطلبات النشر

### متطلبات النظام
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git
- Firebase CLI
- Expo CLI

### حسابات مطلوبة
- حساب Firebase
- حساب Expo
- حساب GitHub (اختياري)

## النشر على Expo

### 1. إعداد Expo
```bash
# تثبيت Expo CLI
npm install -g @expo/cli

# تسجيل الدخول إلى Expo
npx expo login
```

### 2. إعداد المشروع
```bash
# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
```

### 3. بناء المشروع
```bash
# بناء للتطوير
npx expo start

# بناء للإنتاج
npx expo build:android
npx expo build:ios
```

## النشر على Firebase

### 1. إعداد Firebase
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول إلى Firebase
firebase login

# تهيئة المشروع
firebase init
```

### 2. إعداد Firestore
```javascript
// في ملف services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 3. قواعد الأمان
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // قواعد المستخدمين
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }

    // قواعد المواد
    match /subjects/{subjectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // قواعد الرسوم
    match /fees/{feeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## النشر على الويب

### 1. إعداد الويب
```bash
# تثبيت التبعيات للويب
npm install

# بناء للويب
npx expo export:web

# تشغيل خادم محلي
npx serve web-build
```

### 2. نشر على Netlify
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# نشر المشروع
netlify deploy --prod --dir=web-build
```

### 3. نشر على Vercel
```bash
# تثبيت Vercel CLI
npm install -g vercel

# نشر المشروع
vercel --prod
```

## النشر على الأجهزة المحمولة

### Android
```bash
# بناء APK
npx expo build:android

# إنشاء حزمة AAB
npx expo build:android --type app-bundle
```

### iOS
```bash
# بناء IPA
npx expo build:ios

# إنشاء حزمة للاختبار
npx expo build:ios --type simulator
```

## إعدادات الإنتاج

### متغيرات البيئة
```env
EXPO_PUBLIC_API_URL=https://api.um-al-banin.edu
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### إعدادات Firebase
```javascript
// إعدادات الإنتاج
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};
```

## مراقبة الأداء

### Firebase Performance Monitoring
```javascript
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);
```

### Crashlytics
```javascript
import { getAnalytics, logEvent } from 'firebase/analytics';

// تتبع الأحداث
logEvent(analytics, 'screen_view', {
  screen_name: 'AdminDashboard',
  screen_class: 'AdminDashboard'
});
```

## الأمان

### تشفير البيانات
- استخدام HTTPS لجميع الاتصالات
- تشفير البيانات الحساسة في قاعدة البيانات
- تنفيذ مصادقة قوية

### حماية API
- استخدام Firebase App Check
- تنفيذ rate limiting
- مراقبة الوصول غير المصرح به

## النسخ الاحتياطي

### قاعدة البيانات
```bash
# تصدير البيانات
firebase firestore:export backup-data

# استيراد البيانات
firebase firestore:import backup-data
```

### ملفات التكوين
```bash
# نسخ ملفات التكوين
cp app.json app.json.backup
cp package.json package.json.backup
```

## استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في الاتصال بـ Firebase
```
حل: تحقق من إعدادات Firebase ومتغيرات البيئة
```

#### 2. خطأ في البناء
```
حل: مسح cache وإعادة تثبيت التبعيات
npm cache clean --force
rm -rf node_modules
npm install
```

#### 3. مشاكل في الأداء
```
حل: تحسين الصور وتقليل حجم الحزم
```

## الدعم والصيانة

### مراقبة النظام
- مراقبة استخدام الذاكرة
- تتبع الأخطاء والاستثناءات
- مراقبة وقت الاستجابة

### التحديثات
- تحديث التبعيات بانتظام
- مراقبة الثغرات الأمنية
- اختبار التحديثات قبل النشر

## الاتصال بنا

للحصول على الدعم الفني:
- البريد الإلكتروني: dev@um-al-banin.edu
- الهاتف: +966 50 123 4567
- الموقع: https://um-al-banin.edu

---

**فريق تطوير منصة أم البنين التعليمية**
