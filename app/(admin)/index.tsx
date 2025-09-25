import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Layout, Text, Card, Button, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useFonts } from 'expo-font';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalGuardians: 0
  });

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  });

  const [selectedAge, setSelectedAge] = useState(new IndexPath(0));
  const [selectedClass, setSelectedClass] = useState(new IndexPath(0));

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data());

      const students = users.filter(user => user.role === 'student').length;
      const teachers = users.filter(user => user.role === 'teacher').length;
      const guardians = users.filter(user => user.role === 'guardian').length;

      setStats({
        totalUsers: usersSnapshot.size,
        totalStudents: students,
        totalTeachers: teachers,
        totalGuardians: guardians
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };



  if (!fontsLoaded) {
    return <Layout style={styles.container}><Text>Loading...</Text></Layout>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <MaterialIcons name="school" size={32} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>أم البنين - الإدارة</Text>
                <Text style={styles.headerSubtitle}>مرحباً بك في لوحة التحكم</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>أد</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>مرحباً بك في نظام أم البنين</Text>
          <Text style={styles.welcomeSubtitle}>إدارة شاملة لمتابعة تقدم الطلاب والمعلمين</Text>
          <View style={styles.welcomeButtons}>
            <Button style={styles.addButton} onPress={() => router.push('/(admin)/students')}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>إضافة طالب جديد</Text>
              </View>
            </Button>
            <Button style={styles.viewButton} appearance="outline" onPress={() => router.push('/(admin)/reports')}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="visibility" size={16} color="#667eea" />
                <Text style={styles.viewButtonText}>عرض التقارير</Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View>
                <Text style={styles.statLabel}>إجمالي الطلاب</Text>
                <Text style={styles.statNumber}>{stats.totalStudents}</Text>
                <View style={styles.statTrend}>
                  <MaterialIcons name="trending-up" size={16} color="#10B981" />
                  <Text style={styles.trendText}>+12% من الشهر الماضي</Text>
                </View>
              </View>
              <View style={styles.statIcon}>
                <MaterialIcons name="people" size={24} color="#3B82F6" />
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View>
                <Text style={styles.statLabel}>المعلمين النشطين</Text>
                <Text style={styles.statNumber}>{stats.totalTeachers}</Text>
                <View style={styles.statTrend}>
                  <MaterialIcons name="access-time" size={16} color="#3B82F6" />
                  <Text style={styles.trendText}>18 متصل الآن</Text>
                </View>
              </View>
              <View style={styles.statIcon}>
                <MaterialIcons name="school" size={24} color="#10B981" />
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View>
                <Text style={styles.statLabel}>معدل الحضور</Text>
                <Text style={styles.statNumber}>94.2%</Text>
                <View style={styles.statTrend}>
                  <MaterialIcons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.trendText}>أداء ممتاز</Text>
                </View>
              </View>
              <View style={styles.statIcon}>
                <MaterialIcons name="trending-up" size={24} color="#F59E0B" />
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <View>
                <Text style={styles.statLabel}>الأنشطة المكتملة</Text>
                <Text style={styles.statNumber}>1,247</Text>
                <View style={styles.statTrend}>
                  <MaterialIcons name="calendar-today" size={16} color="#8B5CF6" />
                  <Text style={styles.trendText}>هذا الأسبوع</Text>
                </View>
              </View>
              <View style={styles.statIcon}>
                <MaterialIcons name="check-circle" size={24} color="#8B5CF6" />
              </View>
            </View>
          </Card>
        </View>

        {/* Enhanced Chart and Analytics */}
        <View style={styles.chartSection}>
          <Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>تقرير الحضور الأسبوعي</Text>
                <Text style={styles.chartSubtitle}>نظرة عامة على أداء الطلاب</Text>
              </View>
              <Button style={styles.exportButton} appearance="outline" size="small">
                <View style={styles.buttonContent}>
                  <MaterialIcons name="download" size={16} color="#6B7280" />
                  <Text style={styles.exportText}>تصدير</Text>
                </View>
              </Button>
            </View>
            <View style={styles.chartContent}>
              {[
                { day: 'السبت', value: 92 },
                { day: 'الأحد', value: 88 },
                { day: 'الإثنين', value: 95 },
                { day: 'الثلاثاء', value: 90 },
                { day: 'الأربعاء', value: 97 },
              ].map((item, index) => (
                <View key={item.day} style={styles.progressRow}>
                  <Text style={styles.dayText}>{item.day}</Text>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${item.value}%` }]} />
                  </View>
                  <Text style={styles.valueText}>{item.value}%</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.filtersCard}>
            <Text style={styles.filtersTitle}>الفلاتر السريعة</Text>
            <View style={styles.filtersContent}>
              <Select
                style={styles.select}
                placeholder="اختر الفئة العمرية"
                value={ageOptions[selectedAge.row]}
                selectedIndex={selectedAge}
                onSelect={(index) => setSelectedAge(Array.isArray(index) ? index[0] : index)}
              >
                <SelectItem title="3-4 سنوات (روضة أولى)" />
                <SelectItem title="4-5 سنوات (روضة ثانية)" />
                <SelectItem title="5-6 سنوات (تمهيدي)" />
              </Select>

              <Select
                style={styles.select}
                placeholder="اختر الفصل"
                value={classOptions[selectedClass.row]}
                selectedIndex={selectedClass}
                onSelect={(index) => setSelectedClass(Array.isArray(index) ? index[0] : index)}
              >
                <SelectItem title="الفصل الأول" />
                <SelectItem title="الفصل الثاني" />
                <SelectItem title="الفصل الثالث" />
              </Select>

              <Button style={styles.applyButton}>
                <View style={styles.buttonContent}>
                  <MaterialIcons name="filter-list" size={16} color="#FFFFFF" />
                  <Text style={styles.applyText}>تطبيق الفلتر</Text>
                </View>
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

const ageOptions = [
  "3-4 سنوات (روضة أولى)",
  "4-5 سنوات (روضة ثانية)",
  "5-6 سنوات (تمهيدي)"
];

const classOptions = [
  "الفصل الأول",
  "الفصل الثاني",
  "الفصل الثالث"
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#6366F1',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerGradient: {
    backgroundColor: '#6366F1',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Poppins-Regular',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    padding: 24,
  },
  welcomeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  welcomeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
  },
  viewButton: {
    borderColor: '#6366F1',
  },
  viewButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: (Dimensions.get('window').width - 72) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Poppins-Medium',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
    fontFamily: 'Poppins-Bold',
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartSection: {
    flexDirection: 'row',
    gap: 24,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    flex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Poppins-SemiBold',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  exportButton: {
    borderColor: '#D1D5DB',
  },
  exportText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
  },
  chartContent: {
    gap: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dayText: {
    width: 60,
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Poppins-Medium',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  valueText: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
    fontFamily: 'Poppins-SemiBold',
  },
  filtersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  filtersContent: {
    gap: 16,
  },
  select: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
  },
});

export default AdminDashboard;
