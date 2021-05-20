<template>
  <div role="group">
    <b-navbar variant="secondary"  style="height: 66px;" fixed="top">
        <router-link to = "/login">
          <b-icon icon= "arrow-left" aria-hidden="true" font-scale="3" style="color:white;"></b-icon>
        </router-link>
    </b-navbar>
    <br><br>
    <b-form>
    <b-form-group 
    class="mt-5"
    id="inoputPhone" 
    label="전화번호"
    label-for="input-phone"
    style="font-size: 1.5rem;"
    >
        <b-form-input
          class="mt-5"
          size="lg"
          style = "text-align:center;"
          id="input-phone"
          v-model="form.tel"
          :state="phoneState"
          type="tel"
          placeholder="Enter PhoneNumber"
          aria-describedby="input-live-help input-live-feedback"
          required
          lazy
        ></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          정확한 전화번호를 입력해 주세요
    </b-form-invalid-feedback>
      </b-form-group>
    <b-button block squared class="footer" :disabled="buttonCondition()" @click="onAssign(form.tel,form.assignNumber)">
        <span style="font-size: 2rem; color:black">{{this.form.buttonStatus}}</span>
    </b-button>

    <span v-if="this.form.buttonStatus == '인증번호 전송' ? false : true">
    <label for="" label-size="lg" style="font-size: 1.5rem; color:black;"> 인증번호</label>
      <b-input-group>
      <b-form-input
        style="text-align:center;"
        v-model="form.assignNumber"
        type="password"
        aria-describedby="input-live-help input-live-feedback"
        required
        size="lg"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="warning" :disabled="!(this.condition.resendButtonCondition)"  @click="resendbutton(form.tel)">재전송</b-button>
        </b-input-group-append>
      </b-input-group>

      <b-alert
      :show="this.condition.dismissCountDown"
      variant="warning"
      @dismissed="this.condition.dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>재전송 버튼이 {{ condition.dismissCountDown }}초 뒤 활성화됩니다.</p>
      <b-progress
        variant="warning"
        :max="this.condition.dismissSecs"
        :value="this.condition.dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>
    
        <br>
      </span>

    </b-form>
  </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
    name: 'signUp',
    created(){
    },
    computed:{
      phoneState(){
        if(this.form.tel.length==11){
          return true;
        }
        else if(this.form.tel.length==0){
            return null;
        }
        else{
          return false;
        }
      },
      assignNumberState(){
        if(this.form.assignNumber.length==6){
          return true;
        }
        else{
          return false;
        }
      }
    },
    data(){
        return{
          condition:{
          resendButtonCondition: true,
          times:5,
          dismissSecs: 15,
          dismissCountDown: 0,
          showDismissibleAlert: false
          }
          ,
          form:{
            isAssigning:false,
            buttonStatus:"인증번호 전송",
            tel:"",
            assignNumber:""
          },
          Msg:{
            successSignInMsg:"회원가입 성공하였습니다!!",
            alreadySignInMsg:"이미 가입되어있는 사용자입니다. 로그인 하시기 바랍니다.",
            errorMsg:"오류발생 재시도해주세요",
            serverErrorMsg:"서버오류 발생 재시도 부탁드립니다."
          }
        }
    },
    methods:{ 
      countDownChanged(dismissCountDown) {
        this.condition.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.condition.dismissCountDown = this.condition.dismissSecs
      },
      resendbutton(mpnum){
        this.condition.resendButtonCondition=false;
        if(this.condition.times>0){
        this.condition.times--;
        axios.post('/sendOTP',{mpnum: mpnum})
            .then((response)=>{
                console.log(response);
                if(response.status==200){
                    switch(response.data.rStatus){
                    case 0:
                      this.showAlert();
                      this.setTimer();
                      console.log("인증번호재전송");        
                    break;
                    default:
                      alert("error!");
                    break;}}
        else{alert("인증번호 전송 오류");}
      });
    }
    else{
      alert("재전송5회를 초과하였습니다.인증을 처음부터 진행해주세요");
    }
    },
      setTimer(){
        setTimeout(() => {
          this.condition.resendButtonCondition=true;
        },15000);
      }
      ,
      buttonCondition(){
        if(this.phoneState==true && this.form.isAssigning==false){
          return false;
        }
        else if(this.form.isAssigning==true && this.assignNumberState==true ){
          return false;
        }
        else{
          return true;
        }
      },
      makeRandom(min,max){
        var rand =Math.floor((Math.random()* (max-min+1))+min);
        alert(typeof(rand));
        return rand;
      },
      makepwd(){
          var ra1 =String(this.makeRandom(100000,999999));
          var ra2 =String(this.makeRandom(100000,999999));
          return ra1+ra2;
      },
      onAssign(mpnum,otp){
        if(this.form.buttonStatus=="인증번호 전송"){//인증번호 요청 로직 작성
            this.form.isAssigning=true;
            axios.post('/sendOTP',{mpnum: mpnum})
            .then((response)=>{
                console.log(response);
                if(response.status==200){
                    switch(response.data.rStatus){
                    case 0:
                        console.log("인증번호전송");
                        this.form.buttonStatus="다음";        
                    break;
                    default:
                      this.form.isAssigning=false;
                        alert("error!");
                    break;
                }
            }
        else{
            console.log("인증번호 전송 오류");
        }
    });
    }
        else{ //인증번호 전송 로직 작성
          const pwd = this.makepwd();
          axios.post('/checkOTP',{mpnum: mpnum, otp: otp, pwd: pwd})
          .then((response)=>{
            if(response.status==200){
              const token = response.data.retObject.token;
              switch(response.data.rStatus){
                case 0:
                    console.log("인증성공");
                    console.log(response);
                    VueCookies.set('token', token, '30min');
                    if(response.data.retObject.exist==1){
                      this.$router.push({name:'selectStore', params:{exist:false} });
                    }
                    else{
                      this.$router.push({name:'selectStore', params:{exist:false}});
                    }
                    break;
                case 201:
                    break;
                default:
                    break;
              }
            }
            else{
              console.log("인증번호 검사 오류");
            }
          });
         }
      }
  }
}
</script>

<style scoped>
  .footer{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 66px;
    background-color: #bac5c5;
  }
</style>