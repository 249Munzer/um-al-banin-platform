import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider } from 'native-base';

export default function ParentDashboard() {
  return (
    <NativeBaseProvider>
      <ScrollView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Ionicons name="school" size={24} color="#FBC02D" />
          <Text style={styles.title}>لوحة ولي الأمر</Text>
          <View style={styles.topIcons}>
            <TouchableOpacity>
              <Ionicons name="notifications" size={24} color="#212121" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }}>
              <Ionicons name="log-out" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>اسم الطالب: أحمد</Text>
          <Text style={styles.summaryText}>الصف: الثالث</Text>
          <Text style={styles.summaryText}>نسبة الإنجاز: 75%</Text>
          <Text style={styles.summaryText}>واجبات معلقة: 2</Text>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأداء</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>عرض التفاصيل</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الجدول</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>إضافة تذكير</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التواصل</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>طلب اجتماع</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأخبار</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>قراءة المزيد</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>دخول الطالب</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>دخول كطالب</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summary: {
    backgroundColor: '#FFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
