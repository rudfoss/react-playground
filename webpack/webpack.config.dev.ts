import webpack from "webpack"
import path from "path"

import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import HtmlPlugin from "html-webpack-plugin"

const rootPath = path.resolve(__dirname, "../")
const indexPath = path.resolve(rootPath, "./src/index.ts")
const indexHtmlPath = path.resolve(rootPath, "./src/index.html")
const distPath = path.resolve(rootPath, "./dist")
const tsConfigPath = path.resolve(rootPath, "./tsconfig.json")

const port = 3000

export default async () => {
	const config: webpack.Configuration = {
		mode: "development",
		target: "web",
		devtool: "source-map",

		devServer: {
			historyApiFallback: true,
			hot: true,
			https: true,
			overlay: true,
			inline: true,
			port,
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		},

		entry: [indexPath],
		output: {
			filename: "js/[name]-[contenthash].js",
			chunkFilename: "js/[name]-[contenthash].js",
			publicPath: `https://localhost:${port}/`, // The last / is critical, without it reloading breaks
			path: distPath
		},

		resolve: {
			extensions: [".js", ".ts", ".tsx"],
			plugins: [
				new TsConfigPathsPlugin({
					configFile: tsConfigPath
				})
			]
		},

		plugins: [
			new ForkTSCheckerPlugin(),
			new ReactRefreshWebpackPlugin(),
			new HtmlPlugin({
				template: indexHtmlPath,
				minify: false
			})
		],

		module: {
			rules: [
				{
					exclude: /node_modules/,
					test: /\.[jt]sx?$/,
					use: [
						{
							loader: "babel-loader",
							options: {
								babelrc: false,
								presets: [
									[
										"@babel/preset-env", // Adds dynamic imports of the necessary polyfills (see .browserslistrc for spec)
										{
											useBuiltIns: "usage",
											corejs: { version: 3, proposals: true },
											debug: false
										}
									],
									"@babel/preset-typescript",
									"@babel/preset-react"
								],
								plugins: [
									["@babel/plugin-proposal-class-properties", { loose: true }],
									"@babel/plugin-transform-runtime"
								]
							}
						}
					]
				}
			]
		}
	}

	return config
}
