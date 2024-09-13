import React, { useState } from 'react';
import './MoodPrompt.css';

interface MoodPromptProps {
  onSubmit: (mood: string) => void;
}

const MoodPrompt: React.FC<MoodPromptProps> = ({ onSubmit }) => {
  const [mood, setMood] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit(mood);
    }
  };

  return (
    <form className="mood-prompt" onSubmit={handleSubmit}>
      <div className={`input-container ${isInputFocused ? 'focused' : ''}`}>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder="How are you feeling?"
        />
        <button type="submit" disabled={!mood.trim()}>
          <span className="button-text">Find Music</span>
          <span className="button-icon">
            <i className="fas fa-search"></i>
          </span>
        </button>
      </div>
    </form>
  );
};

export default MoodPrompt;
