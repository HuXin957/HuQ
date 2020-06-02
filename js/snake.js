var Map;//地图
var Snake;//蛇
var score=0;//分数
var speed=300;//蛇前进的速度
var game=(function(){//单例模式
    function Map(){//地图方法
        this._map=null;
        this.creatmap=function(){//创建地图
            if(this._map==null){
                this._map=document.createElement('div');
                this._map.className='map';
            }
        }
        this.createSpan=function(){//创建分数显示栏
            this._span=null;
            if(this._span==null){
                this._span=document.createElement('span');
                this._span.className='score';
                this._span.innerHTML='总分：0分';
            }
            this._map.appendChild(this._span);
        }
    }

    function Snake(){//蛇的方法
        this.direct='right';//方向
        this._map=null;
        this._span=null;
        this._snake=[//蛇 初始化
            [3, 1, "red", null],
            [2, 1, "orange", null],
            [1, 1, "orange", null]
        ];

        this.createsnake=function(){//创建蛇方法  触发条件：吃到Food
            var snakeLen=this._snake.length;
            for(var i=0;i<snakeLen;i++){
                if(this._snake[i][3]==null){//判断蛇数组 的第3位是否为null，若是 则给他添加
                    this._snake[i][3]=document.createElement('div');
                    this._snake[i][3].style.backgroundColor=this._snake[i][2];
                    this._snake[i][3].className='snake';
                }
                this._snake[i][3].style.left=this._snake[i][0]*30+'px';//地图大小是900*600 蛇一节为30*30
                this._snake[i][3].style.top=this._snake[i][1]*30+'px';
                this._map.appendChild(this._snake[i][3]);//将蛇的节添加到地图中
            }
        }


        this.snake_move=function(){//蛇移动
            var len=this._snake.length-1;//蛇 节的长度 （优化性能写法）
            for(var i=len;i>0;i--){
                this._snake[i][1]=this._snake[i-1][1]//当前y 等于上一节-1的y
                this._snake[i][0]=this._snake[i-1][0]//同上 x
            }
            switch (this.direct){//移动的方向
                case 'right':
                    this._snake[0][0]+=1;//向右 ，蛇头部x坐标一直加1，后面的也跟着加1
                    break;
                case 'left':
                    this._snake[0][0]-=1;//向左 ，x坐标减1*30
                    break;
                case 'top':
                    this._snake[0][1]+=1;//向上
                    break;
                case 'down':
                    this._snake[0][1]-=1//向下
                    break;
            }

            //如果蛇头的x,y等于食物的x,y
         
            if(this._snake[0][0] == food.x && this._snake[0][1]==food.y){
                score+=100;
                this._span.innerHTML='总分：'+score+'分'
                if(score % 500==0 && speed>100){//如果分数整除500等于0（每500分执行一次），并且速度大于100
                    speed-=100;//速度加快100ms
                    clearInterval(timecount);
                   setInterval(function(){
                        snake.snake_move();
                    },speed)
                }
                this._snake.push([//增加蛇长
                    this._snake[this._snake.length - 1 ][0],//x坐标 蛇长减1也就是蛇的尾部
                    this._snake[this._snake.length - 1 ][1],
                    'yellow',
                    null
                ]);
                food.creatfood();//重新创建食物
            }
            if(this._snake[0][0]*30<0||this._snake[0][0]*30>870||this._snake[0][1]*30<0||this._snake[0][1]*30>570){//碰壁 判断
                    clearInterval(timecount);
                    this._span.innerHTML='GAME OVER'
                    window.alert("你好菜哦！")
            }
            this.createsnake();
        }
    }

    function Food(){//食物构造函数
        this._food=null;
        this.map=null;
        this.x=0;
        this.y=0;
        this.creatfood=function(){//创建食物的方法
            this.x=Math.floor(Math.random()*30);//食物 随机x坐标 （0-29 ）*30
            this.y=Math.floor(Math.random()*20);
            if(this._food ==null){
                this._food =document.createElement('div');
                this._food.className='food';
            }
            this._food.style.left=this.x*30+'px';//将 x值赋给食物的left
            this._food.style.top=this.y*30+'px';
            this._map.appendChild(this._food);//食物也是地图的儿子
        }
    }
    // =============以上所写map snake food 都是构造函数 给每一个构造函数设定自身的属性和方法==========
    //实例化构造函数

    function getmaps(){ //初始化地图
         map=new Map;
         map.creatmap();//创建地图
         map.createSpan();//创建积分栏
         CreatFood(map._map);//由于要创建食物时要追加到地图中，所以不能直接调用“创建”方法，要传对应的参数
         CreateSnake(map._map,map._span);//创建蛇

         return map._map;//返回地图
        }

        function CreatFood(Map){//创建食物 传入地图
            food=new Food;
            food._map=Map;
            food.creatfood();//调用创建食物的方法
        }

        function CreateSnake(Map,span){//创建蛇
            snake=new Snake();
            snake._map=Map;
            snake._span=span;
            snake.createsnake();//调用创建蛇方法
            timecount=setInterval(function(){
                snake.snake_move();//调用蛇的移动方法
            },speed);
            
            document.onkeydown=function(e){//键盘按下事件
                var key=e.keyCode;
                switch(key){
                    case 40:
                            if(snake.direct=='down'){//一个东西你 有 就不给你了，如果 没有 就给你
                                return;
                            }
                            snake.direct='top';//应该是向下,如果按相反键就Break;
                            break;
                    case 37:
                            if(snake.direct=='right'){
                                return;
                            }
                            snake.direct='left';
                            break;
                    case 38:
                           if(snake.direct=='top'){
                               return;
                           }
                           snake.direct='down';
                           break;
                    
                    case 39:  
                           if(snake.direct=='left'){
                               return;
                           }
                           snake.direct='right';
                           break;
                }
            }
        }
        return {
            snakemap:getmaps()
        }
        
})();
document.body.appendChild(game.snakemap);

