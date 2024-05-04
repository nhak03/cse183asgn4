"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
            contacts: [],
            editFunction: '',
            potential_val: '',
            potential_contact: null,
            img_url: "",
            file: null
        };
    },
    methods: {
        // Complete. 
        setEditFunction(event, funcName, contact) {
            const value = event.target.value;
            this.editFunction = funcName;
            this.potential_val = value;
            this.potential_contact = contact;
            // console.log("Focusing on ", this.editFunction);
            console.log("Potential change: ", value);
            // console.log("The relevant contact: ", contact);
        },
        set_val_on_blur(event){
            const value = event.target.value;
            this.potential_val = value;
        }, 
        editImage(contact){
            this.potential_contact = contact;
            let identifier;
            if(contact.contact_name){
                identifier = contact.contact_name;
            }
            else{
                identifier = contact.card_id;
            }
            console.log("You want to edit the image of ", identifier);

            app.click_figure();

        },
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
        editContactName(contact){
            // const value = event.target.value;
            const value = this.potential_val;
            console.log("Name extracted: ", value);
            console.log("assoc. card_id: ", contact.card_id);

            
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
        },
        editContactAffiliation(contact){
            // const value = event.target.value;
            const value = this.potential_val;
            console.log("Affiliation extracted: ", value);
            console.log("assoc. card_id: ", contact.card_id);
            axios.post('/editContactAffiliation', { affiliation: value, card_id: contact.card_id})
            .then(response => {
                if(response.status === 200){
                    console.log("Card:", contact.card_id);
                    console.log("New Affiliation: ", value)
                }
                else{
                    console.log("error on affiliation change");
                }
            // Handle response as needed
            }).catch(error => {
                console.error("Error:", error);
            });
        },
        editDescription(contact){
            // const value = event.target.value;
            const value = this.potential_val;
            console.log("Description extracted: ", value);
            console.log("assoc. card_id: ", contact.card_id);
            axios.post('/editContactDescription', { description: value, card_id: contact.card_id})
            .then(response => {
                if(response.status === 200){
                    console.log("Card:", contact.card_id);
                    console.log("New Description: ", value)
                }
                else{
                    console.log("error on description change");
                }
            // Handle response as needed
            }).catch(error => {
                console.error("Error:", error);
            });
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

app.click_figure = function () {
    let input = document.getElementById("file-input");
    input.addEventListener('change', function(event) {
        const file = event.target.files[0]; // Access the selected file
        // console.log("Selected file:", file);

        console.log("Selected file:", file);

        // Create a FormData object to send the file
        let formData = new FormData();
        formData.append('img_file', file);
        formData.append('card_id', app.vue.potential_contact.card_id);


        axios.post('/editImage', formData)
            .then(response => {
                if(response.status === 200){
                    console.log("Card:", app.vue.potential_contact.card_id);
                    console.log("New Image!!");
                }
                else{
                    console.log("error on image change");
                }
            // Handle response as needed
            }).catch(error => {
                console.error("Error:", error);
            });
    });
    input.click();
}

app.setUpBeforeUnloadListener = function () {
    // console.log("the setup started");
    window.addEventListener('beforeunload', function(event) {
        // Execute any necessary actions before the page is unloaded
        // For example, call the editDescription function
        // Note: You may want to adjust this based on your specific requirements
        console.log("Before unloading the page...");
        // this.alert("Unload listener works");
        // Call your editDescription function here if needed
        
        if (app.vue.editFunction === 'editDescription'){
            console.log("on refresh, calling editDescription");
            app.vue.editDescription(app.vue.potential_contact);
        }

        if (app.vue.editFunction === 'editContactName'){
            console.log("on refresh, calling editContactName");
            app.vue.editContactName(app.vue.potential_contact);
        }

        if (app.vue.editFunction === 'editContactAffiliation'){
            console.log("on refresh, calling editContactAffiliation");
            app.vue.editContactAffiliation(app.vue.potential_contact);
        }

        // debugger;
    });

}

app.load_data();

app.setUpBeforeUnloadListener();