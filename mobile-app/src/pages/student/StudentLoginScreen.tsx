import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {Text, TextInput, Button, HelperText, Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TeacherStackParamList} from '../../navigation/AppNavigator';
import {useAuthStore} from '../../store/authStore';

type NavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

const StudentLoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {studentLogin, loading} = useAuthStore();
  
  const [classCode, setClassCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [errors, setErrors] = useState<{classCode?: string; name?: string}>({});

  const validateClassCode = (value: string) => {
    if (value.length < 4) {
      setErrors(prev => ({...prev, classCode: '班级码至少 4 位'}));
      return false;
    }
    setErrors(prev => ({...prev, classCode: undefined}));
    return true;
  };

  const validateName = (value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({...prev, name: '请输入姓名'}));
      return false;
    }
    setErrors(prev => ({...prev, name: undefined}));
    return true;
  };

  const handleSubmit = async () => {
    if (!validateClassCode(classCode) || !validateName(studentName)) {
      return;
    }

    const success = await studentLogin(classCode.toUpperCase(), studentName.trim());

    if (success) {
      navigation.navigate('StudentMain');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🔐</Text>
          </View>
          <Text variant="headlineMedium" style={styles.title}>
            学生登录
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            输入班级码加入班级
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Card.Content>
            <TextInput
              label="班级码"
              value={classCode}
              onChangeText={(text) => {
                setClassCode(text.toUpperCase());
                validateClassCode(text);
              }}
              onBlur={() => validateClassCode(classCode)}
              keyboardType="default"
              maxLength={8}
              style={styles.input}
              error={!!errors.classCode}
              placeholder="向老师获取班级码"
              autoCapitalize="characters"
            />
            <HelperText type="error" visible={!!errors.classCode}>
              {errors.classCode}
            </HelperText>

            <TextInput
              label="姓名"
              value={studentName}
              onChangeText={(text) => {
                setStudentName(text);
                validateName(text);
              }}
              onBlur={() => validateName(studentName)}
              style={styles.input}
              error={!!errors.name}
              placeholder="请输入你的姓名"
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
              icon="login">
              加入班级
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.infoCard}>
          <Text variant="bodyMedium" style={styles.infoTitle}>
            💡 如何获取班级码？
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            1. 联系你的老师获取班级码{'\n'}
            2. 班级码由老师统一管理{'\n'}
            3. 一个班级码对应一个班级
          </Text>
        </View>

        <Button
          mode="text"
          onPress={() => navigation.navigate('TeacherLogin')}
          style={styles.toggleButton}>
          切换到老师端
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#03dac6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  infoCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#2e7d32',
    lineHeight: 22,
  },
  toggleButton: {
    marginTop: 8,
  },
});

export default StudentLoginScreen;
