# OfferCard 核实记录

## 2026-08 新增 hover 按钮(V1/V2 两个版本)
对照节点 `7498:68345` 核实的 V1:鼠标 hover 卡片时 INFO 区变模糊(该节点
自己带 blur-[2px] class)+ 叠一层三个按钮(Primary Action 渐变 / 
Secondary 描边 / Tertiary,Tertiary 在这个 Figma 实例里 Code Connect
映射的也是 secondary 样式,视觉上和 Secondary 一样,不是我漏做区分)。
新增 `buttonVersion` prop(none/v1/v2),Controls 面板可以切换,默认v1。
按钮本身的具体 padding/字号 Figma 里是外部 acv-shared-vuejs Button
组件,没给像素级样式——渐变色沿用了本项目已核实过的同一个
Gradient/Button token(DealershipFilterDropdown "Apply Filter" 按钮的
那个渐变),不是重新单独核实的,其余细节待确认。

### V2(节点 7499:69479)—— 和 V1 是两套完全不同的实现,不只是按钮数量差异
- 按钮**一直可见**,正常排在 `.offer-card__info` 信息区最下面(在 Figma
  JSX 里就是 "INFO" 容器的第三个子元素),不是 hover 才浮出来的绝对定位
  层——hover 卡片**不会**触发模糊,这是本来的设计,不是没做完。
- 只有 **2 个**按钮:Primary Action + Secondary,没有 V1 的 Tertiary。
- 按钮上方多一条 `#EBEBEB` 分隔线(复用消息块上方那条同款分隔线,节点
  里确实这么排的)。
- 因为 V2 按钮也挂在 `.offer-card__info` 下面,如果不做区分,V1 那条
  "卡片 hover → info 模糊" 的规则会连带把 V2 的按钮也模糊掉。已经给卡片
  根节点加 `.offer-card--v1` 修饰类(只在 `buttonVersion==='v1'` 时加),
  模糊规则改成只在 `.offer-card--v1:hover` 生效,V2 不受影响。
- **待你确认**:V2 这个 Figma 帧量出来 mileage/VIN/Auction ID 是
  12px,V1 对应帧是 14px。判断是设计稿复制帧时的手滑字号漂移,不是有意
  要求"V2 整卡缩小字号",所以**没有**照着改,两个版本共享同一套 14px
  Vehicle Detail 样式。如果这其实是有意的设计差异,请告知。

### V1 补充:按钮数量 1/2/3(节点 7501:69741)
你给的这个新节点是同一张 V1 卡片的两个真实实例(1 按钮/2 按钮),不是我
猜的"按钮少了该保留哪个":
- **1 按钮**:只有 Primary Action。
- **2 按钮**:Primary Action + 一个描边按钮,Figma 里这个描边按钮字面
  label 就是 **"Tertiary"**(不是 "Secondary"),视觉上两者一样(都是
  描边药丸),照抄 Figma 字面结果,不是我自己挑的搭配。
- **3 按钮**(原来核实的 7498:68345):Primary + Secondary + Tertiary。
- 新增 `buttonCount` prop(1/2/3,默认 3),只在 `buttonVersion==='v1'`
  时生效。
- **重要发现,不是拼凑的规则**:hover 模糊的范围随按钮数量一起变化——
  Figma 里这三个数量各自标的 `blur-[2px]` 范围本来就不一样:1 按钮只
  模糊车辆信息(标题/里程/VIN/Auction ID);2 按钮车辆信息+倒计时/状态
  chip 那一行一起模糊,消息块不模糊;3 按钮连消息块也模糊(等于整个
  info 区,和之前核实的行为一致)。推测原因是浮层按钮块的实际高度随
  按钮数量变化,盖住的信息区范围跟着变。已经把原来"V1 hover 统一模糊
  整个 info"这一条规则拆成按 `buttonCount` 区分的三条规则
  (`.offer-card--v1-btn-1/2/3`),3 按钮时的行为和之前完全一样,默认值
  也还是 3,不影响任何已有效果。

### V1 补充:按钮位置修正(你截图指出位置不对)
之前按钮浮层 `.offer-card__hover-buttons` 用的是 `top:222px + bottom:
12px + justify-content:center`,把按钮块拉伸铺满卡片下半部分再垂直居中
——对 3 个按钮凑巧看起来没问题(内容差不多正好填满这段空间),但 1
个/2 个按钮时,按钮就会被居中显示在下半部分中间,而不是紧贴在车辆信息
下面,跟 Figma 截图对不上。已经改成不拉伸、不居中,直接按 Figma 三个
按钮数量各自核实到的数值定位:`top:220px`(Figma 三个实例分别是
215/221/224px,取中间值)、水平边距 `11px`(Figma 是 ~11-11.67px,不是
之前沿用车辆信息区的 16px padding),高度完全由内容撑开(按钮块自己的
padding 改成 `8px 16px 16px` 对应 Figma 的 pt8/px16/pb16)。现在 1 个
按钮时块矮、紧贴车辆信息下方,2/3 个按钮时块跟着变高,不再需要居中
凑数字。

### V1 补充:hover 按钮改名 "Manage Offer"
Primary 按钮文案从占位的 "Primary Action" 改成你直接给的 "Manage
Offer"——这是业务命名,不是 Figma 数值(Figma 里就是占位符文案)。只改
了 V1(hover 才出现的)这颗按钮,V2 一直可见的 Primary 按钮文案没有动
(按你说的"hover on 的action"理解只针对 hover 触发的这个)。

## 2026-08 按你的要求:卡片图片也进 VDP
`.offer-card__image` 现在包了一层 `<a target="_blank">` 链去 VDP 占位页
(`assets/vdp/vdp-page.html`),和表格视图 `OfferTableRow` 点缩略图的
行为保持一致(同一个占位页,不是各自的真实 VDP)。为什么是这个占位页、
不是真的 VDP 集成,细节见 [OfferTableRow/notes.md](../OfferTableRow/notes.md),
这里不重复。原来 `.offer-card__image` 是 `<div>`,现在换成 `<a>` 后补了
`display:block`(`<a>` 默认是 inline,不加这个的话 `position:relative`/
`width:100%`/`height:210px` 这些原有样式不会正常生效)。

## 2026-08 删掉了 max-width:400px
之前根组件 `.offer-card` 有个 `max-width:400px`,没有对应的 Figma 核实
记录,是之前随手加的防御性上限,不是来自这里"来源"列的任何节点。按你
的要求让 [OfferDashboard](../OfferDashboard/notes.md) 里的卡片网格
(card-grid)全屏时响应式伸缩之后,这个上限会在网格列宽超过400px时把
卡片卡住不再撑满格子,看起来像卡片间距变大了(其实 grid 的 gap 还是
16px,是卡片自己没填满格子)。已经删掉,让 `width:100%` 单独生效,始终
填满 grid 分配给它的那一列。

## 来源
- Figma 主帧(tile version):node `7432:68669`
- 卡片实例(General Auction Card,hidden=false):node `7432:69394`
- Make Offer 徽标变体核实:node `7441:5248` / `7441:5254`
- 结构规则参考:`acv-auction-cards` 技能(General Auction Card 的 Image
  Section / Action Area / Vehicle Detail Section / Flexible Section 划分,
  以及"最多3个按钮""图标要有hover tooltip""同一时间只显示一个状态chip"等
  规则)。

## 已核实的数值(全部来自 `get_design_context`,hidden=false)
- 卡片容器:白底 `#FFFFFF`,边框 `1px solid #E8E9EB`,圆角 `12px`,
  `overflow: hidden`,底部 padding `12px`。
- 图片区高度 `210px`。
- 图片左下角两个徽标:
  - **状态徽标(In Negotiation)**:背景 `#1C1D1F`,白字,圆角 **8px**,
    **无边框**,padding `2px 6px`。→ 和表格版本(`OfferTypeBadge` 组件,
    圆角3px + 白色1px描边)明确不一样,**没有强行复用同一份 CSS**,是card
    专属的一套样式(`.offer-card__type-badge--in-negotiation`)。
  - **状态徽标(Make Offer)**:外层描边 `1px solid #8D9199` 圆角 `3px`,
    内层白底,padding `4px 6px`,文字 `#0E0E0F`。→ 和表格版本数值**完全
    一致**,不是巧合,是同一套设计规范在两个场景里被分别核实到的结果。
  - **经销商/lane 徽标**:背景 `rgba(0,0,0,0.4)` + `backdrop-filter:
    blur(0.75px)`,白字,圆角 `8px`,padding `2px 10px`,字号12px
    letter-spacing 0.4px。
  - 两个徽标间距:按坐标算出来是 `5px`(第一个徽标右边缘 x=111,第二个
    左边缘 x=116),实现时用了文件里已确认存在的 `Space/6`(6px)token,
    没有拿一个瞎猜的数字。
- Vehicle Detail 区(字段顺序严格保留,符合 acv-auction-cards 规则):
  1. 车辆标题 `16px/24px` Medium,letter-spacing `0.15px`,色 `#0E0E0F`。
  2. 里程 + "・" + "VIN {vin}" + 复制图标,`14px/21px` Regular,色
     `#55575C`。复制图标是真实下载的 SVG(节点 `7432:69414`),点击复制
     VIN 到剪贴板 —— 这是图标本身明摆着的功能,不是额外加的特性。
  3. "Auction ID: {auctionId}",同上字号/颜色。
- Flexible 区(自定义组合,不是库里的 `_block/Card-Auction Details`——那个
  在这个实例里是 `hidden=true`,没有被实际使用):
  - 倒计时:16×16 Clock 图标(真实下载,填色 `#CC433A`)+ "45m Left"
    `14px/20px` Medium letter-spacing `0.1px` 色 `#CC433A`。
  - 同一行右侧 New / Received 两个 `StatusChip`,颜色和已核实的
    `fragments/StatusChip` 组件完全一致,直接复用,New 没有icon
    (`show-icon="false"`)。
  - 分隔线 `1px #EBEBEB`。
  - 消息块:主消息 `14px/20px` Medium 色 `#0E0E0F`,副消息
    `14px/21px` Regular 色 `#55575C`。

## 明确标注的"待确认" / 设计稿疑点
1. **`vehicleTitle` 示例文案字面是 "Year Make Model"**——这看起来是设计师
   没替换掉的占位符文案(类似之前在 `DealershipFilterDropdown` 里发现的
   重复经销商名 "Apple Chevrolet" 那种情况),不是我编的假数据,原样保留
   在 `mock.js` 里,等真实数据或下一轮 scenario 指示时再替换,**不要**
   当成这就是"正确的车型显示格式"。
2. **图片区右上角的操作图标列(watchlist / hide / note / more,共4个,
   节点 `7432:69398`)在这个实例里 `hidden=true`**,不是当前可见设计,
   **没有实现**。如果实际需要展示这些操作按钮,请明确告知,到时候要
   同时遵守 acv-auction-cards 技能里"图标按钮要配hover tooltip""最多3个
   按钮"的规则。
3. [2026-08 消息块部分已确认] 你对照节点 `7485:41392` 明确说"每个 card
   都有 message at bottom",这个疑点关于消息块的部分已解决——[OfferDashboard](../OfferDashboard/notes.md)
   现在不再显式传空字符串覆盖掉这两个 prop,让 tile 视图 12 张卡片都走
   OfferCard 自己核实过的默认文案。倒计时行/New+Received 状态chip/
   Auction ID 行是否在所有场景都出现,仍然待确认(还是只看到这一个
   In Negotiation 例子),已经做成可选 prop 不受影响。
4. 图片本身在 Figma 里是一张固定素材裁切,组件里简化成普通 `<img
   object-fit: cover>` 填充 210px 高的容器,没有还原素材本身的具体尺寸/
   裁切位置(那属于内容素材,不是组件结构)。

## 与表格版本的关键差异对比(明确记录,避免以后误合并成一套CSS)
| | 表格 OfferTypeBadge | 卡片 In Negotiation 徽标 |
|---|---|---|
| 圆角 | 3px(用户手动改为4px,见 OfferTypeBadge/notes.md) | 8px(Figma核实) |
| 边框 | 有(白色1px,来自父容器) | 无 |

Make Offer 徽标两边数值一致,未发现差异。

## 组件宽度说明
Figma 里这张卡片的实际宽度是 `363.33px`(来自 1122px 内容区、3 列、
列间距16px 反推:`(1122-32)/3=363.33`)。组件本身把宽度写成 `width:
100%`,交给外层网格容器(`OfferDashboard` 里的 `.offer-dashboard__card-
grid`,`grid-template-columns: repeat(3, 1fr)` + `gap: 16px`)决定实际
像素宽度——在 1122px 内容区下算出来的宽度和 Figma 的 363px 是一致的,
不是放弃了这个数值,只是换成响应式的方式实现,方便这个组件将来在其他
宽度的容器里(比如 Playground 单独预览)也能正常撑满,不用硬编码
固定宽度。

## 2026-08 补充:真实车辆照片
你提供了两张真实车辆照片(存在 `assets/vehicle-photos/` 下):
- `2018-ford-focus-rs.jpg` —— 黑色 Ford Focus RS 掀背车(车头有 "RS" 标)。
- `2022-bmw-x5.jpg` —— 深橄榄绿 2022 BMW X5(年份/车型你自己确认的)。

`inNegotiationExample` / `makeOfferExample` 这两个 mock 现在用的就是这两张
真实照片,`vehicleTitle` 也跟着改成真实车型名,不再是 Figma 原稿里那个疑似
占位的 "Year Make Model"(仍然怀疑那是设计师没替换的占位文案,推测记录见
上面)。`mileage`/`vin` 是你说的"可以随意编"的字段,按车重新编了合理数值,
不是任何真实数据源核实来的。`vehicleOnlyExample` 保持没有照片,专门用来
测试"没有照片"这个边界情况(不是遗漏)。

## 待办 / 下一步
- 用户已明确表示接下来会给"不同 scenario 的卡片展示"，**这次先不要**
  提前设计更多状态变体，等实际的 Figma/说明来了再做。
- Tile view 的整体页面接入(视图切换按钮 + "Viewing N results" 文案 +
  卡片网格)记录在 `fragments/OfferDashboard/notes.md`，不在这个组件
  笔记里重复。
