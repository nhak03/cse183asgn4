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
        },
        editContactName(event){
            const value = event.target.value;
            console.log("Name extracted:", value);
            axios.post('/editContactName', { name: value })
            .then(response => {
                if(response.status === 200){
                    console.log("Name was successfully changed to ", value);
                }
                else{
                    console.log("error on name change");
                }
            // Handle response as needed
            }).catch(error => {
                console.error("Error:", error);
            });
            // console.log("End of edit contact")
        }
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    // Complete.
    axios.get('/get_contacts').then(response => {
        if(response.status === 200){
            app.vue.contacts = response.data.contacts;
            console.log("Loaded contacts: ", app.vue.contacts);
        }
        else{
            alert("unable to load contacts from backend")
        }
    })

}

app.load_data();

