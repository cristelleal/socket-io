import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authClient } from '../../shared/lib/auth.client';
import styles, { COLORS } from './auth.screen.styles';

type Mode = 'login' | 'register';

const FormContent = ({ mode, username, password, error, loading, onUsername, onPassword, onSubmit, onSwitch }: {
  mode: Mode;
  username: string;
  password: string;
  error: string | null;
  loading: boolean;
  onUsername: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: () => void;
  onSwitch: (m: Mode) => void;
}) => (
  <>
    <View style={styles.logoRow}>
      <View style={styles.logoCircle}>
        <View style={styles.logoDot} />
      </View>
      <Text style={styles.logoLabel}>Yam <Text style={styles.logoLabelAccent}>Master</Text></Text>
    </View>

    <Text style={styles.titleLine1}>Enter</Text>
    <Text style={styles.titleLine2}>Arena</Text>
    <Text style={styles.subtitle}>Choose your entry point below.</Text>

    <View style={styles.shapesRow}>
      <View style={styles.shapeCircle} />
      <View style={styles.shapeRect} />
      <View style={styles.shapeWide} />
    </View>

    <View style={styles.modeSwitcher}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
        onPress={() => onSwitch('login')}
        activeOpacity={0.8}
      >
        <Text style={[styles.modeButtonText, mode === 'login' && styles.modeButtonTextActive]}>
          Sign in
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'register' && styles.modeButtonActive]}
        onPress={() => onSwitch('register')}
        activeOpacity={0.8}
      >
        <Text style={[styles.modeButtonText, mode === 'register' && styles.modeButtonTextActive]}>
          Sign up
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.inputsSection}>
      <View style={styles.inputCard}>
        <View style={styles.inputIconCircle}>
          <Feather name="user" size={16} color={COLORS.primary} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.onSurfaceSubtle}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={onUsername}
        />
      </View>

      <View style={styles.inputCard}>
        <View style={styles.inputIconCircle}>
          <Feather name="key" size={16} color={COLORS.secondary} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.onSurfaceSubtle}
          secureTextEntry
          value={password}
          onChangeText={onPassword}
        />
        <Text style={styles.inputHint}>Forgot?</Text>
      </View>
    </View>

    {error && <Text style={styles.error}>{error}</Text>}

    <TouchableOpacity
      style={styles.button}
      onPress={onSubmit}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.onPrimary} />
      ) : (
        <>
          <Text style={styles.buttonText}>Enter Arena</Text>
          <Feather name="arrow-right" size={16} color={COLORS.onPrimary} />
        </>
      )}
    </TouchableOpacity>
  </>
);

export const AuthScreen = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    if (mode === 'register') {
      const { error: err } = await authClient.signUp.email({
        email: `${username.trim()}@yatzy.local`,
        password,
        name: username.trim(),
        username: username.trim(),
      });
      if (err) setError(err.message ?? 'Registration failed.');
    } else {
      const { error: err } = await authClient.signIn.username({
        username: username.trim(),
        password,
      });
      if (err) setError(err.message ?? 'Login failed.');
    }

    setLoading(false);
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setError(null);
  };

  const formProps = {
    mode,
    username,
    password,
    error,
    loading,
    onUsername: setUsername,
    onPassword: setPassword,
    onSubmit: handleSubmit,
    onSwitch: switchMode,
  };

  if (isDesktop) {
    return (
      <View style={styles.container}>
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopCard}>
            <FormContent {...formProps} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.inner, { paddingTop: insets.top + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormContent {...formProps} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
