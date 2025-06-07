import React, { createContext, useState, useContext } from 'react';

type SettingsContextType = {
  number: number;
  setNumber: (num: number) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [players, setPlayers] = useState<number>(2);
    const [cardsPerPlayer, setCardsPerPlayer] = useState<number>(5);

  return (
    <SettingsContext.Provider value={{ players, setPlayers, cardsPerPlayer, setCardsPerPlayer }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};