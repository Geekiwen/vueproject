module.exports = {
    devServer: {
        port: 8000,
        proxy: {
            '/api': {
                target: 'http://localhost:3300',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            "/ego_api": {
                target: "http://121.42.14.194:9011",
                changeOrigin: true,
                pathRewrite: {
                    '^/ego_api': ''
                }
            },
            '/content_api': {
                target: 'http://121.42.14.194:9021',
                pathRewrite: {
                    '^/content_api': ''
                },
                changeOrigin: true
            },
        }
    }
}
