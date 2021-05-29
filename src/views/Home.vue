<template>
  <div class="home">
    <router-view></router-view>
    <img alt="subway" src="../assets/img_subway.png"  width="1500" height="1269" usemap="#menuMap"/>

    <map name ="menuMap" id="menuMap">
      <area shape="circle" coords="1346,494,3" alt="" title="Deokso" target="_blank" v-on:click="onStationClicked('왕십리')"/>
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

        <b-card no-body>
          <b-tabs card>
            <b-tab v-for="(stn, index) in lineStation" :key="stn.subwayStationId" :title="stn.subwayRouteName" :active="index===0">              

              <b-tabs card>
                
                <b-tab v-for="ele in tableTab"  :key = ele >  
                  
                  
                  <b-table
                    id="my-table"
                    :items="timeTable[trainMap[currentName].item[index].subwayStationId][ele]"
                    :per-page="perPage"
                    :current-page="currentPage"
                  >
                  </b-table>
                  {{ele}}
                  {{timeTable[trainMap[currentName].item[index].subwayStationId].totalCount[ele]}}
                  {{trainMap[currentName].item[index].subwayStationId}}
                  {{timeTable[trainMap[currentName].item[index].subwayStationId][ele] }}
                  <b-pagination
                    :key=" currentPage"
                    v-model="currentPage"
                    :total-rows="timeTable[trainMap[currentName].item[index].subwayStationId].totalCount[ele]"
                    :per-page="perPage"
                    next-text="Next"
                    prev-text="Prev"
                    aria-controls="my-table"
                  > 

                  </b-pagination>
               
                </b-tab>

              </b-tabs>

            </b-tab>
          </b-tabs>
        </b-card>
      </div>

    </Modal>

    </div>
</template>

<script>
import axios from 'axios';
import Modal from "./Modal";

const serviceKey='DkNcb3tEZkL2B%2BjFFBOTbBbYKsgkcFKs4g06IxAbjr40J6g6LMdwA8xSUFGPzpaSf8uHY4tsk%2F0992PQAAvcHw%3D%3D'
const NAME2LINEINFO = "/SubwayInfoService/getKwrdFndSubwaySttnList?serviceKey="
const ID2TIMETABLE = "/SubwayInfoService/getSubwaySttnAcctoSchdulList?serviceKey="
const numOfRows= '&numOfRows=300'
const pageNo="&pageNo=1"

export default {
  name: 'home',
  components: {
  Modal,
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
      map:new Map(),
      obj:{},

      tableTab: ['up','down'],

      currentName:"",     // 현재 선택된 역명
      currentTimeIndex:0,

      trainMap: {
        서울역:{ 
          item:
          [
          {subwayRouteName: "공항", subwayStationId: "MTRARA1A01", subwayStationName: "서울역"},
          {subwayRouteName: "경의중앙", subwayStationId: "MTRKRK4P313", subwayStationName: "서울역"},
          {subwayRouteName: "서울 1호선", subwayStationId: "MTRS11133", subwayStationName: "서울역"},
          {subwayRouteName: "서울 4호선", subwayStationId: "MTRS14426", subwayStationName: "서울역"},
          ]
          ,
          totalCount:4
        }
        ,
      },     // 한글 지하철명에 대한 역정보

      timeTable: {
        MTRARA1A01: {
          up: [
            {depTime: '052100',_rowVariant:''},
            {depTime: '052100',_rowVariant:''},
            {depTime: '052100',_rowVariant:''},
          ],
          down: [
            {depTime: '052100'},
            {depTime: '052100'},
            {depTime: '052100'},
          ],
          currentPage:0,
          totalCount:{up:0,down:0},
          currentRow:{upRow:0,downRow:0}
        },

      },     // 역별 상행 / 하행 출발 시간 정보

      curTimeTable: {},

      msg:{
        em: "서두르셔야합니다.",
        sl: "아직 여유가 있습니다",
        ma: "많이 기다리셔야 합니다"
      }
    };
  },

  computed:{
    lineStation: {
      get() {
        console.log(this.trainMap[this.currentName].item);
        return this.trainMap[this.currentName].item;
      }
    },
    currentTime:{
      get(){
        return this.now;
      }
    },
  },

  methods:{
    /* 역 클릭에 대한 이벤트 처리 */
    onStationClicked(stationName) {
      this.currentName=stationName;
      console.log("click");
      // 역정보가 존재하는 경우
      if (this.trainMap[stationName] !== undefined) {
        // 팝업 표시
      }
      // 역정보가 존재하지 않는 경
      else {
        // 호출 URL
        let url = NAME2LINEINFO + serviceKey + "&subwayStationName=" + stationName;

        // openApi 호출
        this.callOpenApi({stationName: stationName, url: url}, this.parseStationInfo);
      }

    },

    /* 역에 대한 기본정보 저장  */
    parseStationInfo(param, data) {
      if (data !== undefined) {//
        console.log(data);
 
        this.trainMap[param.stationName]={};     
        this.trainMap[param.stationName].item = data.items.item;
        this.trainMap[param.stationName].totalCount = data.totalCount; 
        console.log(this.trainMap[param.stationName]);

        let length=this.trainMap[param.stationName].totalCount;
        
        
        for (let i=0; i< length ; ++i) {
          
          let idxStationId;
          //길이가 1이면 배열 사용이 안되 변환
          if(length == 1)
            idxStationId = this.trainMap[param.stationName].item.subwayStationId;
          else
            idxStationId = this.trainMap[param.stationName].item[i].subwayStationId;

          //binding할 미리 timeTable 생성
          
          this.timeTable[idxStationId]= { up:[], down:[], totalCount:{up:0,down:0}, currentRow:{upRow:-1,downRow:-1} };

          // 호출 URL & 파라미터
          let upParam = {
            stationId: idxStationId,
            upOrDown:"up",
            url: ID2TIMETABLE+ serviceKey+"&subwayStationId="+ idxStationId + numOfRows + "&dailyTypeCode=01&upDownTypeCode=U" + pageNo
          };
          
          this.callOpenApi(upParam, this.parseTimeTable);

          // 호출 URL & 파라미터
          let downParam = {
            stationId: idxStationId,
            upOrDown: "down",
            url: ID2TIMETABLE+ serviceKey+ "&subwayStationId=" + idxStationId + numOfRows + "&dailyTypeCode=01&upDownTypeCode=D" + pageNo
          };

          this.callOpenApi(downParam, this.parseTimeTable);
        }
      }
      else
        console.log("parseStaion:data error");
      this.modalElement
    },

    /* 타임테이블 정보 저장 */
    parseTimeTable(param, data) {
      if (data !== undefined) { 
        
        //this.timeTable[param.stationId]= { up:[], down:[], totalCount:{upCnt:0,downCnt:0}, currentRow:{upRow:-1,downRow:-1} };
        console.log(param);

        for(let i=0 ; i <data.totalCount ;i++){
          let obj = {};
          obj.도착시간 = data.items.item[i].depTime;
          this.timeTable[param.stationId][param.upOrDown].push(obj);
        }

        console.log(this.timeTable[param.stationId][param.upOrDown]);

        if(param.upOrDown == 'up')
          this.timeTable[param.stationId].totalCount.up =data.totalCount;
        else if(param.upOrDown =='down')
           this.timeTable[param.stationId].totalCount.down =data.totalCount;
        else
          console.log("parseStaion: up OR down Error");
        
        // this.timeTable[param.stationId][param.upOrDown].sort((a,b) => a-b);
        console.log(this.timeTable[param.stationId]);
        console.log("timeTable");
        console.log(this.timeTable);
      }
      else
        console.log("parseStaion:data error");
      this.modalElement.showModal=true;
    },

    /* openApi 호출 */
    callOpenApi(param, funcPtr){

      axios.get(param.url).then((response) => {

        console.log(response);

        if (response.status === 200) {
          funcPtr(param, response.data.response.body);
        }
        else {
          funcPtr(param);
          console.log("Server Error");
        }
      })
    },
    /*시간표 테이블의 ROW의 개수 반환*/
    totalRows(idx , param){
      console.log("totalRows")

      if(this.timeTable[this.trainMap[this.currentName].item[idx].subwayStationId] != undefined) { //null check
        
        console.log(this.trainMap[this.currentName].item[idx].subwayStationId);
        
        if(param=='up') {
          return this.timeTable[this.trainMap[this.currentName].item[idx].subwayStationId].totalCount.up;
        }

        else if(param=='down') {
          return this.timeTable[this.trainMap[this.currentName].item[idx].subwayStationId].totalCount.downCnt;
        }

        else{
          console.log("error: totalRows ");
          return null;
        }
      }
    },

    /*역의 테이블 반환*/
    staionTimeTable(index ,param){
      console.log("staionTimeTable")
      console.log(index);

      if(this.timeTable[this.trainMap[this.currentName].item[index].subwayStationId] != undefined) { //null check
        
        console.log(this.timeTable[this.trainMap[this.currentName].item[index].subwayStationId].up);
       
       if(param == 'up') {
          return this.timeTable[this.trainMap[this.currentName].item[index].subwayStationId].up;
        }

        else if(param == 'down')        {
          return this.timeTable[this.trainMap[this.currentName].item[index].subwayStationId].down;
        }

        else{
          console.log("error: staionTimeTable ")
          return null;
        }
      }
    },

    /*시간 관련 함수*/
    time(){
       this.setTime()
       setInterval(
       this.setTime(),1000);
     },
    setTime(){
       this.now= this.clock();
     }
     ,
     /* 현재시각 반환 */
    clock(){
      let date = new Date();
      let strHM = ("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2); //오전 00:00 형식
      return this.timeConvertTo12(strHM)+" "+date.getSeconds();
      },

      /*24시간 => 12시간 변경*/
    timeConvertTo12(time){
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

      /*12시간=> 24시간 변경 */
    timeConvertTo24(str){
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

    //시간이 t1이 빠르면 1 return t2가 빠르면 2 return
    compareTime(element){ 
        var time1 = this.rowTime(element);
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
        //var downItv;
        //var upItv;
        var uptime;
        var downtime;
        var Index =this.map.get(this.currentName).btn_Index;
        if(this.map.get(this.currentName).item[this.map.get(this.currentName).btn_Index].timeIndex.up != -1){
          uptime = this.rowTime(this.map.get(this.currentName).item[Index].timeTable[this.map.get(this.currentName).item[Index].timeIndex.up]);
          //upItv=parseInt(uptime.slice(0,2))*60+parseInt(uptime.slice(2,4));
        //  console.log(upItv);
          this.uptimeAlert= now - uptime;
          this.upAlert=true;
          if(this.uptimeAlert < 0 )
            this.setCurrentTable(this.map.get(this.currentName).btn_Index);
        }
        else{
          this.upAlert = false;
        }
        if(this.map.get(this.currentName).item[this.map.get(this.currentName).btn_Index].timeIndex.down != -1){
          downtime = this.rowTime(this.map.get(this.currentName).item[Index].timeTable[this.map.get(this.currentName).item[Index].timeIndex.down]);
          //downItv=parseInt(downtime.slice(0,2))*60+parseInt(downtime.slice(2,4));
         // console.log(downItv);
          this.downAlert=true;
          this.downtimeAlert= now - downtime;
          if(this.downtimeAlert<0)
            this.setCurrentTable(this.map.get(this.currentName).btn_Index);
        }
        else{
          this.downAlert=false;
        }
         setInterval(this.updateTime,10000);
      },

      //현재 시각과 가장 가까운 ROW를 찾아서 해당 ROW의 값을 특정하는 함수 => 1분마다 호출하거나 바뀔때마다 호출 
      findCurrentTime(Index,checkUpDown){
        //up일 경우
        if(checkUpDown == 'up'){
          //전에 존재하던 현재시간과 가장 가까운 ROW값을 삭제
          let upIdx=this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].currentRow.upRow;
          if(upIdx != -1 )
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].up[upIdx]._rowVariant="";
          
          //현재 시간을 기준으로 가장 근접한 값을 찾은 후 값을 변경
          if(this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].totalCount.upCnt != 0 ){
            upIdx = this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].up.findIndex(); 
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].currentRow.upRow=upIdx;
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].up[upIdx]._rowVariant="success";
            
            //현재 시각이 있는 ROW로 page이동
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].currentPage = parseInt(upIdx/10) + 1;
          }
          else{
            console.log("상행이 존재하지 않습니다.");
          }
        }
        //down일 경우
        else if(checkUpDown == 'down'){
          //전에 존재하던 현재시간과 가장 가까운 ROW값을 삭제
          let downIdx=this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].currentRow.downRow;
          if(downIdx != -1 )
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].down[downIdx]._rowVariant="";
          
          //현재 시간을 기준으로 가장 근접한 값을 찾은 후 값을 변경
          if(this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].totalCount.downCnt != 0 ){
            downIdx = this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].down.findIndex(); 
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].currentRow.downRow=downIdx;
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].down[downIdx]._rowVariant="success";
            
            //현재 시각이 있는 ROW로 page이동
            this.timeTable[this.trainMap[this.currentName].item[Index].subwayStationId].currentPage = parseInt(downIdx/10) + 1;
          }
          else{
            console.log("하행이 존재하지 않습니다.");
          }
        }
        else{
          console.log("findCurrentTime: checkUpDown error");
        }
     },


     makeJsonArr(count,Index,stationName){
       this.upTime.sort((a,b)=> a-b);
       this.downTime.sort((a,b) => a-b);
       for(var i= 0 ; i < count ; i++){
          var json= new Object();
          var json2= new Object();
          if(!this.upTime[i])
            json.up = " ";
          else
            json.up= this.timeConvertTo12((""+this.upTime[i]).substring(0,2)+":"+(""+this.upTime[i]).substring(2,4));
          if(!this.downTime[i])
            json.down=" ";
          else
            json.down= this.timeConvertTo12((""+this.downTime[i]).substring(0,2)+":"+(""+this.downTime[i]).substring(2,4));
          json2.up='';
          json2.down='';
          json._cellVariants=json2;
          this.map.get(stationName).item[Index].timeTable.push(json);
       }
       this.map.get(stationName).item[Index].curIndex = this.map.get(stationName).item[Index].curIndex + count;
       this.setCurrentTable(Index,stationName);
       this.upTime.fill();
       this.downTime.fill();
     },
     openSubway(subName){
      if(this.obj[subName] == undefined){
        this.obj[subName] = new this.makeItems();
      }
      if(!this.map.get(subName)){
          this.map.set(subName , new this.makeItems());
          this.getJson(subName);
      }
       this.currentName=subName;
       this.modalElement.showModal=true;
       this.modalElement.headName=subName;
     }
  }
}
</script>
