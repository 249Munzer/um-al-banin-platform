import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Layout, Text, Card, Button, Input, Select, SelectItem, Modal, Card as KittenCard, Icon } from '@ui-kitten/components';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: Date;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: ''
  });
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    role: 'student',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as User[];
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('خطأ', 'حدث خطأ في جلب المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const usersCollection = collection(db, 'users');
      await addDoc(usersCollection, {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        createdAt: new Date()
      });

      Alert.alert('نجح', 'تم إضافة المستخدم بنجاح');
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'student', phone: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('خطأ', 'حدث خطأ في إضافة المستخدم');
    }
  };

  const handleEditUser = async () => {
    if (!editingUser || !editUser.name || !editUser.email) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        phone: editUser.phone
      });

      Alert.alert('نجح', 'تم تحديث المستخدم بنجاح');
      setShowEditModal(false);
      setEditingUser(null);
      setEditUser({ name: '', email: '', role: 'student', phone: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحديث المستخدم');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف المستخدم ${userName}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId));
              Alert.alert('نجح', 'تم حذف المستخدم بنجاح');
              fetchUsers();
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('خطأ', 'حدث خطأ في حذف المستخدم');
            }
          }
        }
      ]
    );
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'shield-outline';
      case 'teacher': return 'school-outline';
      case 'student': return 'person-outline';
      case 'guardian': return 'people-outline';
      default: return 'person-outline';
    }
  };


  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>👥</Text>
        <Text category="h4" style={styles.headerTitle}>
          إدارة المستخدمين
        </Text>
        <Text category="p2" style={styles.headerSubtitle}>
          إدارة جميع مستخدمي المنصة
        </Text>
      </View>

      <View style={styles.actionBar}>
        <Button
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.buttonIcon}>➕</Text>
          إضافة مستخدم جديد
        </Button>
      </View>

      <ScrollView style={styles.usersList}>
        {users.map((user) => (
          <Card key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userHeader}>
                <Icon
                  name={getRoleIcon(user.role)}
                  style={styles.userIcon}
                  fill={getRoleColor(user.role)}
                />
                <View style={styles.userDetails}>
                  <Text category="h6" style={styles.userName}>
                    {user.name}
                  </Text>
                  <Text category="p2" style={styles.userEmail}>
                    {user.email}
                  </Text>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                    <Text style={styles.roleText}>
                      {user.role === 'admin' ? 'مدير' :
                       user.role === 'teacher' ? 'معلم' :
                       user.role === 'student' ? 'طالب' : 'ولي أمر'}
                    </Text>
                  </View>
                </View>
              </View>
              {user.phone && (
                <Text category="p2" style={styles.userPhone}>
                  📞 {user.phone}
                </Text>
              )}
              <Text category="c1" style={styles.userDate}>
                انضم في: {user.createdAt.toLocaleDateString('ar-SA')}
              </Text>
            </View>
            <View style={styles.userActions}>
              <Button
                style={[styles.actionButton, styles.editButton]}
                size="small"
                onPress={() => openEditModal(user)}
              >
                تعديل
              </Button>
              <Button
                style={[styles.actionButton, styles.deleteButton]}
                size="small"
                status="danger"
                onPress={() => handleDeleteUser(user.id, user.name)}
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
            إضافة مستخدم جديد
          </Text>

          <Input
            style={styles.modalInput}
            placeholder="اسم المستخدم"
            value={newUser.name}
            onChangeText={(text) => setNewUser({...newUser, name: text})}
          />

          <Input
            style={styles.modalInput}
            placeholder="البريد الإلكتروني"
            value={newUser.email}
            onChangeText={(text) => setNewUser({...newUser, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            style={styles.modalInput}
            placeholder="كلمة المرور"
            value={newUser.password}
            onChangeText={(text) => setNewUser({...newUser, password: text})}
            secureTextEntry
          />

          <Input
            style={styles.modalInput}
            placeholder="رقم الهاتف (اختياري)"
            value={newUser.phone}
            onChangeText={(text) => setNewUser({...newUser, phone: text})}
            keyboardType="phone-pad"
          />

          <Select
            style={styles.modalInput}
            placeholder="اختر الدور"
            value={newUser.role === 'admin' ? 'مدير' :
                   newUser.role === 'teacher' ? 'معلم' :
                   newUser.role === 'student' ? 'طالب' : 'ولي أمر'}
            onSelect={(index: any) => {
              const roles = ['student', 'teacher', 'guardian', 'admin'];
              setNewUser({...newUser, role: roles[index.row]});
            }}
          >
            <SelectItem title="طالب" />
            <SelectItem title="معلم" />
            <SelectItem title="ولي أمر" />
            <SelectItem title="مدير" />
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
              onPress={handleAddUser}
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
            تعديل المستخدم
          </Text>

          <Input
            style={styles.modalInput}
            placeholder="اسم المستخدم"
            value={editUser.name}
            onChangeText={(text) => setEditUser({...editUser, name: text})}
          />

          <Input
            style={styles.modalInput}
            placeholder="البريد الإلكتروني"
            value={editUser.email}
            onChangeText={(text) => setEditUser({...editUser, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            style={styles.modalInput}
            placeholder="رقم الهاتف (اختياري)"
            value={editUser.phone}
            onChangeText={(text) => setEditUser({...editUser, phone: text})}
            keyboardType="phone-pad"
          />

          <Select
            style={styles.modalInput}
            placeholder="اختر الدور"
            value={editUser.role === 'admin' ? 'مدير' :
                   editUser.role === 'teacher' ? 'معلم' :
                   editUser.role === 'student' ? 'طالب' : 'ولي أمر'}
            onSelect={(index: any) => {
              const roles = ['student', 'teacher', 'guardian', 'admin'];
              setEditUser({...editUser, role: roles[index.row]});
            }}
          >
            <SelectItem title="طالب" />
            <SelectItem title="معلم" />
            <SelectItem title="ولي أمر" />
            <SelectItem title="مدير" />
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
              onPress={handleEditUser}
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
  usersList: {
    flex: 1,
    padding: 15,
  },
  userCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    marginBottom: 3,
  },
  userEmail: {
    color: '#666',
    marginBottom: 5,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  userPhone: {
    marginTop: 5,
    color: '#666',
  },
  userDate: {
    marginTop: 5,
    color: '#999',
    fontSize: 11,
  },
  userActions: {
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

export default UserManagement;
