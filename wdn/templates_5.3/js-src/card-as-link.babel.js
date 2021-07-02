require (['dcf-cardAsLink-module'], (cardAsLink) => {
  const cards = document.querySelectorAll('.dcf-card-as-link');
  const cardAsLinkInstance = new cardAsLink(cards);
  cardAsLinkInstance.initialize();
});
