# دليل التكامل - منصة أم البنين التعليمية

## نظرة عامة
هذا الدليل يوضح كيفية تكامل منصة أم البنين التعليمية مع أنظمة خارجية وخدمات ثالثة.

## تكامل قاعدة البيانات

### Firebase Integration
```javascript
// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// استخدام في المكونات
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return data;
};
```

### MongoDB Integration (اختياري)
```javascript
// services/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
```

## تكامل المصادقة

### Firebase Authentication
```javascript
// services/auth.js
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
```

### Google OAuth
```javascript
// components/GoogleSignIn.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'your-web-client-id',
  offlineAccess: true,
});

const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    throw error;
  }
};
```

## تكامل الدفع

### Stripe Integration
```javascript
// services/stripe.js
import { StripeProvider } from '@stripe/stripe-react-native';

const StripeIntegration = () => {
  return (
    <StripeProvider
      publishableKey="pk_test_your_publishable_key"
      merchantIdentifier="merchant.com.umalbanin"
    >
      {/* باقي المكونات */}
    </StripeProvider>
  );
};

export const createPaymentIntent = async (amount, currency) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency }),
  });
  return response.json();
};
```

### PayPal Integration
```javascript
// services/paypal.js
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalIntegration = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: "10.00" },
            }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            console.log('Transaction completed by ' + details.payer.name.given_name);
          });
        }}
      />
    </PayPalScriptProvider>
  );
};
```

## تكامل الإشعارات

### Firebase Cloud Messaging
```javascript
// services/notifications.js
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    return getFCMToken();
  }
};

export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    Alert.alert('إشعار جديد', remoteMessage.notification?.body);
  });
};
```

### OneSignal Integration
```javascript
// services/onesignal.js
import OneSignal from 'react-native-onesignal';

OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("your-onesignal-app-id");

OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  let notification = notificationReceivedEvent.getNotification();
  notificationReceivedEvent.complete(notification);
});

OneSignal.setNotificationOpenedHandler(result => {
  console.log('OneSignal: notification opened:', result);
});
```

## تكامل وسائل التواصل الاجتماعي

### Facebook SDK
```javascript
// services/facebook.js
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export const facebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    return data.accessToken.toString();
  } catch (error) {
    throw error;
  }
};
```

### Twitter Integration
```javascript
// services/twitter.js
import { authorize } from 'react-native-app-auth';

const twitterConfig = {
  issuer: 'https://twitter.com',
  clientId: 'your-twitter-client-id',
  redirectUrl: 'com.umalbanin://oauth',
  scopes: ['openid', 'profile', 'email'],
};

export const twitterLogin = async () => {
  try {
    const result = await authorize(twitterConfig);
    return result.accessToken;
  } catch (error) {
    throw error;
  }
};
```

## تكامل التحليلات

### Google Analytics
```javascript
// services/analytics.js
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

export const logScreenView = (screenName) => {
  logEvent(analytics, 'screen_view', {
    screen_name: screenName,
    screen_class: screenName,
  });
};

export const logCustomEvent = (eventName, parameters) => {
  logEvent(analytics, eventName, parameters);
};

export const logUserAction = (action, details) => {
  logEvent(analytics, 'user_action', {
    action: action,
    details: details,
    timestamp: new Date().toISOString(),
  });
};
```

### Mixpanel Integration
```javascript
// services/mixpanel.js
import Mixpanel from 'react-native-mixpanel';

Mixpanel.sharedInstanceWithToken('your-mixpanel-token');

export const trackEvent = (eventName, properties) => {
  Mixpanel.track(eventName, properties);
};

export const trackUser = (userId, properties) => {
  Mixpanel.identify(userId);
  Mixpanel.people.set(properties);
};

export const trackRevenue = (amount, properties) => {
  Mixpanel.trackCharge(amount, properties);
};
```

## تكامل التخزين السحابي

### AWS S3 Integration
```javascript
// services/s3.js
import { RNS3 } from 'react-native-aws3';

const s3Config = {
  keyPrefix: 'uploads/',
  bucket: 'umalbanin-bucket',
  region: 'us-east-1',
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key',
  successActionStatus: 201,
};

export const uploadToS3 = async (file) => {
  try {
    const response = await RNS3.put(file, s3Config);
    if (response.status !== 201) {
      throw new Error('Failed to upload image to S3');
    }
    return response.body.postResponse.location;
  } catch (error) {
    throw error;
  }
};
```

### Cloudinary Integration
```javascript
// services/cloudinary.js
import { Cloudinary } from 'react-native-cloudinary';

Cloudinary.init({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
});

export const uploadToCloudinary = async (imageUri) => {
  try {
    const response = await Cloudinary.upload(imageUri, {
      upload_preset: 'your-upload-preset',
    });
    return response.secure_url;
  } catch (error) {
    throw error;
  }
};
```

## تكامل الخرائط

### Google Maps Integration
```javascript
// components/MapView.js
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const SchoolMap = () => {
  const [region, setRegion] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      onRegionChangeComplete={setRegion}
    >
      <Marker
        coordinate={{ latitude: 24.7136, longitude: 46.6753 }}
        title="منصة أم البنين التعليمية"
        description="المقر الرئيسي"
      />
    </MapView>
  );
};
```

## تكامل التقويم

### Google Calendar Integration
```javascript
// services/calendar.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const addToGoogleCalendar = async (event) => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const calendarEvent = {
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
    };

    // إضافة الحدث إلى التقويم
    const result = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userInfo.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calendarEvent),
    });

    return result.json();
  } catch (error) {
    throw error;
  }
};
```

## استكشاف الأخطاء

### مشاكل التكامل الشائعة

#### 1. مشاكل Firebase
```
حل: تحقق من إعدادات المشروع ومفاتيح API
```

#### 2. مشاكل المصادقة
```
حل: تحقق من إعدادات OAuth وصلاحيات التطبيق
```

#### 3. مشاكل الدفع
```
حل: تحقق من إعدادات Stripe/PayPal ومفاتيح API
```

## الأمان والخصوصية

### تشفير البيانات
- استخدام HTTPS لجميع الاتصالات
- تشفير البيانات الحساسة
- تنفيذ مصادقة قوية

### حماية API
- استخدام API keys آمنة
- تنفيذ rate limiting
- مراقبة الوصول غير المصرح به

## الاختبار

### اختبار التكامل
```javascript
// tests/integration.test.js
describe('Integration Tests', () => {
  test('Firebase connection', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
  });

  test('Authentication flow', async () => {
    const user = await signIn('test@example.com', 'password');
    expect(user).toBeDefined();
  });
});
```

## الدعم والصيانة

### مراقبة التكامل
- مراقبة حالة الخدمات الخارجية
- تتبع الأخطاء والاستثناءات
- تحديث مفاتيح API بانتظام

### التحديثات
- تحديث SDKs بانتظام
- مراقبة الثغرات الأمنية
- اختبار التحديثات قبل النشر

## الاتصال بنا

للحصول على الدعم الفني:
- البريد الإلكتروني: integration@um-al-banin.edu
- الهاتف: +966 50 123 4567
- الموقع: https://um-al-banin.edu

---

**فريق التطوير والتكامل**
**منصة أم البنين التعليمية**
