import axios from './axios';
import VueCookies from 'vue-cookies';


export async function login(mpnum, pwd){
   return axios.post('/login',{mpnum: mpnum , pwd: pwd})
   .then( (response)=> {
        var retvalue = response.data.rStatus;    
        if(response.status==200){            
             var token = null;
            console.log("loginresponse:"+response.data.rStatus);
            switch(response.data.rStatus){
                case 112: //invalid pwd 
                    console.log("invalid pwd");                    
                    break;
                case 111: // invalid login
                    console.log("invalid login");                  
                    break;
                case 0: // success
                    token = response.data.retObject.token;
                    console.log("inside login:"+response.data.retObject.token);
                    VueCookies.set('token', token, '30m');
                    //console.log(VueCookies.get('token'));
                    break;
                 default:  //etc...
                    break;
            }
            return retvalue;
        }
        else{
            console.log("서버에서 오류가 발생하였습니다.");
            return response.status;
        }
     }
    );
    /*
    try{
        const token = await axios.post('/login', {mpnum: id, pwd: pwd});
        VueCookies.set('token', token.data.data.token, '60s' );
        VueCookies.set('refresh_token', token.data.data.refresh_token, '30d' );
        axios.defaults.headers['refresh_token'] = VueCookies.get('refresh_token');
        return token;
    }catch(err){
        return err;
    }*/
}

export async function refreshToken(){
    try{
        const token = await axios.post('/refreshToken')
        VueCookies.set('token', token.data.data.token, '60s' );
        return token;
    }catch(err){
        return err;
    }
}
