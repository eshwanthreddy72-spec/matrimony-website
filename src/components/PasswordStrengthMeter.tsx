import React from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  confirmPassword?: string;
  showCriteria?: boolean;
}

export interface PasswordAnalysis {
  score: number; // 0 to 4
  label: string;
  colorClass: string;
  barColorClass: string;
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  isMatch?: boolean;
}

export function analyzePassword(password: string, confirmPassword?: string): PasswordAnalysis {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const passedCount = Object.values(criteria).filter(Boolean).length;

  let score = 0;
  let label = 'Very Weak';
  let colorClass = 'text-rose-600';
  let barColorClass = 'bg-rose-500';

  if (!password) {
    score = 0;
    label = 'Empty';
    colorClass = 'text-slate-400';
    barColorClass = 'bg-slate-200';
  } else if (password.length < 6) {
    score = 1;
    label = 'Too Short (Min 6)';
    colorClass = 'text-rose-600';
    barColorClass = 'bg-rose-500';
  } else if (passedCount <= 2) {
    score = 1;
    label = 'Weak';
    colorClass = 'text-rose-600';
    barColorClass = 'bg-rose-500';
  } else if (passedCount === 3) {
    score = 2;
    label = 'Fair';
    colorClass = 'text-amber-600';
    barColorClass = 'bg-amber-500';
  } else if (passedCount === 4) {
    score = 3;
    label = 'Good';
    colorClass = 'text-sky-600';
    barColorClass = 'bg-sky-500';
  } else {
    score = 4;
    label = 'Strong';
    colorClass = 'text-emerald-600';
    barColorClass = 'bg-emerald-600';
  }

  const isMatch =
    confirmPassword !== undefined && confirmPassword.length > 0
      ? password === confirmPassword
      : undefined;

  return {
    score,
    label,
    colorClass,
    barColorClass,
    criteria,
    isMatch
  };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  confirmPassword,
  showCriteria = true
}) => {
  if (!password && !confirmPassword) return null;

  const analysis = analyzePassword(password, confirmPassword);

  return (
    <div className="space-y-2 mt-2 pt-1">
      {/* Strength Bar & Label */}
      {password.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-600 flex items-center space-x-1">
              {analysis.score >= 3 ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : analysis.score >= 2 ? (
                <Shield className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span>Security Strength:</span>
            </span>
            <span className={`font-bold ${analysis.colorClass}`}>
              {analysis.label}
            </span>
          </div>

          {/* 4-Segment Gauge Bar */}
          <div className="grid grid-cols-4 gap-1.5 h-1.5">
            {[1, 2, 3, 4].map((step) => {
              const isFilled = analysis.score >= step;
              return (
                <div
                  key={step}
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFilled ? analysis.barColorClass : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time Requirement Checklist */}
      {showCriteria && password.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
          <div
            className={`flex items-center space-x-1.5 font-medium transition-colors ${
              analysis.criteria.length ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {analysis.criteria.length ? (
              <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[2.5]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 ml-1 mr-0.5" />
            )}
            <span>8+ characters</span>
          </div>

          <div
            className={`flex items-center space-x-1.5 font-medium transition-colors ${
              analysis.criteria.uppercase && analysis.criteria.lowercase
                ? 'text-emerald-700'
                : 'text-slate-500'
            }`}
          >
            {analysis.criteria.uppercase && analysis.criteria.lowercase ? (
              <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[2.5]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 ml-1 mr-0.5" />
            )}
            <span>Upper & lower case</span>
          </div>

          <div
            className={`flex items-center space-x-1.5 font-medium transition-colors ${
              analysis.criteria.number ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {analysis.criteria.number ? (
              <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[2.5]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 ml-1 mr-0.5" />
            )}
            <span>At least 1 number</span>
          </div>

          <div
            className={`flex items-center space-x-1.5 font-medium transition-colors ${
              analysis.criteria.special ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {analysis.criteria.special ? (
              <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[2.5]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 ml-1 mr-0.5" />
            )}
            <span>1 special symbol (@, #, !)</span>
          </div>
        </div>
      )}

      {/* Password Match Indicator */}
      {confirmPassword !== undefined && confirmPassword.length > 0 && (
        <div className="pt-1">
          {analysis.isMatch ? (
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>Passwords match perfectly</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-[11px] text-rose-700 font-semibold bg-rose-50/80 px-2.5 py-1 rounded-lg border border-rose-200/60">
              <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
              <span>Passwords do not match yet</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
