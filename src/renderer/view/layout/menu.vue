<template>
  <el-menu
    default-active="1"
    background-color="#00132A"
    text-color="#fff"
    active-text-color="#fff"
    :collapse="menu_is_collapse"
    :collapse-transition="false"
    class="el-menu-vertical-demo">
    <template v-for="(item, i) in menu_list">
      <!-- 多级菜单 -->
      <el-submenu v-if="item.sub_menu && item.sub_menu.length > 0 && (item.admin ? is_admin : true)"  :key="`menu_list-${i}`" :index="i.toString()">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.lable}}</span>
        </template>
        <el-menu-item v-for="(subItem, ii) in item.sub_menu" :key="`sub_menu-${subItem.lable}`" :index="`sub_menu-${subItem.lable}`" @click="setActiveItem(subItem)">
          <i :class="subItem.icon"></i>
          {{subItem.lable}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else-if="!item.admin" :index="i.toString()" :key="`menu_list-${i}`"  @click="setActiveItem(item)">
        <i :class="item.icon"></i>
        <span slot="title">{{item.lable}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script type="text/ecmascript-6">
  import Data from './menu.data'
  import { mapGetters } from 'vuex'
  export default {
    name: 'menue',
    data () {
      return {
        ...Data,
        groups_list: [],
        active_menu_item: null,
        active_menu_list: [],
      }
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'menu_is_collapse',
      ]),
      is_admin() {
        return this.userInfo.is_admin
      }
    },
    methods: {
      getGroupsList() {
        this.$http('groups_list').then(({ data }) => {
          if (/^ok$/i.test(data.status)) {
            this.groups_list = data.data.groups || []
          }
        })
      },
      setActiveItem(item) {
        let MenuItem = item || this.menu_list[1]
        this.active_menu_item = MenuItem
        if (!this.active_menu_list.includes(MenuItem)) {
          this.active_menu_list.push(MenuItem)
        }
        this.$emit('change', MenuItem)
        let link = MenuItem.link
        if (link) {
          this.$router.push(MenuItem.link)
        }
        // console.log(this.$route.fullPath)
        // console.log(Array.from(this.active_menu_list, item => item.lable).join())
      }
    },
    mounted () {
      this.getGroupsList()
      this.setActiveItem()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  >>>
    .el-menu
      border-right-width  none !important
    .el-menu-item
      height 50px
      line-height 50px
      &.is-active
       background #2d8cf0 !important
</style>
