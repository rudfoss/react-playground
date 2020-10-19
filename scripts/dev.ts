import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import wpConfig from "../webpack/webpack.config.dev"

const start = async () => {
	const config = await wpConfig()
	const server = new WebpackDevServer(webpack(config), config.devServer)

	server.listen(config.devServer?.port || 3000, (err) => {
		if (err) {
			console.error(err)
		}
	})
}

start().catch((error) => {
	console.error(error)
	process.exit(1)
})
