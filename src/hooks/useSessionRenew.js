import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpiresAt, saveToken, saveExpiresAt, logout, renewToken } from '../services/authService';

// Renew 3 min before expiry; warn 1 min before expiry
const RENEW_BEFORE_MS = 3 * 60 * 1000;
const WARN_BEFORE_MS  = 60 * 1000;

export function useSessionRenew() {
  const navigate              = useNavigate();
  const [phase, setPhase]     = useState('ok');      // 'ok' | 'renewing' | 'renewed' | 'warning'
  const [secLeft, setSecLeft] = useState(0);
  const [schedV, setSchedV]   = useState(0);

  const phaseRef   = useRef('ok');
  const renewRef   = useRef(null);
  const warnRef    = useRef(null);
  const cdRef      = useRef(null);
  const dismissRef = useRef(null);

  const changePhase = (p) => { phaseRef.current = p; setPhase(p); };

  useEffect(() => {
    const expMs = getExpiresAt();
    if (!expMs) return;

    const msLeft = expMs - Date.now();
    if (msLeft <= 0) { logout(); navigate('/login'); return; }

    const startCountdown = () => {
      if (phaseRef.current === 'warning') return;
      let secs = Math.max(1, Math.floor((getExpiresAt() - Date.now()) / 1000));
      setSecLeft(secs);
      changePhase('warning');
      cdRef.current = setInterval(() => {
        secs--;
        if (secs <= 0) {
          clearInterval(cdRef.current);
          logout();
          navigate('/login');
        } else {
          setSecLeft(secs);
        }
      }, 1000);
    };

    const doRenew = async () => {
      if (phaseRef.current === 'warning') return;
      changePhase('renewing');
      try {
        const res = await renewToken();
        saveToken(res.data.sessionToken);
        saveExpiresAt(res.data.expiresAtMs);
        changePhase('renewed');
        dismissRef.current = setTimeout(() => changePhase('ok'), 3000);
        setSchedV(v => v + 1);
      } catch {
        startCountdown();
      }
    };

    const renewIn = msLeft - RENEW_BEFORE_MS;
    const warnIn  = msLeft - WARN_BEFORE_MS;

    if (renewIn > 0) {
      renewRef.current = setTimeout(doRenew, renewIn);
    } else {
      doRenew();
    }

    if (warnIn > 0) {
      warnRef.current = setTimeout(
        () => { if (phaseRef.current === 'ok') startCountdown(); },
        warnIn
      );
    } else if (phaseRef.current === 'ok') {
      startCountdown();
    }

    return () => {
      clearTimeout(renewRef.current);
      clearTimeout(warnRef.current);
      clearInterval(cdRef.current);
    };
  }, [navigate, schedV]); // eslint-disable-line react-hooks/exhaustive-deps

  // dismissRef survives effect re-runs; clean up only on unmount
  useEffect(() => () => clearTimeout(dismissRef.current), []);

  return { phase, secLeft };
}
