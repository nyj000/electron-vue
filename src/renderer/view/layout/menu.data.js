export default {
  menu_list: [
    {
      lable: '系统管理',
      link: '',
      admin: true,
      icon: 'iconfont icon-shezhi2',
      sub_menu: [
        { lable: '账号管理', link: '/account_management', icon: '' },
        { lable: '全部设备', link: '/device_all', icon: '' },
      ]
    },
    { lable: '用户管理', link: '/user_management', icon: 'iconfont icon-mn_qunzu' },
    { lable: '用户群组', link: '/user_groups', icon: 'iconfont icon-zy_qunzuduoren' },
    {
      lable: '设备管理',
      link: '',
      icon: 'iconfont icon-shebei',
      sub_menu: [
        { lable: '设备列表', link: '/devices', icon: '' },
        { lable: '设备识别记录', link: '/devices_identify_record', icon: '' },
        { lable: '设备状态日志', link: '/devices_status_record', icon: '' },
      ]
    },
    {
      lable: '人脸特征',
      link: '',
      icon: 'iconfont icon-bhjmianbushibie',
      sub_menu: [
        { lable: '人脸检测', link: '/face_detection', icon: '' },
        { lable: '人脸比对', link: '/face_verification', icon: '' },
        // { lable: '人脸识别', link: '/face_identification', icon: '' },
        { lable: '人脸识别', link: '/face_image_identification', icon: '' },
      ]
    },
  ]
}
