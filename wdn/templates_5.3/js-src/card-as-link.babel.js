require (['dcf-utility', 'dcf-cardAsLink'], (Utility) => {
  const cards = document.querySelectorAll('.dcf-card-as-link');
  const cardAsLink = new DCFCardAsLink(cards);
  cardAsLink.initialize();
});
