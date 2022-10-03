// export default plugins = ['gatsby-plugin-emotion'];

module.exports = {
  plugins: [
    'gatsby-plugin-emotion',
    {
      resolve: `gatsby-plugin-compile-es6-packages`,
      options: {
        modules: [`query-string`],
      },
    },
  ],
};
