require (['dcf-cardAsLink'], (cardAsLinkModule) => {
  const cards = document.querySelectorAll('.dcf-card-as-link');
  const cardAsLink = new cardAsLinkModule.DCFCardAsLink(cards);
  cardAsLink.initialize();
});
