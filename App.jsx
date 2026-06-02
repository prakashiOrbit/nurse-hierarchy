
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { NurseSplash } from './src/screens/SplashScreen';
import { NurseLoginScreen, NurseLoginMobile, NurseTwoFactor } from './src/screens/LoginScreens';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PatientDetailsScreen } from './src/screens/PatientDetailsScreen';
import { AlarmsScreen } from './src/screens/AlarmsScreen';
import { HandoverScreen } from './src/screens/HandoverScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MonitoringScreen } from './src/screens/MonitoringScreen';
import { NurseNotesScreen } from './src/screens/NurseNotesScreen';
import { MedicationRecordScreen } from './src/screens/MedicationRecordScreen';
import { IncidentReportScreen } from './src/screens/IncidentReportScreen';
import { NurseForgotPw } from './src/screens/NurseForgotPw';
import { WardTransferModal } from './src/components/WardTransferModal';
import { BedPatientInfo } from './src/components/BedPatientInfo';
import { UpdateAlarmConfig } from './src/components/UpdateAlarmConfig';
import { ActivateMonitoring } from './src/components/ActivateMonitoring';
import { NT } from './src/constants/theme';
import { NBEDS, NALARMS, NWARD, NPATIENTS } from './src/constants/mockData';
import { NTopBar, NBottomNav, NToast, SSEDot, NAvatar } from './src/components/Shared';
import { NIcoBell, NIcoActivity } from './src/components/Icons';

export default function App() {
  const [phase, setPhase] = useState('splash');
  const [loginMethod, setLoginMethod] = useState('username');
  const [tab, setTab] = useState('dashboard');
  const [selectedBed, setSelectedBed] = useState(null);
  const [showBedInfo, setShowBedInfo] = useState(false);
  const [showAlarmConfig, setShowAlarmConfig] = useState(false);
  const [showActivateMon, setShowActivateMon] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const [isMedication, setIsMedication] = useState(false);
  const [isIncident, setIsIncident] = useState(false);
  const [toast, setToast] = useState(null);
  const [connected, setConnected] = useState(true);
  
  // App state
  const [alarms, setAlarms] = useState(NALARMS);
  const [beds, setBeds] = useState(NBEDS);

  const showToast = (msg, kind = 'info') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBedAction = (action) => {
    if (action === 'details') {
      setShowBedInfo(false);
      setIsDetails(true);
    } else if (action === 'monitoring-view') {
      setShowBedInfo(false);
      setShowActivateMon(false);
      setIsMonitoring(true);
    } else if (action === 'monitoring') {
      setShowBedInfo(false);
      setShowActivateMon(true);
    } else if (action === 'alarm-config') {
      setShowBedInfo(false);
      setShowActivateMon(false);
      setShowAlarmConfig(true);
    } else if (action === 'add-note') {
      setShowBedInfo(false);
      setIsNotes(true);
    } else if (action === 'medication') {
      setShowBedInfo(false);
      setIsMedication(true);
    } else if (action === 'incident') {
      setShowBedInfo(false);
      setIsIncident(true);
    } else if (action === 'transfer' || action === 'discharge') {
      setShowBedInfo(false);
      setShowTransfer(true);
    } else if (action === 'handle-alarm') {
      setAlarms(prev => prev.filter(a => a.bedCode !== selectedBed.code));
      setShowBedInfo(false);
      showToast('Alarm handled', 'good');
    } else if (action === 'emergency') {
      showToast('Emergency escalation sent!', 'bad');
      setShowBedInfo(false);
    } else if (action === 'send-doctor') {
      showToast('Alert sent to attending doctor', 'info');
      setShowBedInfo(false);
    } else {
      console.log('Action:', action);
    }
  };

  const handleTransferDone = (res) => {
    if (res.type === 'discharge') {
      setBeds(bs => bs.map(b => b.code === selectedBed.code ? { ...b, status: 'empty', patientId: null } : b));
      showToast('Patient discharged', 'info');
    } else {
      setBeds(bs => bs.map(b => b.code === selectedBed.code ? { ...b, status: 'empty', patientId: null } : b));
      showToast(`Transferred to ${res.destWard}`, 'good');
    }
  };

  // Splash logic
  if (phase === 'splash') {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#1A2B1A" />
        <NurseSplash onDone={() => setPhase('login')} />
      </>
    );
  }

  // Login Logic
  if (phase === 'login') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={NT.bg} />
        {loginMethod === 'username' ? (
          <NurseLoginScreen
            onSignIn={() => setPhase('2fa')}
            onForgot={() => setPhase('forgot')}
            onMobile={() => setLoginMethod('mobile')}
          />
        ) : (
          <NurseLoginMobile
            onSend={() => setPhase('2fa')}
            onBack={() => setLoginMethod('username')}
          />
        )}
      </View>
    );
  }

  // Forgot Password Logic
  if (phase === 'forgot') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={NT.bg} />
        <NurseForgotPw 
          onBack={() => setPhase('login')} 
          onDone={() => {
            showToast('Password updated — please sign in', 'good');
            setPhase('login');
          }}
        />
      </View>
    );
  }

  // 2FA Logic
  if (phase === '2fa') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={NT.bg} />
        <NurseTwoFactor
          onVerify={() => setPhase('app')}
          onBack={() => setPhase('login')}
          via={loginMethod}
        />
      </View>
    );
  }

  // Main App
  if (phase === 'app') {
    if (isMonitoring && selectedBed) {
      const patient = selectedBed.patientId ? NPATIENTS[selectedBed.patientId] : null;
      return (
        <MonitoringScreen
          patient={patient}
          bed={selectedBed}
          onClose={() => setIsMonitoring(false)}
          onAddNote={() => setIsNotes(true)}
        />
      );
    }

    if (isDetails && selectedBed) {
      const patient = selectedBed.patientId ? NPATIENTS[selectedBed.patientId] : null;
      return (
        <PatientDetailsScreen
          patient={patient}
          bed={selectedBed}
          onClose={() => setIsDetails(false)}
          onMonitor={() => { setIsDetails(false); setIsMonitoring(true); }}
          onAddNote={() => setIsNotes(true)}
          onMedication={() => setIsMedication(true)}
        />
      );
    }

    if (isNotes) {
      return (
        <NurseNotesScreen onBack={() => setIsNotes(false)} />
      );
    }

    if (isMedication) {
      const patient = selectedBed?.patientId ? NPATIENTS[selectedBed.patientId] : null;
      return (
        <MedicationRecordScreen 
          patient={patient} 
          onClose={() => setIsMedication(false)} 
        />
      );
    }

    if (isIncident) {
      return (
        <IncidentReportScreen 
          onClose={() => setIsIncident(false)} 
          onSubmit={() => showToast('Incident reported successfully', 'good')}
        />
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={NT.bg} />
        <NTopBar
          title={tab === 'dashboard' ? NWARD.name : tab.charAt(0).toUpperCase() + tab.slice(1)}
          subtitle={tab === 'dashboard' ? `${NWARD.code} · ${NWARD.shift.name}` : 'Clinical Dashboard'}
          leading={
            <View style={styles.logoBox}>
              <NIcoActivity s={20} c="#fff" />
            </View>
          }
          trailing={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {tab === 'dashboard' && <SSEDot connected={connected} />}
              <TouchableOpacity onPress={() => setTab('alarms')} style={styles.iconAction}>
                <NIcoBell s={20} c={NT.textDim} />
                {alarms.length > 0 && (
                  <View style={styles.notifBadge} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('profile')}>
                <NAvatar initials="SM" size={32} color={NT.primary} />
              </TouchableOpacity>
            </View>
          }
        />
        {tab === 'dashboard' && (
          <>
            <DashboardScreen
              alarms={alarms}
              beds={beds}
              connected={connected}
              onBedTap={(bed) => { setSelectedBed(bed); setShowBedInfo(true); }}
              onAlarmTap={(alarm) => {
                const bed = beds.find(b => b.code === alarm.bedCode);
                if (bed) { setSelectedBed(bed); setShowBedInfo(true); }
              }}
              onViewAllAlarms={() => setTab('alarms')}
            />
            <BedPatientInfo
              visible={showBedInfo}
              bed={selectedBed}
              onClose={() => setShowBedInfo(false)}
              onAction={handleBedAction}
            />
            <UpdateAlarmConfig
              visible={showAlarmConfig}
              patient={selectedBed?.patientId ? NPATIENTS[selectedBed.patientId] : null}
              bed={selectedBed}
              onClose={() => setShowAlarmConfig(false)}
              onSave={() => showToast('Alarm limits updated', 'good')}
            />
            <ActivateMonitoring
              visible={showActivateMon}
              patient={selectedBed?.patientId ? NPATIENTS[selectedBed.patientId] : null}
              bed={selectedBed}
              onClose={() => setShowActivateMon(false)}
              onStarted={() => { 
                setBeds(bs => bs.map(b => b.code === selectedBed.code ? { ...b, status: 'monitoring' } : b));
                showToast('Monitoring started', 'good');
              }}
              onStopped={() => {
                setBeds(bs => bs.map(b => b.code === selectedBed.code ? { ...b, status: 'occupied' } : b));
                showToast('Monitoring stopped', 'info');
              }}
              onConfigAlarm={() => {
                setShowActivateMon(false);
                setShowAlarmConfig(true);
              }}
            />
            <WardTransferModal
              visible={showTransfer}
              patient={selectedBed?.patientId ? NPATIENTS[selectedBed.patientId] : null}
              bed={selectedBed}
              onClose={() => setShowTransfer(false)}
              onDone={handleTransferDone}
            />
          </>
        )}
        {tab === 'alarms' && (
           <AlarmsScreen
             alarms={alarms}
             onAlarmTap={(alarm) => {
               const bed = beds.find(b => b.code === alarm.bedCode);
               if (bed) { setSelectedBed(bed); setShowBedInfo(true); }
             }}
             onMarkAll={() => { setAlarms([]); showToast('All alarms handled', 'good'); }}
             onBack={() => setTab('dashboard')}
           />
        )}
        {tab === 'handover' && (
           <HandoverScreen onBack={() => setTab('dashboard')} />
        )}
        {tab === 'profile' && (
           <ProfileScreen onLogout={() => setPhase('login')} />
        )}
        <NBottomNav
          active={tab}
          onChange={setTab}
          alarmCount={alarms.length}
        />
        <NToast 
           visible={!!toast} 
           message={toast?.msg} 
           kind={toast?.kind} 
        />
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NT.bg,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: NT.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -4,
  },
  iconAction: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  }
});
