// pages/index/index.js
Page({
  data: {
    restaurants: []
  },

  onLoad: function() {
    let tableName = 'restaurants'
    let Restaurant = new wx.BaaS.TableObject(tableName)
    let page = this
    Restaurant.find().then (function(res) {
      page.setData({
        restaurants: res.data.objects
      })
      console.log('restaurant', res)
    })
  },

  onClick: function(event) {
    let restaurantID = event.currentTarget.dataset.id
    let name = event.currentTarget.dataset.name
    // wx.showModal({
    //   title: name + ' 被点击'
    // })
    wx.navigateTo({
      url: '/pages/show/show?id=' + restaurantID
    })
  }
})