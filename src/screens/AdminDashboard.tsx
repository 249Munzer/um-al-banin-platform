import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider, Box, VStack, HStack, Center, Avatar, Badge } from 'native-base';

export default function AdminDashboard() {
  return (
    <NativeBaseProvider>
      <ScrollView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Ionicons name="school" size={24} color="#FBC02D" />
          <Text style={styles.title}>لوحة الإدارة</Text>
          <View style={styles.topIcons}>
            <TouchableOpacity>
              <Ionicons name="notifications" size={24} color="#212121" />
              <Badge style={styles.badge}>3</Badge>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }}>
              <Ionicons name="log-out" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summary}>
          <View style={styles.card}>
            <Ionicons name="people" size={32} color="#2196F3" />
            <Text style={styles.cardText}>عدد الطلاب</Text>
            <Text style={styles.cardNumber}>50+</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="person" size={32} color="#4CAF50" />
            <Text style={styles.cardText}>عدد المعلمين</Text>
            <Text style={styles.cardNumber}>10+</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="home" size={32} color="#FBC02D" />
            <Text style={styles.cardText}>أولياء الأمور</Text>
            <Text style={styles.cardNumber}>40+</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="school" size={32} color="#2E7D32" />
            <Text style={styles.cardText}>الصفوف</Text>
            <Text style={styles.cardNumber}>5+</Text>
          </View>
        </View>

        {/* Sub-sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إدارة المستخدمين</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>إضافة مستخدم</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إعداد المناهج</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>إضافة درس</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التقارير</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>عرض التقارير</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإعدادات</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>تخصيص</Text>
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#D32F2F',
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    width: '45%',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    color: '#212121',
    marginTop: 8,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
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
