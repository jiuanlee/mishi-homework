import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Teacher Pages
import TeacherLoginScreen from '../pages/teacher/TeacherLoginScreen';
import TeacherHomeScreen from '../pages/teacher/TeacherHomeScreen';
import HomeworkGenerationScreen from '../pages/teacher/HomeworkGenerationScreen';
import ClassManagementScreen from '../pages/teacher/ClassManagementScreen';
import LearningStatsScreen from '../pages/teacher/LearningStatsScreen';

// Student Pages
import StudentLoginScreen from '../pages/student/StudentLoginScreen';
import StudentHomeScreen from '../pages/student/StudentHomeScreen';
import GamePracticeScreen from '../pages/student/GamePracticeScreen';
import StudentProfileScreen from '../pages/student/StudentProfileScreen';

export type TeacherStackParamList = {
  TeacherLogin: undefined;
  TeacherMain: undefined;
  TeacherHome: undefined;
  HomeworkGeneration: undefined;
  ClassManagement: undefined;
  LearningStats: undefined;
};

export type StudentStackParamList = {
  StudentLogin: undefined;
  StudentMain: undefined;
  StudentHome: undefined;
  GamePractice: {homeworkId?: string};
  StudentProfile: undefined;
};

const TeacherStack = createNativeStackNavigator<TeacherStackParamList>();
const StudentStack = createNativeStackNavigator<StudentStackParamList>();
const TeacherTab = createBottomTabNavigator();
const StudentTab = createBottomTabNavigator();

// Teacher Tab Navigator
const TeacherTabNavigator = () => {
  return (
    <TeacherTab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'TeacherHome') {
            iconName = focused ? 'home' : 'home-outlined';
          } else if (route.name === 'HomeworkGeneration') {
            iconName = focused ? 'create' : 'create-outlined';
          } else if (route.name === 'ClassManagement') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'LearningStats') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outlined';
          } else {
            iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <TeacherTab.Screen name="TeacherHome" component={TeacherHomeScreen} />
      <TeacherTab.Screen
        name="HomeworkGeneration"
        component={HomeworkGenerationScreen}
      />
      <TeacherTab.Screen
        name="ClassManagement"
        component={ClassManagementScreen}
      />
      <TeacherTab.Screen
        name="LearningStats"
        component={LearningStatsScreen}
      />
    </TeacherTab.Navigator>
  );
};

// Student Tab Navigator
const StudentTabNavigator = () => {
  return (
    <StudentTab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'StudentHome') {
            iconName = focused ? 'home' : 'home-outlined';
          } else if (route.name === 'GamePractice') {
            iconName = focused ? 'games' : 'games-outlined';
          } else if (route.name === 'StudentProfile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#03dac6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <StudentTab.Screen name="StudentHome" component={StudentHomeScreen} />
      <StudentTab.Screen
        name="GamePractice"
        component={GamePracticeScreen}
        initialParams={{homeworkId: undefined}}
      />
      <StudentTab.Screen
        name="StudentProfile"
        component={StudentProfileScreen}
      />
    </StudentTab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <TeacherStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="TeacherLogin">
      <TeacherStack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
      <TeacherStack.Screen name="TeacherMain" component={TeacherTabNavigator} />
      <TeacherStack.Screen
        name="StudentLogin"
        component={StudentLoginScreen}
      />
      <TeacherStack.Screen name="StudentMain" component={StudentTabNavigator} />
    </TeacherStack.Navigator>
  );
};

export default AppNavigator;
