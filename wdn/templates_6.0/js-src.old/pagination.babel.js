require(['dcf-pagination'], (DCFPaginationModule) => {
  const paginationNavs = document.querySelectorAll('.dcf-pagination');
  const pagination = new DCFPaginationModule.DCFPagination(paginationNavs);
  pagination.initialize();
});
