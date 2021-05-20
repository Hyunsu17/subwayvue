<template>
  <div class="home">
    <router-view></router-view>
    <img alt="subway" src="../assets/img_subway.png"  width="1500" height="1269" usemap="#menuMap"/>
  <map name ="menuMap" id="menuMap">
    <area shape="circle" coords="1346,494,3" alt="" title="Deokso" target="_blank" v-on:click="openSubway('덕소')"/>
    <area shape="circle" coords="973,358,50" alt="" title="Deokso" target="_blank" href="https://www.naver.com" style="background-color=#0000FF;"/>
    <area shape="circle" coords="963,340,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
    <area shape="circle" coords="964,320,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/> 
    <area shape="circle" coords="963,300,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
    <area shape="circle" coords="955,286,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
    <area shape="circle" coords="973,358,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
    <area shape="circle" coords="973,358,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
    <area shape="circle" coords="973,358,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
    <area shape="circle" coords="973,358,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
    <area shape="circle" coords="973,358,2" alt="" title="Deokso" target="_blank" href="https://www.naver.com"/>
  </map>
  <Modal v-if="modalElement.showModal" @close="modalElement.showModal=false">
    <h3 slot="header">
      {{modalElement.headName}}
      <i class="fas fa-times caloseModalBtn" @click="modalElement.showModal = false"></i>
    </h3>
    <div slot="body">
      <h3>현재시각<b-badge>{{this.now}}</b-badge></h3>
      <b-table
      id="my-table"
      :items="stationElemnt.items"
      :per-page="perPage"
      :current-page="currentPage"
    ></b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="this.row"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
    </div>
  </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import Modal from "./Modal";

const serviceKey='DkNcb3tEZkL2B%2BjFFBOTbBbYKsgkcFKs4g06IxAbjr40J6g6LMdwA8xSUFGPzpaSf8uHY4tsk%2F0992PQAAvcHw%3D%3D'

const numOfRows= '&numOfRows=50'
const pageNo="&pageNo="

export default {
  name: 'home',
  components: {
  Modal,
  },
  created(){
  },
  mounted(){
  }
  ,
  data(){
    return{
      now:"00:00:00",
      row: 16,
      perPage:10,
      currentPage:1,
      modalElement:
      {
        headName:"None",
        showModal:false,
        lineCount:0,
        lineName:[], 
        Id:[]
      },
      stationElemnt:{
        downPage:1,
        upPage:1,
        downCnt:0,
        upCnt:0,
        items:[],
        upTime:[],
        downTime:[]
      }
    };
  },
   methods:{
     clock(){
       let date = new Date();
       this.now = this.timeconvert(date.getHours() + ":"
       +date.getMinutes())+" "+date.getSeconds();
     },
     time(){
       this.clock();
       setInterval(this.clock,1000);
     },
     makeJsonArr(cur,scp){
       this.stationElemnt.upTime.sort((a,b)=> a-b);
       this.stationElemnt.downTime.sort((a,b) => a-b);
       for(var i=cur; i <= scp;i++){
          var json= new Object();
          json.up= this.timeconvert(this.stationElemnt.upTime[i].substring(0,2)+":"+this.stationElemnt.upTime[i].substring(2,4));
          json.down= this.timeconvert(this.stationElemnt.downTime[i].substring(0,2)+":"+this.stationElemnt.downTime[i].substring(2,4));
          this.stationElemnt.items.push(json);
       }
     }
     ,
     getJson(stationName){
       var str = "/SubwayInfoService/getKwrdFndSubwaySttnList?serviceKey="
       str = str+serviceKey+"&subwayStationName="
       var url = str+stationName
       axios.get(url)
        .then((response) => {
        console.log(response)
        var xml = response.data.response.body
        this.lineCount = xml.totalCount
        if(this.lineCount == 1 ){
           this.modalElement.Id.push(xml.items.item.subwayStationId)
           this.modalElement.lineName.push(xml.items.item.subwayRouteName)
        }
        else{
          var i
          for(i=0;i<this.lineCount;i++){
            this.modalElement.lineName.push(xml.items.item[i].subwayRouteName)
            this.modalElement.Id.push(xml.items.item[i].subwayStationId)
          }
        }
        for(i=0;i<this.lineCount;i++){
          this.getTimetable(this.modalElement.Id[i])
         }
      })
      },
      timeconvert(time){
        var timeRegFormat = /^([0-9]{2}):([0-9]{2})$/;
        var timeToken = time.match(timeRegFormat);
        var ap=['오전','오후'];

        var intH=parseInt(timeToken[1]);
        var intM=timeToken[2];
        var str12H = ('0'+(intH == 12 ? 12 : intH % 12 )).slice(-2);
        console.log(ap[parseInt(intH/12)]+" " + str12H + "시" + intM);
        return ap[parseInt(intH/12)]+" " + str12H + "시" + intM +"분";
      },
      getDown(url){
        axios.get(url)
        .then((response)=> {
          var rep=response.data.response.body
          var j =0;
          this.stationElemnt.downCnt= rep.totalCount
           for(var i=(this.stationElemnt.downPage-1)*50 ;i < this.stationElemnt.downPage*50 ; j++, i++){
            if(i >= this.stationElemnt.downCnt)
              break;
            this.stationElemnt.downTime[i]= rep.items.item[j].depTime.toString();
            } 
          console.log("down")
          console.log(response)
          this.makeJsonArr(0,49)
        })
      },
      getup(urlUp,urlDown){
        axios.get(urlUp)
        .then((response) => {
          var rep=response.data.response.body
          this.stationElemnt.upCnt= rep.totalCount
          var j =0
          for(var i=(this.stationElemnt.upPage-1)*50 ;i < this.stationElemnt.upPage*50 ; j++, i++){
            if(i >= this.stationElemnt.upCnt)
              break;
            this.stationElemnt.upTime[i] = rep.items.item[j].depTime.toString();
          } 
          console.log("up")
          console.log(response)
          this.getDown(urlDown)
        })
      },
      getTimetable(stationId){
        var str = "/SubwayInfoService/getSubwaySttnAcctoSchdulList?serviceKey="
        var url = str+serviceKey+"&subwayStationId="+stationId+numOfRows+"&dailyTypeCode=01&upDownTypeCode="
        var urlUp = url+"U"
        var urlDown = url+"D"
        urlUp=urlUp+pageNo+this.stationElemnt.upPage
        urlDown=urlDown+pageNo+this.stationElemnt.downPage
        this.getup(urlUp,urlDown)
       
      }
      ,
     openSubway(subName){
       this.time();
       this.getJson(subName);
       this.modalElement.showModal=true;
       this.modalElement.headName=subName;
     }
  }
}
</script>
