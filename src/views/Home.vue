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
    <area shape="circle" coords="717,559,3" alt="" title="Deokso" target="_blank" v-on:click="openSubway('서울역')"/>
    <area shape="circle" coords="775,558,3" alt="" title="Deokso" target="_blank" v-on:click="openSubway('회현')"/>
    <area shape="circle" coords="817,559,3" alt="" title="Deokso" target="_blank" v-on:click="openSubway('명동')"/>
    <area shape="circle" coords="860,559,3" alt="" title="Deokso" target="_blank" v-on:click="openSubway('충무로')"/>
    <area shape="circle" coords="775,558,3" alt="" title="Deokso" target="_blank" v-on:click="openSubway('')"/>
  </map>
  <Modal v-if="modalElement.showModal" @close="modalElement.showModal=false">
    <h3 slot="header">
      {{modalElement.headName}}
      <i class="fas fa-times caloseModalBtn" @click="modalElement.showModal = false"></i>
    </h3>
    <div slot="body">
      <h3>현재시각<b-badge>{{this.now}}</b-badge></h3>
       <b-alert v-if="downAlert" show variant="light"> 상행성 다음열차출발까지{{this.uptimeAlert}}분 만큼 남았습니다. </b-alert>
       <b-alert v-if="upAlert" show variant="light"> 하행선 다음열차출발까지 {{this.downtimeAlert}}분 만큼 남았습니다 </b-alert>
          <b-button-group v-if="this.items.btn_state">
          <b-button variant="info"
            v-for="(btn) in items.btn_state" 
            :key="btn.name"
            :pressed.sync="btn.state"
            v-on:click="btn_click(btn.name)"
       >
            {{btn.name}}
            </b-button>
          </b-button-group>
     <div class="overflow-auto">
      <b-table
      id="my-table"
      :items="items.item[items.btn_Index].timeTable"
      :per-page="perPage"
      :current-page="currentPage"
    ></b-table>
    <b-pagination
      Id="paging"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      next-text="Next"
      prev-text="Prev"
      aria-controls="my-table"
    ></b-pagination>
    </div>
  </div>
  </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import Modal from "./Modal";

const serviceKey='DkNcb3tEZkL2B%2BjFFBOTbBbYKsgkcFKs4g06IxAbjr40J6g6LMdwA8xSUFGPzpaSf8uHY4tsk%2F0992PQAAvcHw%3D%3D'

const numOfRows= '&numOfRows=300'
const pageNo="&pageNo="

export default {
  name: 'home',
  components: {
  Modal,
  },
  computed:{
    rows(){
      return this.items.item[this.items.btn_Index].curIndex;
    }
  },
  created(){
  },
  mounted(){
    this.time();
  }
  ,
  data(){
    return{
      now:"00:00:00",
      perPage:10,
      networkcheck:false,
      currentPage:1,
      downtimeAlert:0,
      uptimeAlert:0,
      downAlert:false,
      upAlert:false,
      modalElement:
      {
        modalOn:false,
        headName:"None",
        showModal:false,
      },
      downTime:[],
      upTime:[],
      items:{
        subaname:"",
        btn_Index:0, //현재 선택된 노선 인덱스
        btn_state:[{name:" ",state:false}], 
        item:[
          {
          Id:"",
          timeTable:[],
          elementCount:{ //각 노선별 시간표 개수
            up:-1,
            down:-1
          },
          timeIndex:{ // 현재 가장 가까운 시간 인덱스
            up:-1,
            down:-1
          },
          curIndex:0, //값이 들어와야하는 배열의 인덱스를 가리킴,
          page:1, //현재 페이지 
        }
        ],
        lineCount:0, 
        numOfRows:0
      },
      msg:{
        em: "서두르셔야합니다.",
        sl: "아직 여유가 있습니다",
        ma: "많이 기다리셔야 합니다"
      }
    };
  },
   methods:{
     setClock(){
       this.now = this.clock();
     },
     clock(){
      let date = new Date();
      var strHM = ("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2); //오전 00:00 형식
      return this.timeconvert(strHM)+" "+date.getSeconds();
      },
     time(){
       this.setClock();
       setInterval(this.setClock,1000);
     },
     rowTime(str){
       var hourInt;
       var minInt;
       if(str.slice(0,2) == "오전" ){
        hourInt = parseInt(str.slice(3,5));
        minInt = parseInt(str.slice(6));
      }
       else if(str.slice(0,2) == "오후"){
        hourInt = parseInt(str.slice(3,5))+12;
        minInt = parseInt(str.slice(6));
       }
       else{
         //console.log("check부탁");
         //console.log(str);
         return null;
       }
       var rep = ("0"+hourInt).slice(-2) + ("0"+minInt).slice(-2); 
      // console.log("rowTime");
      // console.log(rep);
       return rep;
     },
     compareTimeup(element){ //시간이 t1이 빠르면 1 return t2가 빠르면 2 return
        var time1 = this.rowTime(element.up);
        var time2 = this.rowTime(this.clock());
        if(!time1){
          return false;
        }
        if(time1 >= time2)
          return true;
        else
          return false;
      },
      compareTimedown(element){
        var time1 = this.rowTime(element.down);
        var time2 = this.rowTime(this.clock());
        if(!time1){
          return false;
        }
        if(time1 >= time2)
          return true;  
        else
          return false; 
      },
      updateTime(){
        var now = this.rowTime(this.clock());
        now =parseInt(now.slice(0,2))*60+parseInt(now.slice(2,4));
        var downItv;
        var upItv;
        var uptime;
        var downtime;
        var Index =this.items.btn_Index;
        if(this.items.item[this.items.btn_Index].timeIndex.up != -1){
          uptime = this.rowTime(this.items.item[Index].timeTable[this.items.item[Index].timeIndex.up]);
          upItv=parseInt(uptime.slice(0,2))*60+parseInt(uptime.slice(2,4));
          console.log(upItv);
          this.uptimeAlert= now - uptime;
          this.upAlert=true;
          if(this.uptimeAlert < 0 )
            this.setCurrentTable(this.items.btn_Index);
        }
        else{
          this.upAlert = false;
        }
        if(this.items.item[this.items.btn_Index].timeIndex.down != -1){
          downtime = this.rowTime(this.items.item[Index].timeTable[this.items.item[Index].timeIndex.down]);
          downItv=parseInt(downtime.slice(0,2))*60+parseInt(downtime.slice(2,4));
          console.log(downItv);
          this.downAlert=true;
          this.downtimeAlert= now - downtime;
          if(this.downtimeAlert<0)
            this.setCurrentTable(this.items.btn_Index);
        }
        else{
          this.downAlert=false;
        }
         setInterval(this.updateTime,10000);
      }
      ,
     setCurrentTable(Index){
      if(this.items.item[Index].timeIndex.down != -1){
        this.items.item[Index].timeTable[this.items.item[Index].timeIndex.down]._cellVariants.down=" ";
        console.log(this.items.item[Index].timeTable[this.items.item[Index].timeIndex.down]._cellVariants.up);
        }
      if(this.items.item[Index].timeIndex.up != -1){
        this.items.item[Index].timeTable[this.items.item[Index].timeIndex.up]._cellVariants.up=" ";
        console.log(this.items.item[Index].timeTable[this.items.item[Index].timeIndex.up]._cellVariants.down);
      
      }
      if(this.items.item[Index].elementCount.down != 0){
        this.items.item[Index].timeIndex.down =this.items.item[Index].timeTable.findIndex(this.compareTimedown);
        console.log("dlfs" + this.items.item[Index].timeIndex.down);
        this.items.item[Index].timeTable[this.items.item[Index].timeIndex.down]._cellVariants.down="success";
      }
      console.log("upcount:"+this.items.item[Index].elementCount.up );
      if(this.items.item[Index].elementCount.up != 0){
        this.items.item[Index].timeIndex.up = this.items.item[Index].timeTable.findIndex(this.compareTimeup); 
        this.items.item[Index].timeTable[this.items.item[Index].timeIndex.up]._cellVariants.up="success";
      }
      console.log(this.items.item[Index].timeIndex.up);
      console.log(this.items.item[Index].timeIndex.down);
      if(this.items.item[Index].timeIndex.up == -1){
        if(this.items.item[Index].timeTable.down == -1){
            console.log("notinformation down and up!!")
          }
          else{
            console.log("notinformation up!!");
            this.currentPage = parseInt(this.items.item[Index].timeIndex.down/10)+1;
            console.log(this.currentPage);
            }
      }
      else{
            this.currentPage = parseInt(this.items.item[Index].timeIndex.up/10)+1;
      }
     },
     makeJsonArr(count,Index){
       this.upTime.sort((a,b)=> a-b);
       this.downTime.sort((a,b) => a-b);
       console.log(this.items.item[Index].timeTable);
       for(var i= 0 ; i < count ; i++){
          var json= new Object();
          var json2= new Object();
          if(!this.upTime[i])
            json.up = " ";
          else
            json.up= this.timeconvert((""+this.upTime[i]).substring(0,2)+":"+(""+this.upTime[i]).substring(2,4));
          if(!this.downTime[i])
            json.down=" ";
          else
            json.down= this.timeconvert((""+this.downTime[i]).substring(0,2)+":"+(""+this.downTime[i]).substring(2,4));
          json2.up='';
          json2.down='';
          json._cellVariants=json2;
          this.items.item[Index].timeTable.push(json);
       }
       this.items.item[Index].curIndex = this.items.item[Index].curIndex + count;
       this.setCurrentTable(Index);
       this.upTime.fill();
       this.downTime.fill();
     },
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
        return ap[parseInt((intH == 12 ? 11 : intH) / 12)]+" " + str12H + "시" + intM +"분";
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
          if(this.items.lineCount != 1 ){
            for(var i=1;i<this.items.lineCount;i++){
              var json2 =new Object();
              this.items.item.push(new this.item(xml.items.item[i].subwayStationId));
              json2.name=xml.items.item[i].subwayRouteName;
              json2.state=false;
              this.items.btn_state.push(json2);
            }
          }
        }
        this.getTimetable(this.items.item[0].Id,0)
      })
      },
      item(ID){
        this.Id=ID;
        this.timeTable=[];
        this.curIndex=0;
        this.page=1;
        this.elementCount = new Object();
        this.elementCount.up=-1;
        this.elementCount.down=-1;
        this.timeIndex= new Object();
        this.timeIndex.up=-1;
        this.timeIndex.down=-1;
        this.numOfRows=0;  
      },
      getDown(url,upCnt,Index){
        var cur=this.items.item[Index].curIndex;
        if(cur < this.items.item[Index].elementCount.down || this.items.item[Index].elementCount.down == -1){
          axios.get(url)
            .then((response)=> {
              var rep=response.data.response.body
              this.items.item[Index].elementCount.down= rep.totalCount
              var cur = this.items.item[Index].curIndex;
              for( var j =0;j < 300 ; j++){
                if(cur >= this.items.item[Index].elementCount.down)
                  break;
                this.downTime[j]= rep.items.item[j].depTime.toString();
                cur++;
                }
              this.items.item[Index].page++; 
              if(j>upCnt)
                this.makeJsonArr(j,Index);
              else
                this.makeJsonArr(upCnt,Index);
           })
        }
        else{
          if(upCnt==0){
            this.setCurrentTable(Index);
            }
          else
            this.makeJsonArr(upCnt,Index);
        }
      },
      getup(urlUp,urlDown,Index){
        var cur=this.items.item[Index].curIndex;
        console.log("cur:"+cur+"until:"+this.items.item[Index].elementCount.up);
        if(cur < this.items.item[Index].elementCount.up || this.items.item[Index].elementCount.up == -1){
          axios.get(urlUp)
            .then((response) => {
              var rep=response.data.response.body
              this.items.item[Index].elementCount.up= rep.totalCount
              for(var j=0 ; j < 300 ; j++){
                if(cur >= this.items.item[Index].elementCount.up)
                  break;
                this.upTime[j] = rep.items.item[j].depTime.toString();
                cur++;
          } 
          this.getDown(urlDown,j,Index)
        })
        }
        else{
          this.getDown(urlDown,0,Index);
        }
      },
      btn_click(stationName){
        var Idx = this.items.btn_state.findIndex(function(item){
          if(item.name==stationName) return true;
        });
        this.items.btn_state[this.items.btn_Index].state=false;
        this.items.btn_state[Idx].state=true;
        this.items.btn_Index=Idx;
        this.getTimetable(this.items.item[Idx].Id,Idx);
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
