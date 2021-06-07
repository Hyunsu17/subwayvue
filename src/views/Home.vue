<template>
  <div class="home">
    
    <router-view @findPath="findMinPath"></router-view>
    
    <img alt="subway" src="../assets/img_subway.png"  width="1629" height="1378" usemap="#menuMap"/>

    <map name ="menuMap" id="menuMap">
      <area shape="circle" coords="1460,537,10" alt=""  target="_blank" v-on:click="onStationClicked('덕소')"/>
      <area shape="circle" coords="1324,663,10" alt=""  target="_blank" v-on:click="onStationClicked('어린이대공원')"/>
      <area shape="circle" coords="1183,564,10" alt=""  target="_blank" v-on:click="onStationClicked('왕십리')"/>
      <area shape="circle" coords="1278,700,10" alt=""  target="_blank" v-on:click="onStationClicked('건대입구')"/>
      <area shape="circle" coords="1368,631,10" alt=""  target="_blank" v-on:click="onStationClicked('군자')"/>
      <area shape="circle" coords="1367,588,10" alt=""  target="_blank" v-on:click="onStationClicked('중곡')"/>
      <area shape="circle" coords="1368,425,10" alt=""  target="_blank" v-on:click="onStationClicked('상봉')"/>
      <area shape="circle" coords="1004,535,10" alt=""  target="_blank" v-on:click="onStationClicked('동대문역사문화공원')"/>
      
      <area shape="circle" coords="717,559,10" alt=""  target="_blank" v-on:click="onStationClicked('서울역')"/>
      <area shape="circle" coords="775,558,10" alt=""  target="_blank" v-on:click="onStationClicked('회현')"/>
      <area shape="circle" coords="817,559,10" alt=""  target="_blank" v-on:click="onStationClicked('명동')"/>
      <area shape="circle" coords="860,559,10" alt=""  target="_blank" v-on:click="onStationClicked('충무로')"/>
      
      <area shape="circle" coords="1094,456,10" alt=""  target="_blank" v-on:click="onStationClicked('동묘앞')"/>
      <area shape="circle" coords="1002,456,10" alt=""  target="_blank" v-on:click="onStationClicked('동대문')"/>
      <area shape="circle" coords="949,456,10" alt=""  target="_blank" v-on:click="onStationClicked('종로5가')"/>
      <area shape="circle" coords="873,456,10" alt=""  target="_blank" v-on:click="onStationClicked('종로3가')"/>
      <area shape="circle" coords="1154,456,10" alt=""  target="_blank" v-on:click="onStationClicked('신설동')"/>
      <area shape="circle" coords="1206,456,10" alt=""  target="_blank" v-on:click="onStationClicked('제기동')"/>
      <area shape="circle" coords="1248,456,10" alt=""  target="_blank" v-on:click="onStationClicked('청량리')"/>
  
    </map>

    <Modal v-if="modalElement.showModal" @close="modalElement.showModal=false">
      <h3 slot="header">
        {{modalElement.headName}}
        <i class="fas fa-times caloseModalBtn" @click="modalElement.showModal = false"></i>
      </h3>

      <div slot="body">
        <h3>현재시각<b-badge>{{currentTime}}</b-badge></h3>
         <b-alert  show variant="success"> 다음열차출발까지 {{this.uptimeAlert}}분 만큼 남았습니다 </b-alert>
   
        <b-card no-body>
          <b-tabs card :key="refresh" v-if="trainMap[currentName].totalCount > 1">
            <b-tab v-for="(stn, index) in lineStation" :key="stn.subwayStationId" :title="stn.subwayRouteName" :active="index===0" @click="tapClick(index)">              
              
              <b-tabs card>
                <b-tab v-for="(value,name) in tableTab" :key = name :title="value" @click="changeUpDown(name)">  
                  
                  <b-table
                    :key="timeTable[trainMap[currentName].item[index].subwayStationId].currentPage[name]"
                    id="my-table"
                    :items="timeTable[trainMap[currentName].item[index].subwayStationId][name]"
                    :per-page="perPage"
                    :current-page="timeTable[trainMap[currentName].item[index].subwayStationId].currentPage[name]"
                  >
                  </b-table>
                  
                  <b-pagination
                    v-model="timeTable[trainMap[currentName].item[index].subwayStationId].currentPage[name]"
                    :total-rows="timeTable[trainMap[currentName].item[index].subwayStationId].totalCount[name]"
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

          <b-tabs card :key="refresh" v-else>
            <b-tab :title="lineStation.subwayRouteName" @click="tapClick(-1)">              
            
              <b-tabs card>
                <b-tab v-for="(value,name) in tableTab" :key = name :title="value" @click="changeUpDown(name)"  >  
                  
                  <b-table
                    :key="timeTable[lineStation.subwayStationId].currentPage[name]"
                    id="my-table"
                    :items="timeTable[lineStation.subwayStationId][name]"
                    :per-page="perPage"
                    :current-page="timeTable[lineStation.subwayStationId].currentPage[name]"
                  >
                  </b-table>
                  
                  <b-pagination
                    v-model="timeTable[lineStation.subwayStationId].currentPage[name]"
                    :total-rows="timeTable[lineStation.subwayStationId].totalCount[name]"
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
    
    <PathModal v-if="showPathModal" @close="showPathModal=false">
      <h3 slot="header">
          최단거리
        <i class="fas fa-times caloseModalBtn" @click="showPathModal = false"></i>
      </h3>

      <div slot="body">
        
          {{stationList}}
          <b-icon-arrow-right></b-icon-arrow-right>

        <br>
        총 {{minDist}} 정거장
      
      </div>
    </PathModal>

    </div>
</template>

<script>
import axios from 'axios';
import Modal from "./Modal";
import PathModal  from "./PathModal";
import * as minPathModule from "../service/findPath"

const serviceKey='DkNcb3tEZkL2B%2BjFFBOTbBbYKsgkcFKs4g06IxAbjr40J6g6LMdwA8xSUFGPzpaSf8uHY4tsk%2F0992PQAAvcHw%3D%3D'
const NAME2LINEINFO = "/SubwayInfoService/getKwrdFndSubwaySttnList?serviceKey="
const ID2TIMETABLE = "/SubwayInfoService/getSubwaySttnAcctoSchdulList?serviceKey="
const numOfRows= '&numOfRows=300'
const pageNo="&pageNo=1"


export default {
  name: 'home',
  components: {
  Modal,
  PathModal
  },
  created(){
  },
  mounted(){
    this.callTime();
    window.curWeb = this;
    minPathModule.makeGraph();
  }
  ,
  data(){
    return{
      now:"00:00",
      perPage:10,

      refresh: 1,
      
      downtimeAlert:0,
      uptimeAlert:0,
      downAlert:false,
      upAlert:false,


      showPathModal:false,
      minDist:0,
      stationList: undefined
      ,

      modalElement: 
      {
        headName:"None",
        showModal:false,
      },

      tableTab: {up:'상행',down:'하행'}, //상행, 하행 구분

      currentName:"",     // 현재 선택된 역명

      curIndex:0, //현새 선택된 tab(노선명) 구분

      upOrDown:'up', //현재 선택된 tab(상행,하행) 구분

      timerCheck:false, //현재 타이머가 재생중인지 확인

      isClick:false,

      trainMap: {
        example2:{ 
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
        example1: {
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
          currentPage:{up:1,down:1},
          totalCount:{up:0,down:0},
          currentRow:{up:0,down:0}
        },

      },     // 역별 상행 / 하행 출발 시간 정보 / 현재 페이지 / 총 개수 / 다음 열차시간 ROW 

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
      this.modalElement.headName=this.currentName;
      console.log("click");

      // 역정보가 존재하는 경우

      if (this.trainMap[stationName] !== undefined) {
        
        // 팝업 표시
        this.modalElement.showModal=true;
      }

      // 역정보가 존재하지 않는 경우
      else {

        // 호출 URL
        let url = NAME2LINEINFO + serviceKey + "&subwayStationName=" + stationName;

        // openApi 호출
        this.callOpenApi({stationName: stationName, url: url}, this.parseStationInfo);
      }

    },

    /* 역에 대한 기본정보(노선 정보, 역ID) 저장  */
    parseStationInfo(param, data) {
      if (data !== undefined) {//
        console.log(data);

        //trainMap 객체 할당
        this.trainMap[param.stationName]={};     
        this.trainMap[param.stationName].item = data.items.item;
        this.trainMap[param.stationName].totalCount = data.totalCount; 
       
        console.log(this.trainMap[param.stationName]);

        let length=this.trainMap[param.stationName].totalCount;
        
        
        for (let i=0; i< length ; i++) {
          
          let idxStationId;
          //길이가 1이면 배열 사용이 안되 변환
          if(length == 1)
            idxStationId = this.trainMap[param.stationName].item.subwayStationId;
          else
            idxStationId = this.trainMap[param.stationName].item[i].subwayStationId;

          //binding할 미리 timeTable 생성
          
          this.timeTable[idxStationId]= { up:[], down:[], totalCount:{up:0,down:0}, currentRow:{up:-1,down:-1}, currentPage:{up:1,down:1} };
          console.log(this.timeTable[idxStationId]);

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
      }
     ,

    /* 타임테이블 정보 저장 */
    parseTimeTable(param, data) {
      if (data !== undefined) { 
        
        //상행 하행 구분해서 table assign
        for(let i=0 ; i <data.totalCount ;i++){
          let obj = {};
          obj.도착시간 = data.items.item[i].depTime.toString();
          obj._rowVariant="";
          this.timeTable[param.stationId][param.upOrDown].push(obj);
        }

        
        //array sorting
        
        this.timeTable[param.stationId][param.upOrDown].sort((a,b) =>{
          if(a.도착시간 >b.도착시간)
            return 1;
          else if(a.도착시간 <b.도착시간)
            return -1;
          else 
            return 0;
        });

        // 오후/오전 00:00 형식으로 변환 

        for(let i=0; i < data.totalCount ;i++){
          this.timeTable[param.stationId][param.upOrDown][i].도착시간=
          this.timeConvertTo12(
            this.timeTable[param.stationId][param.upOrDown][i].도착시간.slice(0,2)
            +":"+
            this.timeTable[param.stationId][param.upOrDown][i].도착시간.slice(2,4)
          );
        }

        //상행 하행 구분해서 개수 저장

        if(param.upOrDown == 'up')
          this.timeTable[param.stationId].totalCount.up =data.totalCount;
        else if(param.upOrDown =='down')
           this.timeTable[param.stationId].totalCount.down =data.totalCount;
        else
          console.log("parseStaion: up OR down Error");
        
        //화면 재구성을 위한 refresh 조정
        this.refresh++;
        
        }
      else
        console.log("parseStaion:data error");
     
      //Modal의 가장 처음 화면에 현재시각에 관한 정보를 호출한다.

      if(this.trainMap[this.currentName].totalCount==1){
          if(this.trainMap[this.currentName].item.subwayStationId==param.stationId){
            this.curIndex=-1;
            this.updateTime();
            if(this.timerCheck==false){
              this.setTimer();
              this.timerCheck=true;
            }
          }
      }
      else{
          if(this.trainMap[this.currentName].item[0].subwayStationId==param.stationId){
            this.curIndex=0;
            this.updateTime();
            if(this.timerCheck==false){
              this.setTimer()
              this.timerCheck=true;
            }
          }
      }
        
      this.modalElement.showModal=true;
    },


    /* openApi 호출 */
    callOpenApi(param, funcPtr){

      axios.get(param.url).then((response) => {

        console.log(response);

        if (response.status === 200)
          funcPtr(param, response.data.response.body);
        else {
          funcPtr(param);
          console.log("Server Error");
        }
      })
    },


    /*시간 관련 함수*/
    callTime(){
      this.setCurrentTime();
      setInterval(this.setCurrentTime, 1000);
     },

    setCurrentTime(){
      this.now= this.clock();
     },
     
     /* 현재시각 반환 */
    clock(){
      let date = new Date();
      let strHM = ("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2); //오전 00:00 형식
      return this.timeConvertTo12(strHM)+" "+date.getSeconds();
      },

      /*24시간 => 12시간 변경*/
    timeConvertTo12(time){
        let timeRegFormat = /^([0-9]{2}):([0-9]{2})$/;
        let timeToken = time.match(timeRegFormat);
        let ap=['오전','오후'];
        if(!timeToken){
          console.log(time);
          return " ";      
        }
        let intH=parseInt(timeToken[1]);
        let intM=timeToken[2];
        let str12H = ('0'+(intH == 12 ? 12 : intH % 12 )).slice(-2);
        return ap[parseInt((intH == 12 ? 11 : intH) / 12)]+" " + str12H + "시" + intM +"분";
      },

      /*12시간=> 24시간 변경 */
    timeConvertTo24(str){
       let hourInt;
       let minInt;
       if(str.slice(0,2) == "오전" ){
        hourInt = parseInt(str.slice(3,5));
        minInt = parseInt(str.slice(6));
      }
       else if(str.slice(0,2) == "오후"){
        hourInt = parseInt(str.slice(3,5))+12;
        minInt = parseInt(str.slice(6));
       }
       else{
         return null;
       }
       let rep = ("0"+hourInt).slice(-2) + ("0"+minInt).slice(-2); 
       return rep;
     },

      //시간이 t1이 빠르면 1 return t2가 빠르면 2 return
    compareTime(element){ 
        
        let time1 = this.timeConvertTo24(element.도착시간);
        let time2 = this.timeConvertTo24(this.clock());
        if(!time1){
          console.log("error:compareTime!!");
          return false;
        }
        if(time1 >= time2)
          return true;
        else
          return false;
      },

      //tapClick param을 설정하기 위한 메서드
      tapClick(Index){
        this.curIndex=Index;
        this.isClick=true;
        this.updateTime();
      },
     
      //시간이 1분지날때마다 updateTime 호출
      setTimer(){
        setInterval(this.updateTime,20000);
      },
     
      //상행 하행 변경시마다 data 갱신
      changeUpDown(upOrDown){
        this.upOrDown=upOrDown;
        this.isClick=true;
        this.updateTime();
      }
      ,

        //현재 시각 Update 남은 분 계산 
      updateTime(){
        let now = this.timeConvertTo24(this.clock());
        console.log(now);
        now =parseInt(now.slice(0,2))*60 +parseInt(now.slice(2,4));
        
        let uptime;
        let Index = this.curIndex;
        let subId 
        
        this.findCurrentTime(this.curIndex,this.isClick);
        if(this.curIndex==-1)
          subId =this.trainMap[this.currentName].item.subwayStationId;
        else
          subId =this.trainMap[this.currentName].item[Index].subwayStationId;

        if(this.timeTable[subId].currentRow[this.upOrDown] != -1){
          uptime = this.timeConvertTo24(this.timeTable[subId][this.upOrDown][this.timeTable[subId].currentRow[this.upOrDown]].도착시간);
          uptime=parseInt(uptime.slice(0,2))*60+parseInt(uptime.slice(2,4));
          this.uptimeAlert=uptime-now;
          this.upAlert=true;
        }
        else{
          this.upAlert = false;
        }
      },
 
      //현재 시각과 가장 가까운 ROW를 찾아서 해당 ROW의 값을 특정하는 함수 => 1분마다 호출하거나 바뀔때마다 호출 
      findCurrentTime(Index,isClick){
        
        //현재 선택된 subId
        let subId;
        if(Index!=-1)
           subId= this.trainMap[this.currentName].item[Index].subwayStationId;
        else
           subId= this.trainMap[this.currentName].item.subwayStationId;
        
        //up일 경우  
        //전에 존재하던 현재시간과 가장 가까운 ROW값을 삭제
        let upIdx = this.timeTable[subId].currentRow.up;
        console.log(upIdx);
        if(upIdx != -1 )
          this.timeTable[subId].up[upIdx]._rowVariant="";
          
        console.log(this.timeTable[subId].totalCount.up);
        //현재 시간을 기준으로 가장 근접한 값을 찾은 후 값을 변경
        if(this.timeTable[subId].totalCount.up != 0 ){
          upIdx = this.timeTable[subId].up.findIndex(this.compareTime);
          console.log(upIdx); 
          this.timeTable[subId].currentRow.up=upIdx;
          this.timeTable[subId].up[upIdx]._rowVariant="success";
            
        //현재 시각이 있는 ROW로 page이동
          if(isClick==true)
            this.timeTable[subId].currentPage['up'] = parseInt(upIdx/10) + 1;
          console.log(this.timeTable[subId].currentPage['up']);
        }
        else{
          console.log("상행이 존재하지 않습니다.");
        }

        //down일 경우
        //전에 존재하던 현재시간과 가장 가까운 ROW값을 삭제
        let downIdx=this.timeTable[subId].currentRow.down;
        if(downIdx != -1 )
          this.timeTable[subId].down[downIdx]._rowVariant="";
          
          //현재 시간을 기준으로 가장 근접한 값을 찾은 후 값을 변경
        if(this.timeTable[subId].totalCount.down != 0 ){
          downIdx = this.timeTable[subId].down.findIndex(this.compareTime); 
          this.timeTable[subId].currentRow.down=downIdx;
          this.timeTable[subId].down[downIdx]._rowVariant="success";
            
          //현재 시각이 있는 ROW로 page이동
          if(isClick==true)
            this.timeTable[subId].currentPage['down'] = parseInt(downIdx/10) + 1;
          console.log(this.timeTable[subId].currentPage['up']);
        }      
        else{
            console.log("하행이 존재하지 않습니다.");
        }
        if(isClick==true){
          this.isClick=false;
        }
     },
      
        //최소 경로함수를 호출
      findMinPath(start,end){
        console.log(start,end);
        let obj=minPathModule.getMinPath(start,end);
        this.minDist=obj.minDist;
        this.stationList = obj.list.reverse();
        this.showPathModal=true;
      }
  }
}
</script>
