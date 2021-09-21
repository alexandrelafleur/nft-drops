const withPWA = require('next-pwa')
const node = {
    __dirname: false
}
module.exports = withPWA({
    pwa: {
        dest: 'public'
    },
    env: {
        ROOT: __dirname,
    }
})