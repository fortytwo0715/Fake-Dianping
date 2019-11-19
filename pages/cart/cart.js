// pages/cart/cart.js
Page({

  /**
   * Page initial data
   */
  data: {
    // currentUser: null,
    userID: [],
    orders: [],
    meals: []
  },

  deleteItem: function(event) {
    let page = this
    let Order = new wx.BaaS.TableObject('orders')
    let orderID = event.currentTarget.dataset.id
    console.log('我是啥', event.currentTarget.dataset)
    console.log('orderID', event.currentTarget.dataset.id)
    Order.delete(orderID).then(res => {
      this.fetchOrders()
      wx.showModal({
        title: '删除成功',
        content: '继续管理订单',
      })
    })
  } ,

  fetchOrders: function(options) {
    let page = this
    let userID = this.data.userID
    console.log('data', page.data)
    console.log('options', options)
    console.log('userID', userID)

    let Order = new wx.BaaS.TableObject('orders')
    let query = new wx.BaaS.Query()
    query.compare('user_id', '=', userID)
    Order.setQuery(query).find().then(function (res) {
      page.setData({
        orders: res.data.objects
      })
      console.log('orders', res)
    })
    Order.setQuery(query).expand(['meal_id']).find().then(function (res) {
      page.setData({
        meals: res.data.objects
      })
      console.log('meals', res)
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userID: options.id,
    })
    this.fetchOrders()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})