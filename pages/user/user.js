// pages/user/user.js
Page({
  data: {
    state: 'register',
    currentUser: null,
    photo: []
  },
  onClick: function (event) {
    let userID = event.currentTarget.dataset.id
    console.log('id', userID)
    wx.navigateTo({
      url: '/pages/cart/cart?id=' + userID
    })
  },
  bindEditProfile: function(event) {
    let page = this;
    // let User = new wx.BaaS.TableObject('users')
    let photo = event.detail.value.photo
    console.log('photo', photo)
    let user = page.data.currentUser
    console.log('currentUser', page.data.currentUser)
    user.set("photo", photo).update().then(user => {
      wx.reLaunch({
        url: '/pages/user/user',
      })
      console.log('user', user)
    }).catch(err => {
      console.log('err', err)
    })
      
    
    // user.set('avatar', photo).update().then(res => {
    //   console.log('avatar', res)
    //   page.setData({
    //     photo: res
    //   })
      // user.save().then(function () {
      //   wx.showModal({
      //     title: '提交成功',
      //     content: '确认',
      //   })
      // }).catch(function (err) {
      //   wx.showModal({
      //     title: '提交失败',
      //     content: err.message,
      //   })
      // })
    //   wx.reLaunch({
    //     url: '/pages/user/user',
    //   })
    // })

  },
  changeState: function() {
    if (this.data.state == 'register') {
      this.setData ({
        state: 'login'
      })
    } else {
      this.setData({
        state: 'register'
      })
    }
  },

  onRegister: function(event) {
    console.log(event)
    let username = event.detail.value.username
    let password = event.detail.value.password
    let page = this
    wx.BaaS.auth.register({
      username: username,
      password: password
    }).then(function(res) {
      page.setData({
        currentUser: res
      })
    }).catch(function(err) {
      wx.showModal({
        title: '注册失败',
        content: err.message,
      })
    }) 
  },

  onLogin: function (event) {
    console.log(event)
    let username = event.detail.value.username
    let password = event.detail.value.password
    let page = this
    wx.BaaS.auth.login({ 
      username: username, 
      password: password 
    }).then(function (res) {
      console.log(res),
      page.setData ({
        currentUser: res
      })
    }).catch(err => {
      console.log('haaaa', err)
      wx.showModal({
        title: '登陆失败',
        content: err.message,
      })
    })
  },
  onLogout: function() {
    wx.BaaS.auth.logout()
    this.setData ({
      currentUser: null
    })
  },

  onLoad: function(options) {
    let page = this
    wx.BaaS.auth.getCurrentUser().then(function(res) {
      //设置用户
      page.setData({
        currentUser: res
      })
      console.log(res)
    }).catch(function(err) {
      console.log(err)
      wx.showModal({
        title: '您没有登陆',
        content: err.message,
      })
    })
  }
})
