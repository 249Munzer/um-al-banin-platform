import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Layout, Text, Card, Button, Icon, Select, SelectItem } from '@ui-kitten/components';
import { db } from '../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface SubjectStats {
  totalSubjects: number;
  subjectsByGrade: { [key: string]: number };
  subjectsByTeacher: { [key: string]: number };
  averageSubjectsPerGrade: number;
  mostActiveGrade: string;
  subjectsWithoutTeacher: number;
}

const SubjectStatistics = () => {
  const [stats, setStats] = useState<SubjectStats>({
    totalSubjects: 0,
    subjectsByGrade: {},
    subjectsByTeacher: {},
    averageSubjectsPerGrade: 0,
    mostActiveGrade: '',
    subjectsWithoutTeacher: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('all');

  useEffect(() => {
    fetchSubjectStats();
  }, []);

  const fetchSubjectStats = async () => {
    try {
      setLoading(true);

      // Fetch subjects data
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Process statistics
      const subjectsByGrade = subjects.reduce((acc, subject) => {
        acc[subject.grade] = (acc[subject.grade] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const subjectsByTeacher = subjects.reduce((acc, subject) => {
        const teacherName = subject.teacherName || 'غير محدد';
        acc[teacherName] = (acc[teacherName] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const subjectsWithoutTeacher = subjects.filter(subject => !subject.teacherId).length;

      const grades = Object.keys(subjectsByGrade);
      const averageSubjectsPerGrade = grades.length > 0 ? subjects.length / grades.length : 0;

      const mostActiveGrade = grades.reduce((prev, current) => {
        return subjectsByGrade[prev] > subjectsByGrade[current] ? prev : current;
      }, grades[0] || '');

      setStats({
        totalSubjects: subjects.length,
        subjectsByGrade,
        subjectsByTeacher,
        averageSubjectsPerGrade,
        mostActiveGrade,
        subjectsWithoutTeacher
      });

    } catch (error) {
      console.error('Error fetching subject statistics:', error);
      Alert.alert('خطأ', 'حدث خطأ في جلب إحصائيات المواد');
    } finally {
      setLoading(false);
    }
  };

  const grades = [
    'جميع الصفوف',
    'الصف الأول',
    'الصف الثاني',
    'الصف الثالث',
    'الصف الرابع',
    'الصف الخامس',
    'الصف السادس',
    'الصف السابع',
    'الصف الثامن',
    'الصف التاسع',
    'الصف العاشر',
    'الصف الحادي عشر',
    'الصف الثاني عشر'
  ];

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Icon name="trending-up-outline" style={styles.headerIcon} fill="#388E3C" />
        <Text category="h4" style={styles.headerTitle}>
          إحصائيات المواد الدراسية
        </Text>
        <Text category="p2" style={styles.headerSubtitle}>
          تحليل مفصل للمواد والمناهج
        </Text>
      </View>

      <View style={styles.filterSection}>
        <Select
          style={styles.gradeSelect}
          placeholder="اختر الصف الدراسي"
          value={selectedGrade === 'all' ? 'جميع الصفوف' : selectedGrade}
          onSelect={(index) => {
            setSelectedGrade(index.row === 0 ? 'all' : grades[index.row]);
          }}
        >
          {grades.map((grade, index) => (
            <SelectItem key={index} title={grade} />
          ))}
        </Select>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text category="h6" style={styles.sectionTitle}>
            ملخص إحصائي
          </Text>
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Icon name="book-outline" style={styles.summaryIcon} fill="#2196F3" />
                <View>
                  <Text category="h4" style={styles.summaryNumber}>
                    {stats.totalSubjects}
                  </Text>
                  <Text category="p2" style={styles.summaryLabel}>
                    إجمالي المواد
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Icon name="school-outline" style={styles.summaryIcon} fill="#4CAF50" />
                <View>
                  <Text category="h4" style={styles.summaryNumber}>
                    {Object.keys(stats.subjectsByGrade).length}
                  </Text>
                  <Text category="p2" style={styles.summaryLabel}>
                    عدد الصفوف
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Icon name="alert-circle-outline" style={styles.summaryIcon} fill="#FF9800" />
                <View>
                  <Text category="h4" style={styles.summaryNumber}>
                    {stats.subjectsWithoutTeacher}
                  </Text>
                  <Text category="p2" style={styles.summaryLabel}>
                    بدون معلم
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        {/* Subjects by Grade */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            توزيع المواد حسب الصف الدراسي
          </Text>
          {Object.entries(stats.subjectsByGrade).map(([grade, count]) => (
            <Card key={grade} style={styles.statCard}>
              <View style={styles.statItem}>
                <Icon name="book-open-outline" style={styles.statIcon} fill="#9C27B0" />
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

        {/* Subjects by Teacher */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            توزيع المواد حسب المعلم
          </Text>
          {Object.entries(stats.subjectsByTeacher).map(([teacher, count]) => (
            <Card key={teacher} style={styles.statCard}>
              <View style={styles.statItem}>
                <Icon name="person-outline" style={styles.statIcon} fill="#E91E63" />
                <View style={styles.statInfo}>
                  <Text category="h6" style={styles.statTitle}>
                    {teacher}
                  </Text>
                  <Text category="p2" style={styles.statDescription}>
                    {count} مادة دراسية
                  </Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: '#E91E63' }]}>
                  <Text style={styles.statBadgeText}>
                    {count}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Additional Statistics */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            إحصائيات إضافية
          </Text>
          <Card style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text category="p1" style={styles.infoLabel}>
                المتوسط لكل صف دراسي:
              </Text>
              <Text category="h6" style={styles.infoValue}>
                {stats.averageSubjectsPerGrade.toFixed(1)} مادة
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text category="p1" style={styles.infoLabel}>
                أكثر الصفوف نشاطاً:
              </Text>
              <Text category="h6" style={styles.infoValue}>
                {stats.mostActiveGrade}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text category="p1" style={styles.infoLabel}>
                نسبة المواد بدون معلم:
              </Text>
              <Text category="h6" style={styles.infoValue}>
                {stats.totalSubjects > 0 ? ((stats.subjectsWithoutTeacher / stats.totalSubjects) * 100).toFixed(1) : 0}%
              </Text>
            </View>
          </Card>
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
  filterSection: {
    padding: 15,
  },
  gradeSelect: {
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
  infoCard: {
    borderRadius: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    color: '#2E7D32',
    fontWeight: '600',
  },
});

export default SubjectStatistics;
