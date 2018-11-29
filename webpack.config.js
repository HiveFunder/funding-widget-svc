const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const common = {
  context: __dirname + '/client',
  devtool: 'source-map',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};

const frontend = {
   entry: './index.jsx',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'public'),
   },
   module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
      },
    ],
  },
  externals: {
    // Use external version of React. Make sure they are the same names used in the imports in JSX files!
    "react": "React",
    "react-dom": "ReactDOM"
  },
   // other loaders, plugins etc. specific for frontend
};

const server = {
   entry: './server.js',
   output: {
     filename: 'bundle.server.js',
     path: path.resolve(__dirname, 'public'),
     libraryTarget: 'commonjs-module'
   },
   target: 'node',
   externals: [nodeExternals()],
   module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        loader: 'isomorphic-style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
      },
    ],
  }
};

module.exports = [
  Object.assign({} , common, frontend),
  Object.assign({} , common, server)
];
