// pages/meal/meal.js
Page({

  /**
   * Page initial data
   */
  data: {
    meals: []
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      restaurantID: options.id
    })
    
    let Meal = new wx.BaaS.TableObject('meals')
    let query = new wx.BaaS.Query()
    let page = this
    let restaurantID = this.data.restaurantID
    query.compare('restaurant_id', '=', restaurantID)
    Meal.setQuery(query).find().then(function(res) {
      page.setData({
        meals: res.data.objects
      })
      console.log('meals', res)
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