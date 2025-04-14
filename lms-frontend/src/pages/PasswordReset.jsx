// src/pages/PasswordReset.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const requestToken = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/password/reset-request?email=${email}`
      );
      alert(`Reset token sent to email. Token: ${res.data}`);
      setStep(2);
    } catch (err) {
      alert('Failed to request token');
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/password/reset', {
        token: resetToken,
        newPassword,
      });
      alert('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      alert('Password reset failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Reset Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={requestToken}
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
            Request Reset Token
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Reset Token"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={resetPassword}
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default PasswordReset;
