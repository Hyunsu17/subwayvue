<template>
    <div>
        <b-card style="margin-top: 70px">
        <b-navbar variant="secondary"  style="height: 66px;" fixed="top">
        </b-navbar>
        <label  for="selecStore" style="font-size: 1.5rem; margin-top: 10%" >독서실 선택</label>
        <b-form-select id="selectStore" v-model="form.Store" ref="selectedStore" style="text-align-last: center;" required size="lg"  >
            <template #first>
            <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
            <b-form-select-option v-for="shp in storeList" :key="shp.shpId" :value="shp.shpId">{{shp.shpNm}}</b-form-select-option>
            </template>
        </b-form-select>
        </b-card>
              <b-button block squared :disabled="storeSelected()" class="footer"  @click="buttonClicked"> 
        <span style="font-size: 2rem; color:black">다음</span>
    </b-button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            form:{
                Store:""
            },
            storeList: this.requestList()
    }
    },
    methods:{
    storeSelected(){
        if(this.form.Store != ""){
          return false;
    }
        else{
          return true;
        }
    },
    buttonClicked(){
      const exist=this.$route.params.exist;
       var shId=this.form.Store;
       alert(shId);
      if(exist===false){
        alert("success false");
        this.$router.push({name :'signUp',params:{shpId:shId}});
      }
      else if(exist===true){
        this.$router.push('/');
      }
    }
    ,
    requestList(){
        axios.post('/shop')
        .then((response)=>
        {
          if(response.status==200){
            console.log(response);
            this.storeList=response.data.retList;
            if(this.storeList.length==1){
              //휴대폰에 저장 알고리즘 
              
              //router 이동
              //this.$router.push('/signUp');
            }
          }
          else{
            alert(this.Msg.serverErrorMsg);
            return null;
          }
        });
      },
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