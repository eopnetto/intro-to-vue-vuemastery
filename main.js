var eventBus = new Vue()

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false,
        }
    },
    template: `
    <div>
        <ul>
            <span class="tab" v-for="(tab, index) in tabs"
            @click="selectedTab = tab" 
            :class="{ activeTab: selectedTab === tab }"
            :key="tab">
                {{ tab }}
            </span>
        </ul>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                <p>{{review.name}}</p>
                <p>{{review.rating}}</p>
                <p>{{review.review}}</p>
                </li>
            </ul>
        </div>
        
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
        
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
        }
    },
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the fields</b>
                <ul>
                <li v-for="error in errors">{{error}}</li>
</ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"  ></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
    
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>
    `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (!this.name || !this.review || !this.rating) {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                return
            }

            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
            }

            eventBus.$emit('review-submitted', productReview)

            this.name = null
            this.review = null
            this.rating = null
        }
    },
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
    },
    template: `<div class="product">
                <div class="product-image">
                    <img v-bind:src="image" alt="">
                </div>
        
                <div class="product-info">
                    <h1>{{ title }}</h1>
                    <p v-if="inStock">In stock</p>
                    <p v-else>Out of stock</p>
        
                    <ul>
                        <li v-for="detail in details">{{detail}}</li>
                    </ul>
                    
                    <p>Shipping: {{shipping}}</p>
        
                    <div class="color-box"
                         v-for="(variant, index) in variants"
                         :key="variant.variantId"
                         :style="{ backgroundColor: variant.variantColor }"
                         @mouseover="updateProduct(index)">
                    </div>
        
                    <button @click="addToCart"
                            :disabled="!inStock"
                            :class="{ disabledButton: !inStock}"
                    >Add to cart</button>
                </div>             
                
                <product-tabs :reviews="reviews"></product-tabs>
            </div>               `,

    data() {
        return {
            brand: 'Vue MAster',
            product: 'Socks',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                },
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }

            return 2.99
        },

    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
    },
})
