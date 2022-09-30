exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const dataSource = { thirdSlideTitle: '예방 행동 수칙' };

  createPage({
    path: '/',
    component: require.resolve('./src/templates/single-page.js'),
    context: { dataSource },
  });
};
