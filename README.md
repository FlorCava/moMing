# moMing
书法爱好教学工具（微信小程序）

### 文档结构：
- server：node.js + express实现rest api；
- client.weixin_app：微信小程序客户端，没有使用第三方框架，只对官方api做少量封装，保持结构的精简；
- client.weixin_h5：保留结构，用于后续产品H5版本（比如公众号使用）的客户端；
- client.admin：保留结构，用于产品的后台管理及数据分析（将会使用react + redux + material ui完成）；

### 产品功能:
利用微信小程序的特点，实现对于多个微信书法爱好者群的教学管理
#### v0.0.1：
- 管理员可在小程序中创建课程；
- 授课师（目前默认为当前课程创建者（管理员））可管理每次课程（直播信息），以及对学员每次的作业进行点评；
- 学员可查看课程信息，并报名参加学习课程以及上交每次课程的作业；

#### 近期会迭代的功能：
- v0.0.2使用react + redux + material ui实现产品后台管理-数据分析功能（课程分析，会员分析以及作业数据分析）；
- v0.0.3实现小程序端的课程报名支付功能，课程视频、音频的在线播放功能；
- v0.0.4实现小程序端的购物功能（课程周边、书法相关物品的在线购买）、对应的商品、订单的后台管理（React端实现）以及商品、订单等的api接口（server端实现）