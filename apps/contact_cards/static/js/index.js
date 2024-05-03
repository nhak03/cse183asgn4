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
                    app.load_data()
                }
                else{
                    console.log('error on adding blank card')
                }
            });
        },
        editContactName(event, contact){
            const value = event.target.value;
            console.log("Name extracted: ", value);
            console.log("assoc. card_id: ", contact.card_id)
            axios.post('/editContactName', { name: value, card_id: contact.card_id})
            .then(response => {
                if(response.status === 200){
                    console.log("Card:", contact.card_id);
                    console.log("New Name: ", value)
                }
                else{
                    console.log("error on name change");
                }
            // Handle response as needed
            }).catch(error => {
                console.error("Error:", error);
            });
            // console.log("End of edit contact")
        },
        deleteContact(contact){
            console.log("You clicked a trash can with id: ", contact.card_id);
            if(contact.contact_name){
                console.log("You will delete: ", contact.contact_name);
            }
            axios.post('/deleteContact', { card_id: contact.card_id })
            .then(response => {
                if(response.status === 200){
                    console.log("You deleted: ", contact.contact_name)
                    app.load_data();
                }
                else{
                    console.log("error on contact deletion");
                }
            // Handle response as needed
            }).catch(error => {
                console.error("deleteContact() Error:", error);
            });

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

