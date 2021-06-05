<template>
    <div id="nav">
    <b-navbar variant="secondary"  style="height: 66px;" fixed="top">
        <b-button v-b-toggle.sidebar-1 style="float:left">
            <b-icon icon= "menu-app" aria-hidden="true" font-scale="2"></b-icon>
        </b-button>
    </b-navbar>
      <b-sidebar 
            id="sidebar-1" 
            title="메뉴"
            width=300px
            no-header
            ref="MenuBar"
      >
        <b-container class="menu-colum">
          <b-row>
            <b-col sm="10" style=" font-size: 1.5rem"> 경로찾기 </b-col>
            <b-col sm="2">
              <b-button style="float:right" variant="light" @click="hide"> 
                <b-icon           
                 icon="menu-app"
                 aria-hidden="true"
                 font-scale="2"
                 shift-h="7"
                 >
                </b-icon>
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        
        <br>

        <label for="startInput">시작역</label>
        <b-form-input id="startInput" v-model="start"></b-form-input>
         
        <label for="endInput">도착역</label>
        <b-form-input id="endInput" v-model="end" ></b-form-input>
        
        <br>
        
        <b-button @click="sendStationName(start,end)"> 찾기 </b-button>

      </b-sidebar>
     </div>
</template>


<script>
export default {
  data(){
    return{
      start:'',
      end:''
    }
  },
  methods:{
    hide(){
      this.$refs['MenuBar'].hide();
    },
    sendStationName(start,end){
      this.$emit('findPath',start,end);
    }
  }
}
</script>