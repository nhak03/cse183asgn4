"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *
import uuid

# courtesy of gemini
def generate_unique_id():
    return str(uuid.uuid4())

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()


db.define_table(
    'contact_card',
    Field('user_email', default=get_user_email()),
    Field('contact_name', 'string', default=''),
    Field('contact_affiliation', 'string', default=''),
    Field('contact_description', 'text', default=''),
    Field('contact_image', 'text'),
    Field('card_id', 'string', default=generate_unique_id())
)

db.commit()
