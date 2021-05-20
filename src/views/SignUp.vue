<template>
  <div role="group">
    <b-navbar variant="secondary"  style="height: 66px;" fixed="top">
    </b-navbar>
    <br><br>
    <b-card class="mt-5" 
    style="box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
     border-radius: 15px;">
    <b-form>
    <b-form-group 
    class="mt-5"
    id="inoputName" 
    label="사용자 정보 입력"
    label-for="input-name"
    style="font-size: 1.5rem;"
    >
    <label class="mt-4" for="" style="font-size: 1.5rem;">이름</label>
        <b-form-input
          class="mt-2"
          size="lg"
          style = "text-align:center;"
          id="input-name"
          v-model="form.mberNam"
          :state="nameState"
          placeholder="Enter Your Name"
          aria-describedby="input-live-help input-live-feedback"
          required
          lazy
        ></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          이름 2글자 이상 입력해주세요
        </b-form-invalid-feedback>
      </b-form-group>
        <label  class="mt-3" for="input-date" style="font-size: 1.5rem;">생년월일</label>
       <b-form-input
          size="lg"
          style = "text-align:center;"
          id="input-date"
          v-model="date"
          type="date"
          aria-describedby="input-live-help input-live-feedback"
          min="1900-01-01"
          :max="today()"
          required
          lazy
        ></b-form-input>
    <label class="mt-4" for="selectGender" style="font-size: 1.5rem;">성별</label>
  <b-form-select id="selectGender" style="text-align-last: center;" v-model="form.gndrSeCd" required size="lg"  >
    <template #first>
    <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
    </template>
    <b-form-select-option value="M">남성</b-form-select-option>
    <b-form-select-option value="F">여성</b-form-select-option>
  </b-form-select>

   <label class="mt-4" for="" style="font-size: 1.5rem;">보호자 번호(*선택*)</label>
        <b-form-input
          class="mt-2"
          size="lg"
          style = "text-align:center;"
          id="input-parentnumber"
          v-model="form.prtcManTelno"
          placeholder="출입시 보호자 번호로 알람이 발송됩니다."
          aria-describedby="input-live-help input-live-feedback"
          lazy
        ></b-form-input>
    </b-form>
    </b-card>
    <b-button block squared :disabled="buttonCondition()" class="footer" type="submit" @click="onSignUp()" > 
        <span style="font-size: 2rem; color:black">다음</span>
    </b-button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'signUp',
    computed:{
      nameState(){
        if(this.form.mberNam.length > 1 && this.form.mberNam.length<7){
          return true;
        }
        else if(this.form.mberNam.length==0){
            return null;
        }
        else{
          return false;
        }
      }
    },
    data(){
        return{
          date:"",
          form:{
            mberNam:"",
            gndrSeCd:"",
            prtcManTelno:"",
            brYr:"",
            shpId:this.$route.params.shpId
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
      genderSelected(){
        if(this.form.gndrSeCd=="M"|| this.form.gndrSeCd=="F"){
          return true;
        }
        else{
          return false;
        }
      },
      buttonCondition(){
        if(this.genderSelected()==true&&this.nameState==true){
          return false;
        }
        else{return true;}
      },
      leadingZeros(n,digits){
        var zero='';
        n=n.toString();
        var i;
        if(n.length<digits){
          for(i=0;i<digits-n.length;i++)
          zero+='0';
        }
        return zero+n;
      },
      getTimeStamp(){
        var d= new Date();
        var s=
        this.leadingZeros(d.getFullYear(),4)+'-'+
        this.leadingZeros(d.getMonth()+1,2)+'-'+
        this.leadingZeros(d.getDate(),2);
        return s;
      },
      getYear(){
        var year = this.date.toString();
        this.form.brYr=year.substring(0,4);
      }
      ,
      today(){
        return this.getTimeStamp();
      },
      onSignUp(){
        this.getYear();
        alert(this.form.shpId);
        axios.post('/user/updateUser',this.form)
        .then((response)=>{
          if(response.status==200){
            console.log(response);
            switch(response.data.rStatus){
              case 0:
                alert(this.Msg.successSignIn);
                alert("success");               
               // this.$router.push('/');
                break;
              case 1:
                alert(this.Msg.alreadySignInMsg);
                break;
              default:
                alert(this.Msg.errorMsg);
                break;
            }
          }
          else{
            alert(this.Msg.serverErrorMsg);
        }
      });
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