<template>
  <div id="app">
    <el-dialog
      title="发现新版本"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="show_modol">
      <p>当前版本: {{app_version}}</p>
      <p>最新版本: {{app.new_version}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="!app.is_force" @click="show_modol = false">下次再说</el-button>
        <el-button type="primary" @click="download">立即下载</el-button>
      </span>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'elevtron-vue',
    data: () => {
      return {
        show_modol: false,
        app_version: require('../../package.json').version,
        app: {
          download_url: '',
          is_force: '', // 是否强制更新
          is_new: '', // 有更新为true
          new_version: ''
        }
      }
    },
    methods: {
      download() {
        require('electron').shell.openExternal(this.app.download_url)
      }
    },
    created() {
      // this.$router.push('/login')
      this.$http('check_upgrade').then(({data}) => {
        if (/^ok$/i.test(data.status)) {
          let _data = data.data || {}
          this.app = _data
          if (_data.is_new) {
            this.show_modol = true
          }
        }
      }).catch(() => {
      })
      // 发现新版本
      ipcRenderer.on('update-available', (event, arg) => {
        console.log('ipcRenderer update-available', event, arg) // prints "pong"
      })
      // 新版本下载完成
      ipcRenderer.on('isUpdateNow', (event, arg) => {
        console.log('ipcRenderer isUpdateNow', event, arg) // prints "pong"
      })
    },
  }
</script>

<style>
  /* CSS */
  #app {
    min-height: 100vh;
    font-family: "Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
</style>
