import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Layout, Text, Card, Button, Input, Select, SelectItem, Modal, Card as KittenCard } from '@ui-kitten/components';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface Fee {
  id: string;
  title: string;
  amount: number;
  description: string;
  dueDate: Date;
  grade: string;
  type: 'monthly' | 'yearly' | 'one-time';
  status: 'active' | 'inactive';
  createdAt: Date;
}

const FeeManagement = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [newFee, setNewFee] = useState({
    title: '',
    amount: '',
    description: '',
    dueDate: '',
    grade: 'جميع الصفوف',
    type: 'monthly' as const,
    status: 'active' as 'active' | 'inactive'
  });
  const [editFee, setEditFee] = useState({
    title: '',
    amount: '',
    description: '',
    dueDate: '',
    grade: 'جميع الصفوف',
    type: 'monthly' as 'monthly' | 'yearly' | 'one-time',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const feesCollection = collection(db, 'fees');
      const feeSnapshot = await getDocs(feesCollection);
      const feeList = feeSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Fee[];
      setFees(feeList);
    } catch (error) {
      console.error('Error fetching fees:', error);
      Alert.alert('خطأ', 'حدث خطأ في جلب الرسوم');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFee = async () => {
    if (!newFee.title || !newFee.amount || !newFee.description || !newFee.dueDate) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const feesCollection = collection(db, 'fees');
      await addDoc(feesCollection, {
        title: newFee.title,
        amount: parseFloat(newFee.amount),
        description: newFee.description,
        dueDate: new Date(newFee.dueDate),
        grade: newFee.grade,
        type: newFee.type,
        status: newFee.status,
        createdAt: new Date()
      });

      Alert.alert('نجح', 'تم إضافة الرسم بنجاح');
      setShowAddModal(false);
      setNewFee({
        title: '',
        amount: '',
        description: '',
        dueDate: '',
        grade: 'جميع الصفوف',
        type: 'monthly',
        status: 'active'
      });
      fetchFees();
    } catch (error) {
      console.error('Error adding fee:', error);
      Alert.alert('خطأ', 'حدث خطأ في إضافة الرسم');
    }
  };

  const handleDeleteFee = async (feeId: string, feeTitle: string) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف الرسم ${feeTitle}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'fees', feeId));
              Alert.alert('نجح', 'تم حذف الرسم بنجاح');
              fetchFees();
            } catch (error) {
              console.error('Error deleting fee:', error);
              Alert.alert('خطأ', 'حدث خطأ في حذف الرسم');
            }
          }
        }
      ]
    );
  };

  const handleEditFee = async () => {
    if (!editingFee || !editFee.title || !editFee.amount || !editFee.description || !editFee.dueDate) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const feeRef = doc(db, 'fees', editingFee.id);
      await updateDoc(feeRef, {
        title: editFee.title,
        amount: parseFloat(editFee.amount),
        description: editFee.description,
        dueDate: new Date(editFee.dueDate),
        grade: editFee.grade,
        type: editFee.type,
        status: editFee.status
      });

      Alert.alert('نجح', 'تم تحديث الرسم بنجاح');
      setShowEditModal(false);
      setEditingFee(null);
      setEditFee({
        title: '',
        amount: '',
        description: '',
        dueDate: '',
        grade: 'جميع الصفوف',
        type: 'monthly',
        status: 'active'
      });
      fetchFees();
    } catch (error) {
      console.error('Error updating fee:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحديث الرسم');
    }
  };

  const openEditModal = (fee: Fee) => {
    setEditingFee(fee);
    setEditFee({
      title: fee.title,
      amount: fee.amount.toString(),
      description: fee.description,
      dueDate: fee.dueDate.toISOString().split('T')[0],
      grade: fee.grade,
      type: fee.type,
      status: fee.status
    });
    setShowEditModal(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'monthly': return '#2196F3';
      case 'yearly': return '#FF9800';
      case 'one-time': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#F44336';
      default: return '#9E9E9E';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="credit-card" style={styles.headerIcon} color="#388E3C" size={50} />
        <Text category="h4" style={styles.headerTitle}>
          إدارة الرسوم والمدفوعات
        </Text>
        <Text category="p2" style={styles.headerSubtitle}>
          إدارة الرسوم الدراسية والمدفوعات
        </Text>
      </View>

      <View style={styles.actionBar}>
        <Button
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <MaterialIcons name="add" style={styles.buttonIcon} color="#FFF" size={16} />
          إضافة رسم جديد
        </Button>
      </View>

      <ScrollView style={styles.feesList}>
        {fees.map((fee) => (
          <Card key={fee.id} style={styles.feeCard}>
            <View style={styles.feeInfo}>
              <View style={styles.feeHeader}>
                <MaterialIcons name="attach-money" style={styles.feeIcon} color="#388E3C" size={40} />
                <View style={styles.feeDetails}>
                  <Text category="h6" style={styles.feeTitle}>
                    {fee.title}
                  </Text>
                  <Text category="p2" style={styles.feeDescription}>
                    {fee.description}
                  </Text>
                  <View style={styles.feeMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(fee.type) }]}>
                      <Text style={styles.typeText}>
                        {fee.type === 'monthly' ? 'شهري' :
                         fee.type === 'yearly' ? 'سنوي' : 'مرة واحدة'}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(fee.status) }]}>
                      <Text style={styles.statusText}>
                        {fee.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Text>
                    </View>
                    <Text category="p2" style={styles.gradeInfo}>
                      📚 {fee.grade}
                    </Text>
                  </View>
                </View>
                <Text category="h5" style={styles.feeAmount}>
                  {formatCurrency(fee.amount)}
                </Text>
              </View>
              <Text category="c1" style={styles.feeDate}>
                تاريخ الاستحقاق: {fee.dueDate.toLocaleDateString('ar-SA')}
              </Text>
            </View>
            <View style={styles.feeActions}>
              <Button
                style={[styles.actionButton, styles.editButton]}
                size="small"
                onPress={() => openEditModal(fee)}
              >
                تعديل
              </Button>
              <Button
                style={[styles.actionButton, styles.deleteButton]}
                size="small"
                status="danger"
                onPress={() => handleDeleteFee(fee.id, fee.title)}
              >
                حذف
              </Button>
            </View>
          </Card>
        ))}
      </ScrollView>

      <Modal
        visible={showAddModal}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={() => setShowAddModal(false)}
      >
        <KittenCard style={styles.modalCard}>
          <Text category="h5" style={styles.modalTitle}>
            إضافة رسم جديد
          </Text>

          <Input
            style={styles.modalInput}
            placeholder="عنوان الرسم"
            value={newFee.title}
            onChangeText={(text) => setNewFee({...newFee, title: text})}
          />

          <Input
            style={styles.modalInput}
            placeholder="المبلغ (بالريال السعودي)"
            value={newFee.amount}
            onChangeText={(text) => setNewFee({...newFee, amount: text})}
            keyboardType="numeric"
          />

          <Input
            style={styles.modalInput}
            placeholder="وصف الرسم"
            value={newFee.description}
            onChangeText={(text) => setNewFee({...newFee, description: text})}
            multiline
            numberOfLines={3}
          />

          <Input
            style={styles.modalInput}
            placeholder="تاريخ الاستحقاق (YYYY-MM-DD)"
            value={newFee.dueDate}
            onChangeText={(text) => setNewFee({...newFee, dueDate: text})}
          />

          <Select
            style={styles.modalInput}
            placeholder="اختر الصف الدراسي"
            value={newFee.grade}
            onSelect={(index: any) => {
              setNewFee({...newFee, grade: grades[index.row]});
            }}
          >
            {grades.map((grade, index) => (
              <SelectItem key={index} title={grade} />
            ))}
          </Select>

          <Select
            style={styles.modalInput}
            placeholder="نوع الرسم"
            value={newFee.type === 'monthly' ? 'شهري' :
                   newFee.type === 'yearly' ? 'سنوي' : 'مرة واحدة'}
            onSelect={(index: any) => {
              const types = ['monthly', 'yearly', 'one-time'];
              setNewFee({...newFee, type: types[index.row] as any});
            }}
          >
            <SelectItem title="شهري" />
            <SelectItem title="سنوي" />
            <SelectItem title="مرة واحدة" />
          </Select>

          <Select
            style={styles.modalInput}
            placeholder="حالة الرسم"
            value={newFee.status === 'active' ? 'نشط' : 'غير نشط'}
            onSelect={(index: any) => {
              setNewFee({...newFee, status: index.row === 0 ? 'active' as const : 'inactive' as const});
            }}
          >
            <SelectItem title="نشط" />
            <SelectItem title="غير نشط" />
          </Select>

          <View style={styles.modalActions}>
            <Button
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddModal(false)}
            >
              إلغاء
            </Button>
            <Button
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleAddFee}
            >
              إضافة
            </Button>
          </View>
        </KittenCard>
      </Modal>

      <Modal
        visible={showEditModal}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={() => setShowEditModal(false)}
      >
        <KittenCard style={styles.modalCard}>
          <Text category="h5" style={styles.modalTitle}>
            تعديل الرسم
          </Text>

          <Input
            style={styles.modalInput}
            placeholder="عنوان الرسم"
            value={editFee.title}
            onChangeText={(text) => setEditFee({...editFee, title: text})}
          />

          <Input
            style={styles.modalInput}
            placeholder="المبلغ (بالريال السعودي)"
            value={editFee.amount}
            onChangeText={(text) => setEditFee({...editFee, amount: text})}
            keyboardType="numeric"
          />

          <Input
            style={styles.modalInput}
            placeholder="وصف الرسم"
            value={editFee.description}
            onChangeText={(text) => setEditFee({...editFee, description: text})}
            multiline
            numberOfLines={3}
          />

          <Input
            style={styles.modalInput}
            placeholder="تاريخ الاستحقاق (YYYY-MM-DD)"
            value={editFee.dueDate}
            onChangeText={(text) => setEditFee({...editFee, dueDate: text})}
          />

          <Select
            style={styles.modalInput}
            placeholder="اختر الصف الدراسي"
            value={editFee.grade}
            onSelect={(index: any) => {
              setEditFee({...editFee, grade: grades[index.row]});
            }}
          >
            {grades.map((grade, index) => (
              <SelectItem key={index} title={grade} />
            ))}
          </Select>

          <Select
            style={styles.modalInput}
            placeholder="نوع الرسم"
            value={editFee.type === 'monthly' ? 'شهري' :
                   editFee.type === 'yearly' ? 'سنوي' : 'مرة واحدة'}
            onSelect={(index: any) => {
              const types = ['monthly', 'yearly', 'one-time'];
              setEditFee({...editFee, type: types[index.row] as any});
            }}
          >
            <SelectItem title="شهري" />
            <SelectItem title="سنوي" />
            <SelectItem title="مرة واحدة" />
          </Select>

          <Select
            style={styles.modalInput}
            placeholder="حالة الرسم"
            value={editFee.status === 'active' ? 'نشط' : 'غير نشط'}
            onSelect={(index: any) => {
              setEditFee({...editFee, status: index.row === 0 ? 'active' as const : 'inactive' as const});
            }}
          >
            <SelectItem title="نشط" />
            <SelectItem title="غير نشط" />
          </Select>

          <View style={styles.modalActions}>
            <Button
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowEditModal(false)}
            >
              إلغاء
            </Button>
            <Button
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleEditFee}
            >
              تحديث
            </Button>
          </View>
        </KittenCard>
      </Modal>
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
  actionBar: {
    padding: 15,
  },
  addButton: {
    backgroundColor: '#388E3C',
    borderColor: '#388E3C',
  },
  buttonIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  feesList: {
    flex: 1,
    padding: 15,
  },
  feeCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  feeInfo: {
    flex: 1,
  },
  feeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  feeIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    marginTop: 5,
  },
  feeDetails: {
    flex: 1,
  },
  feeTitle: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#2E7D32',
  },
  feeDescription: {
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  feeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  typeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  gradeInfo: {
    color: '#666',
    fontSize: 12,
  },
  feeAmount: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  feeDate: {
    color: '#999',
    fontSize: 11,
    marginTop: 5,
  },
  feeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E7D32',
  },
  modalInput: {
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    borderColor: '#9E9E9E',
  },
  confirmButton: {
    backgroundColor: '#388E3C',
    borderColor: '#388E3C',
  },
});

export default FeeManagement;
