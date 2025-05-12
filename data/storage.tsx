export const generateRandomGradient = () => {
  const gradients = [
    ['#ff9a9e', '#fad0c4'],
    ['#a18cd1', '#fbc2eb'],
    ['#fbc2eb', '#a6c1ee'],
    ['#fdcbf1', '#e6dee9'],
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};