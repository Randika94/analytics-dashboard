# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from apps.home import blueprint
from flask import Flask, render_template, request
from jinja2 import TemplateNotFound
from flask_wtf.csrf import CSRFProtect
from wtforms import Form, StringField, validators

app = Flask(__name__)
csrf = CSRFProtect(app)

class SearchCustomerForm(Form):
    member_id = StringField('Member ID', [
        validators.DataRequired(),
        validators.Length(min=3, max=30, message="Member is required")
    ])

@blueprint.route('/')
def index():
    return render_template('home/index.html', segment='index')

@blueprint.route('/customer')
def customerManagement():

    return render_template('home/customer_management/index.html', segment='customerManagement')

@blueprint.route('/campaign')
def campaignManagement():

    return render_template('home/campaign_management/index.html', segment='campaignManagement')

@blueprint.route('/active-users')
def activeUsersRecommendation():

    return render_template('home/recommendation/active_users.html', segment='activeUsersRecommendation')

@blueprint.route('/inactive-users')
def inactiveUsersRecommendation():

    return render_template('home/recommendation/active_users.html', segment='inactiveUsersRecommendation')

@blueprint.route('/search-customer', methods=['GET', 'POST'])
def searchCustomer():
    form = SearchCustomerForm(request.form)
    memberId = form.member_id.data
    return render_template('home/customer_management/show.html', segment='searchCustomer', memberId=memberId)

@blueprint.route('/<template>')
def route_template(template):

    try:

        if not template.endswith('.html'):
            template += '.html'

        # Detect the current page
        segment = get_segment(request)

        # Serve the file (if exists) from app/templates/home/FILE.html
        return render_template("home/" + template, segment=segment)

    except TemplateNotFound:
        return render_template('home/errors/page-404.html'), 404

    except:
        return render_template('home/errors/page-500.html'), 500


# Helper - Extract current page name from request
def get_segment(request):

    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment

    except:
        return None
