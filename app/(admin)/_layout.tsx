import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'لوحة التحكم' }} />
      <Stack.Screen name="users" options={{ title: 'إدارة المستخدمين' }} />
      <Stack.Screen name="subjects" options={{ title: 'إدارة المواد' }} />
      <Stack.Screen name="fees" options={{ title: 'إدارة الرسوم' }} />
      <Stack.Screen name="reports" options={{ title: 'التقارير' }} />
      <Stack.Screen name="subjects-statistics" options={{ title: 'إحصائيات المواد' }} />
      <Stack.Screen name="advanced-analytics-phase3" options={{ title: 'التحليلات المتقدمة' }} />
    </Stack>
  );
}
