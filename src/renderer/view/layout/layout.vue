<template>
  <div class="">
    <el-container style="min-height: 400px;height: 100vh;">
      <el-aside :width="menu_is_collapse ? '68px' : '260px'">
        <div v-show="!menu_is_collapse" class="logo-box clearfix">
          <div class="left fl">
            <img src="../../assets/logo.svg" class="logo"/>
          </div>
          <div class="right fr">
            <div class="project-name">猎户人脸</div>
            <div class="sub-project">后台管理系统</div>
          </div>
        </div>
        <div v-show="menu_is_collapse" class="logo-box">
            <img src="../../assets/logo.min.png" style="margin-top: 8px;" class="logo"/>
        </div>
        <MenuE/>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 14px;border-bottom: 1px solid #ebeef5" class="clearfix">
          <i class="el-icon-menu fl header-icon" @click="set_menu_is_collapse()"></i>
          <div class="fl header-title">{{$route.meta.title}}</div>
          <div class="fl header-back theme hand" onclick="history.back()">后退</div>
          <div class="fl theme hand" @click="updatePage">刷新</div>
          <div class="user-info fr">
            <el-popover
              v-for="(item, key) in server_status" :key="`item-item-${key}`"
              placement="top-start"
              trigger="hover"
              :content="`${item.text}: ${item.status?'在线':'离线'}`">
              <span slot="reference" class="status ib hand" :class="[item.status?'online':'']">
                <i class="iconfont" :class="[item.icon]"></i>
              </span>
            </el-popover>
            <span class="ib" style="width: 20px"></span>
            <el-dropdown>
              <span class="el-dropdown-link hand">
                <i class="iconfont icon-gerenzhongxin"></i>
                {{userInfo.account}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="$router.push('/login')">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" ref="notify">
              <!--<el-button size="mini">通知</el-button>-->
              <el-badge @click.native="showNotify" :value="notify.new_notify_count" :class="{hide: notify.new_notify_count < 1}" :max="99">
                <i class="el-icon-bell" style="font-size: 20px;"></i>
              </el-badge>
              <el-dropdown-menu slot="dropdown" :class="{hide: notify.list.length < 1}">
                <div class="hive-notify">
                  <div v-for="(item, i) in notify.list" :key="`notify-${i}`" class="hive-notify-item">
                    <div class="notify-item-title title">
                      <i slot="reference" class="iconfont" :class="[server_status[item.category].icon, item.data.online ? 'up' : 'down']"></i>
                      {{`${server_status[item.category].text}${item.data.online ? '已上线' : '已离线'}`}}
                      <span class="fr prompt">{{item.data.occur_at}}</span>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <div class="main-wrapper" v-if="!update">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
            <div class="vserson-message">
              <p>上海阅面网络科技有限公司</p>
              <p>联系邮箱: support@readsense.cn&emsp;软件版本: v{{VERSON}} <span class="theme hand" @click="open('https://www.showdoc.cc/148776433408089?page_id=845662446254720')">在线文档</span></p>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
  import MenuE from './menu.vue'
  import { mapGetters, mapMutations } from 'vuex'
  import { readServerConfig, readToken } from 'api/fs.config.js'
  export default {
    name: 'layout',
    components: {
      MenuE,
    },
    data() {
      return {
        VERSON: require('../../../../package.json').version,
        update: false,
        title: null,
        notify: {
          list: [],
          new_notify_count: 0,
        },
        server_status: {
          device_online: {status: false, text: '人脸设备管理服务', icon: 'icon-shebeiguanli'},
          feature_online: {status: false, text: '人脸检测服务', icon: 'icon-bhjmianbushibie'},
          search_online: {status: false, text: '人脸搜索服务', icon: 'icon-guanliyuansousuo_o'},
        },
      }
    },
    computed: {
      ...mapGetters([
        'menu_is_collapse',
        'userInfo',
        'new_notify_count',
      ]),
    },
    methods: {
      ...mapMutations([
        'set_menu_is_collapse',
        'add_new_notify_count',
        'clear_new_notify_count',
      ]),
      // 在浏览器打开
      open(url) {
        require('electron').shell.openExternal(url)
      },
      async initWs() {
        this.ws = null
        let [server, TOKEN] = await Promise.all([readServerConfig(), readToken()])
        let ws = new WebSocket(`ws://${server.ip}:${server.port}/ws?token=${TOKEN}`)
        ws.onmessage = (e) => {
          console.log(e)
          let data
          try {
            data = JSON.parse(e.data)
          } catch (e) {
            data = {}
          }
          if (Object.hasOwnProperty.call(this.server_status, data.category)) {
            // 添加通知
            this.notify.list.unshift(data)
            this.notify.new_notify_count += 1
            // 更新状态
            this.server_status[data.category].status = data.data.online
          }
        }
        ws.onopen = (e) => {
          this.try_conenct_ws = null
          console.log(e)
        }
        ws.onclose = (e) => {
          // 连续失败10次不再尝试
          if (this.try_conenct_ws === 10) {
            return
          }
          console.log(e)
          this.ws = null
          // 意外关闭，一分钟后尝试重新连接
          setTimeout(_ => {
            this.try_conenct_ws += 1
            this.initWs()
          }, 6e4)
        }
        ws.onerror = console.error
        this.ws = ws
      },
      getGRPCStatus() {
        this.$http('grpc_status').then(({data}) => {
          if (/^ok$/i.test(data.status)) {
            let _data = data.data
            for (let key in _data) {
              this.server_status[key].status = _data[key]
            }
          }
        }).catch(() => {
        })
      },
      showNotify(e) {
        this.notify.new_notify_count = 0
        this.$refs.notify.show()
      },
      updatePage() {
        this.update = true
        this.$nextTick(function () {
          setTimeout(() => {
            this.update = false
          })
        })
      }
    },
    mounted() {
      this.initWs()
      this.getGRPCStatus()
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  aside
    position: relative
    background $color-aside-bg
    .logo-box
      height $main-header-height
      width 100%
      text-align center
      .left{
        width 47%
        text-align right
        line-height $main-header-height
        img{
          width 75%
          vertical-align middle
        }
      }
      .right {
        width 47%
        color #fff
        font-size 14px
        font-weight bolder
        text-align left
        .project-name{
          padding-top 12%
        }
      }
    .logo
      display inline-block
      max-width 100%
      max-height 44px
      line-height 44px
      margin 0 auto
      vertical-align middle
  .el-header
    height $main-header-height
    line-height $main-header-height
    background #fff
    .header-icon
      margin-right: 20px
      font-size: 18px
      height $main-header-height
      line-height $main-header-height
    .header-title
      font-size 18px
      font-weight bold
    .header-back
      cursor pointer
      padding-left 25px
      padding-right 15px
    .user-info
      padding-right 10px
      &>span>.status
        width: 22px
        height @width
        margin: 17px 5px 0
        border-radius 50%
        background-color $color-prompt
        color #fff
        text-align center
        line-height @width
        &.online
          color #fff
          background-color $color-theme // 00cc00
          box-shadow 1px 1px 4px @background-color
  .el-main
    padding: 18px
    .main-wrapper
      position: relative
      min-height: calc(100vh - 96px) // 60 18 18
      min-width 830px
      padding-bottom: 80px
  .vserson-message
    position: absolute
    width 100%
    left: 0
    bottom: -18px
    padding: 10px 0
    font-size: 14px
    line-height 20px
    text-align center
    color $color-prompt
    cursor default
  >>>
    .el-menu-item
    .el-submenu__title
      width: 260px
    .el-badge
      line-height 1
      margin-left: 20px
      &.hide
        .el-badge__content
          display none
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .el-dropdown-menu.hide
    display none
  .hive-notify
    padding: 0 15px
    width 220px
    max-height 300px
    overflow-y auto
    .hive-notify-item
      padding: 13px 0 13px
      line-height normal
      border-bottom 1px solid #f4f4f4
      .notify-item-title
        font-size: 14px
        .prompt
          font-size: 12px
      .notify-item-content
        font-size: 12px
      .up
        color #00cc00
      .down
        color #f56c6c
</style>
