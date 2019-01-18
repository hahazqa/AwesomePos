<template>
    <div class="pos">
       <div>
           <el-row>
               <el-col :span='7' id="order-list">
                     <el-tabs v-model="activeName" >
                        <el-tab-pane label="点餐" name="first">
                            <el-table 
                                :data="tableData"
                                border
                                :summary-method="getSummaries"
                                show-summary
                                style="width: 100%" >
                                <el-table-column prop="goodsName" label="商品"  ></el-table-column>
                                <el-table-column prop="count" label="量" width="50"></el-table-column>
                                <el-table-column prop="price" label="金额" width="70"></el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template scope="scope">
                                        <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                                        <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="order-btn">
                                <el-button type="warning" >挂单</el-button>
                                <el-button type="danger" @click="delAllGoods">删除</el-button>
                                <el-button type="success" @click="checkout" >结账</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
               </el-col>
               <el-col :span='17'>
                   <div class="often-goods">
                        <div class="title">常用商品</div>
                        <div class="often-goods-list">
                            <ul>
                                <li v-for = " item in oftenGoods" :key="item.goodsId" @click="addOrderList(item)">
                                    <span>{{item.goodsName}}</span>
                                    <span class="o-price">￥{{ item.price }}元</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="goods-type">
                        <el-tabs>
                            <el-tab-pane label="汉堡">
                               <ul class='cookList'>
                                    <li v-for="item in alltypeGoods.hanbao" :key="item.goodsId" @click="addOrderList(item)">
                                        <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                                        <span class="foodName">{{ item.goodsName }}</span>
                                        <span class="foodPrice">￥{{ item.price }}元</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                                <el-tab-pane label="小食">
                                <ul class='cookList'>
                                    <li v-for="item in alltypeGoods.xiaoshiL" :key="item.goodsId" @click="addOrderList(item)">
                                        <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                                        <span class="foodName">{{ item.goodsName }}</span>
                                        <span class="foodPrice">{{ item.price }}</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                            <el-tab-pane label="饮料">
                               <ul class='cookList'>
                                    <li v-for="item in alltypeGoods.yinliao" :key="item.goodsId" @click="addOrderList(item)">
                                        <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                                        <span class="foodName">{{ item.goodsName }}</span>
                                        <span class="foodPrice">{{ item.price }}</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                            <el-tab-pane label="套餐">
                               <ul class='cookList'>
                                    <li v-for="item in alltypeGoods.taocan" :key="item.goodsId" @click="addOrderList(item)">
                                        <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                                        <span class="foodName">{{ item.goodsName }}</span>
                                        <span class="foodPrice">{{ item.price }}</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
               </el-col>
           </el-row>
       </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            tableData: [],
            oftenGoods:[],
            alltypeGoods:{
                hanbao:[],
                xiaoshiL:[],
                yinliao:[],
                taocan:[]
            },
            totalMoney: 0, //订单总价格
            totalCount: 0,  //订单商品总数量
            activeName:'first'
        }
    },
    created() {
        //获取常用商品
        this.oftenGoodes();
        //获取分类商品
        this.typeGoodes();
    },
    mounted() {
        let orderHeight = document.body.clientHeight;
        document.getElementById('order-list').style.height = orderHeight+'px';
    },
    methods: {
        oftenGoodes() {
            let this_ = this;
            let oftenUrl = 'https://www.easy-mock.com/mock/5b8b30dbf032f03c5e71de7f/kuaican/oftenGoods'
            axios.get(oftenUrl).then(function(response){
                this_.oftenGoods = response.data
            })
        },
        typeGoodes() {
            let this_ = this;
            let typeUrl = 'https://www.easy-mock.com/mock/5b8b30dbf032f03c5e71de7f/kuaican/typeGoods'
            axios.get(typeUrl).then(function(response){
                console.log(response);
                this_.alltypeGoods.hanbao = response.data[0];
                this_.alltypeGoods.xiaoshiL = response.data[1];
                this_.alltypeGoods.yinliao = response.data[2];
                this_.alltypeGoods.taocan = response.data[3];
            })
        },
        addOrderList(goods) {
            //添加订单列表的方法
                this.totalCount=0; //汇总数量清0
                this.totalMoney=0;
                let isHave=false;
                //判断是否这个商品已经存在于订单列表
                for (let i=0; i<this.tableData.length;i++){
                    // console.log(this.tableData[i].goodsId);
                    if(this.tableData[i].goodsId==goods.goodsId){
                        isHave=true; //存在
                    }
                }
                //根据isHave的值判断订单列表中是否已经有此商品
                if(isHave){
                    //存在就进行数量添加
                    let arr = this.tableData.filter(o =>o.goodsId == goods.goodsId);
                    arr[0].count++;
                    // arr[0].price = arr[0].price*arr[0].count;
                    // console.log(arr);
                }else{
                    //不存在就推入数组
                    let newGoods={goodsId:goods.goodsId,goodsName:goods.goodsName,price:goods.price,count:1};
                    this.tableData.push(newGoods);
                }
                //进行数量和价格的汇总计算
                this.tableData.forEach((element) => {
                    this.totalCount+=element.count;
                    this.totalMoney=this.totalMoney+(element.price*element.count);   
                });

                //  console.log( this.totalMoney);
                
        },
        delSingleGoods(goods) {
            if(goods.count==1) {
                this.tableData=this.tableData.filter(o => o.goodsId !=goods.goodsId);
            }else {
                // console.log(goods);
                // console.log(this.tableData);
                this.tableData.forEach((item)=>{
                    if(item.goodsId ==goods.goodsId ) {
                        item.count--
                    }
                });
            }
             
             this.getAllMoney();
        },
        delAllGoods() {
            this.tableData = [];
            this.totalCount = 0;
            this.totalMoney = 0;
        },
        //汇总数量和金额
        getAllMoney() {
            this.totalCount = 0;
            this.totalMoney = 0;
            if (this.tableData) {
                this.tableData.forEach((element) => {
                    this.totalCount += element.count;
                    this.totalMoney = this.totalMoney + (element.price * element.count);
                });
            }
        },
         //结账方法模拟
        checkout() {
            if (this.totalCount!=0) {
                this.tableData = [];
                this.totalCount = 0;
                this.totalMoney = 0;
                this.$message({
                    message: '结账成功，感谢你又为店里出了一份力!',
                    type: 'success',
                    duration:2000
                });

            }else{
                this.$message.error('不能空结。老板了解你急切的心情！');

            }

        },
        getSummaries(param) {
            // console.log(param);
            let this_ = this;
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index)=>{
                if(index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    if(column.property == 'count') {
                        sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else if (column.property == 'price') {
                        sums[index] =this_.totalMoney
                    }
                
                       
                    }
            });
            return sums;
        }
    },
}
</script>
<style scoped>
.pos {
    font-size: 12px;
}

.pos-order {

    background-color: #F9FAFC;
    border-right: 1px solid #C0CCDA;
}

.order-btn {
    margin-top: 10px;
    text-align: center;
}

.title {
    height: 20px;
    border-bottom: 1px solid #D3DCE6;
    background-color: #F9FAFC;
    padding: 10px;
    padding-bottom: 9px;
}

.often-goods-list ul li {
    list-style: none;
    float: left;
    border: 1px solid #E5E9F2;
    padding: 10px;
    margin: 5px;
    background-color: #fff;
    cursor: pointer;
}

.goods-type {
    clear: both;
}

.o-price {
    color: #58B7FF;
}

.often-goods-list {
    border-bottom: 1px solid #C0CCDA;
    height: auto;
    overflow: hidden;
    padding-bottom: 10px;
    background-color: #F9FAFC;
}

.cookList li {
    list-style: none;
    width: 23%;
    border: 1px solid #E5E9F2;
    height: auot;
    overflow: hidden;
    background-color: #fff;
    padding: 2px;
    float: left;
    margin: 2px;
    cursor: pointer;
}

.cookList li span {

    display: block;
    float: left;
}

.foodImg {
    width: 40%;
}

.foodName {
    font-size: 18px;
    padding-left: 10px;
    color: brown;
}

.foodPrice {
    font-size: 16px;
    padding-left: 10px;
    padding-top: 10px;
}

.totalDiv {
    height: auot;
    overflow: hidden;
    text-align: right;
    font-size: 16px;
    background-color: #fff;
    border-bottom: 1px solid #E5E9F2;
    padding: 10px;
}
</style>
