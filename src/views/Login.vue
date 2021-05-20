<template>
    <div class="vue-tempalte">
        <b-card class="inner-block vertical-center" > 
         <form>
           <h3>로그인</h3>

            <div class="form-group">
                <label>전화번호</label>
                <input type="email" class="form-control form-control-lg" />
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control form-control-lg" />
            </div>

            <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

            <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/authentication">회원가입</router-link>
            </p>
            </form>
          </b-card>
    </div>
</template>

<script>
import {login} from '../service/login'
import VueCookies from 'vue-cookies';

export default {
  name: 'login',
  data(){
    return {
      tel:null,
      password:null,
      formErrorMsg:"PhoneNumber error! please check your form",
      wrongPwdMsg:"invalid password",
      errorMsg: "error please retry login!!",
      invalidLoginMsg:"invalid login"
    }
  },
  created(){
      if(VueCookies.get('token')!=null){
        this.$router.push('/');
      }
      else{
        this.$router.push('/authentication');
      }
  },
  methods:{
    async onLogin(){
       await login(this.tel, this.password)
      .then((response)=>{
        switch(response){
          case 0:
            this.$router.push('/');
            break;
          case 111:
            alert(this.invalidLoginMsg);
            break;
          case 112:
             alert(this.wrongPwdMsg);
            break;
          case 101:
            alert(this.formErrorMsg);
            break;
          default:
            alert(this.errorMsg);
        }
      });
    },
    onSignUp(){
      this.$router.push('/authentication');
    }
  }
}
</script>
<style>
* {
  box-sizing: border-box;
}

.vertical-center {
  width: 100%;
  height: 100%;
  display: flex;
  border: #2554FF; 
}
.navbar-light {
  background-color: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
}
.vertical-center {
  text-align: left;
  justify-content: center;
  flex-direction: column;    
}
.inner-block {
  position:relative;
  width: 500px;
  margin-left: 35%;
  margin-top: 400px;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 15px;
  transition: all .3s;
}
.vertical-center .form-control:focus {
  border-color: #2554FF;
  box-shadow: none;
}
.vertical-center h3 {
  text-align: center;
  margin: 0;
  line-height: 1;
  padding-bottom: 20px;
}
label {
  font-weight: 500;
}
.forgot-password,
.forgot-password a {
  text-align: right;
  font-size: 13px;
  padding-top: 10px;
  color: #7a7a7a;
  margin: 0;
}
.forgot-password a {
  color: #2554FF;
}
</style>