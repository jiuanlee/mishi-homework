import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, FlatList} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  IconButton,
  Dialog,
  Portal,
  Chip,
  Avatar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useClassStore} from '../../store/classStore';

const ClassManagementScreen = () => {
  const {classes, addClass, addStudent, removeStudent} = useClassStore();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showClassCodeDialog, setShowClassCodeDialog] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

  const handleAddClass = () => {
    if (newClassName.trim()) {
      addClass(newClassName.trim());
      setNewClassName('');
      setShowAddDialog(false);
    }
  };

  const handleShowClassCode = (classId: string) => {
    setSelectedClass(classId);
    setShowClassCodeDialog(true);
  };

  const renderClassCard = ({item}: {item: any}) => (
    <Card style={styles.classCard}>
      <Card.Content>
        <View style={styles.classCardHeader}>
          <View style={styles.classInfo}>
            <Text variant="titleMedium" style={styles.className}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.studentCount}>
              {item.studentCount} 名学生
            </Text>
          </View>
          <View style={styles.classActions}>
            <IconButton
              icon="qrcode"
              size={24}
              onPress={() => handleShowClassCode(item.id)}
            />
            <IconButton
              icon="account-circle"
              size={24}
              onPress={() => setSelectedClass(item.id)}
            />
          </View>
        </View>

        <View style={styles.classStats}>
          <View style={styles.statBadge}>
            <Text variant="bodySmall" style={styles.statLabel}>
              完成率
            </Text>
            <Text variant="titleSmall" style={styles.statValue}>
              {item.completionRate}%
            </Text>
          </View>
          <View style={styles.statBadge}>
            <Text variant="bodySmall" style={styles.statLabel}>
              正确率
            </Text>
            <Text variant="titleSmall" style={styles.statValue}>
              {item.accuracyRate}%
            </Text>
          </View>
        </View>

        {selectedClass === item.id && (
          <View style={styles.studentList}>
            <Text variant="titleSmall" style={styles.studentListTitle}>
              学生列表
            </Text>
            {item.students.map((student: any, index: number) => (
              <View key={index} style={styles.studentItem}>
                <Avatar.Text size={32} label={student.name[0]} />
                <Text variant="bodyMedium" style={styles.studentName}>
                  {student.name}
                </Text>
                <Chip
                  compact
                  textStyle={styles.statusChip}
                  style={styles.statusChipContainer}>
                  {student.status}
                </Chip>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => removeStudent(item.id, student.id)}
                />
              </View>
            ))}
            <View style={styles.addStudentRow}>
              <TextInput
                placeholder="学生姓名"
                value={newStudentName}
                onChangeText={setNewStudentName}
                style={styles.addStudentInput}
                mode="outlined"
                dense
              />
              <Button
                mode="contained"
                onPress={() => {
                  if (newStudentName.trim()) {
                    addStudent(item.id, newStudentName.trim());
                    setNewStudentName('');
                  }
                }}
                style={styles.addStudentButton}>
                添加
              </Button>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          班级管理
        </Text>
        <Button
          mode="contained"
          icon="add"
          onPress={() => setShowAddDialog(true)}
          style={styles.addClassButton}>
          新建班级
        </Button>
      </View>

      <View style={styles.content}>
        <FlatList
          data={classes}
          renderItem={renderClassCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>新建班级</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="班级名称"
              value={newClassName}
              onChangeText={setNewClassName}
              placeholder="例如：三年级一班"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>取消</Button>
            <Button onPress={handleAddClass}>确定</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={showClassCodeDialog}
          onDismiss={() => setShowClassCodeDialog(false)}>
          <Dialog.Title>班级码</Dialog.Title>
          <Dialog.Content>
            <View style={styles.classCodeContent}>
              <Icon name="qrcode" size={100} color="#6200ee" />
              <Text variant="headlineMedium" style={styles.classCode}>
                {selectedClass ? 'ABC123' : ''}
              </Text>
              <Text variant="bodyMedium" style={styles.classCodeHint}>
                学生输入此码加入班级
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClassCodeDialog(false)}>关闭</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  addClassButton: {
    marginLeft: 12,
  },
  content: {
    padding: 16,
  },
  classCard: {
    marginBottom: 16,
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontWeight: 'bold',
  },
  studentCount: {
    color: '#666',
    marginTop: 4,
  },
  classActions: {
    flexDirection: 'row',
  },
  classStats: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statBadge: {
    marginRight: 24,
  },
  statLabel: {
    color: '#666',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  studentList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  studentListTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    flex: 1,
    marginLeft: 12,
  },
  statusChipContainer: {
    marginRight: 4,
  },
  statusChip: {
    fontSize: 12,
  },
  addStudentRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  addStudentInput: {
    flex: 1,
    marginRight: 8,
  },
  addStudentButton: {
    paddingHorizontal: 16,
  },
  classCodeContent: {
    alignItems: 'center',
    padding: 20,
  },
  classCode: {
    marginTop: 16,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  classCodeHint: {
    marginTop: 8,
    color: '#666',
  },
});

export default ClassManagementScreen;
