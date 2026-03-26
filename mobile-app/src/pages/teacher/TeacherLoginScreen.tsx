import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TeacherStackParamList} from '../../navigation/AppNavigator';
import {useAuthStore} from '../../store/authStore';

type NavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

const TeacherLoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {login, loading} = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [errors, setErrors] = useState<{phone?: string; code?: string}>({});

  const validatePhone = (value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      setErrors(prev => ({...prev, phone: '请输入正确的手机号'}));
      return false;
    }
    setErrors(prev => ({...prev, phone: undefined}));
    return true;
  };

  const validateCode = (value: string) => {
    if (value.length !== 6) {
      setErrors(prev => ({...prev, code: '验证码为 6 位数字'}));
      return false;
    }
    setErrors(prev => ({...prev, code: undefined}));
    return true;
  };

  const handleSendCode = async () => {
    if (validatePhone(phone)) {
      // TODO: 调用发送验证码 API
      console.log('发送验证码到:', phone);
    }
  };

  const handleSubmit = async () => {
    if (!validatePhone(phone) || !validateCode(code)) {
      return;
    }

    if (isRegister && (!teacherName || !schoolName)) {
      return;
    }

    const success = await login(phone, code, isRegister ? {
      teacherName,
      schoolName,
    } : undefined);

    if (success) {
      navigation.navigate('TeacherMain');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            老师端登录
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {isRegister ? '创建新账号' : '欢迎回来'}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="手机号"
            value={phone}
            onChangeText={setPhone}
            onBlur={() => validatePhone(phone)}
            keyboardType="phone-pad"
            maxLength={11}
            style={styles.input}
            error={!!errors.phone}
          />
          <HelperText type="error" visible={!!errors.phone}>
            {errors.phone}
          </HelperText>

          <View style={styles.codeContainer}>
            <TextInput
              label="验证码"
              value={code}
              onChangeText={setCode}
              onBlur={() => validateCode(code)}
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.input, styles.codeInput]}
              error={!!errors.code}
            />
            <Button
              mode="outlined"
              onPress={handleSendCode}
              style={styles.sendCodeButton}
              disabled={phone.length !== 11}>
              发送验证码
            </Button>
          </View>
          <HelperText type="error" visible={!!errors.code}>
            {errors.code}
          </HelperText>

          {isRegister && (
            <>
              <TextInput
                label="姓名"
                value={teacherName}
                onChangeText={setTeacherName}
                style={styles.input}
              />
              <TextInput
                label="学校名称"
                value={schoolName}
                onChangeText={setSchoolName}
                style={styles.input}
              />
            </>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
            disabled={loading}>
            {isRegister ? '注册' : '登录'}
          </Button>

          <Button
            mode="text"
            onPress={() => setIsRegister(!isRegister)}
            style={styles.toggleButton}>
            {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('StudentLogin')}
            style={styles.toggleButton}>
            切换到学生端
          </Button>
        </View>
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
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  codeInput: {
    flex: 1,
    marginRight: 8,
  },
  sendCodeButton: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  toggleButton: {
    marginTop: 8,
  },
});

export default TeacherLoginScreen;
