import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Layout, Text, Card, Button, Icon, Select, SelectItem } from '@ui-kitten/components';
import { db } from '../../services/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

interface AnalyticsData {
  userGrowth: { period: string; count: number }[];
  subjectPerformance: { subject: string; enrollment: number; completion: number }[];
  feeCollection: { month: string; collected: number; pending: number }[];
  systemHealth: {
    totalUsers: number;
    activeUsers: number;
    totalSubjects: number;
    totalFees: number;
    systemUptime: number;
  };
  predictions: {
    nextMonthUsers: number;
    nextMonthRevenue: number;
    popularSubject: string;
  };
}

const AdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    userGrowth: [],
    subjectPerformance: [],
    feeCollection: [],
    systemHealth: {
      totalUsers: 0,
      activeUsers: 0,
      totalSubjects: 0,
      totalFees: 0,
      systemUptime: 99.9
    },
    predictions: {
      nextMonthUsers: 0,
      nextMonthRevenue: 0,
      popularSubject: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all collections data
      const [usersSnapshot, subjectsSnapshot, feesSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'subjects')),
        getDocs(collection(db, 'fees'))
      ]);

      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const fees = feesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate user growth (mock data for demo)
      const userGrowth = [
        { period: 'يناير', count: 120 },
        { period: 'فبراير', count: 135 },
        { period: 'مارس', count: 158 },
        { period: 'أبريل', count: 180 },
        { period: 'مايو', count: 195 },
        { period: 'يونيو', count: 210 }
      ];

      // Calculate subject performance (mock data)
      const subjectPerformance = subjects.slice(0, 5).map(subject => ({
        subject: subject.name,
        enrollment: Math.floor(Math.random() * 50) + 20,
        completion: Math.floor(Math.random() * 30) + 70
      }));

      // Calculate fee collection (mock data)
      const feeCollection = [
        { month: 'يناير', collected: 45000, pending: 5000 },
        { month: 'فبراير', collected: 52000, pending: 3000 },
        { month: 'مارس', collected: 48000, pending: 7000 },
        { month: 'أبريل', collected: 55000, pending: 2000 },
        { month: 'مايو', collected: 58000, pending: 4000 },
        { month: 'يونيو', collected: 62000, pending: 1000 }
      ];

      // Calculate system health
      const activeUsers = users.filter(user => {
        const lastActive = user.lastActive?.toDate();
        if (!lastActive) return false;
        const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive <= 30;
      }).length;

      // Generate predictions (mock AI predictions)
      const predictions = {
        nextMonthUsers: users.length + Math.floor(Math.random() * 20) + 10,
        nextMonthRevenue: 65000 + Math.floor(Math.random() * 10000),
        popularSubject: subjects.length > 0 ? subjects[0].name : 'الرياضيات'
      };

      setAnalyticsData({
        userGrowth,
        subjectPerformance,
        feeCollection,
        systemHealth: {
          totalUsers: users.length,
          activeUsers,
          totalSubjects: subjects.length,
          totalFees: fees.length,
          systemUptime: 99.9
        },
        predictions
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      Alert.alert('خطأ', 'حدث خطأ في جلب بيانات التحليلات');
    } finally {
      setLoading(false);
    }
  };

  const timeframes = [
    '3 أشهر',
    '6 أشهر',
    'سنة كاملة',
    'سنتين'
  ];

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Icon name="analytics-outline" style={styles.headerIcon} fill="#388E3C" />
        <Text category="h4" style={styles.headerTitle}>
          التحليلات المتقدمة - المرحلة الثالثة
        </Text>
        <Text category="p2" style={styles.headerSubtitle}>
          تحليلات ذكية وتوقعات مستقبلية
        </Text>
      </View>

      <View style={styles.timeframeSelector}>
        <Select
          style={styles.timeframeSelect}
          placeholder="اختر الفترة الزمنية"
          value={selectedTimeframe === '3months' ? '3 أشهر' :
                 selectedTimeframe === '6months' ? '6 أشهر' :
                 selectedTimeframe === 'year' ? 'سنة كاملة' : 'سنتين'}
          onSelect={(index) => {
            const timeframes = ['3months', '6months', 'year', '2years'];
            setSelectedTimeframe(timeframes[index.row]);
          }}
        >
          {timeframes.map((timeframe, index) => (
            <SelectItem key={index} title={timeframe} />
          ))}
        </Select>
      </View>

      <ScrollView style={styles.content}>
        {/* System Health */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            حالة النظام
          </Text>
          <View style={styles.healthGrid}>
            <Card style={styles.healthCard}>
              <View style={styles.healthItem}>
                <Icon name="heart-outline" style={styles.healthIcon} fill="#4CAF50" />
                <View>
                  <Text category="h5" style={styles.healthValue}>
                    {analyticsData.systemHealth.systemUptime}%
                  </Text>
                  <Text category="p2" style={styles.healthLabel}>
                    وقت تشغيل النظام
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.healthCard}>
              <View style={styles.healthItem}>
                <Icon name="people-outline" style={styles.healthIcon} fill="#2196F3" />
                <View>
                  <Text category="h5" style={styles.healthValue}>
                    {analyticsData.systemHealth.activeUsers}
                  </Text>
                  <Text category="p2" style={styles.healthLabel}>
                    مستخدمين نشطين
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        {/* User Growth Chart */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            نمو المستخدمين
          </Text>
          <Card style={styles.chartCard}>
            {analyticsData.userGrowth.map((data, index) => (
              <View key={index} style={styles.chartItem}>
                <View style={styles.chartBar}>
                  <View
                    style={[
                      styles.chartFill,
                      { height: `${(data.count / 250) * 100}%` }
                    ]}
                  />
                </View>
                <Text category="c1" style={styles.chartLabel}>
                  {data.period}
                </Text>
                <Text category="p2" style={styles.chartValue}>
                  {data.count}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Subject Performance */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            أداء المواد الدراسية
          </Text>
          {analyticsData.subjectPerformance.map((subject, index) => (
            <Card key={index} style={styles.performanceCard}>
              <View style={styles.performanceItem}>
                <View style={styles.performanceInfo}>
                  <Text category="h6" style={styles.performanceTitle}>
                    {subject.subject}
                  </Text>
                  <Text category="p2" style={styles.performanceStats}>
                    الالتحاق: {subject.enrollment} | الإنجاز: {subject.completion}%
                  </Text>
                </View>
                <View style={styles.performanceBar}>
                  <View
                    style={[
                      styles.performanceFill,
                      { width: `${subject.completion}%` }
                    ]}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Fee Collection */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            تحصيل الرسوم
          </Text>
          <Card style={styles.feeCard}>
            {analyticsData.feeCollection.map((fee, index) => (
              <View key={index} style={styles.feeItem}>
                <Text category="p1" style={styles.feeMonth}>
                  {fee.month}
                </Text>
                <View style={styles.feeBars}>
                  <View style={styles.feeBar}>
                    <View
                      style={[
                        styles.feeCollected,
                        { width: `${(fee.collected / 70000) * 100}%` }
                      ]}
                    />
                    <Text category="c1" style={styles.feeAmount}>
                      {fee.collected.toLocaleString()} ريال
                    </Text>
                  </View>
                  <View style={styles.feeBar}>
                    <View
                      style={[
                        styles.feePending,
                        { width: `${(fee.pending / 10000) * 100}%` }
                      ]}
                    />
                    <Text category="c1" style={styles.feeAmount}>
                      {fee.pending.toLocaleString()} ريال
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* AI Predictions */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            التوقعات الذكية 🤖
          </Text>
          <Card style={styles.predictionCard}>
            <View style={styles.predictionItem}>
              <Icon name="trending-up-outline" style={styles.predictionIcon} fill="#4CAF50" />
              <View>
                <Text category="h6" style={styles.predictionTitle}>
                  المستخدمين المتوقع الشهر القادم
                </Text>
                <Text category="h4" style={styles.predictionValue}>
                  {analyticsData.predictions.nextMonthUsers}
                </Text>
              </View>
            </View>

            <View style={styles.predictionItem}>
              <Icon name="cash-outline" style={styles.predictionIcon} fill="#FF9800" />
              <View>
                <Text category="h6" style={styles.predictionTitle}>
                  الإيرادات المتوقعة الشهر القادم
                </Text>
                <Text category="h4" style={styles.predictionValue}>
                  {analyticsData.predictions.nextMonthRevenue.toLocaleString()} ريال
                </Text>
              </View>
            </View>

            <View style={styles.predictionItem}>
              <Icon name="star-outline" style={styles.predictionIcon} fill="#9C27B0" />
              <View>
                <Text category="h6" style={styles.predictionTitle}>
                  أكثر المواد شعبية
                </Text>
                <Text category="h4" style={styles.predictionValue}>
                  {analyticsData.predictions.popularSubject}
                </Text>
              </View>
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
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#388E3C',
    textAlign: 'center',
  },
  timeframeSelector: {
    padding: 15,
  },
  timeframeSelect: {
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    color: '#2E7D32',
    marginBottom: 15,
    fontWeight: '600',
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  healthIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  healthValue: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  healthLabel: {
    color: '#666',
    fontSize: 12,
  },
  chartCard: {
    padding: 15,
    borderRadius: 12,
  },
  chartItem: {
    alignItems: 'center',
    marginBottom: 15,
  },
  chartBar: {
    width: 30,
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    marginBottom: 5,
  },
  chartFill: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: '100%',
  },
  chartLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    color: '#666',
  },
  performanceCard: {
    marginBottom: 10,
    borderRadius: 12,
  },
  performanceItem: {
    padding: 15,
  },
  performanceInfo: {
    marginBottom: 10,
  },
  performanceTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  performanceStats: {
    color: '#666',
    fontSize: 12,
  },
  performanceBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  performanceFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  feeCard: {
    borderRadius: 12,
  },
  feeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  feeMonth: {
    fontWeight: '600',
    marginBottom: 10,
  },
  feeBars: {
    gap: 10,
  },
  feeBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeCollected: {
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    marginRight: 10,
  },
  feePending: {
    height: 20,
    backgroundColor: '#FF9800',
    borderRadius: 10,
    marginRight: 10,
  },
  feeAmount: {
    fontSize: 12,
    color: '#666',
  },
  predictionCard: {
    borderRadius: 12,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  predictionIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  predictionTitle: {
    flex: 1,
    marginBottom: 5,
  },
  predictionValue: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});

export default AdvancedAnalytics;
