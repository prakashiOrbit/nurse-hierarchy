
export const NWARD = {
  id:'W001', name:'General Ward 3', code:'GW3',
  hospital:"St. Mary's Hospital", floor:'3rd Floor',
  totalBeds:16, occupiedBeds:11,
  shift:{ name:'Morning Shift', start:'07:00', end:'15:00', nurse:'Sarah Mitchell', id:'S001' },
};

export const NWARD_ROOMS = [
  { id:'R01', name:'Room 1', beds:['B01','B02'] },
  { id:'R02', name:'Room 2', beds:['B03','B04'] },
  { id:'R03', name:'Room 3', beds:['B05','B06'] },
  { id:'R04', name:'Room 4', beds:['B07','B08'] },
  { id:'R05', name:'Room 5', beds:['B09','B10'] },
  { id:'R06', name:'Room 6', beds:['B11','B12'] },
  { id:'R07', name:'Room 7', beds:['B13','B14'] },
  { id:'R08', name:'Room 8', beds:['B15','B16'] },
];

export const NBEDS = [
  { id:'B01', code:'B01', room:'R01', status:'monitoring', patientId:'P001' },
  { id:'B02', code:'B02', room:'R01', status:'monitoring', patientId:'P002' },
  { id:'B03', code:'B03', room:'R02', status:'occupied',   patientId:'P003' },
  { id:'B04', code:'B04', room:'R02', status:'discharge',  patientId:'P004' },
  { id:'B05', code:'B05', room:'R03', status:'empty',      patientId:null   },
  { id:'B06', code:'B06', room:'R03', status:'monitoring', patientId:'P005' },
  { id:'B07', code:'B07', room:'R04', status:'admit',      patientId:null   },
  { id:'B08', code:'B08', room:'R04', status:'transfer',   patientId:'P006' },
  { id:'B09', code:'B09', room:'R05', status:'monitoring', patientId:'P007' },
  { id:'B10', code:'B10', room:'R05', status:'empty',      patientId:null   },
  { id:'B11', code:'B11', room:'R06', status:'occupied',   patientId:'P008' },
  { id:'B12', code:'B12', room:'R06', status:'monitoring', patientId:'P009' },
  { id:'B13', code:'B13', room:'R07', status:'empty',      patientId:null   },
  { id:'B14', code:'B14', room:'R07', status:'occupied',   patientId:'P010' },
  { id:'B15', code:'B15', room:'R08', status:'monitoring', patientId:'P011' },
  { id:'B16', code:'B16', room:'R08', status:'empty',      patientId:null   },
];

export const NPATIENTS = {
  P001:{ id:'P001', name:'James Okafor',     mrn:'MRN-20481', age:67, gender:'M', admitDate:'May 28', diagnosis:'Acute MI',               doctor:'Dr. Shah',   alarmCount:2, vitals:{hr:112,spo2:91,rr:22,nibp:'148/96',temp:38.4}, status:'critical' },
  P002:{ id:'P002', name:'Maria Santos',     mrn:'MRN-20482', age:54, gender:'F', admitDate:'May 30', diagnosis:'COPD Exacerbation',       doctor:'Dr. Chen',   alarmCount:1, vitals:{hr:98, spo2:88,rr:28,nibp:'132/84',temp:37.8}, status:'high'     },
  P003:{ id:'P003', name:'Robert Kim',       mrn:'MRN-20483', age:72, gender:'M', admitDate:'May 25', diagnosis:'Post-op Hip Replacement', doctor:'Dr. Patel',  alarmCount:0, vitals:{hr:76, spo2:97,rr:16,nibp:'118/74',temp:37.1}, status:'stable'   },
  P004:{ id:'P004', name:'Anna Williams',    mrn:'MRN-20484', age:45, gender:'F', admitDate:'May 27', diagnosis:'Pneumonia',               doctor:'Dr. Shah',   alarmCount:0, vitals:{hr:88, spo2:94,rr:18,nibp:'124/80',temp:38.1}, status:'medium'   },
  P005:{ id:'P005', name:'Chen Wei',         mrn:'MRN-20485', age:81, gender:'M', admitDate:'May 29', diagnosis:'CHF',                    doctor:'Dr. Hassan', alarmCount:1, vitals:{hr:102,spo2:92,rr:24,nibp:'160/100',temp:37.5},status:'high'     },
  P006:{ id:'P006', name:'Fatima Al-Rashid', mrn:'MRN-20486', age:58, gender:'F', admitDate:'May 31', diagnosis:'Stroke Recovery',        doctor:'Dr. Patel',  alarmCount:0, vitals:{hr:72, spo2:96,rr:14,nibp:'130/82',temp:36.9}, status:'stable'   },
  P007:{ id:'P007', name:'David Osei',       mrn:'MRN-20487', age:63, gender:'M', admitDate:'May 26', diagnosis:'Diabetes Complication',  doctor:'Dr. Chen',   alarmCount:0, vitals:{hr:84, spo2:95,rr:17,nibp:'136/88',temp:37.6}, status:'medium'   },
  P008:{ id:'P008', name:'Elena Kowalski',   mrn:'MRN-20488', age:49, gender:'F', admitDate:'May 28', diagnosis:'Appendectomy',           doctor:'Dr. Shah',   alarmCount:0, vitals:{hr:78, spo2:98,rr:15,nibp:'112/70',temp:37.2}, status:'stable'   },
  P009:{ id:'P009', name:'Marcus Johnson',   mrn:'MRN-20489', age:76, gender:'M', admitDate:'May 24', diagnosis:'Atrial Fibrillation',    doctor:'Dr. Hassan', alarmCount:1, vitals:{hr:118,spo2:93,rr:20,nibp:'154/92',temp:37.3}, status:'high'     },
  P010:{ id:'P010', name:'Yuki Tanaka',      mrn:'MRN-20490', age:38, gender:'F', admitDate:'Jun 1',  diagnosis:'Post-partum Care',       doctor:'Dr. Chen',   alarmCount:0, vitals:{hr:74, spo2:99,rr:16,nibp:'110/68',temp:36.8}, status:'stable'   },
  P011:{ id:'P011', name:'Samuel Adeyemi',   mrn:'MRN-20491', age:55, gender:'M', admitDate:'May 30', diagnosis:'Renal Failure',          doctor:'Dr. Patel',  alarmCount:1, vitals:{hr:108,spo2:90,rr:26,nibp:'176/108',temp:38.9},status:'critical' },
};

export const NALARMS = [
  { id:'A001', bedCode:'B01', patientId:'P001', param:'SpO2', value:91,       unit:'%',    severity:'critical', raisedMin:3,  desc:'SpO₂ critically low'   },
  { id:'A002', bedCode:'B02', patientId:'P002', param:'SpO2', value:88,       unit:'%',    severity:'critical', raisedMin:8,  desc:'SpO₂ below threshold'  },
  { id:'A003', bedCode:'B06', patientId:'P005', param:'HR',   value:102,      unit:'bpm',  severity:'high',     raisedMin:12, desc:'Heart rate elevated'    },
  { id:'A004', bedCode:'B12', patientId:'P009', param:'HR',   value:118,      unit:'bpm',  severity:'high',     raisedMin:5,  desc:'Tachycardia detected'   },
  { id:'A005', bedCode:'B15', patientId:'P011', param:'NIBP', value:'176/108',unit:'mmHg', severity:'high',     raisedMin:2,  desc:'Hypertensive episode'   },
  { id:'A006', bedCode:'B09', patientId:'P007', param:'TEMP', value:37.6,     unit:'°C',   severity:'medium',   raisedMin:25, desc:'Temperature elevated'   },
  { id:'A007', bedCode:'B04', patientId:'P004', param:'RR',   value:22,       unit:'/min', severity:'low',      raisedMin:40, desc:'Resp rate borderline'   },
];

export const NMEDS = [
  { id:'M001', name:'Amoxicillin',  dose:'500mg',   route:'Oral',   time:'08:00', period:'morning', status:'administered', by:'Sarah M.', at:'08:05' },
  { id:'M002', name:'Metoprolol',   dose:'25mg',    route:'Oral',   time:'10:00', period:'morning', status:'administered', by:'Sarah M.', at:'10:07' },
  { id:'M003', name:'Furosemide',   dose:'40mg',    route:'IV',     time:'12:00', period:'afternoon',status:'pending' },
  { id:'M004', name:'Heparin',      dose:'5000 IU', route:'SC',     time:'14:00', period:'afternoon',status:'pending' },
  { id:'M005', name:'Paracetamol',  dose:'1g',      route:'Oral',   time:'16:00', period:'afternoon',status:'pending' },
  { id:'M006', name:'Omeprazole',   dose:'20mg',    route:'Oral',   time:'18:00', period:'evening',  status:'pending' },
  { id:'M007', name:'Atorvastatin', dose:'40mg',    route:'Oral',   time:'20:00', period:'evening',  status:'pending' },
  { id:'M008', name:'Morphine',     dose:'4mg',     route:'IV PRN', time:'02:00', period:'night',    status:'missed'  },
  { id:'M009', name:'Enoxaparin',   dose:'80mg',    route:'SC',     time:'22:00', period:'night',    status:'pending' },
];

export const NNOTES = [
  { id:'N001', type:'GENERAL',    text:'Patient alert and oriented. Complaint of mild chest tightness. Vitals monitored q2h.', nurse:'Sarah Mitchell', time:'10:32 AM' },
  { id:'N002', type:'MEDICATION', text:'Administered Furosemide 40mg IV as prescribed. Patient tolerated well. Output 450ml.', nurse:'Sarah Mitchell', time:'09:15 AM' },
  { id:'N003', type:'HANDOVER',   text:'Patient mobilized with assistance in AM. Wound dressing changed — no signs of infection.', nurse:'Night Nurse', time:'Yesterday 22:30' },
  { id:'N004', type:'INCIDENT',   text:'Patient attempted to remove IV line. Line secured, patient re-educated. Family notified.', nurse:'Sarah Mitchell', time:'Yesterday 20:15' },
];

export const NHANDOVER = [
  { patientId:'P001', bedCode:'B01', priority:'URGENT',  alarmCount:2, monitoring:true,  tasks:[
    { id:'T001', text:'Reassess SpO2 q30min — target >94%',      done:false },
    { id:'T002', text:'IV antibiotics at 16:00',                 done:false },
    { id:'T003', text:'Family update — son is contact',          done:true  },
  ]},
  { patientId:'P002', bedCode:'B02', priority:'URGENT',  alarmCount:1, monitoring:true,  tasks:[
    { id:'T004', text:'Nebuliser treatment q4h',                 done:false },
    { id:'T005', text:'ABG results — review with Dr. Chen',      done:false },
  ]},
  { patientId:'P003', bedCode:'B03', priority:'ROUTINE', alarmCount:0, monitoring:false, tasks:[
    { id:'T006', text:'Ambulate x2 — physio at 15:00',           done:true  },
    { id:'T007', text:'Pain score q4h',                          done:true  },
  ]},
  { patientId:'P007', bedCode:'B09', priority:'ROUTINE', alarmCount:0, monitoring:true,  tasks:[
    { id:'T008', text:'Blood glucose check q6h',                 done:false },
    { id:'T009', text:'Insulin per sliding scale',               done:false },
  ]},
];

export const NINSTRUCTIONS = [
  { id:'I001', text:'Monitor SpO2 every 30 minutes. Notify Dr. Shah if SpO2 <92%.', doctor:'Dr. Shah',  time:'10:00 AM', read:false },
  { id:'I002', text:'Administer Furosemide 40mg IV at 12:00 and 18:00.',            doctor:'Dr. Shah',  time:'08:30 AM', read:true  },
  { id:'I003', text:'Strict fluid balance. Target urine output >0.5ml/kg/hr.',      doctor:'Dr. Shah',  time:'08:00 AM', read:true  },
  { id:'I004', text:'12-lead ECG on admission and repeat in 6 hours.',              doctor:'Dr. Shah',  time:'Yesterday',read:true  },
];

export const NACTIVITY = [
  { id:'V001', text:'SpO2 alarm triggered — 91%',                    time:'10:45 AM', type:'alarm'       },
  { id:'V002', text:'Vitals recorded: HR 112, SpO2 91, RR 22',       time:'10:00 AM', type:'vitals'      },
  { id:'V003', text:'Medication administered: Metoprolol 25mg',       time:'10:07 AM', type:'medication'  },
  { id:'V004', text:'Doctor instruction added by Dr. Shah',           time:'10:00 AM', type:'instruction' },
  { id:'V005', text:'Nurse note added by Sarah Mitchell',             time:'09:15 AM', type:'note'        },
  { id:'V006', text:'Monitoring started on device ECG-A7',           time:'09:00 AM', type:'device'      },
];
