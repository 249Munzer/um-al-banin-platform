import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Layout, Text, Card, Button, Input, Select, SelectItem, Modal, Icon } from '@ui-kitten/components';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  class: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

const AdminStudents = () => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    phone: '',
    grade: '',
    class: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    dateOfBirth: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  const [editStudent, setEditStudent] = useState<Student>({
    id: '',
    name: '',
    email: '',
    phone: '',
    grade: '',
    class: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    dateOfBirth: '',
    enrollmentDate: '',
    status: 'active'
  });

  const grades = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'];
  const classes = ['أ', 'ب', 'ج', 'د'];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('خطأ', 'فشل في تحميل بيانات الطلاب');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.grade) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        grade: newStudent.grade,
        class: newStudent.class,
        parentName: newStudent.parentName,
        parentPhone: newStudent.parentPhone,
        parentEmail: newStudent.parentEmail,
        address: newStudent.address,
        dateOfBirth: newStudent.dateOfBirth,
        enrollmentDate: newStudent.enrollmentDate,
        status: newStudent.status
      });
      setShowAddModal(false);
      setNewStudent({
        name: '',
        email: '',
        phone: '',
        grade: '',
        class: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        dateOfBirth: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'active'
      });
      fetchStudents();
      Alert.alert('نجح', 'تم إضافة الطالب بنجاح');
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('خطأ', 'فشل في إضافة الطالب');
    }
  };

  const handleEditStudent = async () => {
    if (!editStudent.name || !editStudent.email || !editStudent.grade) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await updateDoc(doc(db, 'students', editStudent.id), editStudent);
      setShowEditModal(false);
      fetchStudents();
      Alert.alert('نجح', 'تم تحديث بيانات الطالب بنجاح');
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert('خطأ', 'فشل في تحديث بيانات الطالب');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذا الطالب؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'students', studentId));
              fetchStudents();
              Alert.alert('نجح', 'تم حذف الطالب بنجاح');
            } catch (error) {
              console.error('Error deleting student:', error);
              Alert.alert('خطأ', 'فشل في حذف الطالب');
            }
          }
        }
      ]
    );
  };

  const openEditModal = (student: Student) => {
    setEditStudent(student);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <Layout style={styles.container}>
        <Text category="h1">جاري التحميل...</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text category="h1" style={styles.title}>إدارة الطلاب</Text>
          <Button
            onPress={() => setShowAddModal(true)}
            accessoryLeft={(props) => <Icon {...props} name="plus" />}
            style={styles.addButton}
          >
            إضافة طالب
          </Button>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text category="h6">إجمالي الطلاب</Text>
            <Text category="h3" style={styles.statNumber}>{students.length}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text category="h6">الطلاب النشطين</Text>
            <Text category="h3" style={styles.statNumber}>
              {students.filter(s => s.status === 'active').length}
            </Text>
          </Card>
        </View>

        <View style={styles.studentsList}>
          {students.map((student) => (
            <Card key={student.id} style={styles.studentCard}>
              <View style={styles.studentHeader}>
                <View style={styles.studentInfo}>
                  <Text category="h6">{student.name}</Text>
                  <Text category="p2" appearance="hint">
                    {student.grade} - الشعبة {student.class}
                  </Text>
                  <Text category="p2" appearance="hint">{student.email}</Text>
                </View>
                <View style={styles.studentActions}>
                  <TouchableOpacity
                    onPress={() => openEditModal(student)}
                    style={styles.actionButton}
                  >
                    <MaterialIcons name="edit" size={20} color="#3366FF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteStudent(student.id)}
                    style={styles.actionButton}
                  >
                    <MaterialIcons name="delete" size={20} color="#FF3D71" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.studentDetails}>
                <Text category="p2">ولي الأمر: {student.parentName}</Text>
                <Text category="p2">هاتف ولي الأمر: {student.parentPhone}</Text>
                <Text category="p2">تاريخ التسجيل: {student.enrollmentDate}</Text>
                <View style={styles.statusContainer}>
                  <Text category="p2">الحالة: </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: student.status === 'active' ? '#4CAF50' : '#FF9800' }
                  ]}>
                    <Text category="c2" style={styles.statusText}>
                      {student.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Add Student Modal */}
      <Modal
        visible={showAddModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowAddModal(false)}
      >
        <Card disabled={true} style={styles.modalCard}>
          <Text category="h5" style={styles.modalTitle}>إضافة طالب جديد</Text>

          <ScrollView style={styles.modalScrollView}>
            <Input
              label="الاسم الكامل *"
              value={newStudent.name}
              onChangeText={(text) => setNewStudent({...newStudent, name: text})}
              style={styles.input}
            />

            <Input
              label="البريد الإلكتروني *"
              value={newStudent.email}
              onChangeText={(text) => setNewStudent({...newStudent, email: text})}
              keyboardType="email-address"
              style={styles.input}
            />

            <Input
              label="رقم الهاتف"
              value={newStudent.phone}
              onChangeText={(text) => setNewStudent({...newStudent, phone: text})}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Select
              label="الصف الدراسي *"
              value={newStudent.grade}
              onSelect={(index) => {
                const idx = Array.isArray(index) ? index[0]?.row || 0 : index.row;
                setNewStudent({...newStudent, grade: grades[idx]});
              }}
              style={styles.input}
            >
              {grades.map((grade) => (
                <SelectItem key={grade} title={grade} />
              ))}
            </Select>

            <Select
              label="الشعبة"
              value={newStudent.class}
              onSelect={(index) => setNewStudent({...newStudent, class: classes[index.row]})}
              style={styles.input}
            >
              {classes.map((cls) => (
                <SelectItem key={cls} title={cls} />
              ))}
            </Select>

            <Input
              label="اسم ولي الأمر"
              value={newStudent.parentName}
              onChangeText={(text) => setNewStudent({...newStudent, parentName: text})}
              style={styles.input}
            />

            <Input
              label="هاتف ولي الأمر"
              value={newStudent.parentPhone}
              onChangeText={(text) => setNewStudent({...newStudent, parentPhone: text})}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Input
              label="بريد ولي الأمر"
              value={newStudent.parentEmail}
              onChangeText={(text) => setNewStudent({...newStudent, parentEmail: text})}
              keyboardType="email-address"
              style={styles.input}
            />

            <Input
              label="العنوان"
              value={newStudent.address}
              onChangeText={(text) => setNewStudent({...newStudent, address: text})}
              style={styles.input}
            />

            <Input
              label="تاريخ الميلاد"
              value={newStudent.dateOfBirth}
              onChangeText={(text) => setNewStudent({...newStudent, dateOfBirth: text})}
              placeholder="YYYY-MM-DD"
              style={styles.input}
            />
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              onPress={() => setShowAddModal(false)}
              appearance="outline"
              status="basic"
              style={styles.modalButton}
            >
              إلغاء
            </Button>
            <Button
              onPress={handleAddStudent}
              style={styles.modalButton}
            >
              إضافة
            </Button>
          </View>
        </Card>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        visible={showEditModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowEditModal(false)}
      >
        <Card disabled={true} style={styles.modalCard}>
          <Text category="h5" style={styles.modalTitle}>تعديل بيانات الطالب</Text>

          <ScrollView style={styles.modalScrollView}>
            <Input
              label="الاسم الكامل *"
              value={editStudent.name}
              onChangeText={(text) => setEditStudent({...editStudent, name: text})}
              style={styles.input}
            />

            <Input
              label="البريد الإلكتروني *"
              value={editStudent.email}
              onChangeText={(text) => setEditStudent({...editStudent, email: text})}
              keyboardType="email-address"
              style={styles.input}
            />

            <Input
              label="رقم الهاتف"
              value={editStudent.phone}
              onChangeText={(text) => setEditStudent({...editStudent, phone: text})}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Select
              label="الصف الدراسي *"
              value={editStudent.grade}
              onSelect={(index) => setEditStudent({...editStudent, grade: grades[index.row]})}
              style={styles.input}
            >
              {grades.map((grade) => (
                <SelectItem key={grade} title={grade} />
              ))}
            </Select>

            <Select
              label="الشعبة"
              value={editStudent.class}
              onSelect={(index) => setEditStudent({...editStudent, class: classes[index.row]})}
              style={styles.input}
            >
              {classes.map((cls) => (
                <SelectItem key={cls} title={cls} />
              ))}
            </Select>

            <Input
              label="اسم ولي الأمر"
              value={editStudent.parentName}
              onChangeText={(text) => setEditStudent({...editStudent, parentName: text})}
              style={styles.input}
            />

            <Input
              label="هاتف ولي الأمر"
              value={editStudent.parentPhone}
              onChangeText={(text) => setEditStudent({...editStudent, parentPhone: text})}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Input
              label="بريد ولي الأمر"
              value={editStudent.parentEmail}
              onChangeText={(text) => setEditStudent({...editStudent, parentEmail: text})}
              keyboardType="email-address"
              style={styles.input}
            />

            <Input
              label="العنوان"
              value={editStudent.address}
              onChangeText={(text) => setEditStudent({...editStudent, address: text})}
              style={styles.input}
            />

            <Input
              label="تاريخ الميلاد"
              value={editStudent.dateOfBirth}
              onChangeText={(text) => setEditStudent({...editStudent, dateOfBirth: text})}
              placeholder="YYYY-MM-DD"
              style={styles.input}
            />

            <Select
              label="الحالة"
              value={editStudent.status}
              onSelect={(index) => setEditStudent({...editStudent, status: index.row === 0 ? 'active' : 'inactive'})}
              style={styles.input}
            >
              <SelectItem title="نشط" />
              <SelectItem title="غير نشط" />
            </Select>
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              onPress={() => setShowEditModal(false)}
              appearance="outline"
              status="basic"
              style={styles.modalButton}
            >
              إلغاء
            </Button>
            <Button
              onPress={handleEditStudent}
              style={styles.modalButton}
            >
              حفظ التغييرات
            </Button>
          </View>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  addButton: {
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  statNumber: {
    marginTop: 10,
    color: '#3366FF',
    fontWeight: 'bold',
  },
  studentsList: {
    padding: 20,
  },
  studentCard: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F7F9FC',
  },
  studentDetails: {
    gap: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E3A59',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  input: {
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
});

export default AdminStudents;
