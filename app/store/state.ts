import { atom, selector } from 'recoil';

export const walletState = atom({
  key: 'WalletState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export const charWalletState = selector({
  key: 'charWalletState', // unique ID
  get: ({ get }: any) => {
    const text = get(walletState);
    return text;
  },
});