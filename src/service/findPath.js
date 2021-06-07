import {subwayDB} from '../assets/subdata.js'


// 방문여부 arr & 현재 까지 최소거리 arr
let isVisit = [];
let dist = [];
let preStation = [];

let stationGraph;
const INF = 10000;

export const Node = function(vertex){
    
    //역 정보 저장
    this.vertex={
        name:vertex.stationName,
        code:vertex.stationCode
    };

    //인접역 생성
    this.link=[];
    for(let i=0 ; i < vertex.adjacencyStation.length; i++){
        this.link.push(vertex.adjacencyStation[i]);
    }
}

export const Graph = function (list) {
    
    //생성자 함수로 모든 vertex를 삽입한다

    let graph = [];
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].stationStructure.length; j++) {
            let k = graph.find((element) => {
                if (list[i].stationStructure[j].stationName == element.vertex.name) {
                    console.log(list[i].stationStructure[j].stationName);
                    return true;
                }
            });
            if (k == undefined) {
                graph.push(new Node(list[i].stationStructure[j]));
            }
        }
    }
   
    //여러 노선에 공유된 역의 인접역 추가
    return {
        getGraph() {
            return graph;
        }
        ,
        showGraph: function () {
            console.log(graph);
        }
        ,
        makeEdge: function(vertex){
            
            //이름이 겹치는 역인지 판단
            let vet = graph.find((element) => {
                if (vertex.stationName == element.vertex.name) {
                    if (vertex.stationCode == element.vertex.code) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            });
            /*
            겹치지 않는다면 return 겹친다면 
            해당 역의 인접역을 그래프 Node에 추가한다.
            */
            if (vet == undefined)
                return;
            else {
                for (let i = 0; i < vertex.adjacencyStation.length; i++) {
                    vet.link.push(vertex.adjacencyStation[i]);
                }
            } 
        }
}

}


//최소힙 push
const heapPush = (heap,vertexObj) => {
    
    heap.push(vertexObj);
    let idx = heap.length - 1;
    
    let parPos;


    while (idx > 1) {
        let temp;
        parPos = parseInt(idx / 2);

        if (heap[parPos].weight > heap[idx].weight) {
            
            temp = heap[parPos];
            heap[parPos] = heap[idx];
            heap[idx] = temp;
            
            
            idx = parPos;
        }
        else {
            break;
        }
    }
    console.log(heap);
}

//최소힙 pop
const heapPop = (heap) => {
    if (heap.length == 1) {
        console.log("error heapPop");
        return null;
    }

    //반환값에 root(heap[1])할당 후 마지막 노드 pop
    const ret = heap[1];
    const lastItem = heap.pop();

    //만약 heap에 원소가 하나밖에 없다면 root만 return
    if (heap.length == 1) return ret;

    heap[1] = lastItem;
    let idx = 1;
    
   
    

    while (idx*2 <= heap.length-1) {
        
        let temp ={};
        if (idx * 2 == heap.length-1) {
            if (heap[idx].weight > heap[idx * 2].weight) {
                temp=heap[idx * 2];
                heap[idx * 2] = heap[idx];
                heap[idx] = temp;
            }
            break;
        }

        let minpos = heap[idx * 2].weight < heap[idx * 2 + 1].weight ? idx * 2 : idx * 2 + 1;
        let min = heap[minpos]; 


        if (heap[idx].weight > min.weight) {
            temp = heap[idx];
            heap[idx] = heap[minpos];
            heap[minpos] = temp;
            
            idx = minpos;
        }
        else 
            break;
    }
    return ret;
}

//그래프 구현 힙 구현 다익스트라로 최소거리 구현

function dijstra(graph,startName,endName) {
    let heap = [];

    heap.push({ name: "null", weight: undefined });
    
    let startV = graph.find((element) => {
        if (startName == element.vertex.name)
            return true;
    });
    
    let obj = {};
    obj.name = startV.vertex.name;
    obj.weight = 0;
    obj.preStation = undefined;
    
    heapPush(heap, obj);

    let ob;

    while (heap.length > 1) {
        
        let minNode = heapPop(heap);
        
        ob = graph.find((element) => {
            if (element.vertex.name == minNode.name)
                return true;
        });
        if (!ob) {
            console.log("error dijstra");
            return null;
        }
        
        
        if (isVisit[minNode.name] == false) {
            isVisit[minNode.name] = true;
        }

        if (dist[minNode.name] > minNode.weight) {
            dist[minNode.name] = minNode.weight;
            preStation[minNode.name] = minNode.preStation;
        }
        

        for (let i = 0; i < ob.link.length; i++){

            if (isVisit[ob.link[i]] == false) {
                let obj = {};
                obj.name = ob.link[i];
                obj.weight = minNode.weight + 1;
                obj.preStation = minNode.name;
                heapPush(heap,obj);
            }
            else 
                continue;
        }
    }
    return dist[endName];
}

//최단거리의 루트를 get
function getPathRoute(endName) {
    
    let routeArr = [];
    let ptr = endName;
    routeArr.push(ptr);


    while (preStation[ptr] != undefined) {

        routeArr.push(preStation[ptr]);
        ptr = preStation[ptr];
    }

    console.log(routeArr);
    return routeArr;
}

//최단거리 return
export function getMinPath(startName, endName) {
    
    //각역들의 거리정보 & 방문여부 정보 초기화
    initDist(stationGraph.getGraph());
    initIsVisit(stationGraph.getGraph());

    let mindist = dijstra(stationGraph.getGraph(), startName, endName);
    let routeArr=getPathRoute(endName);
    
    let retObj = {list:routeArr,minDist:mindist};
    return retObj;
}


//최소거리 초기화
function initDist(graph) {
    console.log(graph);
    for (let i = 0; i <graph.length; i++)
        dist[graph[i].vertex.name] = INF;
}


//방문여부 초기화
function initIsVisit(graph) {
    for (let i = 0; i < graph.length; i++)
        isVisit[graph[i].vertex.name] = false;
}


//그래프 생성 함수
export function makeGraph(){
    
    //역 정보를 담을 object 리스트
    let list= [{
        stationStructure:[
            {
            stationName:"",
            stationCode:"",
            adjacencyStation:[],
        }
        ],
    }];
    
    //buffer array
    let arr=[{
        totalName:[]
    }];

    //정거장 전체 구성을 역별로 나누어서 저장
    for(let i=0;i < subwayDB.records.length;i++){
        arr[i] ={}; 
        arr[i].totalName=subwayDB.records[i].정거장구성.split(',');
    }

    // 역 코드와 역 이름을 분리해서 object로 저장
    for(let i=0;i<arr.length ;i++){
        
        list[i]={stationStructure:[]}

        for(let j=0;j <arr[i].totalName.length ;j++){
            
            list[i].stationStructure[j]={}
            let repArr = [];
            repArr = arr[i].totalName[j].split('-');
            list[i].stationStructure[j].stationCode=repArr[0];
            list[i].stationStructure[j].stationName=repArr[1];
            
            //인접역 정보 저장
            list[i].stationStructure[j].adjacencyStation=[];
            let repNextArr;
            let repPreArr;

            if(j==0){    
                 repNextArr = arr[i].totalName[j+1].split('-');
                list[i].stationStructure[j].adjacencyStation.push(repNextArr[1]);
            }
            else if(j==arr[i].totalName.length-1){
                 repPreArr = arr[i].totalName[j-1].split('-');
                list[i].stationStructure[j].adjacencyStation.push(repPreArr[1]);
            }
            else{
                 repPreArr = arr[i].totalName[j-1].split('-');
                 repNextArr = arr[i].totalName[j+1].split('-');
               
                list[i].stationStructure[j].adjacencyStation.push(repPreArr[1]);
                list[i].stationStructure[j].adjacencyStation.push(repNextArr[1]);
            }
        }
    } 

    //각 역들을 그래프형식으로 저장
    stationGraph = new Graph(list);
    
    //각 그래프 노드간 간선 연결
    for(let i=0;i<list.length;i++){
        for(let j=0;j<list[i].stationStructure.length;j++){
            stationGraph.makeEdge(list[i].stationStructure[j]);
        }
    }
    stationGraph.showGraph();

}



 
  