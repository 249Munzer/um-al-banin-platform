import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Layout, Text, Card, Button, Input, Select, SelectItem, Modal, Card as KittenCard } from '@ui-kitten/components';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface Subject {
  id: string;
  name: string;
  description: string;
  teacherId?: string;
  teacherName?: string;
  grade: string;
  createdAt: Date;
}

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    grade: 'الصف الأول',
    teacherId: ''
  });
  const [editSubject, setEditSubject] = useState({
    name: '',
    description: '',
    grade: 'الصف الأول',
    teacherId: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const subjectsCollection = collection(db, 'subjects');
      const subjectSnapshot = await getDocs(subjectsCollection);
      const subjectList = subjectSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Subject[];
      setSubjects(subjectList);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      Alert.alert('خطأ', 'حدث خطأ في جلب المواد');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.description) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const subjectsCollection = collection(db, 'subjects');
      await addDoc(subjectsCollection, {
        name: newSubject.name,
        description: newSubject.description,
        grade: newSubject.grade,
        teacherId: newSubject.teacherId || null,
        createdAt: new Date()
      });

      Alert.alert('نجح', 'تم إضافة المادة بنجاح');
      setShowAddModal(false);
      setNewSubject({ name: '', description: '', grade: 'الصف الأول', teacherId: '' });
      fetchSubjects();
    } catch (error) {
      console.error('Error adding subject:', error);
      Alert.alert('خطأ', 'حدث خطأ في إضافة المادة');
    }
  };

  const handleEditSubject = async () => {
    if (!editingSubject || !editSubject.name || !editSubject.description) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const subjectRef = doc(db, 'subjects', editingSubject.id);
      await updateDoc(subjectRef, {
        name: editSubject.name,
        description: editSubject.description,
        grade: editSubject.grade,
        teacherId: editSubject.teacherId || null
      });

      Alert.alert('نجح', 'تم تحديث المادة بنجاح');
      setShowEditModal(false);
      setEditingSubject(null);
      setEditSubject({ name: '', description: '', grade: 'الصف الأول', teacherId: '' });
      fetchSubjects();
    } catch (error) {
      console.error('Error updating subject:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحديث المادة');
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setEditSubject({
      name: subject.name,
      description: subject.description,
      grade: subject.grade,
      teacherId: subject.teacherId || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف المادة ${subjectName}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'subjects', subjectId));
              Alert.alert('نجح', 'تم حذف المادة بنجاح');
              fetchSubjects();
            } catch (error) {
              console.error('Error deleting subject:', error);
              Alert.alert('خطأ', 'حدث خطأ في حذف المادة');
            }
          }
        }
      ]
    );
  };

  const grades = [
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
        <MaterialIcons name="book" style={styles.headerIcon} color="#388E3C" size={50} />
        <Text category="h4" style={styles.headerTitle}>
          إدارة المواد الدراسية
        </Text>
        <Text category="p2" style={styles.headerSubtitle}>
          إدارة المواد والمناهج الدراسية
        </Text>
      </View>

      <View style={styles.actionBar}>
        <Button
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <MaterialIcons name="add" style={styles.buttonIcon} color="#FFF" size={16} />
          إضافة مادة جديدة
        </Button>
      </View>

      <ScrollView style={styles.subjectsList}>
        {subjects.map((subject) => (
          <Card key={subject.id} style={styles.subjectCard}>
            <View style={styles.subjectInfo}>
              <View style={styles.subjectHeader}>
                <MaterialIcons name="book" style={styles.subjectIcon} color="#388E3C" size={40} />
                <View style={styles.subjectDetails}>
                  <Text category="h6" style={styles.subjectName}>
                    {subject.name}
                  </Text>
                  <Text category="p2" style={styles.subjectDescription}>
                    {subject.description}
                  </Text>
                  <View style={styles.subjectMeta}>
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeText}>
                        {subject.grade}
                      </Text>
                    </View>
                    {subject.teacherName && (
                      <Text category="p2" style={styles.teacherInfo}>
                        👨‍🏫 {subject.teacherName}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <Text category="c1" style={styles.subjectDate}>
                تم إنشاؤها: {subject.createdAt.toLocaleDateString('ar-SA')}
              </Text>
            </View>
            <View style={styles.subjectActions}>
              <Button
                style={[styles.actionButton, styles.editButton]}
                size="small"
                onPress={() => openEditModal(subject)}
              >
                تعديل
              </Button>
              <Button
                style={[styles.actionButton, styles.deleteButton]}
                size="small"
                status="danger"
                onPress={() => handleDeleteSubject(subject.id, subject.name)}
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
            إضافة مادة دراسية جديدة
          </Text>

          <Input
            style={styles.modalInput}
            placeholder="اسم المادة"
            value={newSubject.name}
            onChangeText={(text) => setNewSubject({...newSubject, name: text})}
          />

          <Input
            style={styles.modalInput}
            placeholder="وصف المادة"
            value={newSubject.description}
            onChangeText={(text) => setNewSubject({...newSubject, description: text})}
            multiline
            numberOfLines={3}
          />

          <Select
            style={styles.modalInput}
            placeholder="اختر الصف الدراسي"
            value={newSubject.grade}
            onSelect={(index: any) => {
              setNewSubject({...newSubject, grade: grades[index.row]});
            }}
          >
            {grades.map((grade, index) => (
              <SelectItem key={index} title={grade} />
            ))}
          </Select>

          <Input
            style={styles.modalInput}
            placeholder="معرف المعلم (اختياري)"
            value={newSubject.teacherId}
            onChangeText={(text) => setNewSubject({...newSubject, teacherId: text})}
          />

          <View style={styles.modalActions}>
            <Button
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddModal(false)}
            >
              إلغاء
            </Button>
            <Button
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleAddSubject}
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
            تعديل المادة الدراسية
          </Text>

          <Input
            style={styles.modalInput}
            placeholder="اسم المادة"
            value={editSubject.name}
            onChangeText={(text) => setEditSubject({...editSubject, name: text})}
          />

          <Input
            style={styles.modalInput}
            placeholder="وصف المادة"
            value={editSubject.description}
            onChangeText={(text) => setEditSubject({...editSubject, description: text})}
            multiline
            numberOfLines={3}
          />

          <Select
            style={styles.modalInput}
            placeholder="اختر الصف الدراسي"
            value={editSubject.grade}
            onSelect={(index: any) => {
              setEditSubject({...editSubject, grade: grades[index.row]});
            }}
          >
            {grades.map((grade, index) => (
              <SelectItem key={index} title={grade} />
            ))}
          </Select>

          <Input
            style={styles.modalInput}
            placeholder="معرف المعلم (اختياري)"
            value={editSubject.teacherId}
            onChangeText={(text) => setEditSubject({...editSubject, teacherId: text})}
          />

          <View style={styles.modalActions}>
            <Button
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowEditModal(false)}
            >
              إلغاء
            </Button>
            <Button
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleEditSubject}
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
  subjectsList: {
    flex: 1,
    padding: 15,
  },
  subjectCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    marginTop: 5,
  },
  subjectDetails: {
    flex: 1,
  },
  subjectName: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#2E7D32',
  },
  subjectDescription: {
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  subjectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  gradeBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  gradeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  teacherInfo: {
    color: '#666',
    fontSize: 12,
  },
  subjectDate: {
    color: '#999',
    fontSize: 11,
    marginTop: 5,
  },
  subjectActions: {
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

export default SubjectManagement;
