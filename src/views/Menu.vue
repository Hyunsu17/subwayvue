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
            <b-col sm="10" style=" font-size: 1.5rem"> {{storeName2}}<br>StudyLine Menu </b-col>
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
          <router-link
            v-for="element in menuElement.name" :key="element"
            :to ="element.path">
        <br>
            <b-icon
              :icon ="element.icon"
              aria-hidden="true"
              font-scale="6">
            </b-icon>
        <br>
          <label style="font-size: 1.5rem">
            {{element}}</label>
        <br>
        </router-link>
      </b-sidebar>
    </div>
</template>


<script>
export default {
  data(){
    return{
      storeName:"덕소점",
      storeName2:"중랑구청점",
      storeName3:"강남 논현점",
      storeName4:"몇글자까지될것인가",
      menuElement:[
        {name: '나의 정보' , path:'/' , icon:'person-check-fill'},
        {name: 'About' , path:'/about' , icon:'info-circle-fill'},
        {name: '사물함' , path:'/' , icon:'inboxes-fill'},
        {name: '스터디룸' , path:'/' , icon:'book'}
      ],
    }
  },
  methods:{
    hide(){
      this.$refs['MenuBar'].hide();
    }

  }
}
</script>