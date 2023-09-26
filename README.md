Run at https://my-lens-5ilpflh7a-aliceonly.vercel.app/

传统的web2社交平台搭建Application with database交互

web3 分离了database, apps 通过lens protocol从blockchain拉取数据，意味着用户own the piece of data

两个本质区别：data ownership && 任何人可以访问建立在数据之上的lens提供的社交图谱

using Lens Protocol, thirdweb Next.js, Tanstack Query, and GraphQL Codegen


lens profile nft collection存储了posts made &  



frontend tech

nextJs - vercel

graphQL

React Query

thirdweb



Application：

1.连接钱包

2.读写信息 user wallets（余额，钱包地址，网络，签名）交易 & 消息

3.读写交易 合约 & 链

![image-20230924153246932](https://gitee.com/dengdengnc/drawingbed/raw/master/img/image-20230924153246932.png)



### 登录到lens

![image-20230924163630424](https://gitee.com/dengdengnc/drawingbed/raw/master/img/image-20230924163630424.png)

tanstack query to get lens-user information in localstorage and detect invalidation

graphql codegen(custom fetcher func) fetcher to get profile from lens api

use useExplorePublicationsQuery hook to load feed page information

NextJs dynamic router to grab id and use generated hook to query and load profile page

follow user : creating message follows ERC-712(send bytes,user sign)

broadcast transaction:lens relay a wallet and pay for the gas cost

dispatcher(delegate signing privileges):

 - intermediate wallet acts as sign-off for every transaction
	- Optimistic

use omit-deep to remove type name from each levels of nesting inside object

createPost: use useStorageUpload hook to upload to ipfs

use useCreatePostTypedDataMutation hook 请求lens创建post的typed data

封装signTypedDataWithOmittedTypename签名函数创造ERC712签名

解构TypedData调用postWithSig发送交易到智能合约
