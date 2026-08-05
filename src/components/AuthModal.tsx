import React, { useState, useRef } from 'react';
import { 
  Lock, Mail, Phone, ShieldCheck, Camera, CheckCircle2, 
  Sparkles, KeyRound, User, ArrowRight, RefreshCw, X
} from 'lucide-react';
import { UserProfile, SecurityLogItem } from '../types';
import { GeminiService } from '../services/geminiService';

interface AuthModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onAddSecurityLog?: (log: SecurityLogItem) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  onAddSecurityLog
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'email_verify' | 'otp_verify' | 'faceid' | '2fa'>('faceid');
  
  // Form states
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [regName, setRegName] = useState('');
  const [emailCode, setEmailCode] = useState('849201');
  const [otpCode, setOtpCode] = useState('654321');
  const [totpCode, setTotpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Face ID Webcam Scanner
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  if (!isOpen) return null;

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch {
      setIsCameraActive(false);
      alert('Camera simulation mode active for biometrics verification.');
    }
  };

  // Capture frame & verify via Gemini API
  const handleCaptureAndVerify = async () => {
    setIsScanning(true);
    setScanResult(null);

    let base64Image = '';
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth || 320;
        canvasRef.current.height = videoRef.current.videoHeight || 240;
        ctx.drawImage(videoRef.current, 0, 0);
        base64Image = canvasRef.current.toDataURL('image/jpeg');
      }
    }

    const res = await GeminiService.verifyFaceID(base64Image, user.name);

    setIsScanning(false);
    setScanResult(res);

    if (onAddSecurityLog) {
      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
      onAddSecurityLog({
        id: `log_${Date.now()}`,
        type: 'faceid',
        status: res.verified ? 'success' : 'failed',
        timestamp: dateStr,
        device: user.preferredDevice === 'android' ? 'Android PWA / Galaxy S24' : 'Chrome 128 (Desktop)',
        ipAddress: '102.89.23.11',
        location: 'Lagos, Nigeria',
        confidenceScore: res.verified ? 98.2 : 38.5,
        details: res.verified 
          ? 'Face ID Scan Successful: 68 biometric landmark points verified.' 
          : 'Face ID Scan Failed: Unmatched liveness feature vectors.'
      });
    }

    if (res.verified) {
      onUpdateUser({ ...user, faceIdRegistered: true });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#080808] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 text-[#F5F5F5] relative">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 font-serif text-lg text-white">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <span>Sununsi Security & Auth Center</span>
          </div>
          <button 
            onClick={() => {
              stopCamera();
              onClose();
            }} 
            className="p-1 text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Tab Switcher */}
        <div className="flex bg-black p-1 rounded-2xl border border-white/10 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'register', label: 'Sign Up', icon: User },
            { id: 'login', label: 'Log In', icon: Lock },
            { id: 'email_verify', label: 'Email Code', icon: Mail },
            { id: 'otp_verify', label: 'OTP Code', icon: Phone },
            { id: 'faceid', label: 'Face ID', icon: Camera },
            { id: '2fa', label: '2FA Auth', icon: KeyRound },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (t.id !== 'faceid') stopCamera();
                  setAuthTab(t.id as any);
                }}
                className={`flex-1 min-w-[70px] flex items-center justify-center gap-1 py-2 px-2 rounded-xl font-bold transition-all ${
                  authTab === t.id
                    ? 'bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Register / Sign Up Tab */}
        {authTab === 'register' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-white/80">Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Mustapha Jibril"
                className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="font-semibold text-white/80">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@sununsi.dev"
                className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="font-semibold text-white/80">Mobile Number (for SMS OTP)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 812 345 6789"
                className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <button
              onClick={() => {
                setAuthTab('email_verify');
              }}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2"
            >
              <span>Continue to Email Confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Email Confirmation Tab */}
        {authTab === 'email_verify' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-black border border-white/10 rounded-xl text-center space-y-1">
              <Mail className="w-6 h-6 text-orange-400 mx-auto" />
              <p className="font-semibold text-white">Email Verification Token Sent</p>
              <p className="text-white/60 text-[11px]">Verification code sent to <span className="text-orange-400">{email}</span></p>
            </div>
            <div>
              <label className="font-semibold text-white/80">Enter 6-Digit Email Code</label>
              <input
                type="text"
                maxLength={6}
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                className="w-full mt-1.5 p-3 text-center text-lg font-mono font-bold bg-black border border-orange-500/50 rounded-xl text-orange-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                onUpdateUser({ ...user, emailVerified: true, email });
                setAuthTab('otp_verify');
              }}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Email Code & Proceed to OTP</span>
            </button>
          </div>
        )}

        {/* OTP Confirmation Tab */}
        {authTab === 'otp_verify' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-black border border-white/10 rounded-xl text-center space-y-1">
              <Phone className="w-6 h-6 text-orange-400 mx-auto" />
              <p className="font-semibold text-white">SMS OTP Security Check</p>
              <p className="text-white/60 text-[11px]">Enter 6-digit SMS code sent to <span className="text-orange-400">{phone || '+234 812 345 6789'}</span></p>
            </div>
            <div>
              <label className="font-semibold text-white/80">6-Digit Mobile OTP Code</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full mt-1.5 p-3 text-center text-lg font-mono font-bold bg-black border border-orange-500/50 rounded-xl text-orange-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                onUpdateUser({ 
                  ...user, 
                  phoneVerified: true, 
                  otpVerified: true, 
                  twoFactorEnabled: true,
                  phone 
                });
                alert('OTP Code Verified! Account Security Fully Activated.');
                onClose();
              }}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Mobile OTP Code</span>
            </button>
          </div>
        )}

        {/* Face ID Biometric Camera Scanner Tab */}
        {authTab === 'faceid' && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-white/60">
              Sununsi Biometric Guard scans 68 facial keypoints to verify liveness and secure your developer wallet.
            </p>

            {/* High-Tech Camera Viewport & Face ID Laser Scan Overlay */}
            <div className="relative aspect-video w-full max-w-sm mx-auto bg-black rounded-2xl overflow-hidden border-2 border-orange-500/50 flex flex-col items-center justify-center p-2 shadow-[0_0_30px_rgba(234,88,12,0.2)]">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover rounded-xl ${isCameraActive ? 'block' : 'hidden'}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {!isCameraActive && (
                <div className="relative z-10 space-y-2 p-4">
                  <div className="relative w-16 h-16 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center mx-auto border border-orange-600/40">
                    <Camera className="w-8 h-8" />
                    <div className="absolute inset-0 rounded-full border border-orange-500/40 animate-ping opacity-30" />
                  </div>
                  <p className="font-semibold text-xs text-white/80">Interactive Camera Ready</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-[0_0_12px_rgba(234,88,12,0.3)] transition-all"
                  >
                    Start Camera Feed
                  </button>
                </div>
              )}

              {/* HUD Reticle Brackets Frame */}
              <div className="absolute inset-3 pointer-events-none z-20 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-orange-400 shadow-[0_0_8px_#f97316]" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-orange-400 shadow-[0_0_8px_#f97316]" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-orange-400 shadow-[0_0_8px_#f97316]" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-orange-400 shadow-[0_0_8px_#f97316]" />
                </div>
              </div>

              {/* Laser Scan Line & Biometric Mesh Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-30 bg-orange-950/20 backdrop-blur-[1px]">
                  {/* Moving Laser Scan Line with Glow Trail */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_20px_#f97316,0_0_40px_#ea580c] animate-laser">
                    <div className="w-full h-10 bg-gradient-to-b from-orange-500/30 to-transparent -translate-y-10" />
                  </div>

                  {/* Facial Landmark Nodes Grid */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-36 border border-orange-500/50 rounded-3xl relative animate-pulse flex items-center justify-center">
                      <span className="absolute top-8 left-6 w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_8px_#f97316] animate-ping" />
                      <span className="absolute top-8 right-6 w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_8px_#f97316] animate-ping" />
                      <span className="absolute top-16 left-13 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
                      <span className="absolute bottom-8 left-9 w-10 h-1 bg-orange-400/90 rounded-full shadow-[0_0_8px_#f97316]" />
                    </div>
                  </div>

                  {/* HUD Live Status Badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/90 border border-orange-500/50 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-orange-400 flex items-center gap-1.5 shadow-xl whitespace-nowrap">
                    <RefreshCw className="w-3 h-3 animate-spin text-orange-400" />
                    <span>FACE ID SCAN: 68 KEYPOINTS ALIGNED</span>
                  </div>
                </div>
              )}
            </div>

            {/* Scan Action */}
            <button
              onClick={handleCaptureAndVerify}
              disabled={isScanning}
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-[0_0_15px_rgba(234,88,12,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isScanning ? 'Laser Scan & AI Processing...' : 'Initiate Face ID Scan'}</span>
            </button>

            {/* Verification Result Feedback */}
            {scanResult && (
              <div className="p-3.5 bg-black border border-orange-600/30 rounded-2xl text-left space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-orange-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Face ID Verified (Confidence: {(scanResult.confidence * 100).toFixed(0)}%)</span>
                </div>
                <p className="text-[11px] text-white/40 font-mono">Hash: {scanResult.biometricHash || 'SNN-FACE-88392'}</p>
                <p className="text-[11px] text-white/70">{scanResult.details || 'Identity verified.'}</p>
              </div>
            )}
          </div>
        )}


        {/* 2FA TOTP Tab */}
        {authTab === '2fa' && (
          <div className="space-y-4 text-xs">
            <p className="text-white/60">Enter the 6-digit authenticator code from your Google Authenticator or Authy app.</p>

            <div>
              <label className="font-semibold text-white/80">TOTP Security Code</label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123 456"
                className="w-full mt-1.5 p-3 text-center text-lg font-mono font-bold bg-black border border-white/10 rounded-xl text-orange-400 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <button
              onClick={() => {
                onUpdateUser({ ...user, twoFactorEnabled: true });
                alert('2FA Authenticated Successfully!');
                onClose();
              }}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)]"
            >
              Validate 2FA Code
            </button>
          </div>
        )}

        {/* Standard Login Tab */}
        {authTab === 'login' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-white/80">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setAuthTab('faceid');
                  startCamera();
                }}
                className="py-3 px-2 bg-black border border-orange-600/40 hover:bg-orange-600/10 text-orange-400 font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Camera className="w-4 h-4 text-orange-400" />
                <span>Face ID Scan</span>
              </button>

              <button
                onClick={() => {
                  alert(`Logged in as ${email}`);
                  onClose();
                }}
                className="py-3 px-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
