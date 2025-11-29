//ecosystem.config

module.exports = {
    apps: [{
        name: 'vani-express-app',
        script: './server.js', // 진입점 명시

        // 코어 개수 만큼 실행시키기
        instances: 'max', // 코어 수 맞춰서
        exec_mode: 'cluster',

        // 환경 변수 설정
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        },

        // Draining 설정
        kill_timeout: 10000, // SIGINT보내고 10초 대기
        wait_ready: true,
    }]
}