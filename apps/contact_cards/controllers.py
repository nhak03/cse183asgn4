"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from .models import get_user_email


@action('index')
@action.uses('index.html', db, auth.user)
def index():
    return dict(
        get_contacts_url = URL('/get_contacts'),
        # Complete. 
    )

@action('/get_contacts')
@action.uses(db, auth.user)
def get_contacts():
    # contacts = [] # Complete. 
    contacts = db(db.contact_card.user_email == get_user_email()).select(orderby=(db.contact_card.id)).as_list()
    # print("Rows found: ", contacts)
    if (contacts):
        print("Success, Rows found: ", contacts)
        return dict(status = 200, contacts = contacts)
    else:
        return dict(status = 500)

@action('/addContact', method='POST')
@action.uses(db, auth.user)
def addContact():
    print("Making a new blank card...")
    id = db.contact_card.insert(user_email = get_user_email())
    if (id):
        print("Inserted blank with record: ", id)
        return dict(status = 200)
    else:
        print("Failed to insert blank")
        return dict(status = 500)
    
@action('/deleteContact', method='POST')
@action.uses(db, auth.user)
def deleteContact():
    card_to_delete = request.json.get('card_id')
    row_to_delete = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_delete)).select().first()
    if row_to_delete:
        row_to_delete.delete_record()
        return dict(status = 200)
    else:
        return dict(status = 500, error = "can't find that record to delete")
    
@action('/editContactName', method='POST')
@action.uses(db, auth.user)
def editContactName():

    print("editContactName:")
    new_name = request.json.get('name')
    card_to_change = request.json.get('card_id')
    # print("We got this name from frontend: ", new_name)
    contact = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().as_list()

    # handle the case where they have no cards
    if (not contact):
        id = db.contact_card.insert(user_email = get_user_email(), contact_name = new_name)
        # print("add it in with id ", id)
        # test_list = db(db.contact_card.contact_name == new_name).select().as_list()
        # print("Test list: ", test_list)
        if (id):
            return dict(status = 200)

    row_to_update = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().first()
    print("Original contact: ", row_to_update)
    print("Will change name to: ", new_name)
    row_to_update.contact_name = new_name
    row_to_update.update_record()
    
    return dict(status = 200)

@action('/editContactAffiliation', method='POST')
@action.uses(db, auth.user)
def editContactAffiliation():
    new_affiliation = request.json.get('affiliation')
    card_to_change = request.json.get('card_id')
    contact = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().as_list()

    if (not contact):
        id = db.contact_card.insert(user_email = get_user_email(), contact_affiliation = new_affiliation)
        if (id):
            return dict(status = 200)
        
    row_to_update = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().first()
    print("Original contact: ", row_to_update)
    print("Will change affiliation to: ", new_affiliation)
    row_to_update.contact_affiliation = new_affiliation
    row_to_update.update_record()
    
    return dict(status = 200)

@action('/editContactDescription', method='POST')
@action.uses(db, auth.user)
def editContactDescription():
    new_description = request.json.get('description')
    card_to_change = request.json.get('card_id')
    contact = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().as_list()

    if (not contact):
        id = db.contact_card.insert(user_email = get_user_email(), contact_description = new_description)
        if (id):
            return dict(status = 200)
    
    row_to_update = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().first()
    print("Original contact: ", row_to_update)
    print("Will change description to: ", new_description)
    row_to_update.contact_description = new_description
    row_to_update.update_record()

    return dict(status = 200)

@action('/editImage', method='POST')
@action.uses(db, auth.user)
def editImage():
    img_file = request.files.get('img_file')  # Access the uploaded image file
    card_id = request.forms.get('card_id')  # Access the card_id
    if img_file:
        # Process the image file as needed
        filename = img_file.filename
        file_data = img_file.file.read()
        print("Macy's picture: ", filename)
    else:
        print("no file found")
    
    if card_id:
        print("We have the associated card id: ", card_id)
    else:
        print("No card id was found")


    return dict(status = 200)
    card_to_change = request.json.get('card_id')

    contact = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().as_list()

    if (not contact):
        id = db.contact_card.insert(user_email = get_user_email(), contact_image = new_image)
        if (id):
            return dict(status = 200)
    
    row_to_update = db((db.contact_card.user_email == get_user_email()) & (db.contact_card.card_id == card_to_change)).select().first()
    print("Original contact: ", row_to_update)
    print("Will change image to: ", new_image)
    row_to_update.contact_image = new_image
    row_to_update.update_record()

    return dict(status = 200)