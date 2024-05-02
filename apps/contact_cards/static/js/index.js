"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
            contacts: [],
        };
    },
    methods: {
        // Complete. 
        addContact(){
            // addContact creates a blank card
            console.log("sending request to make blank card...")
            axios.post('/addContact', {request: "make_card"}).then(response => {
                if(response.status === 200){
                    console.log('blank card added successfully')
                    // alert('blank card added successfully')
                }
                else{
                    console.log('error on adding blank card')
                }
            });
        }
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    // Complete.
}

app.load_data();

