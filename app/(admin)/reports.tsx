import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Layout, Text, Card, Button, Select, SelectItem } from '@ui-kitten/components';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface ReportData {
  totalUsers: number;
  totalSubjects: number;
  totalFees: number;
  usersByRole: { [key: string]: number };
  subjectsByGrade: { [key: string]: number };
  recentActivities: any[];
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalUsers: 0,
    totalSubjects: 0,
    totalFees: 0,
    usersByRole: {},
    subjectsByGrade: {},
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch users data
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch subjects data
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch fees data
      const feesCollection = collection(db, 'fees');
      const feesSnapshot = await getDocs(feesCollection);
      const fees = feesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Process data
      const usersByRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const subjectsByGrade = subjects.reduce((acc, subject) => {
        acc[subject.grade] = (acc[subject.grade] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      setReportData({
        totalUsers: users.length,
        totalSubjects: subjects.length,
        totalFees: fees.length,
        usersByRole,
        subjectsByGrade,
        recentActivities: []
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
      Alert.alert('خطأ', 'حدث خطأ في جلب بيانات التقارير');
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'teacher': return 'معلم';
      case 'student': return 'طالب';
      case 'guardian': return 'ولي أمر';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'security';
      case 'teacher': return 'school';
      case 'student': return 'person';
      case 'guardian': return 'people';
      default: return 'person';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#E53935';
      case 'teacher': return '#FF9800';
      case 'student': return '#2196F3';
      case 'guardian': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="bar-chart" style={styles.headerIcon} color="#388E3C" size={50} />
        <Text category="h4" style={styles.headerTitle}>
          التقارير والإحصائيات
        </Text>
        <Text category="p2" style={styles.headerSubtitle}>
          نظرة شاملة على بيانات المنصة
        </Text>
      </View>

      <View style={styles.periodSelector}>
        <Select
          style={styles.periodSelect}
          placeholder="اختر الفترة"
          value={selectedPeriod === 'month' ? 'الشهر الحالي' :
                 selectedPeriod === 'quarter' ? 'الربع الحالي' : 'السنة الحالية'}
          onSelect={(index) => {
            const periods = ['month', 'quarter', 'year'];
            setSelectedPeriod(periods[index.row]);
          }}
        >
          <SelectItem title="الشهر الحالي" />
          <SelectItem title="الربع الحالي" />
          <SelectItem title="السنة الحالية" />
        </Select>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text category="h6" style={styles.sectionTitle}>
            ملخص عام
          </Text>
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <MaterialIcons name="people" style={styles.summaryIcon} color="#2196F3" size={30} />
                <View>
                  <Text category="h4" style={styles.summaryNumber}>
                    {reportData.totalUsers}
                  </Text>
                  <Text category="p2" style={styles.summaryLabel}>
                    إجمالي المستخدمين
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <MaterialIcons name="book" style={styles.summaryIcon} color="#4CAF50" size={30} />
                <View>
                  <Text category="h4" style={styles.summaryNumber}>
                    {reportData.totalSubjects}
                  </Text>
                  <Text category="p2" style={styles.summaryLabel}>
                    إجمالي المواد
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <MaterialIcons name="credit-card" style={styles.summaryIcon} color="#FF9800" size={30} />
                <View>
                  <Text category="h4" style={styles.summaryNumber}>
                    {reportData.totalFees}
                  </Text>
                  <Text category="p2" style={styles.summaryLabel}>
                    إجمالي الرسوم
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        {/* Users by Role */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            المستخدمين حسب الدور
          </Text>
          {Object.entries(reportData.usersByRole).map(([role, count]) => (
            <Card key={role} style={styles.statCard}>
              <View style={styles.statItem}>
                <MaterialIcons
                  name={getRoleIcon(role)}
                  style={styles.statIcon}
                  color={getRoleColor(role)}
                  size={25}
                />
                <View style={styles.statInfo}>
                  <Text category="h6" style={styles.statTitle}>
                    {getRoleName(role)}
                  </Text>
                  <Text category="p2" style={styles.statDescription}>
                    {count} مستخدم
                  </Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: getRoleColor(role) }]}>
                  <Text style={styles.statBadgeText}>
                    {count}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Subjects by Grade */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            المواد حسب الصف الدراسي
          </Text>
          {Object.entries(reportData.subjectsByGrade).map(([grade, count]) => (
            <Card key={grade} style={styles.statCard}>
              <View style={styles.statItem}>
                <MaterialIcons name="school" style={styles.statIcon} color="#9C27B0" size={25} />
                <View style={styles.statInfo}>
                  <Text category="h6" style={styles.statTitle}>
                    {grade}
                  </Text>
                  <Text category="p2" style={styles.statDescription}>
                    {count} مادة دراسية
                  </Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: '#9C27B0' }]}>
                  <Text style={styles.statBadgeText}>
                    {count}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7F0',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E8F5E8',
  },
  headerIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#388E3C',
    textAlign: 'center',
  },
  periodSelector: {
    padding: 15,
  },
  periodSelect: {
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  summarySection: {
    padding: 15,
  },
  sectionTitle: {
    color: '#2E7D32',
    marginBottom: 15,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  summaryIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  summaryNumber: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  summaryLabel: {
    color: '#666',
    fontSize: 12,
  },
  section: {
    padding: 15,
  },
  statCard: {
    marginBottom: 10,
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  statIcon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontWeight: '600',
    marginBottom: 3,
  },
  statDescription: {
    color: '#666',
    fontSize: 12,
  },
  statBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    minWidth: 30,
    alignItems: 'center',
  },
  statBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Reports;
