const wallet = [
  {
    walletCode: 'Anchor',
    walletName: 'Anchor',
    decription: 'Connect with your Anchor Wallet',
    image: 'images/wallet/anchor.png',
  },
];

const getWallet = () => {
  let walletData = wallet;
  return walletData;
};

const attachWallet = (walletCode) => {
  // if walletCode == 'something' {}
  const walletDetails = wallet.filter((w) => w.walletCode === walletCode);
  const walletInfo = walletDetails[0] ? walletDetails[0] : null;

  alert(JSON.stringify(walletInfo));
};

export default {
  getWallet,
  attachWallet,
};
