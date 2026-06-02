
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { NT } from '../constants/theme';
import { NBtn, NInput, NTopBar, NOTPInput } from '../components/Shared';
import { NIcoUser, NIcoLock, NIcoPhone, NIcoFingerp } from '../components/Icons';

export function NurseLoginScreen({ onSignIn, onForgot, onMobile }) {
  const [user, setUser] = useState('sarah.mitchell');
  const [pass, setPass] = useState('password123');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to access your ward dashboard</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Username or Email</Text>
            <NInput
              value={user}
              onChange={setUser}
              placeholder="nurse_id or email"
              leading={<NIcoUser s={18} c={NT.textFaint} />}
            />
          </View>

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={onForgot}>
                <Text style={styles.linkText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <NInput
              value={pass}
              onChange={setPass}
              placeholder="••••••••"
              secureTextEntry
              leading={<NIcoLock s={18} c={NT.textFaint} />}
            />
          </View>

          <NBtn fullWidth onPress={onSignIn} style={{ marginTop: 10 }}>Sign In</NBtn>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.secondaryActions}>
            <NBtn variant="outline" fullWidth onPress={onMobile} icon={<NIcoPhone s={18} c={NT.primary} />}>
              Sign in with Mobile
            </NBtn>
            <NBtn variant="ghost" fullWidth icon={<NIcoFingerp s={20} c={NT.textDim} />}>
              Use Biometrics
            </NBtn>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Secure Clinical Access · v0.8.2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function NurseLoginMobile({ onSend, onBack }) {
  const [phone, setPhone] = useState('+44 7700 900123');

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar onBack={onBack} title="Mobile Sign In" plain />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter mobile number</Text>
          <Text style={styles.subtitle}>We'll send a 6-digit verification code to your registered device</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Mobile Number</Text>
            <NInput
              value={phone}
              onChange={setPhone}
              placeholder="+1 (555) 000-0000"
              type="phone"
              leading={<NIcoPhone s={18} c={NT.textFaint} />}
            />
          </View>

          <NBtn fullWidth onPress={onSend} style={{ marginTop: 10 }}>Send Code</NBtn>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function NurseTwoFactor({ onVerify, onBack, via = 'email' }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar onBack={onBack} title="Verification" plain />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter 6-digit code</Text>
          <Text style={styles.subtitle}>
            Sent to your {via === 'mobile' ? 'mobile' : 'email'} (s***@stmarys.org)
          </Text>
        </View>

        <View style={styles.form}>
          <NOTPInput otp={otp} onChange={setOtp} />
          <View style={{ height: 22 }} />
          <NBtn fullWidth onPress={onVerify} style={{ marginTop: 10 }}>Verify & Sign In</NBtn>

          <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={styles.linkText}>Didn't receive code? Resend</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: NT.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: NT.textDim,
    lineHeight: 22,
    textAlign: 'center',
  },
  form: {
    gap: 20,
    width: '100%',
    maxWidth: 480,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: NT.textDim,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: NT.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: NT.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '700',
    color: NT.textFaint,
  },
  secondaryActions: {
    gap: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: NT.textFaint,
    fontWeight: '500',
  },
});
