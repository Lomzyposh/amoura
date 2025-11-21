import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/login";

// SIGNUP SCREENS
import Step1Basic from "../screens/signup/Step1Basic";
import Step2DOB from "../screens/signup/Step2DOB";
import Step3Gender from "../screens/signup/Step3Gender";
import Step4Preferences from "../screens/signup/Step4Preferences";
import Step5Hobbies from "../screens/signup/Step5Hobbies";
import Step6Photos from "../screens/signup/Step6Photos";
import Step7Bio from "../screens/signup/Step7Bio";
import Step8Finish from "../screens/signup/Step8Finish";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Step1Basic" component={Step1Basic} />
      <Stack.Screen name="Step2DOB" component={Step2DOB} />
      <Stack.Screen name="Step3Gender" component={Step3Gender} />
      <Stack.Screen name="Step4Preferences" component={Step4Preferences} />
      <Stack.Screen name="Step5Hobbies" component={Step5Hobbies} />
      <Stack.Screen name="Step6Photos" component={Step6Photos} />
      <Stack.Screen name="Step7Bio" component={Step7Bio} />
      <Stack.Screen name="Step8Finish" component={Step8Finish} />
    </Stack.Navigator>
  );
}