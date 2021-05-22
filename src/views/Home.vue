<template>
  <div class="home">
    <router-view></router-view>
    <img alt="subway" src="../assets/img_subway.png"  width="1500" height="1269" usemap="#menuMap"/>
  <map name ="menuMap" id="menuMap">
    <area shape="circle" coords="1346,494,3" alt="" title="Deokso" target="_blank" v-on:click="openSubway('서울역')"/>
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
      :items="items.item[items.btn_Index].timeTable"
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
    //for(var i=0;i<50;i++){
    //  this.uptime.push(undefined);
      //this.downtime.push(undefined);
    //}
    console.log("test!!!!!!");
    console.log(this.uptime);
    console.log("down")
    console.log(this.downtime);
    this.time();
  }
  ,
  data(){
    return{
      now:"00:00:00",
      row: 16,
      perPage:10,
      networkcheck:false,
      currentPage:1,
      modalElement:
      {
        headName:"None",
        showModal:false,
      },
      downTime:[],
      upTime:[],
      items:{
        btn_Index:0,
        btn_state:[{name:" ",state:false}],
        item:[
          {
          Id:"",
          timeTable:[],
          elementCount:{
            up:0,
            down:0
          },
          curIndex:0, //값이 들어와야하는 배열의 인덱스를 가리킴,
          page:1,
        }
        ],
        lineCount:0,
      }
    };
  },
   methods:{
     clock(){
       let date = new Date();
       var strHM = ("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2); // 00:00 형식
       this.now = this.timeconvert(strHM)+ " "+date.getSeconds();
     },
     time(){
       this.clock();
       setInterval(this.clock,1000);
     },
     makeJsonArr(count,Index){
       //  17
       console.log("count:"+count);
       this.upTime.sort((a,b)=> a-b);
       this.downTime.sort((a,b) => a-b);
       for(var i= 0 ; i < count ; i++){
          var json= new Object();
          if(!this.upTime[i])
            json.up= this.timeconvert((""+this.upTime[i]).substring(0,2)+":"+(""+this.upTime[i]).substring(2,4));
          else
            json.up = " ";
          if(!this.downTime[i])
            json.down= this.timeconvert((""+this.downTime[i]).substring(0,2)+":"+(""+this.downTime[i]).substring(2,4));
          else
            json.down=" ";
          this.items.item[Index].timeTable.push(json);
       }
       this.items.item[Index].curIndex = this.items.item[Index].curIndex + count;
       this.upTime.fill();
       this.downTime.fill();
     }
     ,
      timeconvert(time){
        var timeRegFormat = /^([0-9]{2}):([0-9]{2})$/;
        var timeToken = time.match(timeRegFormat);
        var ap=['오전','오후'];

        if(!timeToken){
          return " ";
        }
        var intH=parseInt(timeToken[1]);
        var intM=timeToken[2];
        var str12H = ('0'+(intH == 12 ? 12 : intH % 12 )).slice(-2);
        return ap[parseInt(intH/12)]+" " + str12H + "시" + intM +"분";
      },
     getJson(stationName){
       var str = "/SubwayInfoService/getKwrdFndSubwaySttnList?serviceKey="
       str = str+serviceKey+"&subwayStationName="
       var url = str+stationName
       axios.get(url)
        .then((response) => {
        var xml = response.data.response.body
        this.items.lineCount = xml.totalCount
        if(this.networkcheck == false){
          var json= new Object();
          this.networkcheck=true;
          this.items.item[0].Id = xml.items.item[0].subwayStationId
          json.name=xml.items.item[0].subwayRouteName;
          json.state = true;
          this.items.btn_state[0]=json;

          if(this.lineCount != 1 ){
            for(var i=1;i<this.lineCount;i++){
              var json2 =new Object();
              this.items.item[i].Id=xml.items.item[i].subwayStationId
              
              json2.name=xml.items.item[i].subwayRouteName;
              json2.state=false;
              this.items.btn_state[i]=json2;
            }
          }
        }
        this.getTimetable(this.items.item[0].Id,0)
      })
      },
      getDown(url,upCnt,Index){
        axios.get(url)
        .then((response)=> {
          console.log("upCnt"+upCnt+"Index"+Index);
          console.log("down");
          console.log(response);
          var rep=response.data.response.body
          this.items.item[Index].elementCount.down= rep.totalCount
          var cur = this.items.item[Index].curIndex;
           for( var j =0;j < 50 ; j++){
            if(cur >= this.items.item[Index].elementCount.down)
              break;
            this.downTime[j]= rep.items.item[j].depTime.toString();
            cur++;
            } 
          console.log("hey");
          console.log(this.downTime)
          console.log(this.upTime);
          if(j>upCnt)
            this.makeJsonArr(j);
          else
            this.makeJsonArr(upCnt);
        })
      },
      getup(urlUp,urlDown,Index){
        axios.get(urlUp)
        .then((response) => {
          var rep=response.data.response.body
          this.items.item[Index].elementCount.up= rep.totalCount
          var cur=this.items.item[Index].curIndex;
          for(var j=0 ; j < 50 ; j++){
            if(cur >= this.items.item[Index].elementCount.up)
              break;
            this.upTime[j] = rep.items.item[j].depTime.toString();
            cur++;
          } 
          console.log("up")
          console.log(response)
          this.getDown(urlDown,j,Index)
        })
      },
      btn_click(stationId){
        this.getTimetable(stationId);
      },
      getTimetable(stationId,Index){
        var str = "/SubwayInfoService/getSubwaySttnAcctoSchdulList?serviceKey="
        var url = str+serviceKey+"&subwayStationId="+stationId+numOfRows+"&dailyTypeCode=01&upDownTypeCode="
        var urlUp = url+"U"
        var urlDown = url+"D"
        urlUp=urlUp+pageNo+this.items.item[Index].page
        urlDown=urlDown+pageNo+this.items.item[Index].page
        this.getup(urlUp,urlDown,Index)
      },
     openSubway(subName){
       this.getJson(subName);
       this.modalElement.showModal=true;
       this.modalElement.headName=subName;
     }
  }
}
</script>
