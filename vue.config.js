module.exports={
    devServer:{
        proxy:{
            '/':{
                target: 'http://openapi.tago.go.kr/openapi/service',
                changeOrigin:true
            }
        }
    }
} 