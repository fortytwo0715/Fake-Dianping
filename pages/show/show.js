// pages/show/show.js
Page({
  data: {
    currentUser: null,
    restaurantId: null,
    restaurant: {},
    reviews: [],
    ratingValues: [1, 2, 3, 4, 5],
    rating: 3,
    meals: [],
    state: 'comment',
    status: 'Click to Order'
  },
  changeState: function () {
    if (this.data.state == 'comment') {
      this.setData({
        state: 'order',
        status: 'Click to Comment'
      })
    } else {
      this.setData({
        state: 'comment',
        status: 'Click to Order'
      })
    }
  },
  onLoad: function(options) {
    let page = this
    wx.BaaS.auth.getCurrentUser().then(function (res) {
      //设置用户
      page.setData({
        currentUser: res
      })
    })
    //在页面保存restuarantId让其他function使用
    this.setData({
      restaurantId: options.id
    })
    let restaurantId = this.data.restaurantId

    //获取餐厅详情
    let Restaurant = new wx.BaaS.TableObject('restaurants')
    Restaurant.get(restaurantId).then(function(res) {
      page.setData({
        restaurant: res.data
      })
    })

    //获取餐厅评论
    this.fetchReviews()
    this.fetchMeals()
  },
  
  onShow: function(options) {
    // let Meal = new wx.BaaS.TableObject('meals')
    // let query = new wx.BaaS.Query()
    // let page = this
    // let restaurantID = this.data.restaurantId
    // console.log('RES', restaurantID)
    // query.compare('restaurant_id', '=', restaurantID)
    // Meal.setQuery(query).find().then(function (res) {
    //   page.setData({
    //     meals: res.data.objects
    //   })
    //   console.log('meals', res)
    // })
  },

  fetchReviews: function () {
    let Review = new wx.BaaS.TableObject('reviews')
    let query = new wx.BaaS.Query()
    let page = this
    let restaurantId = this.data.restaurantId
    query.compare('restaurant_id', '=', restaurantId)
    Review.setQuery(query).find().then(function (res) {
      page.setData({
        reviews: res.data.objects
      })
    })
  },

  fetchMeals: function() {
    let Meal = new wx.BaaS.TableObject('meals')
    let query = new wx.BaaS.Query()
    let page = this
    let restaurantID = this.data.restaurantId
    console.log('RES', restaurantID)
    query.compare('restaurant_id', '=', restaurantID)
    Meal.setQuery(query).find().then(function (res) {
      page.setData({
        meals: res.data.objects
      })
      console.log('meals', res)
    })
  },

  onSubmitOrder: function(event) {
    let mealId = event.currentTarget.dataset.id
    let Order = new wx.BaaS.TableObject('orders')
    let order = Order.create()
    order.set({
      user_id: this.data.currentUser.id.toString(),
      meal_id: mealId,
      quantity: 1
    })
    order.save().then(function() {
      setTimeout(() => wx.switchTab({
        url: '/pages/user/user'
      }), 800)
      wx.showToast({
        title: '成功，跳转个人中心',
      })
    }).catch(function(err) {
      wx.showModal({
        title: '订单创建失败',
        content: err.message,
      })
    })
  },

  onChangeRating: function(event) {
    let index = event.detail.value
    let rating = this.data.ratingValues[index]
    this.setData({
      rating: rating
    })
    console.log('评分', event)
  },
  onSubmitReview: function(event) {
    let content = event.detail.value.content
    //rating的值已经在选择rating的时候被存过了
    let rating = this.data.rating
    //创建一个实例的母版，和server沟通
    let Review = new wx.BaaS.TableObject('reviews')
    //下面是定义一个实例
    let review = Review.create()

    //下面是把数据传入
    review.set({
      user_id: this.data.currentUser.id.toString(),
      restaurant_id: this.data.restaurantId,
      content: content,
      rating: rating
    })

    //下面是把数据保存然后调用fetchReviews
    let page = this
    review.save().then(function(res) {
      page.fetchReviews()
      page.submitSuccess
    })
  },
  submitSuccess(res) {
    console.log(res)
    if (res.statusCode === 201) {
      // wx.navigateBack()
      wx.showToast({
        title: 'Yay',
        icon: 'success'
      })
      this.setData({
        content: ''
      })
    }
  },
})