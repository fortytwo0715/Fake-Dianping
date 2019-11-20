// pages/cart/cart.js
Page({

  /**
   * Page initial data
   */
  data: {
    currentUser: null,
    userID: [],
    orders: [],
    meals: [],
    points:[],
    state: []
  },

  deleteItem: function(event) {
    let page = this
    let Order = new wx.BaaS.TableObject('orders')
    let orderID = event.currentTarget.dataset.id
    let points = event.currentTarget.dataset.points
    console.log('我是啥', event.currentTarget.dataset)
    console.log('orderID', event.currentTarget.dataset.id)
    Order.delete(orderID).then(res => {
      this.fetchOrders()
      this.updatePoints(points)
    })
  } ,

  updatePoints: function(points) {
    let page = this
    let currentUser = page.data.currentUser
    let currentPoints = currentUser.get('points')
    let newPoints = currentPoints - points
    currentUser.set('points', newPoints)
    currentUser.update().then(function (res) {
      // setTimeout(() => wx.switchTab({
      //   url: '/pages/user/user'
      // }), 800)
      wx.showModal({
        title: '删除成功',
        content: '继续管理订单',
      })
    })
  },

  fetchOrders: function(options) {
    let page = this
    let userID = this.data.userID
    console.log('data', page.data)
    console.log('options', options)
    console.log('userID', userID)

    let Order = new wx.BaaS.TableObject('orders')
    // let query = new wx.BaaS.Query()
    // query.compare('user_id', '=', userID)
    // Order.setQuery(query).find().then(function (res) {
    //   page.setData({
    //     orders: res.data.objects
    //   })
    //   console.log('orders', res)
    // })
    // Order.setQuery(query).expand(['meal_id']).find().then(function (res) {
    //   page.setData({
    //     meals: res.data.objects
    //   })
    //   console.log('meals', res)
    // })
    Order.expand(['meal_id', 'deliverer']).find().then(function (res) {
      page.setData({
        meals: res.data.objects,
      })
      console.log('meals', res)
    })
  },

  readyOrder(event) {
    const data = event.currentTarget.dataset;
    console.log('readydata', data)
    const id = data.id;
    console.log('ready', id);
    let Order = new wx.BaaS.TableObject('orders')
    let order = Order.getWithoutData(id)
    console.log('order', order)
    order.set("state", "ready").update().then(res => {
      wx.reLaunch({
        url: '/pages/orders/orders',
      })
    })
  },
  // readyOrder(event) {
  //   const data = event.currentTarget.dataset;
  //   console.log('readydata', data)
  //   const id = data.id;
  //   console.log('ready', id);
  //   let Order = new wx.BaaS.TableObject('orders')
  //   let order = Order.getWithoutData(id)
  //   console.log('order', order)
  //   order.set("state", "ready").update().then(res => {
  //     wx.reLaunch({
  //       url: '/pages/orders/orders',
  //     })
  //   })
  // },
  loadOrder: function () {
    const page = this;
    let Order = new wx.BaaS.TableObject('orders')
    var query = new wx.BaaS.Query()

    const isDeliverer = page.data.currentUser.get('role') == 'deliverer'
    console.log('deliverer', isDeliverer)
    if (isDeliverer) {
      query.in('state', ['ready', 'delivering']);
      // Order.setQuery(query);
    }
    Order.setQuery(query).expand(["meal"]).find().then(function(res) {
      page.setData({
        meals: res.data.objects,
      })
    })
  },	
  deliverOrder(event) {
    const page = this;
    const data = event.currentTarget.dataset;
    const id = data.id;
    let currentUser = page.data.currentUser;

    console.log(id);

    let tableName = 'orders'
    let Order = new wx.BaaS.TableObject(tableName)
    let order = Order.getWithoutData(id)

    // order.set("state", "delivering").update().then(res => {
    //   wx.reLaunch({
    //     url: '/pages/orders/orders',
    //   })
    // })
    console.log('order', event)
    order.set("state", "delivering");
    order.set("deliverer", currentUser.id.toString());
    order.update().then(res => {
      wx.reLaunch({
        url: '/pages/cart/cart',
      })
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let page = this
    wx.BaaS.auth.getCurrentUser().then(function (res) {
      console.log(res.get('role'))
      console.log('res', res)
      //设置用户
      page.setData({
        currentUser: res,
        userID: res.id,
        points: res.points,
        state: res.state
      })
      page.fetchOrders()
      page.loadOrder()
    })
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