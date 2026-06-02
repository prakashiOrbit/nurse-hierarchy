
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NT } from '../constants/theme';
import { NTopBar, NBtn, NField, NInput, NOTPInput } from '../components/Shared';
import { NIcoFile, NIcoLock, NIcoEye, NIcoEyeOff, NIcoCheck } from '../components/Icons';

export function NurseForgotPw({ onBack, onDone }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('sarah.mitchell@hospital.org');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pw, setPw] = useState('');
  const [pwc, setPwc] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : /[^a-zA-Z0-9]/.test(pw) ? 4 : 3;
  const sLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const sColor = ['', '#FF3B30', '#FFAA00', '#34C759', '#007AFF'];

  const next = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step < 3) {
        setStep(s => s + 1);
      } else {
        onDone();
      }
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NTopBar onBack={step > 1 ? () => setStep(s => s - 1) : onBack} plain />
      
      <View style={styles.progressRow}>
        {[1, 2, 3].map(s => (
          <View 
            key={s} 
            style={[
              styles.progressDot, 
              { 
                width: s === step ? 28 : 8, 
                backgroundColor: s <= step ? NT.primary : NT.border 
              }
            ]} 
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {step === 1 && (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>Enter your registered email address.</Text>
              </View>
              <NField label="Email Address">
                <NInput 
                  value={email} 
                  onChange={setEmail} 
                  placeholder="your@email.com" 
                  type="email" 
                  leading={<NIcoFile s={16} c={NT.textFaint} />} 
                />
              </NField>
              <View style={{ height: 20 }} />
              <NBtn fullWidth loading={loading} onPress={next}>Send Verification Code</NBtn>
            </>
          )}

          {step === 2 && (
            <>
              <View style={[styles.header, { alignItems: 'center' }]}>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>Code sent to {email}</Text>
              </View>
              <NOTPInput otp={otp} onChange={setOtp} />
              <View style={{ height: 22 }} />
              <NBtn fullWidth loading={loading} onPress={next}>Verify Code</NBtn>
              <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={styles.linkText}>Didn't receive code? Resend</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>New Password</Text>
                <Text style={styles.subtitle}>Create a strong new password.</Text>
              </View>
              <View style={{ gap: 14 }}>
                <NField label="New Password">
                  <NInput 
                    value={pw} 
                    onChange={setPw} 
                    secureTextEntry={!show} 
                    leading={<NIcoLock s={16} c={NT.textFaint} />}
                    trailing={
                      <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeBtn}>
                        {show ? <NIcoEyeOff s={16} c={NT.textFaint} /> : <NIcoEye s={16} c={NT.textFaint} />}
                      </TouchableOpacity>
                    }
                  />
                </NField>
                
                {pw.length > 0 && (
                  <View style={styles.strengthRow}>
                    {[1, 2, 3, 4].map(i => (
                      <View 
                        key={i} 
                        style={[
                          styles.strengthBar, 
                          { backgroundColor: i <= strength ? sColor[strength] : NT.border }
                        ]} 
                      />
                    ))}
                    <Text style={[styles.strengthLabel, { color: sColor[strength] }]}>{sLabel[strength]}</Text>
                  </View>
                )}

                <NField label="Confirm Password">
                  <NInput 
                    value={pwc} 
                    onChange={setPwc} 
                    secureTextEntry={!show} 
                    leading={<NIcoLock s={16} c={NT.textFaint} />}
                  />
                </NField>
              </View>
              <View style={{ height: 20 }} />
              <NBtn 
                fullWidth 
                loading={loading} 
                disabled={!pw || pw !== pwc} 
                onPress={next} 
                icon={<NIcoCheck s={16} c="#fff" />}
              >
                Update Password
              </NBtn>
            </>
          )}
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
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    padding: 22,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 480,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: NT.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: NT.textDim,
  },
  eyeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '600',
    width: 50,
    textAlign: 'right',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: NT.primary,
  },
});
